import { useId } from 'react';
import { goHome } from '@/lib/navigation';
import { GameTopbar } from '@/puzzles/shared/GameTopbar';
import { HintsPanel } from '@/puzzles/shared/HintsPanel';
import { PuzzleClock } from '@/puzzles/shared/PuzzleClock';
import { SaveCodeModal } from '@/puzzles/shared/SaveCodeModal';
import { useModalA11y } from '@/puzzles/shared/useModalA11y';
import { MurdokuBoard } from './MurdokuBoard';
import { SuspectPanel } from './SuspectPanel';
import type { useMurdokuPuzzle } from './useMurdokuPuzzle';

export type MurdokuGame = ReturnType<typeof useMurdokuPuzzle>;

type MurdokuScreenProps = {
	game: MurdokuGame;
	brand: string;
	caseName: string;
	boardRule: string;
	furnitureObjects: string[];
	gridClassName?: string;
	shellClassName?: string;
	legendAriaLabel?: string;
	suspectTitle?: string;
	suspectHint?: string;
	/** Countdown urgency styles + timeout modal (puzzle 05). */
	countdown?: boolean;
	saveCodeTitle?: string;
	saveCodeSubtitle?: string;
	saveCodeContinueLabel?: string;
	onSaveCodeContinue?: () => void;
};

type TimeoutModalProps = {
	onExtend: () => void;
	onReset: () => void;
};

/** Timeout dialog: no Escape dismiss (must pick extend / reset / home). Focus restores on unmount. */
const TimeoutModal = ({ onExtend, onReset }: TimeoutModalProps) => {
	const titleId = useId();
	const { containerRef } = useModalA11y();

	return (
		<div className="modal-backdrop">
			<div
				ref={containerRef}
				className="instructions-modal save-code-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
			>
				<p className="label">El reloj se detuvo</p>
				<h2 id={titleId}>El reloj del castillo no espera</h2>
				<p>
					Se acabaron los minutos. La pregunta sigue en el aire. Prórroga… o
					reinicia el reloj y sigue.
				</p>
				<button type="button" className="primary-button" onClick={onExtend}>
					+5 minutos
				</button>
				<button
					type="button"
					className="tool-button secondary"
					onClick={onReset}
					style={{ width: '100%', marginTop: 8 }}
				>
					Reiniciar reloj (22:00)
				</button>
				<button type="button" className="text-link" onClick={goHome}>
					Volver al archivo
				</button>
			</div>
		</div>
	);
};

