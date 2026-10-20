import { useEffect, useState, type CSSProperties } from 'react';

export const PROOF_COUNT = 79;

/** Slow at the ends, fast in the middle (1 → 0 → 1). */
const slowFactor = (t: number) => 0.5 + 0.5 * Math.cos(Math.PI * 2 * Math.min(1, Math.max(0, t)));

const cinematicInterval = (t: number, min: number, max: number) =>
	min + (max - min) * slowFactor(t);

const DEAL_INTERVAL_MIN = 72;
const DEAL_INTERVAL_MAX = 290;
const FLIGHT_MIN = 400;
const FLIGHT_MAX = 820;
const FAST_TAIL = 4200;
const PRELOAD_CONCURRENCY = 5;

const ease = (from: number, to: number, t: number) => from * (to / from) ** t;

const dealFlight = (t: number) => FLIGHT_MIN + (FLIGHT_MAX - FLIGHT_MIN) * slowFactor(t);

/** Spawn times for the 79 table cards: lento → ráfaga → aterrizaje. */
const buildDealSchedule = (): number[] => {
	const schedule = [0];
	let time = 0;
	const gaps = PROOF_COUNT - 1;
	for (let i = 1; i <= gaps; i += 1) {
		const t = gaps <= 1 ? 0 : (i - 1) / (gaps - 1);
		time += cinematicInterval(t, DEAL_INTERVAL_MIN, DEAL_INTERVAL_MAX);
		schedule.push(time);
	}
	return schedule;
};

const DEAL_SCHEDULE = buildDealSchedule();
const DEAL_LAST_AT = DEAL_SCHEDULE[PROOF_COUNT - 1];

export const PROOF_DEAL_MS = DEAL_LAST_AT + dealFlight(1);
export const PROOF_SPAWN_MS = PROOF_DEAL_MS + FAST_TAIL;

const PINS = ['ruby', 'brass', 'navy', 'forest'] as const;

type ProofPin = (typeof PINS)[number];

type ProofDrop = {
	id: number;
	proofNumber: string;
	src: string;
	width: number;
	height: number;
	y: number;
	r: number;
	size: number;
	dur: number;
	pin: ProofPin;
};

export const proofSrc = (index: number) =>
	`${import.meta.env.BASE_URL}finale/pruebas-ilustradas/prueba-${String(index + 1).padStart(2, '0')}.jpg`;

const proofLoads = new Map<number, Promise<boolean>>();
const proofSizes = new Map<number, { width: number; height: number }>();

const loadProof = (index: number): Promise<boolean> => {
	const cached = proofLoads.get(index);
	if (cached) return cached;
	const promise = new Promise<boolean>((resolve) => {
		const img = new Image();
		img.decoding = 'async';
		img.onload = () => {
			proofSizes.set(index, {
				width: img.naturalWidth,
				height: img.naturalHeight,
			});
			if (typeof img.decode === 'function') {
				void img.decode().then(
					() => resolve(true),
					() => resolve(true)
				);
			} else {
				resolve(true);
			}
		};
		img.onerror = () => resolve(false);
		img.src = proofSrc(index);
	});
	proofLoads.set(index, promise);
	return promise;
};

const runPool = async <T,>(
	items: T[],
	limit: number,
	worker: (item: T) => Promise<unknown>
) => {
	let cursor = 0;
	const run = async () => {
		while (cursor < items.length) {
			const item = items[cursor];
			cursor += 1;
			await worker(item);
		}
	};
	await Promise.all(
		Array.from({ length: Math.min(limit, items.length) }, () => run())
	);
};

/** Warm the proof JPEGs while the detective is still on the ask screen. */
export const warmProofImages = () => {
	void runPool(
		[...Array(PROOF_COUNT).keys()],
		PRELOAD_CONCURRENCY,
		loadProof
	);
};

const shuffle = <T,>(items: T[]): T[] => {
	const next = [...items];
	for (let i = next.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		const current = next[i];
		next[i] = next[j];
		next[j] = current;
	}
	return next;
};

const tableAnchors = (narrow: boolean) => {
	const cols = narrow ? 4 : 8;
	const rows = Math.ceil(PROOF_COUNT / cols);
	const xMin = narrow ? 18 : 11;
	const xSpan = narrow ? 64 : 78;
	const yMin = narrow ? 16 : 12;
	const ySpan = narrow ? 68 : 76;
	const anchors = [];
	for (let row = 0; row < rows; row += 1) {
		for (let col = 0; col < cols; col += 1) {
			anchors.push({
				x: xMin + ((col + 0.5) / cols) * xSpan,
				y: yMin + ((row + 0.5) / rows) * ySpan,
			});
		}
	}
	return shuffle(anchors).slice(0, PROOF_COUNT);
};

