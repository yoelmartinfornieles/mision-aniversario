export const PUZZLE_ORDER = [
	'puzzle01-started-todo',
	'puzzle02-first-house',
	'puzzle03-kai-born',
	'puzzle04-arroa-move',
	'puzzle05-gift-plot',
] as const;

export type PuzzleId = (typeof PUZZLE_ORDER)[number];

export type PuzzleMeta = {
	id: PuzzleId;
	number: number;
	label: string;
	teaser: string;
	/** Password-style continue code (no backend). */
	code: string;
};

export const isPuzzleId = (value: string): value is PuzzleId =>
	(PUZZLE_ORDER as readonly string[]).includes(value);

export const getPuzzleIndex = (id: PuzzleId): number => PUZZLE_ORDER.indexOf(id);