export const MurdokuScreen = ({
	game,
	brand,
	caseName,
	boardRule,
	furnitureObjects,
	gridClassName = 'board-grid',
	shellClassName = 'murdoku-shell',
	legendAriaLabel = 'Habitaciones',
	suspectTitle,
	suspectHint,
	countdown = false,
	saveCodeTitle,
	saveCodeSubtitle,
	saveCodeContinueLabel,
	onSaveCodeContinue,
}: MurdokuScreenProps) => {
	return (
		<div className={shellClassName}>
			<GameTopbar
				className="murdoku-topbar"
				brand={brand}
				caseName={caseName}
				timer={
					<PuzzleClock
						mode={countdown ? 'countdown' : 'elapsed'}
						running={game.clockRunning}
						initialSeconds={game.clockInitial}
						session={game.clockSession}
						secondsRef={game.clockRef}
						onExpire={game.handleClockExpire}
						expired={game.timedOut}
					/>
				}
				onHints={() => game.setShowHints(true)}
				hintsDisabled={game.boardLocked}
			/>

			<div className="game-layout">
				<SuspectPanel
					suspects={game.suspects}
					selectedSuspectId={game.selectedSuspectId}
					placedSuspectIds={game.placedSuspectIds}
					victimId={game.victimId}
					otherSuspectsPlacedCount={game.otherSuspectsPlacedCount}
					preVictimError={game.preVictimError}
					status={game.status}
					rooms={game.ROOM_ORDER}
					objects={furnitureObjects}
					title={suspectTitle}
					hint={suspectHint}
					disabled={game.boardLocked}
					activeHighlight={game.activeHighlight}
					onHighlight={game.setActiveHighlight}
					onSelect={game.selectSuspect}
				/>

				<aside className="right-tools">
					<button
						type="button"
						className="tool-button small"
						onClick={game.handleClearBoard}
						disabled={game.boardLocked}
					>
						<span className="tool-icon" aria-hidden="true">
							<svg viewBox="0 0 24 24" className="tool-svg" focusable="false">
								<path d="M4.5 14.5 14 5l4.5 4.5-9.5 9.5H4.5v-4.5Z" />
								<path d="M12.2 6.8 17.2 11.8" />
								<path d="M4.5 19.5h15" />
							</svg>
						</span>
						<span>Limpiar</span>
					</button>
					<button
						type="button"
						className="tool-button small action"
						onClick={game.handleUndo}
						disabled={game.boardLocked}
					>
						<span className="tool-icon" aria-hidden="true">
							↶
						</span>
						<span>Deshacer</span>
					</button>
				</aside>

				<section className="board-panel">
					<MurdokuBoard
						rows={game.BOARD_ROWS}
						columns={game.BOARD_COLUMNS}
						roomMatrix={game.roomMatrix}
						furnitureCells={game.furnitureCells}
						windowCells={game.windowCells}
						placements={game.placements}
						emptyMarks={game.emptyMarks}
						suspects={game.suspects}
						getRoomClass={game.getRoomClass}
						highlightedKeys={game.highlightedKeys}
						lockedRows={game.lockedRows}
						lockedColumns={game.lockedColumns}
						gridClassName={gridClassName}
						disabled={game.boardLocked}
						onCellClick={game.handleCellClick}
					/>
					<div className="room-legend" aria-label={legendAriaLabel}>
						{game.ROOM_ORDER.map((room) => (
							<span key={room}>
								<i className={game.getRoomClass(room)} aria-hidden="true" />
								{room}
							</span>
						))}
					</div>
					<p className="board-rule">{boardRule}</p>
				</section>

				<aside className="bottom-tools">
					<button
						type="button"
						className="tool-button secondary mark-toggle"
						aria-pressed={game.markMode}
						title="Tacha casillas imposibles"
						disabled={game.isVictimPlaced || game.boardLocked}
						onClick={game.toggleMarkMode}
					>
						<span className="mark-toggle-icon" aria-hidden="true">
							✎
						</span>
						<span>Tachar</span>
					</button>
					<button
						type="button"
						className={`tool-button secondary submit-button${game.allPlaced ? ' is-ready' : ''}`}
						onClick={game.handleSubmit}
						disabled={(countdown && game.timedOut) || !game.allPlaced}
						title={
							game.allPlaced
								? 'Comprobar solución'
								: 'Coloca a todos primero'
						}
					>
						{game.allPlaced ? 'Enviar' : 'Enviar (coloca a todos)'}
					</button>
				</aside>
			</div>

			<HintsPanel
				hints={game.HINTS}
				open={game.showHints}
				onClose={() => game.setShowHints(false)}
				persistKey={game.puzzleId}
			/>

			{countdown && game.timedOut && (
				<TimeoutModal
					onExtend={game.extendTimer}
					onReset={game.resetTimer}
				/>
			)}

			{game.showSaveCode && (
				<SaveCodeModal
					code={game.saveCode}
					title={saveCodeTitle}
					subtitle={saveCodeSubtitle}
					continueLabel={saveCodeContinueLabel}
					onContinueAtHome={() => {
						game.setShowSaveCode(false);
						if (onSaveCodeContinue) {
							onSaveCodeContinue();
							return;
						}
						goHome();
					}}
					onDismiss={() => game.setShowSaveCode(false)}
				/>
			)}
		</div>
	);
};