const markProofImg = (img: HTMLImageElement | null) => {
	if (!img) return;
	if (img.complete && img.naturalWidth > 0) {
		img.classList.add('is-loaded');
	}
};

const onProofLoad = (event: { currentTarget: HTMLImageElement }) => {
	event.currentTarget.classList.add('is-loaded');
};

export const ProofRain = ({ spawning }: { spawning: boolean }) => {
	const [drops, setDrops] = useState<ProofDrop[]>([]);

	useEffect(() => {
		if (!spawning) return;

		const narrow = window.matchMedia('(max-width: 560px)').matches;
		const pileCap = narrow ? 34 : 52;
		const sizeMin = narrow ? 112 : 150;
		const sizeSpan = narrow ? 36 : 52;
		const order = shuffle([...Array(PROOF_COUNT).keys()]);
		const anchors = tableAnchors(narrow);
		const schedule = [...DEAL_SCHEDULE];
		const fastOrigin = DEAL_LAST_AT;
		let time = fastOrigin;
		// Aftershock: still quick at first, then settles with the letterbox.
		while (time < fastOrigin + FAST_TAIL) {
			const fastT = (time - fastOrigin) / FAST_TAIL;
			const interval = ease(52, 210, Math.min(1, fastT));
			const burst = fastT < 0.35 ? 3 : fastT < 0.7 ? 2 : 1;
			time += interval;
			if (time > fastOrigin + FAST_TAIL) break;
			for (let i = 0; i < burst; i += 1) schedule.push(time);
		}

		let cursor = 0;
		let nextId = 0;
		let timer = 0;

		// Keep the pool warm for any still missing after the ask-screen prefetch.
		void runPool(order, PRELOAD_CONCURRENCY, loadProof);

		const started = performance.now();
		const tick = () => {
			const elapsed = performance.now() - started;
			const added: ProofDrop[] = [];
			while (cursor < schedule.length && schedule[cursor] <= elapsed) {
				const dealIndex = cursor;
				const index = order[dealIndex % order.length];
				const anchor = anchors[dealIndex % anchors.length];
				const scattered = dealIndex >= PROOF_COUNT;
				const dealT =
					PROOF_COUNT <= 1 ? 0 : Math.min(1, dealIndex / (PROOF_COUNT - 1));
				const fastT = scattered
					? Math.min(1, (schedule[dealIndex] - fastOrigin) / FAST_TAIL)
					: 0;
				cursor += 1;
				nextId += 1;
				void loadProof(index);
				added.push({
					id: nextId,
					proofNumber: String(index + 1).padStart(2, '0'),
					src: proofSrc(index),
					width: proofSizes.get(index)?.width ?? 400,
					height: proofSizes.get(index)?.height ?? 300,
					x: scattered
						? 12 + Math.random() * 76
						: anchor.x + (Math.random() * 2 - 1) * 3.5,
					y: scattered
						? 14 + Math.random() * 72
						: anchor.y + (Math.random() * 2 - 1) * 2.8,
					r: (Math.random() * 2 - 1) * (scattered ? 18 : 11),
					size: sizeMin + Math.random() * sizeSpan,
					dur: scattered
						? ease(360, 720, fastT)
						: dealFlight(dealT),
					pin: PINS[nextId % PINS.length],
				});
			}
			if (added.length > 0) {
				const keepAll = cursor <= PROOF_COUNT;
				setDrops((prev) => {
					const next = [...prev, ...added];
					if (keepAll || next.length <= pileCap) return next;
					return next.slice(next.length - pileCap);
				});
			}
			if (cursor >= schedule.length) return;
			const wait = Math.max(16, schedule[cursor] - elapsed);
			timer = window.setTimeout(tick, Math.min(wait, 200));
		};

		timer = window.setTimeout(tick, 0);
		return () => window.clearTimeout(timer);
	}, [spawning]);

	return (
		<div className="proof-rain" aria-hidden="true">
			{drops.map((drop) => (
				<div
					key={drop.id}
					className="proof-drop"
					data-pin={drop.pin}
					style={
						{
							'--x': `${drop.x}%`,
							'--y': `${drop.y}%`,
							'--r': `${drop.r}deg`,
							'--size': `${drop.size}px`,
							'--dur': `${drop.dur}ms`,
							zIndex: drop.id,
						} as CSSProperties
					}
				>
					<figure className="finale-photo-card finale-photo-card--proof">
						<span className="finale-chincheta" aria-hidden="true" />
						<img
							ref={markProofImg}
							src={drop.src}
							width={drop.width}
							height={drop.height}
							alt=""
							draggable={false}
							decoding="async"
							onLoad={onProofLoad}
						/>
						<figcaption>Prueba {drop.proofNumber}</figcaption>
					</figure>
				</div>
			))}
		</div>
	);
};
