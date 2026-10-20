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
				kicker="Arroa Behea · Zestoa · un hogar entre las pistas"
				alreadyDone={game.alreadyDone}
				saveCode={game.saveCode}
				startLabel="Abrir el tablero"
				replayLabel="Reabrir el dossier"
				onStart={() => game.setStarted(true)}
			>
				Otra dirección en el expediente. Una fecha adelantada, lluvia, mar y monte. 
				Un idioma que aún no sabíamos descifrar y nuevos nombres al otro lado de la puerta.
				No faltaron los retos. Tampoco las risas. Revisé las pruebas:
				habíamos vuelto a hacer hogar. Tú te encargabas de que nadie
				se quedara fuera. Yo seguía sin encontrar cómo darte las gracias.
				Que conste por escrito: te quiero.
				<br />
				<br />
				La siguiente pista está bajo las fichas. Retira las parejas.
				Cuando no quede nada que la tape, el paisaje hablará por sí solo.
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
						Toca una ficha libre, luego su pareja · despeja para revelar la foto
					</p>
					<div className="mahjong-controls">
						<button
							type="button"
							className="tool-button secondary"
							onClick={() => void game.handleRescue()}
							disabled={
								game.rescueBusy ||
								game.matchedPulse.length > 0 ||
								game.remaining === 0
							}
						>
							{game.rescueBusy ? 'Analizando…' : 'Ayuda de rescate'}
						</button>
						<button
							type="button"
							className="tool-button action"
							onClick={game.handleUndo}
							disabled={!game.canUndo || game.matchedPulse.length > 0}
						>
							↶ Deshacer
						</button>
						<button
							type="button"
							className="tool-button secondary"
							onClick={game.handleReset}
							disabled={game.matchedPulse.length > 0}
						>
							Reiniciar
						</button>
					</div>
					<div className="mahjong-legend" aria-hidden>
						<div className="mahjong-legend-item">
							<span className="mahjong-legend-swatch is-free" />
							Libre: se puede tocar
						</div>
						<div className="mahjong-legend-item">
							<span className="mahjong-legend-swatch is-blocked" />
							Bloqueada: tapa o flancos
						</div>
					</div>
				</aside>

				<section className="mahjong-board-panel">
					<Board
						tiles={game.tiles}
						freeIds={game.freeIds}
						selectedId={game.selectedId}
						matchedPulse={game.matchedPulse}
						rejectPulse={game.rejectPulse}
						rescueIds={game.rescueIds}
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
