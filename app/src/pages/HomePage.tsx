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
	/** El 5º dossier solo aparece tras completar los cuatro. */
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
			setCodeMessage('Código desconocido. Revisa lo que anotaste.');
			return;
		}

		const puzzle = PUZZLES.find((entry) => entry.id === restored);
		setCodeError(false);
		setCodeMessage(
			`Progreso restaurado hasta «${puzzle?.label}». Ya puedes seguir.`
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
				<h1 className="landing-brand">Misión: Aniversario</h1>
				<p className="landing-kicker">
					Una aventura acaba… pero otra empieza.
				</p>
				<div className="landing-lede">
					<p>
						La ciudad duerme. Yo no. Nueve años de pistas, miles de
						recuerdos archivados… y ahora el caso se amplía: viajamos
						los tres.
					</p>
					<p>
						Fecha del expediente: 13 de noviembre. Si quieres cerrar
						este caso, tendrás que bajar a la sala de pruebas: a tus
						propios recuerdos.
					</p>
					<p>
						Cuatro escenas. Cuatro momentos que lo cambiaron todo.
						Resuélvelas, responde la última pregunta… y el regalo
						llegará a tu correo. Falla… y la entrega se cancela. Sin
						apelación.
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
						Ha aparecido un último dossier sellado…
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

			<section className="continue-panel" aria-label="Continuar con código">
				<h2>¿Tienes un código de guardado?</h2>
				<p>
					Si cambiaste de dispositivo o borraste la memoria, introduce
					aquí el último código que anotaste.
				</p>
				<form className="continue-form" onSubmit={handleRedeem}>
					<input
						type="text"
						value={codeInput}
						onChange={(event) => {
							setCodeInput(event.target.value.toUpperCase());
							setCodeMessage(null);
						}}
						placeholder="Ej. ELBARDELBASKO"
						autoComplete="off"
						spellCheck={false}
						aria-label="Código de guardado"
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
								'¿Borrar el progreso local? Necesitarás un código para recuperarlo.'
							)
						) {
							resetProgress();
							setCodeMessage('Progreso local borrado.');
							setCodeError(false);
						}
					}}
				>
					Borrar progreso local
				</button>
			)}
		</div>
	);
};
