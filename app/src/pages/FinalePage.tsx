import {
	useEffect,
	useRef,
	useState,
	type CSSProperties,
	type FormEvent,
	type ReactNode,
} from 'react';
import { SoundToggle, audio } from '@/lib/audio';
import {
	hasFinaleBeenNotified,
	hasFinaleBeenSolved,
	markFinaleSolved,
	notifyFinaleComplete,
} from '@/lib/finaleNotify';
import { goHome } from '@/lib/navigation';
import { useProgress } from '@/lib/progress';
import { HintsPanel } from '@/puzzles/shared/HintsPanel';
import { FinaleGallery, type FinaleView } from '@/pages/FinaleGallery';
import { FINALE_HINTS } from '@/pages/finaleHints';
import {
	PROOF_DEAL_MS,
	PROOF_SPAWN_MS,
	ProofRain,
	warmProofImages,
} from '@/pages/ProofRain';
import {
	FINALE_SUSPECTS,
	pickDeskSuspects,
	type FinaleSuspect,
} from '@/pages/finaleSuspects';

const MOBILE_DESK_MAX = 32;

const FINALE_ANSWER = 'disney';

const normalizeAnswer = (value: string): string =>
	value
		.trim()
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/[^a-z]/g, '');

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const prefersReducedMotion = () =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type FinalePhase = 'ask' | 'sending' | 'sent' | 'already';

const initialPhase = (): FinalePhase =>
	hasFinaleBeenSolved() ? 'already' : 'ask';

const SoundDock = () => (
	<div className="sound-dock">
		<SoundToggle />
	</div>
);

const SuspectPin = ({
	suspect,
	index,
}: {
	suspect: FinaleSuspect;
	index: number;
}) => (
	<li
		className={suspect.featured ? 'finale-suspect--featured' : undefined}
		style={
			{
				'--x': suspect.x,
				'--y': suspect.y,
				'--r': `${suspect.r}deg`,
				'--mx': suspect.mx,
				'--my': suspect.my,
				'--z': suspect.z,
				'--delay': `${0.04 + Math.min(index, 18) * 0.03}s`,
			} as CSSProperties
		}
		data-pin={suspect.pin}
	>
		<figure
			className={
				suspect.id === 'kai'
					? 'finale-photo-card finale-photo-card--kai'
					: 'finale-photo-card'
			}
		>
			<span className="finale-chincheta" aria-hidden="true" />
			<img
				src={suspect.src}
				alt={suspect.alt}
				draggable={false}
				loading={suspect.featured ? 'eager' : 'lazy'}
				decoding="async"
				fetchPriority={suspect.featured ? 'high' : 'low'}
			/>
			<figcaption>{suspect.name}</figcaption>
		</figure>
	</li>
);

const LockedGate = () => (
	<div className="landing-shell">
		<SoundDock />
		<div className="landing-card">
			<p className="label">Archivo clasificado</p>
			<h1>Aún no</h1>
			<p className="landing-kicker">El expediente sigue abierto.</p>
			<p className="landing-copy">
				Esta pregunta solo aparece cuando cierres los cinco dossiers.
			</p>
			<button type="button" className="primary-button" onClick={goHome}>
				Volver al archivo
			</button>
		</div>
	</div>
);

/** Proof photos stay mounted from rain → caso cerrado so the table doesn't vanish. */
const ProofDesk = ({
	spawning,
	revealMail,
	closed,
	closedPanel,
}: {
	spawning: boolean;
	revealMail: boolean;
	closed: boolean;
	closedPanel: ReactNode;
}) => (
	<div
		className={`landing-shell finale-shell finale-shell--rain${
			revealMail && !closed ? ' finale-shell--letterbox' : ''
		}${closed ? ' finale-shell--proof-settled' : ''}`}
	>
		<SoundDock />
		<ProofRain spawning={spawning} />
		{revealMail && !closed && (
			<div className="proof-message">
				<div className="landing-card finale-card proof-message-card">
					<p className="label">Caso cerrado</p>
					<h1>La sentencia viaja…</h1>
					<p className="landing-copy">
						La resolución sale hacia tu correo. Un momento, detective.
					</p>
				</div>
			</div>
		)}
		{closed && (
			<div className="proof-message">
				<div className="landing-card finale-card proof-message-card">
					<p className="label">Archivo clasificado · Cierre</p>
					{closedPanel}
				</div>
			</div>
		)}
	</div>
);

