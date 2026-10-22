import { goHome } from '@/lib/navigation';
import { GameTopbar } from '@/puzzles/shared/GameTopbar';
import { HintsPanel } from '@/puzzles/shared/HintsPanel';
import { PuzzleClock } from '@/puzzles/shared/PuzzleClock';
import { PuzzleIntroCard } from '@/puzzles/shared/PuzzleIntroCard';
import { SaveCodeModal } from '@/puzzles/shared/SaveCodeModal';
import { HexBoard } from './components/HexBoard';
import { PieceTray } from './components/PieceTray';
import { PUZZLE_ID } from './constants';
import { usePuzzle02 } from './usePuzzle02';

export const Puzzle02Screen = () => {
	const game = usePuzzle02();

	if (!game.started) {
		return (
			<PuzzleIntroCard
				label="Archivo clasificado · 02 · IQ Hexagon"
				title="La primera casa"
				kicker="Carrer de Mallorca · demolida y reconstruida"
				alreadyDone={game.alreadyDone}
				saveCode={game.saveCode}
				startLabel="Abrir el plano"
				replayLabel="Reconstruir de nuevo"
				onStart={() => game.setStarted(true)}
			>
				Carrer de Mallorca, junto al Asador El Bierzo. La primera vez
				que vi aquella casa, el estómago se me encogió: la cocina era
				un auténtico agujero, el baño parecía sacado de un manicomio,
				esos techos falsos ahogaban cualquier ilusión. Tú viste el
				mismo crimen… pero no te arrugaste y decidiste demolerlo.
				Tiraste media casa. Levantaste un hogar. Después vinieron las
				risas, las noches, los gritos de los vecinos, un nuevo Presi,
				la pandemia, los cambios de trabajo: muescas en el cinturón de
				dos personas que nunca supieron rendirse. Del plano hexagonal
				solo quedan en pie la Habitación de la entrada y la Terraza.
				Reconstruye las otras seis. El archivo no admite otro encaje.
			</PuzzleIntroCard>
		);
	}

	return (
		<div className="hex-shell">
			<GameTopbar
				className="hex-topbar"
				brand="La primera casa"
				caseName="Mallorca · hexágono"
				timer={
					<PuzzleClock
						running={game.started}
						initialSeconds={game.clockInitial}
						session={game.clockSession}
						secondsRef={game.clockRef}
					/>
				}
				onHints={() => game.setShowHints(true)}
			/>

			<div className="hex-layout">
				<aside className="hex-side">
					<h2>Estancias</h2>
					<p className="hex-status" role="status">
						{game.status}
					</p>
					<p className="hex-hint">
						Elige una pieza · Rotar / Voltear · tócala en el plano
					</p>
					<div className="hex-controls">
						<button
							type="button"
							className="tool-button action"
							onClick={game.rotateSelected}
							title="Rotar 60° (R)"
						>
							<svg className="tool-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
								<path d="M20 11a8 8 0 1 0-2 6" />
								<path d="M20 4v7h-7" />
							</svg>
							<span>Rotar</span>
						</button>
						<button
							type="button"
							className="tool-button action"
							onClick={game.flipSelected}
							title="Voltear cara (F)"
						>
							<svg className="tool-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
								<path d="M12 3v18M8 6 3 12l5 6V6ZM16 6l5 6-5 6V6Z" />
							</svg>
							<span>Voltear</span>
						</button>
						<button
							type="button"
							className="tool-button small"
							onClick={game.handleUndo}
						>
							<svg className="tool-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
								<path d="M4 8h9a6 6 0 0 1 0 12" />
								<path d="m9 3-5 5 5 5" />
							</svg>
							<span>Deshacer</span>
						</button>
						<button
							type="button"
							className="tool-button secondary"
							onClick={game.handleClear}
						>
							<svg className="tool-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
								<path d="M4.5 14.5 14 5l4.5 4.5-9.5 9.5H4.5v-4.5Z" />
								<path d="M12.2 6.8 17.2 11.8M4.5 19.5h15" />
							</svg>
							<span>Limpiar</span>
						</button>
					</div>
					<PieceTray
						trayPieceIds={game.trayPieceIds}
						selectedId={game.selectedId}
						poses={game.poses}
						onSelect={game.selectPiece}
					/>
					<p className="hex-help">
						Los puntos marcan piezas fijas. Usa Rotar / Voltear (o{' '}
						<kbd>R</kbd> / <kbd>F</kbd> en teclado).
					</p>
				</aside>

				<section className="hex-board-panel">
					<div className="hex-board-frame">
						<HexBoard
							placements={game.placements}
							ghost={game.ghostCells}
							onHoverCell={game.setHoverCell}
							onCellActivate={game.handleCellClick}
						/>
					</div>
					<p className="hex-board-rule">
						1 plano · 2 caras · rotación libre · un único encaje
					</p>
					<button
						type="button"
						className={`tool-button secondary hex-submit${game.trayPieceIds.length === 0 ? ' is-ready' : ''}`}
						onClick={game.handleSubmit}
					>
						¿Ya es un hogar?
					</button>
				</section>
			</div>

			<HintsPanel
				hints={game.HINTS}
				open={game.showHints}
				onClose={() => game.setShowHints(false)}
				persistKey={PUZZLE_ID}
			/>

			{game.showSaveCode && (
				<SaveCodeModal
					code={game.saveCode}
					title="Plano reconstruido"
					onContinueAtHome={() => {
						game.setShowSaveCode(false);
						goHome();
					}}
					onDismiss={() => game.setShowSaveCode(false)}
				/>
			)}
		</div>
	);
};
