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
		clue: 'Estaban sobre una alfombra del Bar.',
		portraitSrc: portrait('emilio-rafa'),
	},
	{
		id: 2,
		name: 'Maria y Charly',
		shortName: 'M+C',
		gender: 'pair',
		clue: 'Estaban en una ventana del Sótano Secreto.',
		portraitSrc: portrait('maria-charly'),
	},
	{
		id: 3,
		name: 'Inma y la Peque',
		shortName: 'I+P',
		gender: 'pair',
		clue: 'Estaban en una ventana del Bar. No sobre una alfombra.',
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
		clue: 'Estaban en una esquina del Sótano Secreto. No tocaban ninguna estantería.',
		portraitSrc: portrait('presi-capi'),
	},
	{
		id: 6,
		name: 'Lourdes y David',
		shortName: 'L+D',
		gender: 'pair',
		clue: 'Estaban sentados en un taburete. No estaban en el Bar.',
		portraitSrc: portrait('lourdes-david'),
	},
	{
		id: 7,
		name: 'Jose y Ramon',
		shortName: 'J+R',
		gender: 'pair',
		clue: 'Estaban entre dos estanterías. No estaban en una esquina.',
		portraitSrc: portrait('jose-ramon'),
	},
	{
		id: 8,
		name: 'Raquel y Jesús',
		shortName: 'R+J',
		gender: 'pair',
		clue: 'Estaban sobre una alfombra del Almacén.',
		portraitSrc: portrait('raquel-jesus'),
	},
	{
		id: 9,
		name: 'Yoel',
		gender: 'male',
		clue: 'Estaba en una ventana del Comedor.',
		portraitSrc: portrait('yoel'),
	},
];

/**
 * 9×9 bar floor plan — salas en bloques limpios:
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
 * Props ligeros. Señuelos: 2 taburetes, 2 huecos entre estanterías, 2 ventanas/sala.
 * Solución: 0-7, 1-1*, 2-3, 3-8, 4-2*, 5-5*, 6-4, 7-0, 8-6.
 * El hueco 1-4 cae en la fila de Lourdes; el taburete 0-1, en la de Maria.
 */
export const furnitureCells: Partial<Record<CellKey, FurnitureCell>> = {
	// —— Cocina (Lourdes en 1-1; 0-1 es el otro taburete) ——
	'0-0': { kind: 'fregadera', role: 'blocking' },
	'0-1': { kind: 'taburete', role: 'occupiable' },
	'0-2': { kind: 'nevera', role: 'blocking' },
	'1-1': { kind: 'taburete', role: 'occupiable' },

	// —— Sótano Secreto (Jose en 2-3 entre estanterías; 1-4 es el otro hueco) ——
	'1-3': { kind: 'estantería', role: 'blocking' },
	'1-5': { kind: 'estantería', role: 'blocking' },
	'3-3': { kind: 'estantería', role: 'blocking' },
	// Cierra la esquina 0-8 para Presi (solo 3-8 queda libre de estantería)
	'1-8': { kind: 'estantería', role: 'blocking' },

	// —— Bar (Emilio en 4-2; 6-1 es otra alfombra) ——
	'4-2': { kind: 'alfombra', role: 'occupiable' },
	'6-1': { kind: 'alfombra', role: 'occupiable' },
	'3-0': { kind: 'taburete', role: 'occupiable' },
	'3-1': { kind: 'taburete', role: 'occupiable' },
	'4-0': { kind: 'cañero', role: 'blocking' },
	'5-2': { kind: 'barra', role: 'blocking' },
	'6-2': { kind: 'barra', role: 'blocking' },
	'7-2': { kind: 'barra', role: 'blocking' },
	'8-2': { kind: 'barra', role: 'blocking' },

	// —— Almacén (Raquel en 5-5; 6-6 es otra alfombra) ——
	'5-5': { kind: 'alfombra', role: 'occupiable' },
	'6-6': { kind: 'alfombra', role: 'occupiable' },
	'5-6': { kind: 'silla', role: 'occupiable' },
	'5-7': { kind: 'silla', role: 'occupiable' },
	'6-5': { kind: 'escalera', role: 'blocking' },
	'6-7': { kind: 'estantería', role: 'blocking' },

	// —— Comedor ——
	'4-4': { kind: 'sofá', role: 'occupiable' },
	'4-5': { kind: 'sofá', role: 'occupiable' },
	'4-6': { kind: 'sofá', role: 'occupiable' },
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
	'Una persona por fila y por columna. Empieza por Presi y el Capi: en el Sótano solo una esquina no toca estantería. Colócalos ahí.',
	'Maria y Charly: ventana del Sótano. La que comparte fila con Presi y el Capi se descarta. Usa la otra.',
	'Lourdes y David: taburete, y no en el Bar. El taburete de la fila de Maria y Charly queda fuera. Ponlos en el otro de la Cocina.',
	'Jose y Ramon: entre dos estanterías, y no en una esquina. El hueco de la fila de Lourdes y David sobra. Usa el otro.',
	'Inma y la Peque: ventana del Bar, sin pisar la columna de Lourdes y David. Emilio y Rafa: alfombra del Bar en una fila que siga libre; prueba la del medio.',
	'Raquel y Jesús: alfombra del Almacén cuya columna no tape a Yoel. Yoel: ventana del Comedor en una columna libre. La de Jose y Ramon no vale.',
	'Con el resto en su sitio solo queda una casilla. Carla, al final, en el Comedor, a solas con Yoel.',
];

/** Una ventana de más por sala: la pista y la fila/columna descartan el señuelo. */
export const windowCells: Partial<Record<CellKey, WindowEdge>> = {
	'0-7': 'top', // Maria y Charly — muro norte del Sótano
	'3-4': 'bottom', // señuelo, muro sur (misma fila que Presi)
	'7-0': 'left', // Inma y la Peque — Bar
	'8-1': 'bottom', // señuelo del Bar
	'8-6': 'bottom', // Yoel — Comedor
	'8-3': 'bottom', // señuelo del Comedor
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
