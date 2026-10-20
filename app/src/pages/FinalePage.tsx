import { useState, type FormEvent } from 'react';
import {
	hasFinaleBeenNotified,
	notifyFinaleComplete,
} from '@/lib/finaleNotify';
import { goHome } from '@/lib/navigation';
import { useProgress } from '@/lib/progress';

const FINALE_ANSWER = 'yoel';
const KAI_MOTO_SRC = `${import.meta.env.BASE_URL}finale/kai-moto.jpg`;

const normalizeAnswer = (value: string): string =>
	value
		.trim()
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase();

type FinalePhase = 'ask' | 'sending' | 'sent' | 'already';

const initialPhase = (): FinalePhase =>
	hasFinaleBeenNotified() ? 'already' : 'ask';

export const FinalePage = () => {
	const { isPuzzleCompleted } = useProgress();
	const lastDone = isPuzzleCompleted('puzzle05-gift-plot');

	const [answer, setAnswer] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [phase, setPhase] = useState<FinalePhase>(initialPhase);

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
		setPhase('sending');
		void notifyFinaleComplete().then((ok) => {
			if (ok) {
				setPhase('sent');
				return;
			}
			setPhase('ask');
			setError(
				'No se pudo enviar el aviso. Inténtalo de nuevo en un momento.'
			);
		});
	};

	const headline =
		phase === 'ask' || phase === 'sending'
			? 'Última pregunta'
			: 'Caso cerrado';

	const kicker =
		phase === 'ask' || phase === 'sending'
			? 'Una pregunta más antes de la sentencia.'
			: 'El regalo va de camino a tu correo.';

	return (
		<div className="landing-shell finale-shell">
			<div className="landing-card finale-card">
				<p className="label">Archivo clasificado · Cierre</p>
				<h1>{headline}</h1>
				<p className="landing-kicker">{kicker}</p>

				{(phase === 'ask' || phase === 'sending') && (
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
							: 'Cinco dossiers. Una última confesión. En el correo: la prueba del delito.'}
					</p>
				)}

				<button type="button" className="text-link" onClick={goHome}>
					← Volver al archivo
				</button>
			</div>

			<figure className="finale-photo-card" aria-label="Kai en moto">
				<img src={KAI_MOTO_SRC} alt="Kai en su moto Vespa roja" />
				<figcaption>Sospechoso · Kai</figcaption>
			</figure>
		</div>
	);
};
