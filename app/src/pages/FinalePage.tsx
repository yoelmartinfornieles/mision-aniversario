import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import {
	hasFinaleBeenNotified,
	notifyFinaleComplete,
} from '@/lib/finaleNotify';
import { goHome } from '@/lib/navigation';
import { useProgress } from '@/lib/progress';
import { PROOF_DEAL_MS, PROOF_SPAWN_MS, ProofRain } from '@/pages/ProofRain';

const FINALE_ANSWER = 'yoel';
const finaleAsset = (file: string) =>
	`${import.meta.env.BASE_URL}finale/${file}`;

const SUSPECTS = [
	{
		id: 'kai',
		name: 'Kai',
		src: finaleAsset('kai-moto.jpg'),
		alt: 'Kai en su moto Vespa roja',
		x: 50,
		y: 5,
		r: -6,
		mx: 22,
		my: 42,
		pin: 'ruby',
	},
	{
		id: 'inma',
		name: 'Inma',
		src: finaleAsset('inma-sospechosa.jpg'),
		alt: 'Inma y la Peque, mirando con sospecha',
		x: 18,
		y: 7,
		r: 8,
		mx: 52,
		my: 34,
		pin: 'brass',
	},
	{
		id: 'presi',
		name: 'Presi',
		src: finaleAsset('presi-sospechoso.jpg'),
		alt: 'Presi y el Capi, actitud sospechosa',
		x: 90,
		y: 6,
		r: -4,
		mx: 84,
		my: 48,
		pin: 'navy',
	},
	{
		id: 'emilio',
		name: 'Emilio',
		src: finaleAsset('emilio-sospechoso.jpg'),
		alt: 'Emilio y Rafa, mirando con sospecha',
		x: 93,
		y: 28,
		r: 7,
		mx: 10,
		my: 52,
		pin: 'ruby',
	},
	{
		id: 'berta',
		name: 'Berta',
		src: finaleAsset('berta-sospechosa.jpg'),
		alt: 'Berta con mirada sospechosa',
		x: 91,
		y: 50,
		r: -9,
		mx: 38,
		my: 40,
		pin: 'brass',
	},
	{
		id: 'abupepe',
		name: 'AbuPepe',
		src: finaleAsset('abupepe-sospechoso.jpg'),
		alt: 'AbuPepe con sonrisa cómplice',
		x: 88,
		y: 72,
		r: 5,
		mx: 70,
		my: 36,
		pin: 'forest',
	},
	{
		id: 'eloy',
		name: 'Eloy',
		src: finaleAsset('eloy-sospechoso.jpg'),
		alt: 'Eloy e Isa, cómplices',
		x: 72,
		y: 93,
		r: -7,
		mx: 18,
		my: 44,
		band: 'bottom' as const,
		pin: 'navy',
	},
	{
		id: 'juani',
		name: 'Juani',
		src: finaleAsset('juani-sospechoso.jpg'),
		alt: 'Juani y Luca, sospechosos',
		x: 48,
		y: 95,
		r: 4,
		mx: 48,
		my: 38,
		band: 'bottom' as const,
		pin: 'ruby',
	},
	{
		id: 'saioa',
		name: 'Saioa',
		src: finaleAsset('saioa-sospechosa.jpg'),
		alt: 'Saioa con expresión sospechosa',
		x: 24,
		y: 92,
		r: -3,
		mx: 80,
		my: 50,
		band: 'bottom' as const,
		pin: 'brass',
	},
	{
		id: 'unai',
		name: 'Unai',
		src: finaleAsset('unai-sospechoso.jpg'),
		alt: 'Unai con mirada sospechosa',
		x: 7,
		y: 68,
		r: 6,
		mx: 32,
		my: 52,
		band: 'bottom' as const,
		pin: 'forest',
	},
	{
		id: 'yoel',
		name: 'Yoel',
		src: finaleAsset('yoel-sospechoso.jpg'),
		alt: 'Yoel con expresión culpable',
		x: 6,
		y: 42,
		r: -8,
		mx: 66,
		my: 42,
		band: 'bottom' as const,
		pin: 'navy',
	},
	{
		id: 'george',
		name: 'George',
		src: finaleAsset('george-sospechoso.jpg'),
		alt: 'George el gato, sospechoso',
		x: 9,
		y: 20,
		r: 10,
		mx: 6,
		my: 36,
		pin: 'ruby',
	},
] as const;

const TOP_SUSPECTS = SUSPECTS.filter((s) => !('band' in s && s.band === 'bottom'));
const BOTTOM_SUSPECTS = SUSPECTS.filter((s) => 'band' in s && s.band === 'bottom');

const normalizeAnswer = (value: string): string =>
	value
		.trim()
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase();

type FinalePhase = 'ask' | 'sending' | 'sent' | 'already';

const initialPhase = (): FinalePhase =>
	hasFinaleBeenNotified() ? 'already' : 'ask';

const SuspectPin = ({
	suspect,
	index,
}: {
	suspect: (typeof SUSPECTS)[number];
	index: number;
}) => (
	<li
		style={
			{
				'--x': suspect.x,
				'--y': suspect.y,
				'--r': `${suspect.r}deg`,
				'--mx': suspect.mx,
				'--my': suspect.my,
				'--delay': `${0.06 + index * 0.045}s`,
			} as CSSProperties
		}
		data-pin={suspect.pin}
	>
		<figure className="finale-photo-card">
			<span className="finale-chincheta" aria-hidden="true" />
			<img src={suspect.src} alt={suspect.alt} />
			<figcaption>{suspect.name}</figcaption>
		</figure>
	</li>
);

