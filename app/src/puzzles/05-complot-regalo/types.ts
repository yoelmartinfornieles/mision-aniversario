import type { MurdokuSuspect } from '@/puzzles/shared/murdoku';

export type { CellKey, BoardSnapshot, WindowEdge } from '@/puzzles/shared/murdoku';
export { toCellKey, parseCellKey } from '@/puzzles/shared/murdoku';

export type Room =
	| 'Avenida'
	| 'Selva'
	| 'Castillo'
	| 'Cuentos'
	| 'Plaza'
	| 'Espacio'
	| 'Muelle';

export type Suspect = MurdokuSuspect & {
	shortName: string;
};
