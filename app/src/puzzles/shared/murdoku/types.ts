export type CellKey = `${number}-${number}`;

export type Gender = 'male' | 'female' | 'pair';

export type MurdokuSuspect = {
	id: number;
	name: string;
	/** Compact label for the board token (optional; derived from name if omitted). */
	shortName?: string;
	gender: Gender;
	clue: string;
	/** Placed last; alone in their area with one other person. */
	isVictim?: boolean;
	/** Optional cartoon portrait URL for the character card. */
	portraitSrc?: string;
};

export type BoardSnapshot = {
	placements: Partial<Record<CellKey, number>>;
	emptyMarks: Partial<Record<CellKey, true>>;
};

export type Placements = Partial<Record<CellKey, number>>;

export const toCellKey = (row: number, column: number): CellKey =>
	`${row}-${column}`;

export const parseCellKey = (key: CellKey): { row: number; column: number } => {
	const [row, column] = key.split('-').map(Number);
	return { row, column };
};
