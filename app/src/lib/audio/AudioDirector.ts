import {
	ambientUrl,
	ambientVolume,
	SFX_VOLUME,
	sfxUrl,
	type AmbientBedId,
} from './assets';
import type { SfxId } from './types';

const STORAGE_KEY = 'mision-audio-muted';
/**
 * Total handoff budget when switching beds (hub ↔ puzzle tracks, etc.).
 * Implemented as a dip (out first, in delayed) so jazz/lofi never sit loud together.
 */
const CROSSFADE_MS = 3200;
/** Longer dip for the finale climax → calm epilogue payoff. */
const FINALE_EPILOGUE_CROSSFADE_MS = 6000;
/** Gentle fade when starting the first bed from silence. */
const FADE_IN_MS = 1400;
/** Soft mute / disable — short enough to feel responsive. */
const MUTE_FADE_MS = 320;
/** Max wait for a lazy puzzle bed to buffer before fading in. */
const BED_READY_MS = 5000;

export type SetAmbientBedOptions = {
	/** Override default crossfade length (ms). */
	crossfadeMs?: number;
};

const readMuted = (): boolean => {
	try {
		return window.localStorage.getItem(STORAGE_KEY) === '1';
	} catch {
		return false;
	}
};

const writeMuted = (muted: boolean): void => {
	try {
		window.localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
	} catch {
		/* private mode */
	}
};

/** Smooth S-curve for generic fades (mute / fade-in from silence). */
const easeInOut = (t: number): number =>
	t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
/** Front-load volume drop so the outgoing bed clears without a hard cut. */
const easeOutQuad = (t: number): number => 1 - (1 - t) ** 2;
/** Soft rise so the incoming bed blooms under a quieter bed. */
const easeInQuad = (t: number): number => t * t;

type EaseFn = (t: number) => number;
type Listener = () => void;

type BedVoice = {
	el: HTMLAudioElement;
	/** Web Audio gain — required so fades work on iOS (el.volume is ignored there). */
	gain: GainNode | null;
};

/**
 * Real sample beds + SFX (CC0).
 * Hub/finale = noir jazz; epilogue = soft night jazz; puzzles = per-puzzle lofi pool.
 * Bed changes use a dip handoff (out first, in delayed) — never a loud equal crossfade.
 * Ambient is routed through Web Audio GainNodes so crossfades work on mobile Safari.
 */
class AudioDirector {
	private ctx: AudioContext | null = null;
	private master: GainNode | null = null;
	private sfxBus: GainNode | null = null;
	private buffers = new Map<SfxId, AudioBuffer>();
	private loading: Promise<void> | null = null;
	private beds = new Map<AmbientBedId, BedVoice>();
	private currentBed: AmbientBedId = 'hub';
	private fadeRafs = new Map<AmbientBedId, number>();
	private stopSafetyTimers = new Map<AmbientBedId, number>();
	private pendingCrossfadeMs: number | null = null;
	/** Bumps on every bed switch so in-flight async handoffs can bail out. */
	private bedGeneration = 0;
	private muted = typeof window !== 'undefined' ? readMuted() : false;
	private unlocked = false;
	private bedsPreloaded = false;
	private wantAmbient = true;
	private listeners = new Set<Listener>();
	private gestureBound = false;
	private visibilityBound = false;

	isMuted(): boolean {
		return this.muted;
	}

	isUnlocked(): boolean {
		return this.unlocked;
	}

	subscribe(listener: Listener): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	private emit(): void {
		for (const listener of this.listeners) listener();
	}

	/** Attach once: first pointer gesture unlocks audio (not keydown — typing would spam it). */
	bindGestureUnlock(): () => void {
		if (this.gestureBound || typeof document === 'undefined') {
			return () => undefined;
		}
		this.gestureBound = true;
		const onGesture = () => {
			void this.unlock();
		};
		document.addEventListener('pointerdown', onGesture, {
			capture: true,
			passive: true,
		});
		const unbindVisibility = this.bindVisibilityResume();
		return () => {
			document.removeEventListener('pointerdown', onGesture, true);
			this.gestureBound = false;
			unbindVisibility();
		};
	}

