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
		clue: 'Estaba en el Balcón, en una ventana. Al este de Isabel y Paco.',
		portraitSrc: portrait('yoel'),
	},
	{
		id: 2,
		name: 'Carla',
		shortName: 'Carla',
		gender: 'female',
		clue: 'Estaba en la Habitación grande, junto a la cuna. Nadie de esa habitación estaba más al sur.',
		portraitSrc: portrait('carla'),
	},
	{
		id: KAI_ID,
		name: 'Kai',
		shortName: 'Kai',
		gender: 'male',
		isVictim: true,
		clue: 'Kai. Estaba a solas con quien lo cuidaba.',
		portraitSrc: portrait('kai'),
	},
	{
		id: 4,
		name: 'Eloy e Isa',
		shortName: 'E+I',
		gender: 'pair',
		clue: 'Estaban en el Salón. Nadie del Salón estaba más al oeste ni más al sur.',
		portraitSrc: portrait('eloy-isa'),
	},
	{
		id: 5,
		name: 'Berta',
		shortName: 'Berta',
		gender: 'female',
		clue: 'Estaba sola en la Entrada, junto a un perchero.',
		portraitSrc: portrait('berta'),
	},
	{
		id: 6,
		name: 'Isabel y Paco',
		shortName: 'I+P',
		gender: 'pair',
		clue: 'Estaban en el Balcón, en una hamaca. Nadie del Balcón estaba más al sur.',
		portraitSrc: portrait('isabel-paco'),
	},
	{
		id: 7,
		name: 'Asun y Luis',
		shortName: 'A+L',
		gender: 'pair',
		clue: 'Estaban en la Cocina, entre la nevera y el fregadero.',
		portraitSrc: portrait('asun-luis'),
	},
	{
		id: 8,
		name: 'Tania y Luis',
		shortName: 'T+L',
		gender: 'pair',
		clue: 'Estaban sentados en el sofá. Al norte de Juani y Luca.',
		portraitSrc: portrait('tania-luis'),
	},
	{
		id: 9,
		name: 'AbuPepe',
		shortName: 'Abu',
		gender: 'male',
		clue: 'Estaba solo en el WC, junto al lavabo.',
		portraitSrc: portrait('abupepe'),
	},
	{
		id: 10,
		name: 'Juani y Luca',
		shortName: 'J+L',
		gender: 'pair',
		clue: 'Estaban en el Salón, junto a la tele. Entre Tania y Luis y Eloy e Isa.',
		portraitSrc: portrait('juani-luca'),
	},
];

/**
 * Casa Hondarribia — salas claras, sin rellenar de muebles:
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
 * Props del caso. Sofá y hamaca son ocupables (la persona va encima).
 * Libres: 0-5, 1-8, 2-1, 3-6, 4-8, 5-2*, 6-3, 7-0, 8-9, 9-4*
 * (* ocupable)
 */
export const furnitureCells: Partial<Record<CellKey, FurnitureCell>> = {
	// Lavadero
	'0-0': { kind: 'lavadora', role: 'blocking' },
	'1-2': { kind: 'tendedero', role: 'blocking' },

	// WC — AbuPepe en 0-5, junto al lavabo
	'0-4': { kind: 'lavabo', role: 'blocking' },
	'1-3': { kind: 'inodoro', role: 'blocking' },

	// Entrada — Berta en 1-8, junto al perchero
	'1-7': { kind: 'perchero', role: 'blocking' },
	'0-9': { kind: 'zapatero', role: 'blocking' },

	// Cocina — Asun en 2-1, entre nevera y fregadera
	'2-0': { kind: 'nevera', role: 'blocking' },
	'2-2': { kind: 'fregadera', role: 'blocking' },
	'4-1': { kind: 'mesa', role: 'blocking' },

	// Habitación grande — Carla en 4-8, junto a la cuna
	'4-7': { kind: 'cuna', role: 'blocking' },
	'2-7': { kind: 'cama', role: 'occupiable' },
	'3-9': { kind: 'cambiador', role: 'blocking' },

	// Salón — Tania 5-2 encima del sofá / Juani 6-3 / Eloy 7-0
	'5-2': { kind: 'sofá', role: 'occupiable' },
	'6-2': { kind: 'tele', role: 'blocking' },
	'7-2': { kind: 'mesa', role: 'blocking' },

	// Habitación
	'6-8': { kind: 'cama', role: 'occupiable' },

	// Balcón — Isabel en 9-4 encima de la hamaca
	'9-4': { kind: 'hamaca', role: 'occupiable' },
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
	'8-9': 'bottom',
	'9-4': 'bottom',
	'8-4': 'bottom',
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
	'AbuPepe está solo en el WC junto al lavabo: solo hay una casilla libre que cumpla eso. Eso cierra su fila y columna.',
	'Berta sola en la Entrada junto al perchero aísla otra fila y columna de un golpe.',
	'Asun y Luis están en la Cocina entre nevera y fregadera — una sola casilla encaja.',
	'En el Salón: Tania va encima del sofá, Juani junto a la tele, y Eloy en el rincón más al oeste y al sur.',
	'Kai al final: Habitación grande, a solas con Carla (ella está junto a la cuna, la más al sur de esa sala).',
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
