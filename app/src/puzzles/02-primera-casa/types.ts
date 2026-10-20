export type Axial = readonly [q: number, r: number];

export type PieceId =
	| 'bano'
	| 'salon'
	| 'invitados'
	| 'dormitorio'
	| 'cocina'
	| 'terraza'
	| 'entrada'
	| 'lavadero';

export type PieceDef = {
	id: PieceId;
	label: string;
	hint: string;
	color: string;
	/** Normalized base shape (face 0, rot 0). */
	base: Axial[];
	locked: boolean;
};

export type Placement = {
	pieceId: PieceId;
	/** 0 = A side, 1 = B side (mirror). */
	face: 0 | 1;
	/** 60° steps, 0–5. */
	rot: number;
	/** Absolute board cells occupied. */
	cells: Axial[];
};

export type CellKey = `${number},${number}`;

export const toCellKey = (q: number, r: number): CellKey => `${q},${r}`;

export const parseCellKey = (key: CellKey): Axial => {
	const [q, r] = key.split(',').map(Number);
	return [q, r];
};
