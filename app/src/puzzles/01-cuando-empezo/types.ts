import type { MurdokuSuspect } from '@/puzzles/shared/murdoku';

export type { CellKey, BoardSnapshot, WindowEdge } from '@/puzzles/shared/murdoku';
export { toCellKey, parseCellKey } from '@/puzzles/shared/murdoku';

export type Room =
	| 'Cocina'
	| 'Sótano Secreto'
	| 'Bar'
	| 'Comedor'
	| 'Almacén';

export type Suspect = MurdokuSuspect;
