import { useState, type CSSProperties, type FormEvent } from 'react';
import { goToFinale } from '@/lib/navigation';
import { useProgress } from '@/lib/progress';
import { PUZZLES } from '@/puzzles/catalog';
import type { PuzzleId } from '@/puzzles/types';

type HomePageProps = {
	onNavigateToPuzzle: (puzzleId: PuzzleId) => void;
};

export const HomePage = ({ onNavigateToPuzzle }: HomePageProps) => {
	const {
		progress,
		redeemContinueCode,
		isPuzzleCompleted,
		isPuzzleUnlocked,
		resetProgress,
	} = useProgress();

	const [codeInput, setCodeInput] = useState('');
	const [codeMessage, setCodeMessage] = useState<string | null>(null);
	const [codeError, setCodeError] = useState(false);

	const completedCount = progress.completedPuzzles.length;
	const visiblePuzzles = PUZZLES.filter(
		(puzzle) => puzzle.number < 5 || isPuzzleUnlocked(puzzle.id)
	);
	const fifthUnlocked = isPuzzleUnlocked('puzzle05-gift-plot');
	const fifthDone = isPuzzleCompleted('puzzle05-gift-plot');
	const nextPuzzle =
		visiblePuzzles.find((puzzle) => !isPuzzleCompleted(puzzle.id)) ?? null;

	const handleRedeem = (event: FormEvent) => {
		event.preventDefault();
		const restored = redeemContinueCode(codeInput);
		if (!restored) {
			setCodeError(true);
			setCodeMessage('Clave desconocida. Revisa lo que anotaste.');
			return;
		}

		const puzzle = PUZZLES.find((entry) => entry.id === restored);
		setCodeError(false);
		setCodeMessage(
			`Expediente restaurado hasta «${puzzle?.label}». Puedes seguir.`
		);
		setCodeInput('');
	};

	const allDone = completedCount === PUZZLES.length;
	const ctaLabel =
		completedCount === 0
			? 'Abrir el primer dossier'
			: allDone
				? 'Última pregunta'
				: 'Continuar la investigación';

	const handleCta = () => {
		if (allDone) {
			goToFinale();
			return;
		}
		onNavigateToPuzzle(nextPuzzle?.id ?? 'puzzle01-started-todo');
	};

	return (
		<div className="landing-shell">
			<header className="landing-hero">
				<p className="case-stamp">Archivo clasificado · Confidencial</p>
				<h1 className="landing-brand">El caso del aniversario</h1>
				<p className="landing-kicker">
					El expediente lleva nueve años abierto. Hoy toca cerrarlo.
				</p>
				<div className="landing-lede">
					<p>
						La ciudad duerme bajo una lluvia que no limpia nada. Yo
						no duermo. Sobre el escritorio: fotos clavadas con
						chinchetas, confesiones a medias, un bar que sigue
						oliendo a humo y perdición. Nueve años de pistas. Y una
						fecha tachada en rojo: 13 de noviembre.
					</p>
					<p>
						Si quieres cerrar el caso, detective, tendrás que bajar
						a la sala de pruebas. No hay laboratorio. Solo tus
						recuerdos… y lo que prefieres no recordar.
					</p>
					<p>
						Cuatro dossiers sellados. Cuatro noches que lo
						cambiaron todo. Resuélvelos uno a uno y el regalo llega
						a tu correo.
					</p>
					<p>
						Falla… y la entrega se cancela. Sin apelación.
					</p>
				</div>
				<p className="landing-tick">El reloj no espera, detective…</p>
				<button type="button" className="primary-button" onClick={handleCta}>
					{ctaLabel}
				</button>
			</header>

			<section className="dossier-archive" aria-label="Expedientes">
				<div className="dossier-archive-head">
					<h2>Expedientes</h2>
					{completedCount > 0 && (
						<p className="progress-summary">
							{completedCount}/{visiblePuzzles.length} claves obtenidas
						</p>
					)}
				</div>

				{fifthUnlocked && !fifthDone && (
					<p className="dossier-alert">
						Un último dossier ha aparecido sobre el escritorio. Sellado.
					</p>
				)}

				<ul className="dossier-rack">
					{visiblePuzzles.map((puzzle, index) => {
						const unlocked = isPuzzleUnlocked(puzzle.id);
						const completed = isPuzzleCompleted(puzzle.id);
						const status = completed
							? 'resuelto'
							: unlocked
								? 'abierto'
								: 'sellado';

						return (
							<li key={puzzle.id}>
								<button
									type="button"
									disabled={!unlocked}
									onClick={() => onNavigateToPuzzle(puzzle.id)}
									className={`dossier${unlocked ? '' : ' is-locked'}${completed ? ' is-solved' : ''}`}
									style={
										{
											['--dossier-i' as string]: index,
										} as CSSProperties
									}
									aria-label={`Dossier ${puzzle.number}: ${puzzle.label}. Estado: ${status}`}
								>
									<span className="dossier-tab" aria-hidden="true">
										0{puzzle.number}
									</span>
									<span className="dossier-body">
										<span className="dossier-meta">
											<span className="dossier-file-id">
												EXP-{String(puzzle.number).padStart(2, '0')}
											</span>
											<span
												className={`dossier-seal seal-${status}`}
												aria-hidden="true"
											>
												{completed ? 'Resuelto' : unlocked ? 'Abierto' : 'Sellado'}
											</span>
										</span>
										<span className="dossier-title">{puzzle.label}</span>
										<span className="dossier-teaser">{puzzle.teaser}</span>
										{completed && (
											<span className="dossier-code">
												Clave · {puzzle.code}
											</span>
										)}
									</span>
									<span className="dossier-status" aria-hidden="true">
										{completed ? (
											<span className="status-mark solved">✓</span>
										) : unlocked ? (
											<span className="status-mark open" title="Desbloqueado">
												<svg viewBox="0 0 24 24" width="28" height="28">
													<path
														fill="currentColor"
														d="M7 10V8a5 5 0 0 1 9.9-1H15a3 3 0 0 0-5.8.6V10h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1zm3 5.7V18h2v-2.3a1.5 1.5 0 1 0-2 0z"
													/>
												</svg>
											</span>
										) : (
											<span className="status-mark locked" title="Bloqueado">
												<svg viewBox="0 0 24 24" width="28" height="28">
													<path
														fill="currentColor"
														d="M17 10h-1V8A4 4 0 0 0 7 8v2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zM9 8a3 3 0 0 1 6 0v2H9V8zm3 10.2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
													/>
												</svg>
											</span>
										)}
									</span>
								</button>
							</li>
						);
					})}
				</ul>
			</section>

			<section className="continue-panel" aria-label="Continuar con clave de guardado">
				<h2>¿Perdiste el rastro?</h2>
				<p>
					Si cambiaste de dispositivo o el navegador olvidó lo que
					sabías, dame la última clave de guardado que anotaste. Yo
					me encargo de recuperar el expediente.
				</p>
				<form className="continue-form" onSubmit={handleRedeem}>
					<input
						type="text"
						value={codeInput}
						onChange={(event) => {
							setCodeInput(event.target.value.toUpperCase());
							setCodeMessage(null);
						}}
						placeholder="Ej. NARKISBALENTZIAGA"
						autoComplete="off"
						spellCheck={false}
						aria-label="Clave de guardado"
					/>
					<button type="submit" className="tool-button secondary">
						Restaurar
					</button>
				</form>
				{codeMessage && (
					<p
						className={`continue-feedback${codeError ? ' error' : ''}`}
						role="status"
					>
						{codeMessage}
					</p>
				)}
			</section>

			{completedCount > 0 && (
				<button
					type="button"
					className="text-link danger"
					onClick={() => {
						if (
							window.confirm(
								'¿Quemar el expediente local? Sin tu clave de guardado, no habrá vuelta atrás.'
							)
						) {
							resetProgress();
							setCodeMessage('Expediente local destruido.');
							setCodeError(false);
						}
					}}
				>
					Quemar expediente local
				</button>
			)}

			<footer className="landing-credit">
				<p>
					© {new Date().getFullYear()} · Propiedad de Carla Giustozzi
					Martínez
				</p>
				<p>Caso programado por Yoel Martín Fornieles</p>
			</footer>
		</div>
	);
};