	/** Mobile Safari suspends AudioContext in the background — resume on return. */
	private bindVisibilityResume(): () => void {
		if (this.visibilityBound || typeof document === 'undefined') {
			return () => undefined;
		}
		this.visibilityBound = true;
		const resume = () => {
			if (document.visibilityState !== 'visible') return;
			if (!this.ctx) return;
			if (this.ctx.state === 'suspended') {
				void this.ctx.resume().catch(() => undefined);
			}
			// Kick the current bed if iOS killed the element while backgrounded.
			if (
				!this.muted &&
				this.wantAmbient &&
				this.unlocked &&
				!this.isBedAudible(this.currentBed)
			) {
				void this.startBed(this.currentBed, 'fade-in');
			}
		};
		document.addEventListener('visibilitychange', resume);
		window.addEventListener('pageshow', resume);
		return () => {
			document.removeEventListener('visibilitychange', resume);
			window.removeEventListener('pageshow', resume);
			this.visibilityBound = false;
		};
	}

	async unlock(): Promise<void> {
		if (typeof window === 'undefined') return;

		// Already live — only nudge a suspended context; never touch ambient beds.
		if (this.unlocked && this.ctx) {
			if (this.ctx.state === 'suspended') {
				await this.ctx.resume();
			}
			return;
		}

		const firstUnlock = !this.unlocked;
		if (!this.ctx) {
			const Ctx =
				window.AudioContext ||
				(window as unknown as { webkitAudioContext: typeof AudioContext })
					.webkitAudioContext;
			this.ctx = new Ctx();
			this.master = this.ctx.createGain();
			this.master.gain.value = this.muted ? 0 : 1;
			this.master.connect(this.ctx.destination);

			this.sfxBus = this.ctx.createGain();
			this.sfxBus.gain.value = 0.95;
			this.sfxBus.connect(this.master);
		}
		if (this.ctx.state === 'suspended') {
			await this.ctx.resume();
		}
		this.unlocked = true;
		// Wire any beds that were warmed before unlock into the Web Audio graph.
		for (const id of this.beds.keys()) {
			this.ensureBedGain(id);
		}
		void this.ensureBuffers();
		// Only once — HTMLMediaElement.load() aborts whatever is already playing.
		if (firstUnlock) this.preloadBeds();
		if (firstUnlock && !this.muted && this.wantAmbient) {
			void this.startBed(this.currentBed, 'fade-in');
		}
		this.emit();
	}

	setMuted(muted: boolean): void {
		this.muted = muted;
		writeMuted(muted);
		if (muted) {
			this.stopAllBeds(false, MUTE_FADE_MS);
			if (this.master && this.ctx) {
				const now = this.ctx.currentTime;
				this.master.gain.cancelScheduledValues(now);
				this.master.gain.setValueAtTime(this.master.gain.value, now);
				this.master.gain.linearRampToValueAtTime(0, now + MUTE_FADE_MS / 1000);
			}
		} else {
			if (this.master && this.ctx) {
				const now = this.ctx.currentTime;
				this.master.gain.cancelScheduledValues(now);
				this.master.gain.setValueAtTime(this.master.gain.value, now);
				this.master.gain.linearRampToValueAtTime(1, now + 0.18);
			}
			void this.unlock().then(() => {
				if (this.wantAmbient) void this.startBed(this.currentBed, 'fade-in');
			});
		}
		this.emit();
	}

	toggleMuted(): void {
		this.setMuted(!this.muted);
	}

	setAmbientEnabled(enabled: boolean): void {
		if (enabled === this.wantAmbient) return;
		this.wantAmbient = enabled;
		if (!enabled) {
			this.stopAllBeds(false, MUTE_FADE_MS);
		} else if (!this.muted && this.unlocked) {
			void this.startBed(this.currentBed, 'fade-in');
		}
	}

