import type { FurnitureCell } from '@/puzzles/shared/murdoku';
import { BOARD_COLUMNS, BOARD_ROWS, CARLA_ID } from './constants';
import type { CellKey, Room, Suspect, WindowEdge } from './types';

const portrait = (name: string) =>
	`${import.meta.env.BASE_URL}puzzles/01-portraits/${name}.jpg`;

/**
 * Clues on each card — Murdoku style: 1–2 short facts (like official cases).
 */
export const suspects: Suspect[] = [
	{
		id: 1,
		name: 'Emilio y Rafa',
		shortName: 'E+R',
		gender: 'pair',
		clue: 'Estaban en el Bar, junto a la barra. Eran los únicos hombres de esa zona.',
		portraitSrc: portrait('emilio-rafa'),
	},
	{
		id: 2,
		name: 'Maria y Charly',
		shortName: 'M+C',
		gender: 'pair',
		clue: 'Estaban en el Sótano Secreto, al este de Jose y Ramon. Estaban junto a una estantería.',
		portraitSrc: portrait('maria-charly'),
	},
	{
		id: 3,
		name: 'Inma y la Peque',
		shortName: 'I+P',
		gender: 'pair',
		clue: 'Estaban en el Bar, al sur y al oeste de Emilio y Rafa.',
		portraitSrc: portrait('inma-peque'),
	},
	{
		id: CARLA_ID,
		name: 'Carla',
		gender: 'female',
		isVictim: true,
		clue: 'Carla. Estaba a solas con quien hablaba.',
		portraitSrc: portrait('carla'),
	},
	{
		id: 5,
		name: 'Presi y el Capi',
		shortName: 'P+C',
		gender: 'pair',
		clue: 'Estaban en el Sótano Secreto. Nadie de esa zona estaba más al este. No tocaban ninguna estantería.',
		portraitSrc: portrait('presi-capi'),
	},
	{
		id: 6,
		name: 'Lourdes y David',
		shortName: 'L+D',
		gender: 'pair',
		clue: 'Estaban en la Cocina, sentados en un taburete, junto a la fregadera.',
		portraitSrc: portrait('lourdes-david'),
	},
	{
		id: 7,
		name: 'Jose y Ramon',
		shortName: 'J+R',
		gender: 'pair',
		clue: 'Estaban en el Sótano Secreto, entre dos estanterías. Nadie de esa zona estaba más al norte.',
		portraitSrc: portrait('jose-ramon'),
	},
	{
		id: 8,
		name: 'Raquel y Jesús',
		shortName: 'R+J',
		gender: 'pair',
		clue: 'Estaban solos en el Almacén. Estaban al oeste de una silla.',
		portraitSrc: portrait('raquel-jesus'),
	},
	{
		id: 9,
		name: 'Yoel',
		gender: 'male',
		clue: 'Estaba en el Comedor, al sur de Carla. Estaba en una ventana.',
		portraitSrc: portrait('yoel'),
	},
];

/**
 * 9×9 bar floor plan — rooms + furniture blockers placed around the solution.
 *
 *   Cocina · Sótano Secreto
 *   Bar    · Comedor · Almacén
 */
export const roomMatrix: Room[][] = Array.from(
	{ length: BOARD_ROWS },
	(_, rowIndex) =>
		Array.from({ length: BOARD_COLUMNS }, (_, columnIndex): Room => {
			if (rowIndex <= 1 && columnIndex <= 2) return 'Cocina';
			if (rowIndex <= 3 && columnIndex >= 3) return 'Sótano Secreto';
			if (columnIndex <= 2) return 'Bar';
			if (
				rowIndex >= 5 &&
				rowIndex <= 6 &&
				columnIndex >= 5 &&
				columnIndex <= 7
			) {
				return 'Almacén';
			}
			return 'Comedor';
		})
);

/**
 * Lourdes y David en 0-1 encima del taburete (ocupable).
 * Barra en C6–C9. Solución: 0-1*, 1-3, 2-7, 3-8, 4-2, 5-5, 6-4, 7-0, 8-6.
 */
