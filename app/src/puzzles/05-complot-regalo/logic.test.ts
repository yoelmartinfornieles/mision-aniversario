import { describe, expect, it } from 'vitest';
import {
	getRoomForPosition,
	isBesideFurniture,
	parseCellKey,
	toCellKey,
} from '@/puzzles/shared/murdoku';
import { BOARD_COLUMNS, BOARD_ROWS, CARLA_ID, GEORGE_ID, YOEL_ID } from './constants';
import { furnitureCells, roomMatrix, suspects, windowCells } from './data';
import { isBoardSolved } from './logic';
import { SOLUTION } from './solution';
import type { CellKey } from './types';

const isRoomCorner = (cell: CellKey) => {
	const room = getRoomForPosition(cell, roomMatrix);
	let minRow = Infinity;
	let maxRow = -1;
	let minColumn = Infinity;
	let maxColumn = -1;
	roomMatrix.forEach((line, rowIndex) => {
		line.forEach((name, columnIndex) => {
			if (name !== room) return;
			minRow = Math.min(minRow, rowIndex);
			maxRow = Math.max(maxRow, rowIndex);
			minColumn = Math.min(minColumn, columnIndex);
			maxColumn = Math.max(maxColumn, columnIndex);
		});
	});
	const { row, column } = parseCellKey(cell);
	return (
		(row === minRow || row === maxRow) &&
		(column === minColumn || column === maxColumn)
	);
};

const betweenFarolas = (cell: CellKey) => {
	const { row, column } = parseCellKey(cell);
	const room = getRoomForPosition(cell, roomMatrix);
	const isFarola = (r: number, c: number) => {
		const key = toCellKey(r, c);
		return (
			furnitureCells[key]?.kind === 'farola' &&
			getRoomForPosition(key, roomMatrix) === room
		);
	};
	return (
		(isFarola(row, column - 1) && isFarola(row, column + 1)) ||
		(isFarola(row - 1, column) && isFarola(row + 1, column))
	);
};

const placementsFromSolution = () =>
	Object.fromEntries(
		Object.entries(SOLUTION).map(([id, cell]) => [cell, Number(id)])
	);

describe('puzzle05 solution', () => {
	it('is 8×8 with eight implicados including George and Carla last', () => {
		expect(BOARD_ROWS).toBe(8);
		expect(BOARD_COLUMNS).toBe(8);
		expect(roomMatrix).toHaveLength(8);
		expect(roomMatrix[0]).toHaveLength(8);
		expect(suspects).toHaveLength(8);
		expect(suspects.some((s) => s.id === GEORGE_ID && s.name === 'George')).toBe(
			true
		);
		expect(suspects.at(-1)?.id).toBe(CARLA_ID);
		expect(suspects.at(-1)?.isVictim).toBe(true);
	});

	it('uses unique rows and columns', () => {
		const rows = Object.values(SOLUTION).map((cell) => parseCellKey(cell).row);
		const cols = Object.values(SOLUTION).map(
			(cell) => parseCellKey(cell).column
		);
		expect(new Set(rows).size).toBe(8);
		expect(new Set(cols).size).toBe(8);
	});

	it('keeps Yoel+Carla alone in Castillo and George alone in Selva', () => {
		const byRoom = new Map<string, number[]>();
		for (const [id, cell] of Object.entries(SOLUTION)) {
			const room = getRoomForPosition(cell, roomMatrix)!;
			const list = byRoom.get(room) ?? [];
			list.push(Number(id));
			byRoom.set(room, list);
		}
		expect(byRoom.get('Castillo')?.sort()).toEqual([YOEL_ID, CARLA_ID].sort());
		expect(byRoom.get('Selva')).toEqual([GEORGE_ID]);
	});

	it('satisfies furniture adjacency from the clues', () => {
		expect(furnitureCells[SOLUTION[1]]?.kind).toBe('carro de chuches');
		expect(
			isBesideFurniture(
				SOLUTION[YOEL_ID],
				'castillo',
				furnitureCells,
				roomMatrix
			)
		).toBe(true);
		expect(furnitureCells[SOLUTION[YOEL_ID]]?.kind).toBe('carro de chuches');
		expect(isRoomCorner(SOLUTION[YOEL_ID])).toBe(false);
		expect(windowCells[SOLUTION[3]]).toBeDefined();
		expect(betweenFarolas(SOLUTION[3])).toBe(true);
		expect(windowCells[SOLUTION[4]]).toBeDefined();
		expect(furnitureCells[SOLUTION[5]]?.kind).toBe('carrusel');
		expect(windowCells[SOLUTION[6]]).toBeDefined();
		expect(
			isBesideFurniture(SOLUTION[6], 'barco', furnitureCells, roomMatrix)
		).toBe(true);
		expect(
			isBesideFurniture(
				SOLUTION[GEORGE_ID],
				'montaña rusa',
				furnitureCells,
				roomMatrix
			)
		).toBe(true);
	});

	it('is accepted by isBoardSolved', () => {
		expect(isBoardSolved(placementsFromSolution())).toBe(true);
	});
});
