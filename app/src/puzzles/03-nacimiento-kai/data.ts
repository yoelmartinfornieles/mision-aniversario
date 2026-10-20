import type { FurnitureCell } from '@/puzzles/shared/murdoku';
import { BOARD_COLUMNS, BOARD_ROWS, KAI_ID } from './constants';
import type { CellKey, Room, Suspect, WindowEdge } from './types';

const portrait = (name: string) =>
	`${import.meta.env.BASE_URL}puzzles/03-portraits/${name}.jpg`;

/**
 * Clues — estilo Murdoku real: 1–2 hechos cortos por carta.
 */
export const suspects: Suspect[] = [
	{
		id: 1,
		name: 'Yoel',
		shortName: 'Yoel',
		gender: 'male',
		clue: 'Estaba en una ventana del Balcón.',
		portraitSrc: portrait('yoel'),
	},
	{
		id: 2,
		name: 'Carla',
		shortName: 'Carla',
		gender: 'female',
		clue: 'Estaba junto a la cuna, sobre una alfombra.',
		portraitSrc: portrait('carla'),
	},
	{
		id: KAI_ID,
		name: 'Kai',
		shortName: 'Kai',
		gender: 'male',
		isVictim: true,
		clue: 'Kai. Estaba a solas con alguien, lejos del jaleo.',
		portraitSrc: portrait('kai'),
	},
	{
		id: 4,
		name: 'Eloy e Isa',
		shortName: 'E+I',
		gender: 'pair',
		clue: 'Estaban en una ventana del Salón.',
		portraitSrc: portrait('eloy-isa'),
	},
	{
		id: 5,
		name: 'Berta',
		shortName: 'Berta',
		gender: 'female',
		clue: 'Estaba en una ventana de la Entrada.',
		portraitSrc: portrait('berta'),
	},
	{
		id: 6,
		name: 'Isabel y Paco',
		shortName: 'I+P',
		gender: 'pair',
		clue: 'Estaban sentados en un banco. No estaban en el Salón.',
		portraitSrc: portrait('isabel-paco'),
	},
	{
		id: 7,
		name: 'Asun y Luis',
		shortName: 'A+L',
		gender: 'pair',
		clue: 'Estaban entre la nevera y la fregadera.',
		portraitSrc: portrait('asun-luis'),
	},
	{
		id: 8,
		name: 'Tania y Luis',
		shortName: 'T+L',
		gender: 'pair',
		clue: 'Estaban sentados en el sofá, junto a la tele.',
		portraitSrc: portrait('tania-luis'),
	},
	{
		id: 9,
		name: 'AbuPepe',
		shortName: 'Abu',
		gender: 'male',
		clue: 'Estaba en el WC, junto al lavabo.',
		portraitSrc: portrait('abupepe'),
	},
	{
		id: 10,
		name: 'Juani y Luca',
		shortName: 'J+L',
		gender: 'pair',
		clue: 'Estaban sobre una alfombra del Salón.',
		portraitSrc: portrait('juani-luca'),
	},
];

/**
 * Casa Hondarribia — salas claras:
 *
 *   Lavadero | WC | Entrada
 *   Cocina   | Habitación grande
 *   Salón    | Habitación
 *   Balcón
 */
export const roomMatrix: Room[][] = Array.from(
	{ length: BOARD_ROWS },
	(_, rowIndex) =>
		Array.from({ length: BOARD_COLUMNS }, (_, columnIndex): Room => {
			if (rowIndex <= 1) {
				if (columnIndex <= 2) return 'Lavadero';
				if (columnIndex <= 5) return 'WC';
				return 'Entrada';
			}

			if (rowIndex <= 4) {
				if (columnIndex <= 3) return 'Cocina';
				return 'Habitación grande';
			}

			if (rowIndex <= 7) {
				if (columnIndex <= 5) return 'Salón';
				return 'Habitación';
			}

			return 'Balcón';
		})
);

/**
 * Señuelos: Lavadero (nevera/fregadera), Habitación (banco), 2 sofás, varios huecos al lavabo.
 * Libres: 0-5, 1-6, 2-1, 3-7, 4-8*, 5-2*, 6-3*, 7-0, 8-9, 9-4*
 */
