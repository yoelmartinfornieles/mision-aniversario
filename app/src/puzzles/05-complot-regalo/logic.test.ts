import { describe, expect, it } from 'vitest';
import {
	getRoomForPosition,
	isBesideFurniture,
	parseCellKey,
} from '@/puzzles/shared/murdoku';
import { BOARD_COLUMNS, BOARD_ROWS, CARLA_ID, GEORGE_ID, KAI_ID } from './constants';
import { furnitureCells, roomMatrix, suspects } from './data';
import { isBoardSolved } from './logic';
import { SOLUTION } from './solution';

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

	it('keeps Kai+Carla alone in Castillo and George alone in Selva', () => {
		const byRoom = new Map<string, number[]>();
		for (const [id, cell] of Object.entries(SOLUTION)) {
			const room = getRoomForPosition(cell, roomMatrix)!;
			const list = byRoom.get(room) ?? [];
			list.push(Number(id));
			byRoom.set(room, list);
		}
		expect(byRoom.get('Castillo')?.sort()).toEqual([KAI_ID, CARLA_ID].sort());
		expect(byRoom.get('Selva')).toEqual([GEORGE_ID]);
	});

	it('satisfies furniture adjacency from the clues', () => {
		expect(
			isBesideFurniture(SOLUTION[1], 'farola', furnitureCells, roomMatrix)
		).toBe(true);
		expect(
			isBesideFurniture(SOLUTION[KAI_ID], 'seto', furnitureCells, roomMatrix)
		).toBe(true);
		expect(
			isBesideFurniture(SOLUTION[3], 'cohete', furnitureCells, roomMatrix)
		).toBe(true);
		expect(
			isBesideFurniture(SOLUTION[4], 'carro', furnitureCells, roomMatrix)
		).toBe(true);
		expect(furnitureCells[SOLUTION[5]]?.kind).toBe('banqueta');
		expect(
			isBesideFurniture(SOLUTION[6], 'barco', furnitureCells, roomMatrix)
		).toBe(true);
		expect(
			isBesideFurniture(
				SOLUTION[GEORGE_ID],
				'tronco',
				furnitureCells,
				roomMatrix
			)
		).toBe(true);
	});

	it('is accepted by isBoardSolved', () => {
		expect(isBoardSolved(placementsFromSolution())).toBe(true);
	});
});