	/** Start buffering a bed without switching — keeps the next crossfade smooth. */
	warmBed(bed: AmbientBedId): void {
		this.getBedVoice(bed);
		if (this.unlocked) this.ensureBedGain(bed);
	}

	/** Switch looping bed with a soft dip handoff. Same bed while playing = no-op. */
	setAmbientBed(bed: AmbientBedId, options?: SetAmbientBedOptions): void {
		if (bed === this.currentBed) {
			// Keep the current loop running — never restart hub between main ↔ intro.
			if (
				!this.muted &&
				this.wantAmbient &&
				this.unlocked &&
				!this.isBedAudible(bed)
			) {
				void this.startBed(bed, 'fade-in');
			}
			return;
		}
		const from = this.currentBed;
		this.currentBed = bed;
		this.bedGeneration += 1;
		this.pendingCrossfadeMs =
			options?.crossfadeMs ??
			(from === 'finale' && bed === 'epilogue'
				? FINALE_EPILOGUE_CROSSFADE_MS
				: null);
		if (this.muted || !this.wantAmbient || !this.unlocked) return;
		void this.startBed(bed, 'crossfade');
	}

	/**
	 * Restore hub only if this bed is still the active one.
	 * Lets the next route claim its bed first without a hub blip in between.
	 */
	releaseAmbientBed(bed: AmbientBedId, fallback: AmbientBedId = 'hub'): void {
		if (this.currentBed !== bed) return;
		this.setAmbientBed(fallback);
	}

	play(id: SfxId): void {
		if (this.muted) return;
		void this.unlock().then(() => {
			if (this.muted) return;
			const buffer = this.buffers.get(id);
			if (buffer && this.ctx && this.sfxBus) {
				const src = this.ctx.createBufferSource();
				const gain = this.ctx.createGain();
				src.buffer = buffer;
				gain.gain.value = SFX_VOLUME[id];
				src.connect(gain);
				gain.connect(this.sfxBus);
				src.start();
				return;
			}
			const el = new Audio(sfxUrl(id));
			el.volume = SFX_VOLUME[id];
			void el.play().catch(() => undefined);
		});
	}

	private bedLevel(bed: AmbientBedId): number {
		const voice = this.beds.get(bed);
		if (!voice) return 0;
		if (voice.gain) return voice.gain.gain.value;
		return voice.el.volume;
	}

	private setBedLevel(bed: AmbientBedId, level: number): void {
		const voice = this.beds.get(bed);
		if (!voice) return;
		const v = Math.max(0, Math.min(1, level));
		if (voice.gain) {
			voice.gain.gain.cancelScheduledValues(voice.gain.context.currentTime);
			voice.gain.gain.value = v;
		} else {
			voice.el.volume = v;
		}
	}

	private isBedAudible(bed: AmbientBedId): boolean {
		const voice = this.beds.get(bed);
		if (!voice || voice.el.paused) return false;
		const target = ambientVolume(bed);
		// Treat "nearly there" as audible so we don't restart mid-fade.
		return this.bedLevel(bed) >= Math.min(0.05, target * 0.35);
	}

	private preloadBeds(): void {
		if (this.bedsPreloaded) return;
		this.bedsPreloaded = true;
		// Puzzle beds are lazy — only warm hub / finale / epilogue.
		for (const id of ['hub', 'finale', 'epilogue'] as const) {
			const voice = this.getBedVoice(id);
			this.ensureBedGain(id);
			// Warm the cache without resetting a bed that is already audible.
			if (!voice.el.paused && this.bedLevel(id) > 0.01) continue;
			voice.el.preload = 'auto';
		}
	}

