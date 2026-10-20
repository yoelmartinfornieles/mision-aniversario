export const PUZZLE_ID = 'puzzle04-arroa-move' as const;

/** Pixel size of one tile on the board. */
export const TILE_WIDTH = 56;
export const TILE_HEIGHT = 72;
export const TILE_DEPTH = 5;

/** Seed for the solvable deal — fixed so the layout is always the same. */
export const DEAL_SEED = 0x4a52_4f41; // "AROA"

export const BACKGROUND_SRC = `${import.meta.env.BASE_URL}puzzles/04-arroa-background.jpg`;
