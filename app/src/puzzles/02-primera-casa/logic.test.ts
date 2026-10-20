import { describe, expect, it } from 'vitest';
import {
	FIXED_PLACEMENTS,
	PIECE_BY_ID,
	SOLUTION_CELLS,
	SOLUTION_POSES,
} from './data';
import {
	buildOccupancy,
	canPlaceCells,
	getOrientedShape,
	isBoardSolved,
	placeShapeAt,
} from './logic';
import { cellsEqualSet } from './hex';
import type { Axial, Placement } from './types';

const freeSolutionPlacements = (): Placement[] =>
	(
		Object.entries(SOLUTION_CELLS) as [
			Placement['pieceId'],
			Axial[],
		][]
	)
		.filter(
			([pieceId]) => !FIXED_PLACEMENTS.some((p) => p.pieceId === pieceId)
		)
		.map(([pieceId, cells]) => ({
			pieceId,
			...SOLUTION_POSES[pieceId],
			cells,
		}));

describe('placeShapeAt', () => {
	it('translates the oriented shape so the anchor index lands on the cell', () => {
		const shape: Axial[] = [
			[0, 0],
			[1, 0],
			[0, 1],
		];
		const placed = placeShapeAt(shape, [2, 3], 0);
		expect(placed).toEqual([
			[2, 3],
			[3, 3],
			[2, 4],
		]);
	});
});

describe('canPlaceCells', () => {
	it('rejects cells outside the board or already occupied', () => {
		const occupancy = buildOccupancy(FIXED_PLACEMENTS);
		expect(canPlaceCells([[10, 10]], occupancy)).toBe(false);

		const fixedCell = FIXED_PLACEMENTS[0].cells[0];
		expect(canPlaceCells([fixedCell], occupancy)).toBe(false);
	});

	it('allows placement on empty on-board cells', () => {
		const occupancy = buildOccupancy(FIXED_PLACEMENTS);
		const free = freeSolutionPlacements()[0].cells;
		expect(canPlaceCells(free, occupancy)).toBe(true);
	});
});

describe('isBoardSolved', () => {
	it('returns false for an empty free-piece set', () => {
		expect(isBoardSolved([])).toBe(false);
	});

	it('returns true when free pieces match the unique solution', () => {
		expect(isBoardSolved(freeSolutionPlacements())).toBe(true);
	});

	it('orients each room into its target cells at the hinted anchor', () => {
		for (const [pieceId, targetCells] of Object.entries(SOLUTION_CELLS) as [
			Placement['pieceId'],
			Axial[],
		][]) {
			const shape = getOrientedShape(
				PIECE_BY_ID[pieceId].base,
				SOLUTION_POSES[pieceId].face,
				SOLUTION_POSES[pieceId].rot
			);
			const anchor = [...targetCells].sort(
				([aq, ar], [bq, br]) => aq - bq || ar - br
			)[0];
			expect(
				cellsEqualSet(placeShapeAt(shape, anchor), targetCells)
			).toBe(true);
		}
	});

	it('returns false when a free piece is on the wrong cells', () => {
		const placements = freeSolutionPlacements();
		const first = placements[0];
		placements[0] = {
			...first,
			cells: first.cells.map(([q, r]) => [q + 1, r] as Axial),
		};
		expect(isBoardSolved(placements)).toBe(false);
	});

	it('returns false when a free piece has the wrong orientation', () => {
		const placements = freeSolutionPlacements();
		const bathroom = placements.find((p) => p.pieceId === 'bano')!;
		bathroom.rot = 0;
		expect(isBoardSolved(placements)).toBe(false);
	});
});