export const furnitureCells: Partial<Record<CellKey, FurnitureCell>> = {
	// —— Cocina ——
	'0-0': { kind: 'estantería', role: 'blocking' },
	'0-1': { kind: 'taburete', role: 'occupiable' },
	'0-2': { kind: 'fregadera', role: 'blocking' },

	// —— Sótano Secreto (hueco 1-3 entre estanterías para Jose) ——
	'0-3': { kind: 'estantería', role: 'blocking' },
	'0-4': { kind: 'estantería', role: 'blocking' },
	'0-5': { kind: 'estantería', role: 'blocking' },
	'0-6': { kind: 'estantería', role: 'blocking' },
	'0-7': { kind: 'estantería', role: 'blocking' },
	'0-8': { kind: 'estantería', role: 'blocking' },
	'1-4': { kind: 'estantería', role: 'blocking' },
	'1-5': { kind: 'estantería', role: 'blocking' },
	'1-6': { kind: 'estantería', role: 'blocking' },
	'1-7': { kind: 'estantería', role: 'blocking' },
	'1-8': { kind: 'estantería', role: 'blocking' },
	'2-3': { kind: 'estantería', role: 'blocking' },
	'2-4': { kind: 'estantería', role: 'blocking' },
	'2-5': { kind: 'estantería', role: 'blocking' },
	'2-6': { kind: 'estantería', role: 'blocking' },

	// —— Bar ——
	'2-0': { kind: 'nevera', role: 'blocking' },
	'3-0': { kind: 'taburete', role: 'occupiable' },
	'3-1': { kind: 'taburete', role: 'occupiable' },
	'4-0': { kind: 'cañero', role: 'blocking' },
	'5-2': { kind: 'barra', role: 'blocking' },
	'6-2': { kind: 'barra', role: 'blocking' },
	'7-2': { kind: 'barra', role: 'blocking' },
	'8-2': { kind: 'barra', role: 'blocking' },

	// —— Almacén ——
	'5-6': { kind: 'silla', role: 'occupiable' },
	'5-7': { kind: 'silla', role: 'occupiable' },
	'6-5': { kind: 'escalera', role: 'blocking' },
	'6-7': { kind: 'estantería', role: 'blocking' },

	// —— Comedor ——
	'4-3': { kind: 'sofá', role: 'occupiable' },
	'4-4': { kind: 'sofá', role: 'occupiable' },
	'4-5': { kind: 'sofá', role: 'occupiable' },
	'4-6': { kind: 'sofá', role: 'occupiable' },
	'4-7': { kind: 'sofá', role: 'occupiable' },
	'4-8': { kind: 'sofá', role: 'occupiable' },
	'6-3': { kind: 'planta', role: 'blocking' },
	'7-4': { kind: 'mesa', role: 'blocking' },
	'7-8': { kind: 'mesa', role: 'blocking' },
	'8-8': { kind: 'piano', role: 'blocking' },
};

export const FURNITURE_OBJECT_NAMES = [
	...new Set(
		Object.values(furnitureCells)
			.map((cell) => cell?.kind)
			.filter((kind): kind is string => Boolean(kind))
	),
];

export const HINTS = [
	'Lourdes y David están en la Cocina sobre el taburete junto a la fregadera: eso fija la esquina noroeste.',
	'Jose y Ramon están en el Sótano entre estanterías, los más al norte de esa zona — solo 1-3 encaja.',
	'Maria y Charly al este de Jose y Ramon, Presi y el Capi los más al este del sótano: cierran dos columnas más.',
	'Emilio y Rafa están en el Bar junto a la barra; Inma y la Peque quedan al sur-oeste de ellos.',
	'Carla al final, a solas con Yoel en el Comedor (Yoel en ventana, al sur de ella).',
];

/** Window edges (decorative; cells stay walkable). */
export const windowCells: Partial<Record<CellKey, WindowEdge>> = {
	'8-1': 'bottom', // B9 — Bar
	'8-3': 'bottom', // D9 — Comedor
	'8-5': 'bottom', // F9 — Comedor
	'8-6': 'bottom', // G9 — Comedor
	'5-8': 'right', // I6
	'6-8': 'right', // I7
};

export const ROOM_ORDER: Room[] = [
	'Cocina',
	'Sótano Secreto',
	'Bar',
	'Comedor',
	'Almacén',
];

export const getRoomClass = (room: Room): string => {
	const classes: Record<Room, string> = {
		Cocina: 'room-kitchen',
		'Sótano Secreto': 'room-secret',
		Bar: 'room-bar',
		Comedor: 'room-dining',
		Almacén: 'room-storage',
	};
	return classes[room];
};