	private ensureBuffers(): Promise<void> {
		if (this.loading) return this.loading;
		if (!this.ctx) return Promise.resolve();
		const ctx = this.ctx;
		const ids = Object.keys(SFX_VOLUME) as SfxId[];
		this.loading = Promise.all(
			ids.map(async (id) => {
				if (this.buffers.has(id)) return;
				try {
					const response = await fetch(sfxUrl(id));
					if (!response.ok) return;
					const data = await response.arrayBuffer();
					const buffer = await ctx.decodeAudioData(data.slice(0));
					this.buffers.set(id, buffer);
				} catch {
					/* keep HTMLAudio fallback */
				}
			})
		).then(() => undefined);
		return this.loading;
	}

	private getBedVoice(bed: AmbientBedId): BedVoice {
		let voice = this.beds.get(bed);
		if (!voice) {
			const el = new Audio(ambientUrl(bed));
			el.loop = true;
			el.preload = 'auto';
			el.volume = 1;
			// iOS: keep looping beds inline (no fullscreen takeover).
			el.setAttribute('playsinline', 'true');
			el.setAttribute('webkit-playsinline', 'true');
			(el as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
			voice = { el, gain: null };
			this.beds.set(bed, voice);
		}
		return voice;
	}

	/**
	 * Route the element through a GainNode once AudioContext exists.
	 * createMediaElementSource can only be called once per element.
	 */
	private ensureBedGain(bed: AmbientBedId): GainNode | null {
		const voice = this.getBedVoice(bed);
		if (voice.gain) return voice.gain;
		if (!this.ctx || !this.master) return null;
		try {
			const source = this.ctx.createMediaElementSource(voice.el);
			const gain = this.ctx.createGain();
			gain.gain.value = 0;
			source.connect(gain);
			gain.connect(this.master);
			voice.gain = gain;
			voice.el.volume = 1;
			return gain;
		} catch {
			// Already connected elsewhere — fall back to element volume.
			return null;
		}
	}

	/** Wait until the element can start playing so fades don't race an empty buffer. */
	private waitForBedReady(el: HTMLAudioElement): Promise<void> {
		if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
			return Promise.resolve();
		}
		return new Promise((resolve) => {
			let settled = false;
			const finish = () => {
				if (settled) return;
				settled = true;
				el.removeEventListener('canplay', finish);
				el.removeEventListener('error', finish);
				window.clearTimeout(timer);
				resolve();
			};
			el.addEventListener('canplay', finish);
			el.addEventListener('error', finish);
			const timer = window.setTimeout(finish, BED_READY_MS);
		});
	}

	private clearFade(bed: AmbientBedId): void {
		const raf = this.fadeRafs.get(bed);
		if (raf !== undefined) {
			window.cancelAnimationFrame(raf);
			this.fadeRafs.delete(bed);
		}
	}

	private clearStopSafety(bed: AmbientBedId): void {
		const timer = this.stopSafetyTimers.get(bed);
		if (timer !== undefined) {
			window.clearTimeout(timer);
			this.stopSafetyTimers.delete(bed);
		}
	}

	private hardStop(bed: AmbientBedId): void {
		const voice = this.beds.get(bed);
		if (!voice) return;
		this.clearFade(bed);
		this.clearStopSafety(bed);
		voice.el.pause();
		this.setBedLevel(bed, 0);
	}

	private stopOtherBeds(
		except: AmbientBedId,
		soft: boolean,
		fadeMs = CROSSFADE_MS
	): void {
		for (const id of this.beds.keys()) {
			if (id === except) continue;
			const voice = this.beds.get(id);
			if (!voice) continue;
			if (soft) {
				if (voice.el.paused && this.bedLevel(id) <= 0.01) continue;
				// Drop outgoing gently so it doesn't mash with the incoming bed.
				this.fadeTo(id, 0, fadeMs, () => this.hardStop(id), easeOutQuad);
				this.clearStopSafety(id);
				const safety = window.setTimeout(
					() => this.hardStop(id),
					fadeMs + 160
				);
				this.stopSafetyTimers.set(id, safety);
			} else {
				this.hardStop(id);
			}
		}
	}