export const furnitureCells: Partial<Record<CellKey, FurnitureCell>> = {
	// Lavadero — señuelo entre nevera y fregadera (Asun)
	'0-0': { kind: 'nevera', role: 'blocking' },
	'0-2': { kind: 'fregadera', role: 'blocking' },
	'1-2': { kind: 'tendedero', role: 'blocking' },

	// WC — AbuPepe en 0-5; también 0-3 y 1-4 tocan el lavabo
	'0-4': { kind: 'lavabo', role: 'blocking' },
	'1-3': { kind: 'inodoro', role: 'blocking' },

	// Entrada — Berta en 1-6
	'1-7': { kind: 'perchero', role: 'blocking' },
	'0-9': { kind: 'zapatero', role: 'blocking' },

	// Cocina — Asun en 2-1, entre nevera y fregadera
	'2-0': { kind: 'nevera', role: 'blocking' },
	'2-2': { kind: 'fregadera', role: 'blocking' },
	'4-1': { kind: 'mesa', role: 'blocking' },

	// Habitación grande — Carla en 4-8, alfombra junto a la cuna
	'4-8': { kind: 'alfombra', role: 'occupiable' },
	'4-7': { kind: 'cuna', role: 'blocking' },
	'2-7': { kind: 'cama', role: 'occupiable' },
	'3-9': { kind: 'cambiador', role: 'blocking' },

	// Salón — Juani en 6-3; Tania en 5-2 (5-4 es el otro sofá)
	'6-3': { kind: 'alfombra', role: 'occupiable' },
	'6-1': { kind: 'alfombra', role: 'occupiable' },
	'5-2': { kind: 'sofá', role: 'occupiable' },
	'5-4': { kind: 'sofá', role: 'occupiable' },
	'6-2': { kind: 'tele', role: 'blocking' },
	'7-2': { kind: 'mesa', role: 'blocking' },

	// Habitación — banco señuelo (Isabel)
	'6-8': { kind: 'banco', role: 'occupiable' },

	// Balcón — Isabel en 9-4 sentada en el banco
	'9-4': { kind: 'banco', role: 'occupiable' },
	'8-2': { kind: 'planta', role: 'blocking' },
};

export const FURNITURE_OBJECT_NAMES = [
	...new Set(
		Object.values(furnitureCells)
			.map((cell) => cell?.kind)
			.filter((kind): kind is string => Boolean(kind))
	),
];

export const windowCells: Partial<Record<CellKey, WindowEdge>> = {
	'1-6': 'bottom', // Berta — Entrada, junto al perchero
	'0-7': 'top', // señuelo, también junto al perchero, fila del WC
	'7-0': 'bottom', // Eloy e Isa — Salón
	'5-0': 'left', // señuelo del Salón, fila de Tania
	'8-9': 'right', // Yoel — Balcón, muro exterior
	'9-8': 'bottom', // señuelo del Balcón, fila de Isabel
};

export const ROOM_ORDER: Room[] = [
	'Lavadero',
	'WC',
	'Entrada',
	'Cocina',
	'Habitación grande',
	'Salón',
	'Habitación',
	'Balcón',
];

export const HINTS = [
	'Una persona por fila y por columna. Empieza por lo más claro: Tania y Luis, en el sofá que tiene la tele al lado. En el Salón solo hay un sofá así.',
	'Carla: la alfombra pegada a la cuna. Solo hay una, así que su fila y su columna quedan cerradas. Kai tendrá que acabar a solas con ella en su misma habitación.',
	'Eloy e Isa: ventana del Salón. Una de las dos comparte fila con Tania y Luis, así que se descarta. Colócalos en la otra.',
	'Asun y Luis: entre la nevera y la fregadera. Hay un hueco en el Lavadero y otro en la Cocina. El del Lavadero se come una fila que el WC y la Entrada necesitan. Quédate con el de la Cocina.',
	'Berta: ventana de la Entrada. De las dos, una deja sin fila a AbuPepe, así que elige la otra. AbuPepe: casilla del WC pegada al lavabo; queda una que no choca con nadie.',
	'Isabel y Paco: sentados en un banco, pero no en el Salón. Si usan el de la Habitación, Juani se queda sin fila para su alfombra. Van al Balcón. Yoel: ventana del Balcón, la que no comparte fila con Isabel y Paco.',
	'Juani y Luca: la alfombra del Salón cuya columna siga libre. Kai, al final, en la última casilla que queda: la Habitación grande, a solas con Carla.',
];

export const getRoomClass = (room: Room): string => {
	const classes: Record<Room, string> = {
		Lavadero: 'room-laundry',
		WC: 'room-wc',
		Entrada: 'room-entry',
		Cocina: 'room-kitchen',
		'Habitación grande': 'room-nursery',
		Salón: 'room-living',
		Habitación: 'room-bedroom',
		Balcón: 'room-balcony',
	};
	return classes[room];
};
