import { BOARD_RADIUS, HEX_SIZE } from './constants';
import type { Axial, CellKey } from './types';
import { toCellKey } from './types';

export { HEX_SIZE, BOARD_RADIUS };
/** Flat-top axial neighbors. */
export const HEX_DIRS: Axial[] = [
	[1, 0],
	[1, -1],
	[0, -1],
	[-1, 0],
	[-1, 1],
	[0, 1],
];

export const rotate60 = ([q, r]: Axial): Axial => [-r, q + r];

export const flipMirror = ([q, r]: Axial): Axial => [q, -q - r];

export const buildBoardCells = (radius = BOARD_RADIUS): Axial[] => {
	const cells: Axial[] = [];
	for (let q = -radius; q <= radius; q++) {
		for (
			let r = Math.max(-radius, -q - radius);
			r <= Math.min(radius, -q + radius);
			r++
		) {
			cells.push([q, r]);
		}
	}
	return cells;
};

export const BOARD_CELLS = buildBoardCells();

export const BOARD_CELL_SET = new Set(
	BOARD_CELLS.map(([q, r]) => toCellKey(q, r))
);

export const isOnBoard = (q: number, r: number): boolean =>
	BOARD_CELL_SET.has(toCellKey(q, r));

/** Pixel center for flat-top hex. */
export const axialToPixel = (
	q: number,
	r: number,
	size = HEX_SIZE
): { x: number; y: number } => {
	const x = size * ((3 / 2) * q);
	const y = size * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r);
	return { x, y };
};

export const pixelToAxial = (
	x: number,
	y: number,
	size = HEX_SIZE
): Axial => {
	const q = ((2 / 3) * x) / size;
	const r = ((-1 / 3) * x + (Math.sqrt(3) / 3) * y) / size;
	return hexRound(q, r);
};

const hexRound = (fq: number, fr: number): Axial => {
	const fx = fq;
	const fz = fr;
	const fy = -fx - fz;
	let rq = Math.round(fx);
	let ry = Math.round(fy);
	let rz = Math.round(fz);
	const dq = Math.abs(rq - fx);
	const dy = Math.abs(ry - fy);
	const dz = Math.abs(rz - fz);
	if (dq > dy && dq > dz) rq = -ry - rz;
	else if (dy > dz) ry = -rq - rz;
	else rz = -rq - ry;
	return [rq, rz];
};

/** Flat-top hexagon path around origin. */
export const hexPolygonPoints = (size = HEX_SIZE): string => {
	const points: string[] = [];
	for (let i = 0; i < 6; i++) {
		const angle = (Math.PI / 180) * (60 * i);
		const x = size * Math.cos(angle);
		const y = size * Math.sin(angle);
		points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
	}
	return points.join(' ');
};

export const boardBounds = (padding = HEX_SIZE * 1.2) => {
	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;
	for (const [q, r] of BOARD_CELLS) {
		const { x, y } = axialToPixel(q, r);
		minX = Math.min(minX, x);
		maxX = Math.max(maxX, x);
		minY = Math.min(minY, y);
		maxY = Math.max(maxY, y);
	}
	return {
		minX: minX - padding,
		minY: minY - padding,
		width: maxX - minX + padding * 2,
		height: maxY - minY + padding * 2,
	};
};

export const cellsEqualSet = (a: Axial[], b: Axial[]): boolean => {
	if (a.length !== b.length) return false;
	const set = new Set(a.map(([q, r]) => toCellKey(q, r)));
	return b.every(([q, r]) => set.has(toCellKey(q, r)));
};

export const sortCells = (cells: Axial[]): Axial[] =>
	[...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

export type Occupancy = Map<CellKey, string>;
