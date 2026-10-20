import { goHome } from '@/lib/navigation';
import { GameTopbar } from '@/puzzles/shared/GameTopbar';
import { HintsPanel } from '@/puzzles/shared/HintsPanel';
import { PuzzleClock } from '@/puzzles/shared/PuzzleClock';
import { PuzzleIntroCard } from '@/puzzles/shared/PuzzleIntroCard';
import { SaveCodeModal } from '@/puzzles/shared/SaveCodeModal';
import { Board } from './components/Board';
import { BACKGROUND_SRC, PUZZLE_ID } from './constants';
import { usePuzzle04 } from './usePuzzle04';

export const Puzzle04Screen = () => {
	const game = usePuzzle04();

	if (!game.started) {
		return (
			<PuzzleIntroCard
				label="Archivo clasificado · 04 · Mahjong"
				title="Mudanza a Arroa"
				kicker="Arroa Behea · Zestoa · capas que no quieren caer"
				alreadyDone={game.alreadyDone}
				saveCode={game.saveCode}
				startLabel="Abrir el tablero"
				replayLabel="Reabrir el dossier"
				onStart={() => game.setStarted(true)}
			>
				Arroa Behea. Cambio de comunidad, idioma ajeno, retos que llaman
				a la puerta sin avisar… y, debajo de todo eso, algo que el
				expediente no sabe archivar: la diversión. Como en todo buen
				caso, hay que ir quitando capas hasta que el paisaje confiesa.
				Gracias por venir. Por volver a levantar un hogar. Por vigilar
				cada día que nadie se quede fuera del plano. Te quiero. Despeja
				el tablero. Despeja el expediente.
			</PuzzleIntroCard>
		);
	}

	return (
		<div className="mahjong-shell">
			<GameTopbar
				className="mahjong-topbar"
				brand="Mudanza a Arroa"
				caseName={`${game.remaining} fichas · ${game.freeMatchCount} parejas libres`}
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

			<div className="mahjong-layout">
				<aside className="mahjong-side">
					<h2>Expediente</h2>
					<p className="mahjong-status" role="status">
						{game.status}
					</p>
					<p className="mahjong-hint">
						Toca una ficha libre, luego su pareja · despeja para revelar la
						foto
					</p>
					<div className="mahjong-controls">
						<button
							type="button"
							className="tool-button action"
							onClick={game.handleUndo}
							disabled={!game.canUndo}
						>
							↶ Deshacer
						</button>
						<button
							type="button"
							className="tool-button secondary"
							onClick={game.handleReset}
						>
							Reiniciar
						</button>
					</div>
					<div className="mahjong-legend" aria-hidden>
						<div className="mahjong-legend-item">
							<span className="mahjong-legend-swatch is-free" />
							Libre — se puede tocar
						</div>
						<div className="mahjong-legend-item">
							<span className="mahjong-legend-swatch is-blocked" />
							Bloqueada — tapa o flancos
						</div>
					</div>
					<p className="mahjong-help">
						Libre = nada encima y lado izquierdo o derecho abierto. Bajo las
						fichas espera Arroa Behea.
					</p>
				</aside>

				<section className="mahjong-board-panel">
					<Board
						tiles={game.tiles}
						freeIds={game.freeIds}
						selectedId={game.selectedId}
						matchedPulse={game.matchedPulse}
						rejectPulse={game.rejectPulse}
						backgroundSrc={BACKGROUND_SRC}
						onTileClick={game.handleTileClick}
					/>
					<p className="mahjong-board-rule">
						{game.remaining} fichas · {game.freeMatchCount} parejas libres ·
						capas apiladas
					</p>
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
					title="Paisaje confesado"
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
