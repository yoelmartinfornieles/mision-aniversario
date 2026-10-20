import type { FurnitureCell } from './MurdokuBoard';
import type { CellKey, MurdokuSuspect, Placements } from './types';
import { parseCellKey, toCellKey } from './types';

export const placementEntries = (placements: Placements) =>
	Object.entries(placements) as [CellKey, number][];

export const findPlacement = (
	placements: Placements,
	suspectId: number
): CellKey | undefined =>
	placementEntries(placements).find(([, id]) => id === suspectId)?.[0];

/** Core Murdoku rule: one person per row and per column. */
export const hasUniqueRowsAndColumns = (placements: Placements): boolean => {
	const entries = placementEntries(placements);
	const rows = entries.map(([key]) => parseCellKey(key).row);
	const columns = entries.map(([key]) => parseCellKey(key).column);
	return (
		new Set(rows).size === rows.length &&
		new Set(columns).size === columns.length
	);
};

export const getRoomForPosition = <TRoom extends string>(
	position: CellKey,
	roomMatrix: TRoom[][]
): TRoom | undefined => {
	const { row, column } = parseCellKey(position);
	return roomMatrix[row]?.[column];
};

export const areAdjacent = (first: CellKey, second: CellKey): boolean => {
	const a = parseCellKey(first);
	const b = parseCellKey(second);
	return Math.abs(a.row - b.row) + Math.abs(a.column - b.column) === 1;
};

export const isAdjacentToRoom = <TRoom extends string>(
	position: CellKey,
	room: TRoom,
	roomMatrix: TRoom[][]
): boolean => {
	const { row, column } = parseCellKey(position);
	return [
		[row - 1, column],
		[row + 1, column],
		[row, column - 1],
		[row, column + 1],
	].some(
		([neighborRow, neighborColumn]) =>
			roomMatrix[neighborRow]?.[neighborColumn] === room
	);
};

export const isBesideFurniture = (
	position: CellKey,
	kind: string,
	furnitureCells: Partial<Record<CellKey, FurnitureCell>>,
	roomMatrix: string[][]
): boolean => {
	const { row, column } = parseCellKey(position);
	const room = getRoomForPosition(position, roomMatrix);
	return [
		toCellKey(row - 1, column),
		toCellKey(row + 1, column),
		toCellKey(row, column - 1),
		toCellKey(row, column + 1),
	].some((key) => {
		const furniture = furnitureCells[key];
		return (
			furniture?.kind === kind && getRoomForPosition(key, roomMatrix) === room
		);
	});
};

/** Victim’s area holds exactly them + one other person. */
export const victimRoomIsValid = (
	placements: Placements,
	victimId: number,
	roomMatrix: string[][]
): boolean => {
	const victimCell = findPlacement(placements, victimId);
	if (!victimCell) return false;
	const victimRoom = getRoomForPosition(victimCell, roomMatrix);
	if (!victimRoom) return false;

	const inRoom = placementEntries(placements).filter(
		([key]) => getRoomForPosition(key, roomMatrix) === victimRoom
	);
	return inRoom.length === 2 && inRoom.some(([, id]) => id === victimId);
};

export const matchesSolutionExceptVictim = (
	placements: Placements,
	victimId: number,
	suspects: Pick<MurdokuSuspect, 'id'>[],
	solution: Partial<Record<number, CellKey>>
): boolean => {
	for (const suspect of suspects) {
		if (suspect.id === victimId) continue;
		const expected = solution[suspect.id];
		const actual = findPlacement(placements, suspect.id);
		if (!actual || actual !== expected) return false;
	}
	return true;
};

export const matchesFullSolution = (
	placements: Placements,
	suspects: Pick<MurdokuSuspect, 'id'>[],
	solution: Partial<Record<number, CellKey>>
): boolean => {
	for (const suspect of suspects) {
		const expected = solution[suspect.id];
		const actual = findPlacement(placements, suspect.id);
		if (!actual || actual !== expected) return false;
	}
	return true;
};

type PreVictimErrorOptions = {
	placements: Placements;
	victimId: number;
	suspects: Pick<MurdokuSuspect, 'id'>[];
	solution: Partial<Record<number, CellKey>>;
	/** Shown when non-victim placements don’t match the solution. */
	clueMismatchMessage?: string;
};

export const getPreVictimError = ({
	placements,
	victimId,
	suspects,
	solution,
	clueMismatchMessage = 'Alguna pista de los personajes aún no cuadra',
}: PreVictimErrorOptions): string | null => {
	const withoutVictim = Object.fromEntries(
		placementEntries(placements).filter(([, id]) => id !== victimId)
	) as Placements;

	if (!hasUniqueRowsAndColumns(withoutVictim)) {
		return 'Regla Murdoku: una persona por fila y por columna';
	}

	const expectedCount = suspects.length - 1;
	if (placementEntries(withoutVictim).length < expectedCount) {
		return null;
	}

	if (
		!matchesSolutionExceptVictim(placements, victimId, suspects, solution)
	) {
		return clueMismatchMessage;
	}

	return null;
};

export const formatCountdown = (totalSeconds: number): string => {
	const safe = Math.max(0, totalSeconds);
	const minutes = Math.floor(safe / 60)
		.toString()
		.padStart(2, '0');
	const seconds = (safe % 60).toString().padStart(2, '0');
	return `${minutes}:${seconds}`;
};