const closedCopy = (
	phase: FinalePhase,
	mailOk: boolean
): { kicker: string; body: string } => {
	if (phase === 'already') {
		return {
			kicker: 'Esta sentencia ya se dictó.',
			body: mailOk
				? 'Has completado el caso. La resolución ya salió de este navegador. Revisa tu correo si aún no ha llegado.'
				: 'Has completado el caso. La resolución aún no ha llegado al correo. El expediente, eso sí, queda cerrado.',
		};
	}
	return {
		kicker: 'La sentencia está dictada, detective.',
		body: mailOk
			? 'Has completado el caso. La resolución se envía a tu correo: cinco dossiers, un último candado y la prueba del delito adjunta.'
			: 'Has completado el caso. La resolución aún no ha llegado al correo. El expediente, eso sí, queda cerrado.',
	};
};

const ClosedPanel = ({
	phase,
	mailOk,
	mailBusy,
	error,
	onResend,
	onView,
}: {
	phase: FinalePhase;
	mailOk: boolean;
	mailBusy: boolean;
	error: string | null;
	onResend: () => void;
	onView: (next: FinaleView) => void;
}) => {
	const { kicker, body } = closedCopy(phase, mailOk);
	return (
		<>
			<h1>Caso cerrado</h1>
			<p className="landing-kicker">{kicker}</p>
			<p className="landing-copy">{body}</p>
			{error && (
				<p className="continue-feedback error" role="status">
					{error}
				</p>
			)}
			{!mailOk && (
				<button
					type="button"
					className="primary-button"
					onClick={onResend}
					disabled={mailBusy}
				>
					{mailBusy ? 'Reenviando…' : 'Reenviar la resolución'}
				</button>
			)}
			<div className="finale-view-row">
				<button
					type="button"
					className="finale-view-button"
					onClick={() => onView('suspects')}
				>
					Mostrar sospechosos
				</button>
				<button
					type="button"
					className="finale-view-button"
					onClick={() => onView('proofs')}
				>
					Mostrar pruebas
				</button>
			</div>
			<button
				type="button"
				className={mailOk ? 'primary-button' : 'text-link'}
				onClick={goHome}
			>
				{mailOk ? 'Volver al archivo' : '← Volver al archivo'}
			</button>
		</>
	);
};

const AskPanel = ({
	answer,
	error,
	busy,
	onAnswerChange,
	onSubmit,
	onHints,
}: {
	answer: string;
	error: string | null;
	busy: boolean;
	onAnswerChange: (value: string) => void;
	onSubmit: (event: FormEvent) => void;
	onHints: () => void;
}) => (
	<>
		<h1>Última pregunta</h1>
		<p className="landing-kicker">Un candado más antes de la sentencia.</p>
		<p className="landing-copy finale-question">
			¿Cuál es nuestro siguiente caso juntos?
		</p>
		<form className="finale-form" onSubmit={onSubmit}>
			<input
				type="text"
				value={answer}
				onChange={(event) => onAnswerChange(event.target.value)}
				placeholder="Destino"
				autoComplete="off"
				spellCheck={false}
				aria-label="Respuesta a la última pregunta"
				disabled={busy}
			/>
			<button
				type="submit"
				className="primary-button"
				disabled={busy || !answer.trim()}
			>
				{busy ? 'Enviando…' : 'Cerrar el caso'}
			</button>
			<button
				type="button"
				className="finale-hint-button"
				onClick={onHints}
				disabled={busy}
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
					focusable="false"
				>
					<path d="M9 16v-1c0-1.5-3-2.5-3-6a6 6 0 0 1 12 0c0 3.5-3 4.5-3 6v1Z" />
					<path d="M9 19h6M10 22h4M12 1v1M2 8H1M23 8h-1M4 3l1 1M20 3l-1 1" />
				</svg>
				Pista
			</button>
		</form>
		{error && (
			<p className="continue-feedback error" role="status">
				{error}
			</p>
		)}
		<div className="finale-links">
			<button type="button" className="text-link" onClick={goHome}>
				← Volver al archivo
			</button>
		</div>
	</>
);

