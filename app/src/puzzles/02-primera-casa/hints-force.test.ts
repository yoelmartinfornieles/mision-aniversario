import { describe, expect, it } from 'vitest';
import {
	FIXED_PLACEMENTS,
	PIECES,
	SOLUTION_CELLS,
	SOLUTION_POSES,
} from './data';
import {
	buildOccupancy,
	canPlaceCells,
	getOrientedShape,
	placeShapeAt,
} from './logic';
import { BOARD_CELLS, cellsEqualSet, HEX_DIRS, sortCells } from './hex';
import type { Axial, CellKey, PieceId, Placement } from './types';
import { toCellKey } from './types';

const allOrientations = (pieceId: PieceId): Axial[][] => {
	const base = PIECES.find((p) => p.id === pieceId)!.base;
	const shapes: Axial[][] = [];
	const seen = new Set<string>();
	for (const face of [0, 1] as const) {
		for (let rot = 0; rot < 6; rot++) {
			const shape = getOrientedShape(base, face, rot);
			const key = shape.map(([q, r]) => `${q},${r}`).join('|');
			if (!seen.has(key)) {
				seen.add(key);
				shapes.push(shape);
			}
		}
	}
	return shapes;
};

const placementsFor = (
	pieceId: PieceId,
	occ: Map<CellKey, PieceId>
): Axial[][] => {
	const results: Axial[][] = [];
	const seen = new Set<string>();
	for (const shape of allOrientations(pieceId)) {
		for (const anchor of BOARD_CELLS) {
			for (let ai = 0; ai < shape.length; ai++) {
				const cells = placeShapeAt(shape, anchor, ai);
				if (!canPlaceCells(cells, occ)) continue;
				const key = sortCells(cells)
					.map(([q, r]) => `${q},${r}`)
					.join('|');
				if (seen.has(key)) continue;
				seen.add(key);
				results.push(cells);
			}
		}
	}
	return results;
};

const touches = (cells: Axial[], set: Set<CellKey>) =>
	cells.some(([q, r]) =>
		HEX_DIRS.some(([dq, dr]) => set.has(toCellKey(q + dq, r + dr)))
	);

const edgeCount = (cells: Axial[], set: Set<CellKey>) => {
	let n = 0;
	for (const [q, r] of cells) {
		for (const [dq, dr] of HEX_DIRS) {
			if (set.has(toCellKey(q + dq, r + dr))) n++;
		}
	}
	return n;
};

const emptyNeighborsOf = (set: Set<CellKey>, occ: Map<CellKey, PieceId>) => {
	const empty = new Set<CellKey>();
	const board = new Set(BOARD_CELLS.map(([q, r]) => toCellKey(q, r)));
	for (const key of set) {
		const [q, r] = key.split(',').map(Number) as [number, number];
		for (const [dq, dr] of HEX_DIRS) {
			const nk = toCellKey(q + dq, r + dr);
			if (!board.has(nk) || set.has(nk) || occ.has(nk)) continue;
			empty.add(nk);
		}
	}
	return empty;
};
const place = (pieceId: PieceId): Placement => ({
	pieceId,
	...SOLUTION_POSES[pieceId],
	cells: SOLUTION_CELLS[pieceId],
});

describe('puzzle02 hints force a unique solution', () => {
	const terraza = new Set(
		SOLUTION_CELLS.terraza.map(([q, r]) => toCellKey(q, r))
	);
	const entrada = new Set(
		SOLUTION_CELLS.entrada.map(([q, r]) => toCellKey(q, r))
	);

	it('requires one rotation, one flip, and one flipped rotation', () => {
		expect(SOLUTION_POSES.bano).toEqual({ face: 0, rot: 1 });
		expect(SOLUTION_POSES.cocina).toEqual({ face: 1, rot: 0 });
		expect(SOLUTION_POSES.dormitorio).toEqual({ face: 1, rot: 1 });
	});

	it('baño: NW of terraza, includes western rim cell, does not touch entrada', () => {
		const occ = buildOccupancy(FIXED_PLACEMENTS);
		const hits = placementsFor('bano', occ).filter(
			(c) =>
				touches(c, terraza) &&
				c.some(([q]) => q === -3) &&
				!touches(c, entrada)
		);
		expect(hits).toHaveLength(1);
		expect(cellsEqualSet(hits[0], SOLUTION_CELLS.bano)).toBe(true);
	});

	it('cocina: seals every remaining empty neighbor of terraza', () => {
		const occ = buildOccupancy([...FIXED_PLACEMENTS, place('bano')]);
		const empty = emptyNeighborsOf(terraza, occ);
		const hits = placementsFor('cocina', occ).filter((c) => {
			const set = new Set(c.map(([q, r]) => toCellKey(q, r)));
			return [...empty].every((k) => set.has(k));
		});
		expect(hits).toHaveLength(1);
		expect(cellsEqualSet(hits[0], SOLUTION_CELLS.cocina)).toBe(true);
	});

	it('invitados: covers the north-rim gap left of the entrada tip', () => {
		const occ = buildOccupancy([
			...FIXED_PLACEMENTS,
			place('bano'),
			place('cocina'),
		]);
		const hits = placementsFor('invitados', occ).filter((c) =>
			c.some(([q, r]) => q === 0 && r === -3)
		);
		expect(hits).toHaveLength(1);
		expect(cellsEqualSet(hits[0], SOLUTION_CELLS.invitados)).toBe(true);
	});

	it('dormitorio: east rim (3 cells at q=3), max contact with entrada', () => {
		const occ = buildOccupancy([
			...FIXED_PLACEMENTS,
			place('bano'),
			place('cocina'),
			place('invitados'),
		]);
		const east = placementsFor('dormitorio', occ).filter(
			(c) =>
				touches(c, entrada) && c.filter(([q]) => q === 3).length >= 3
		);
		const max = Math.max(...east.map((c) => edgeCount(c, entrada)));
		const hits = east.filter((c) => edgeCount(c, entrada) === max);
		expect(hits).toHaveLength(1);
		expect(cellsEqualSet(hits[0], SOLUTION_CELLS.dormitorio)).toBe(true);
	});

	it('salon: max contact with entrada among remaining holes', () => {
		const occ = buildOccupancy([
			...FIXED_PLACEMENTS,
			place('bano'),
			place('cocina'),
			place('invitados'),
			place('dormitorio'),
		]);
		const all = placementsFor('salon', occ);
		const max = Math.max(...all.map((c) => edgeCount(c, entrada)));
		const hits = all.filter((c) => edgeCount(c, entrada) === max);
		expect(hits).toHaveLength(1);
		expect(cellsEqualSet(hits[0], SOLUTION_CELLS.salon)).toBe(true);
	});

	it('lavadero: only one placement fills the board', () => {
		const occ = buildOccupancy([
			...FIXED_PLACEMENTS,
			place('bano'),
			place('cocina'),
			place('invitados'),
			place('dormitorio'),
			place('salon'),
		]);
		const hits = placementsFor('lavadero', occ).filter((cells) => {
			const final = new Map(occ);
			for (const [q, r] of cells) final.set(toCellKey(q, r), 'lavadero');
			return final.size === BOARD_CELLS.length;
		});
		expect(hits).toHaveLength(1);
		expect(cellsEqualSet(hits[0], SOLUTION_CELLS.lavadero)).toBe(true);
	});
});