export const FinalePage = () => {
	const { isPuzzleCompleted } = useProgress();
	const lastDone = isPuzzleCompleted('puzzle05-gift-plot');

	const [answer, setAnswer] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [phase, setPhase] = useState<FinalePhase>(initialPhase);
	const [revealMail, setRevealMail] = useState(false);
	const [reducedMotion] = useState(
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
	const mounted = useRef(true);

	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	if (!lastDone) {
		return (
			<div className="landing-shell">
				<div className="landing-card">
					<p className="label">Archivo clasificado</p>
					<h1>Aún no</h1>
					<p className="landing-kicker">El expediente sigue abierto.</p>
					<p className="landing-copy">
						Esta pregunta solo aparece cuando has cerrado los cinco dossiers.
					</p>
					<button type="button" className="primary-button" onClick={goHome}>
						Volver al archivo
					</button>
				</div>
			</div>
		);
	}

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		if (phase !== 'ask') return;

		if (normalizeAnswer(answer) !== FINALE_ANSWER) {
			setError('Respuesta incorrecta. Piensa en la primera cita…');
			return;
		}

		setError(null);
		setRevealMail(false);
		setPhase('sending');
		const started = performance.now();
		const sleep = (ms: number) =>
			new Promise((resolve) => setTimeout(resolve, ms));
		void notifyFinaleComplete().then(async (ok) => {
			if (!mounted.current) return;
			if (!reducedMotion) {
				const elapsed = performance.now() - started;
				const untilReveal = Math.max(0, PROOF_DEAL_MS - elapsed);
				const untilEnd = Math.max(0, PROOF_SPAWN_MS - elapsed);
				if (ok && untilReveal > 0) await sleep(untilReveal);
				if (!mounted.current) return;
				if (ok) setRevealMail(true);
				const rest = ok ? untilEnd - untilReveal : untilEnd;
				if (rest > 0) await sleep(rest);
				if (!mounted.current) return;
			}
			if (!ok) {
				setRevealMail(false);
				setPhase('ask');
				setError(
					'No se pudo enviar el aviso. Inténtalo de nuevo en un momento.'
				);
				return;
			}
			setPhase('sent');
		});
	};

	const headline =
		phase === 'sent'
			? 'Revisa tu correo electrónico…'
			: phase === 'ask' || phase === 'sending'
				? 'Última pregunta'
				: 'Caso cerrado';

	const kicker =
		phase === 'ask' || phase === 'sending'
			? 'Una pregunta más antes de la sentencia.'
			: 'El regalo va de camino a tu correo.';

	const flooding = !reducedMotion && (phase === 'sending' || phase === 'sent');
	const showSuspects = phase === 'ask' || (phase === 'sending' && reducedMotion);

	if (flooding) {
		return (
			<div className="landing-shell finale-shell finale-shell--rain">
				<ProofRain spawning={phase === 'sending'} />
				{(revealMail || phase === 'sent') && (
					<div className="proof-message">
						<div className="landing-card finale-card proof-message-card">
							<p className="label">Caso cerrado</p>
							<h1>Revisa tu correo electrónico…</h1>
							<p className="landing-copy">
								Cinco dossiers. Una última confesión. Adjunto en el correo: la
								prueba del delito.
							</p>
							<button type="button" className="text-link" onClick={goHome}>
								← Volver al archivo
							</button>
						</div>
					</div>
				)}
			</div>
		);
	}

	return (
		<div
			className={`landing-shell finale-shell${showSuspects ? ' finale-shell--board' : ''}`}
		>
			<div className="finale-stage">
				{showSuspects && (
					<>
						<ul
							className="finale-suspects finale-suspects--top"
							aria-label="Sospechosos (arriba)"
						>
							{TOP_SUSPECTS.map((suspect, index) => (
								<SuspectPin key={suspect.id} suspect={suspect} index={index} />
							))}
						</ul>
						<ul
							className="finale-suspects finale-suspects--bottom"
							aria-label="Sospechosos (abajo)"
						>
							{BOTTOM_SUSPECTS.map((suspect, index) => (
								<SuspectPin
									key={suspect.id}
									suspect={suspect}
									index={index + TOP_SUSPECTS.length}
								/>
							))}
						</ul>
					</>
				)}

				<div className="landing-card finale-card">
					<p className="label">Archivo clasificado · Cierre</p>
					<h1>{headline}</h1>
					<p className="landing-kicker">{kicker}</p>

					{showSuspects && (
						<>
							<p className="landing-copy finale-question">
								¿Quién tiró los platos en nuestra primera cita?
							</p>
							<form className="finale-form" onSubmit={handleSubmit}>
								<input
									type="text"
									value={answer}
									onChange={(event) => {
										setAnswer(event.target.value);
										setError(null);
									}}
									placeholder="Nombre"
									autoComplete="off"
									spellCheck={false}
									aria-label="Respuesta a la última pregunta"
									disabled={phase === 'sending'}
								/>
								<button
									type="submit"
									className="primary-button"
									disabled={phase === 'sending' || !answer.trim()}
								>
									{phase === 'sending' ? 'Enviando…' : 'Cerrar el caso'}
								</button>
							</form>
							{error && (
								<p className="continue-feedback error" role="status">
									{error}
								</p>
							)}
						</>
					)}

					{(phase === 'sent' || phase === 'already') && (
						<p className="landing-copy">
							{phase === 'already'
								? 'Esta sentencia ya se dictó desde este navegador. Revisa tu correo si aún no ha llegado.'
								: 'Cinco dossiers. Una última confesión. Adjunto en el correo: la prueba del delito.'}
						</p>
					)}

					<button type="button" className="text-link" onClick={goHome}>
						← Volver al archivo
					</button>
				</div>
			</div>
		</div>
	);
};
