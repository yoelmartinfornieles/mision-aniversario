import {
	FIXED_PLACEMENTS,
	PIECE_BY_ID,
	SOLUTION_CELLS,
	SOLUTION_POSES,
} from './data';
import {
	BOARD_CELL_SET,
	cellsEqualSet,
	flipMirror,
	isOnBoard,
	rotate60,
} from './hex';
import type { Axial, CellKey, PieceId, Placement } from './types';
import { toCellKey } from './types';

export const normalizeShape = (cells: Axial[]): Axial[] => {
	const minQ = Math.min(...cells.map(([q]) => q));
	const minR = Math.min(...cells.map(([, r]) => r));
	return cells
		.map(([q, r]) => [q - minQ, r - minR] as Axial)
		.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};

export const getOrientedShape = (
	base: Axial[],
	face: 0 | 1,
	rot: number
): Axial[] => {
	let cells = base.map(([q, r]) => [q, r] as Axial);
	if (face === 1) cells = cells.map(flipMirror);
	const turns = ((rot % 6) + 6) % 6;
	for (let i = 0; i < turns; i++) cells = cells.map(rotate60);
	return normalizeShape(cells);
};

export const placeShapeAt = (
	shape: Axial[],
	anchor: Axial,
	anchorIndex = 0
): Axial[] => {
	const [aq, ar] = shape[anchorIndex] ?? shape[0];
	const dq = anchor[0] - aq;
	const dr = anchor[1] - ar;
	return shape.map(([q, r]) => [q + dq, r + dr] as Axial);
};

export const buildOccupancy = (
	placements: Placement[]
): Map<CellKey, PieceId> => {
	const map = new Map<CellKey, PieceId>();
	for (const placement of placements) {
		for (const [q, r] of placement.cells) {
			map.set(toCellKey(q, r), placement.pieceId);
		}
	}
	return map;
};

export const canPlaceCells = (
	cells: Axial[],
	occupancy: Map<CellKey, PieceId>,
	ignorePieceId?: PieceId
): boolean => {
	if (cells.length === 0) return false;
	for (const [q, r] of cells) {
		if (!isOnBoard(q, r)) return false;
		const key = toCellKey(q, r);
		const owner = occupancy.get(key);
		if (owner !== undefined && owner !== ignorePieceId) return false;
	}
	return true;
};

export const isBoardSolved = (placements: Placement[]): boolean => {
	const all = [...FIXED_PLACEMENTS, ...placements];
	const byId = new Map(all.map((p) => [p.pieceId, p]));
	for (const pieceId of Object.keys(SOLUTION_CELLS) as PieceId[]) {
		const placement = byId.get(pieceId);
		if (!placement) return false;
		if (!cellsEqualSet(placement.cells, SOLUTION_CELLS[pieceId])) return false;
		const solutionPose = SOLUTION_POSES[pieceId];
		if (
			placement.face !== solutionPose.face ||
			placement.rot !== solutionPose.rot
		) {
			return false;
		}
	}
	const occ = buildOccupancy(all);
	return occ.size === BOARD_CELL_SET.size;
};

export const getPieceColor = (pieceId: PieceId): string =>
	PIECE_BY_ID[pieceId].color;