	private stopAllBeds(immediate: boolean, fadeMs = CROSSFADE_MS): void {
		for (const id of this.beds.keys()) {
			if (immediate) this.hardStop(id);
			else this.fadeTo(id, 0, fadeMs, () => this.hardStop(id), easeOutQuad);
		}
	}

	private bedStillWanted(bed: AmbientBedId, generation: number): boolean {
		return (
			this.currentBed === bed &&
			this.bedGeneration === generation &&
			!this.muted &&
			this.wantAmbient
		);
	}

	private async startBed(
		bed: AmbientBedId,
		mode: 'crossfade' | 'fade-in' | 'cut'
	): Promise<void> {
		const voice = this.getBedVoice(bed);
		this.ensureBedGain(bed);
		const targetVol = ambientVolume(bed);
		const crossfadeMs = this.pendingCrossfadeMs ?? CROSSFADE_MS;
		this.pendingCrossfadeMs = null;
		const generation = this.bedGeneration;
		this.clearStopSafety(bed);

		// Already carrying this bed — do not touch level or restart the element.
		if (
			mode !== 'cut' &&
			!voice.el.paused &&
			this.bedLevel(bed) >= targetVol * 0.8 &&
			bed === this.currentBed
		) {
			this.stopOtherBeds(bed, true, Math.round(crossfadeMs * 0.5));
			return;
		}

		if (mode === 'cut') {
			this.stopOtherBeds(bed, false);
			void voice.el.play().catch(() => undefined);
			this.clearFade(bed);
			this.setBedLevel(bed, targetVol);
			return;
		}

		// Buffer + start silent FIRST, then dip the outgoing bed.
		// Fading out before the next file is ready leaves a dead gap on mobile.
		this.setBedLevel(bed, 0);
		await this.waitForBedReady(voice.el);
		if (!this.bedStillWanted(bed, generation)) return;

		try {
			await voice.el.play();
		} catch {
			return;
		}
		if (!this.bedStillWanted(bed, generation)) {
			this.hardStop(bed);
			return;
		}

		const outMs = Math.round(crossfadeMs * 0.5);
		const inDelayMs = mode === 'crossfade' ? Math.round(crossfadeMs * 0.28) : 0;
		const inMs =
			mode === 'crossfade' ? Math.round(crossfadeMs * 0.72) : FADE_IN_MS;

		this.stopOtherBeds(bed, true, outMs);

		if (inDelayMs > 0) {
			await new Promise<void>((resolve) => {
				window.setTimeout(resolve, inDelayMs);
			});
			if (!this.bedStillWanted(bed, generation)) {
				this.hardStop(bed);
				return;
			}
		}

		this.fadeTo(bed, targetVol, inMs, undefined, easeInQuad);
	}

	private fadeTo(
		bed: AmbientBedId,
		target: number,
		durationMs: number,
		onDone?: () => void,
		ease: EaseFn = easeInOut
	): void {
		if (!this.beds.has(bed)) {
			onDone?.();
			return;
		}
		this.clearFade(bed);
		const start = this.bedLevel(bed);
		const startedAt = performance.now();
		const duration = Math.max(1, durationMs);

		const tick = (now: number) => {
			if (!this.beds.has(bed)) {
				this.fadeRafs.delete(bed);
				onDone?.();
				return;
			}
			const t = Math.min(1, (now - startedAt) / duration);
			const eased = ease(t);
			this.setBedLevel(bed, start + (target - start) * eased);
			if (t < 1) {
				const raf = window.requestAnimationFrame(tick);
				this.fadeRafs.set(bed, raf);
				return;
			}
			this.fadeRafs.delete(bed);
			this.setBedLevel(bed, target);
			onDone?.();
		};

		const raf = window.requestAnimationFrame(tick);
		this.fadeRafs.set(bed, raf);
	}
}

export const audio = new AudioDirector();