export const FinalePage = () => {
	const { isPuzzleCompleted } = useProgress();
	const lastDone = isPuzzleCompleted('puzzle05-gift-plot');

	const [answer, setAnswer] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [phase, setPhase] = useState<FinalePhase>(initialPhase);
	const [showHints, setShowHints] = useState(false);
	const [view, setView] = useState<FinaleView>('card');
	const [revealMail, setRevealMail] = useState(false);
	const [mailOk, setMailOk] = useState(() => hasFinaleBeenNotified());
	const [mailBusy, setMailBusy] = useState(false);
	const [reducedMotion] = useState(prefersReducedMotion);
	const [narrowDesk, setNarrowDesk] = useState(
		() => window.matchMedia('(max-width: 560px)').matches
	);
	/** One random mobile sample per visit (Kai/Yoel always included). */
	const [mobileDeskSample] = useState(() =>
		pickDeskSuspects(FINALE_SUSPECTS, MOBILE_DESK_MAX)
	);
	const mounted = useRef(true);

	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	useEffect(() => {
		const media = window.matchMedia('(max-width: 560px)');
		const sync = () => setNarrowDesk(media.matches);
		sync();
		media.addEventListener('change', sync);
		return () => media.removeEventListener('change', sync);
	}, []);

	// Climax while asking; epilogue once closed (or already was).
	// Warm epilogue early so the long crossfade can start without a buffer gap.
	useEffect(() => {
		if (phase === 'ask') audio.warmBed('epilogue');
		audio.setAmbientBed(phase === 'ask' ? 'finale' : 'epilogue');
	}, [phase]);

	// Pull proof JPEGs while the detective types — mobile otherwise deals blank strips.
	useEffect(() => {
		if (!lastDone || phase !== 'ask' || reducedMotion) return;
		warmProofImages();
	}, [lastDone, phase, reducedMotion]);

	if (!lastDone) return <LockedGate />;

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		if (phase !== 'ask') return;

		if (!normalizeAnswer(answer).includes(FINALE_ANSWER)) {
			audio.play('error');
			setError('Ese no es el siguiente caso. Cinco dossiers, cinco pistas. Algo se te escapa, detective. ¿Necesitas una pista?');
			return;
		}

		setError(null);
		setRevealMail(false);
		markFinaleSolved();
		// Start the calm bed immediately — don't wait for the phase effect.
		audio.setAmbientBed('epilogue');
		audio.play('caseClosed');
		setPhase('sending');

		const started = performance.now();
		void notifyFinaleComplete().then(async (ok) => {
			if (!mounted.current) return;
			if (!reducedMotion) {
				const elapsed = performance.now() - started;
				const untilReveal = Math.max(0, PROOF_DEAL_MS - elapsed);
				const untilEnd = Math.max(0, PROOF_SPAWN_MS - elapsed);
				if (untilReveal > 0) await sleep(untilReveal);
				if (!mounted.current) return;
				setRevealMail(true);
				const rest = untilEnd - untilReveal;
				if (rest > 0) await sleep(rest);
				if (!mounted.current) return;
			}
			setMailOk(ok);
			if (!ok) {
				setError(
					'El correo no salió. El caso queda cerrado; puedes reintentar el envío.'
				);
			}
			setPhase('sent');
		});
	};

	const handleResendMail = () => {
		if (mailBusy || mailOk) return;
		setMailBusy(true);
		setError(null);
		void notifyFinaleComplete().then((ok) => {
			if (!mounted.current) return;
			setMailBusy(false);
			setMailOk(ok);
			if (!ok) {
				setError('El correo no salió. Inténtalo de nuevo en un momento.');
			}
		});
	};

	const closed = phase === 'sent' || phase === 'already';
	const flooding = !reducedMotion && phase === 'sending';
	// After the deal, keep the Carla/Yoel proof photos on the table under the card.
	const proofDesk =
		!reducedMotion && (phase === 'sending' || phase === 'sent');
	const showSuspects =
		phase === 'ask' || (phase === 'sending' && reducedMotion);
	const deskSuspects = narrowDesk ? mobileDeskSample : FINALE_SUSPECTS;

	const closedPanel = (
		<ClosedPanel
			phase={phase}
			mailOk={mailOk}
			mailBusy={mailBusy}
			error={error}
			onResend={handleResendMail}
			onView={setView}
		/>
	);

	if (closed && view !== 'card') {
		return (
			<FinaleGallery
				kind={view}
				suspects={FINALE_SUSPECTS}
				onKind={setView}
			/>
		);
	}

	if (proofDesk) {
		return (
			<ProofDesk
				spawning={flooding}
				revealMail={revealMail}
				closed={closed}
				closedPanel={closedPanel}
			/>
		);
	}

	return (
		<div
			className={`landing-shell finale-shell${showSuspects ? ' finale-shell--board' : ''}`}
		>
			<SoundDock />
			<div className="finale-stage">
				{showSuspects && (
					<ul
						className="finale-suspects finale-suspects--pile"
						aria-label="Sospechosos"
					>
						{deskSuspects.map((suspect, index) => (
							<SuspectPin key={suspect.id} suspect={suspect} index={index} />
						))}
					</ul>
				)}

				<div className="landing-card finale-card">
					<p className="label">Archivo clasificado · Cierre</p>
					{closed ? (
						closedPanel
					) : (
						<AskPanel
							answer={answer}
							error={error}
							busy={phase === 'sending'}
							onAnswerChange={(value) => {
								setAnswer(value);
								setError(null);
							}}
							onSubmit={handleSubmit}
							onHints={() => setShowHints(true)}
						/>
					)}
				</div>
			</div>
			<HintsPanel
				hints={FINALE_HINTS}
				open={showHints}
				onClose={() => setShowHints(false)}
				persistKey="puzzle06-finale"
			/>
		</div>
	);
};
