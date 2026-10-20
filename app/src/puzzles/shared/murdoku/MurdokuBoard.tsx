import { FurnitureIcon } from './furnitureIcons';
import { Portrait } from './Portrait';

export type FurnitureRole = 'blocking' | 'occupiable';

export type FurnitureCell = {
	kind: string;
	role: FurnitureRole;
};

export type BoardSuspect = {
	id: number;
	name: string;
	shortName?: string;
	gender: string;
	letter?: string;
	isVictim?: boolean;
	portraitSrc?: string;
};

export type WindowEdge = 'top' | 'bottom' | 'left' | 'right';

type MurdokuBoardProps = {
	rows: number;
	columns: number;
	roomMatrix: string[][];
	furnitureCells: Partial<Record<string, FurnitureCell>>;
	windowCells?: Partial<Record<string, WindowEdge>>;
	placements: Partial<Record<string, number>>;
	emptyMarks: Partial<Record<string, true>>;
	suspects: BoardSuspect[];
	getRoomClass: (room: string) => string;
	highlightedKeys?: Set<string>;
	lockedRows?: Set<number>;
	lockedColumns?: Set<number>;
	gridClassName?: string;
	disabled?: boolean;
	onCellClick: (row: number, column: number) => void;
};

const cellKey = (row: number, column: number) => `${row}-${column}`;

export const MurdokuBoard = ({
	rows,
	columns,
	roomMatrix,
	furnitureCells,
	windowCells = {},
	placements,
	emptyMarks,
	suspects,
	getRoomClass,
	highlightedKeys,
	lockedRows,
	lockedColumns,
	gridClassName = 'board-grid',
	disabled = false,
	onCellClick,
}: MurdokuBoardProps) => (
	<div
		className={gridClassName}
		aria-label={`Tablero del caso, ${rows} filas y ${columns} columnas`}
		style={{
			gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
			gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
		}}
	>
		{roomMatrix.map((row, rowIndex) =>
			row.map((room, columnIndex) => {
				const key = cellKey(rowIndex, columnIndex);
				const furniture = furnitureCells[key];
				const isBlocking = furniture?.role === 'blocking';
				const isOccupiable = furniture?.role === 'occupiable';
				const windowEdge = windowCells[key];
				const isMarkedEmpty = emptyMarks[key] === true;
				const isHighlighted = highlightedKeys?.has(key) ?? false;
				const isLineLocked =
					(lockedRows?.has(rowIndex) || lockedColumns?.has(columnIndex)) ??
					false;

				const boundaryClasses = [
					rowIndex === 0 || roomMatrix[rowIndex - 1]?.[columnIndex] !== room
						? 'boundary-top'
						: '',
					columnIndex === 0 || roomMatrix[rowIndex][columnIndex - 1] !== room
						? 'boundary-left'
						: '',
					rowIndex === rows - 1 ||
					roomMatrix[rowIndex + 1]?.[columnIndex] !== room
						? 'boundary-bottom'
						: '',
					columnIndex === columns - 1 ||
					roomMatrix[rowIndex][columnIndex + 1] !== room
						? 'boundary-right'
						: '',
				]
					.filter(Boolean)
					.join(' ');

				const occupantId = placements[key];
				const occupant = suspects.find((suspect) => suspect.id === occupantId);
				const token = occupant
					? (occupant.letter ??
						occupant.shortName ??
						occupant.name.slice(0, 1))
					: null;

				return (
					<button
						key={key}
						type="button"
						className={[
							'cell',
							getRoomClass(room),
							boundaryClasses,
							isBlocking ? 'blocked' : '',
							isOccupiable ? 'occupiable' : '',
							windowEdge ? `window-${windowEdge}` : '',
							isMarkedEmpty ? 'marked-empty' : '',
							isHighlighted ? 'is-highlighted' : '',
							isLineLocked && !occupant && !isBlocking ? 'line-locked' : '',
						]
							.filter(Boolean)
							.join(' ')}
						data-obstacle={furniture?.kind}
						onClick={() => onCellClick(rowIndex, columnIndex)}
						aria-label={`${room}${furniture ? `, ${furniture.kind}` : ''} - ${occupant?.name ?? 'vacía'}${isBlocking ? ', bloqueada' : ''}${isOccupiable ? ', se puede ocupar' : ''}${isMarkedEmpty ? ', marcada como vacía' : ''}`}
						disabled={disabled || isBlocking}
					>
						{windowEdge && <span className="cell-window" aria-hidden="true" />}
						{furniture && (
							<span
								className={`cell-furniture${occupant ? ' has-occupant' : ''}`}
								aria-hidden="true"
							>
								<FurnitureIcon kind={furniture.kind} />
							</span>
						)}
						{isMarkedEmpty && (
							<span className="empty-cell-mark" aria-hidden="true">
								X
							</span>
						)}
						{occupant && (
							<span
								className={`cell-occupant${occupant.portraitSrc ? ' cell-occupant--photo' : ''}`}
								data-gender={occupant.gender}
							>
								{occupant.portraitSrc ? (
									<Portrait
										gender={occupant.gender}
										isVictim={occupant.isVictim}
										size="board"
										src={occupant.portraitSrc}
										alt={occupant.name}
									/>
								) : (
									token
								)}
							</span>
						)}
					</button>
				);
			})
		)}
	</div>
);
