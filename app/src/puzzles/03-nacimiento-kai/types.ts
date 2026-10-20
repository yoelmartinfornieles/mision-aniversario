import type { MurdokuSuspect } from '@/puzzles/shared/murdoku';

export type { CellKey, BoardSnapshot, WindowEdge } from '@/puzzles/shared/murdoku';
export { toCellKey, parseCellKey } from '@/puzzles/shared/murdoku';

export type Room =
	| 'Lavadero'
	| 'WC'
	| 'Entrada'
	| 'Cocina'
	| 'Habitación grande'
	| 'Salón'
	| 'Habitación'
	| 'Balcón';

export type Suspect = MurdokuSuspect & {
	shortName: string;
};
