import type { FurnitureCell } from '@/puzzles/shared/murdoku';
import { BOARD_COLUMNS, BOARD_ROWS, CARLA_ID } from './constants';
import type { CellKey, Room, Suspect, WindowEdge } from './types';

const portrait = (name: string) =>
	`${import.meta.env.BASE_URL}puzzles/05-portraits/${name}.jpg`;

/**
 * Clues — estilo Murdoku real: hechos cortos.
 * Pregunta: ¿Quién ha elegido el regalo de aniversario?
 */
export const suspects: Suspect[] = [
	{
		id: 1,
		name: 'Yoel',
		shortName: 'Yoel',
		gender: 'male',
		clue: 'Estaba en un carro de chuches junto a un castillo. No estaba en una esquina.',
		portraitSrc: portrait('yoel'),
	},
	{
		id: 2,
		name: 'Kai',
		shortName: 'Kai',
		gender: 'male',
		clue: 'Estaba en un carro de chuches al norte de Haizea.',
		portraitSrc: portrait('kai'),
	},
	{
		id: 3,
		name: 'Luar',
		shortName: 'Luar',
		gender: 'male',
		clue: 'Estaba en una ventana del Espacio, entre dos farolas.',
		portraitSrc: portrait('luar'),
	},
	{
		id: 4,
		name: 'Haizea',
		shortName: 'Haizea',
		gender: 'female',
		clue: 'Estaba en una ventana de la Avenida.',
		portraitSrc: portrait('haizea'),
	},
	{
		id: 5,
		name: 'Saioa',
		shortName: 'Saioa',
		gender: 'female',
		clue: 'Estaba en un carrusel. No estaba en Cuentos.',
		portraitSrc: portrait('saioa'),
	},
	{
		id: 6,
		name: 'Unai',
		shortName: 'Unai',
		gender: 'male',
		clue: 'Estaba en una ventana del Muelle, junto a un barco.',
		portraitSrc: portrait('unai'),
	},
	{
		id: 7,
		name: 'George',
		shortName: 'George',
		gender: 'male',
		clue: 'Estaba junto a una montaña rusa. No estaba en Cuentos.',
		portraitSrc: portrait('george'),
	},
	{
		id: CARLA_ID,
		name: 'Carla',
		shortName: 'Carla',
		gender: 'female',
		isVictim: true,
		clue: 'Carla. Estaba a solas con quien eligió el regalo de aniversario.',
		portraitSrc: portrait('carla'),
	},
];

/**
 * Parque 8×8 — zonas claras:
 *
 *   Avenida
 *   Selva | Castillo | Cuentos
 *   Plaza
 *   Espacio | Muelle
 */
export const roomMatrix: Room[][] = Array.from(
	{ length: BOARD_ROWS },
	(_, rowIndex) =>
		Array.from({ length: BOARD_COLUMNS }, (_, columnIndex): Room => {
			if (rowIndex <= 1) return 'Avenida';

			if (rowIndex <= 4) {
				if (columnIndex <= 1) return 'Selva';
				if (columnIndex <= 4) return 'Castillo';
				return 'Cuentos';
			}

			if (rowIndex === 5) return 'Plaza';

			return columnIndex <= 3 ? 'Espacio' : 'Muelle';
		})
);

/**
 * Atracciones: carro, castillo, carrusel, montaña rusa, fuente, farolas, barcos.
 * Nudo de backtrack: Kai/Haizea — 2 carros en fila 0 × 2 ventanas en fila 1 = 4 pares
 * «al norte» plausibles; solo 0-0 + 1-7 sobrevive al cruce con Yoel/George/Unai.
 * Geometría (≥2 candidatas):
 * - Yoel: carro+castillo y no esquina (0-0 cae; quedan 1-1 / 2-3 / 3-5).
 * - Luar: ventana entre dos farolas (6-2 / 7-1).
 * - Unai: ventana del Muelle junto a un barco (7-4 / 7-6).
 * Libres: 0-0*, 1-7, 2-3*, 3-4, 4-1, 5-5*, 6-2, 7-6
 */
export const furnitureCells: Partial<Record<CellKey, FurnitureCell>> = {
	// Avenida — Kai en 0-0; 0-5 es el carro señuelo del nudo; castillo esquina (Yoel)
	'0-0': { kind: 'carro de chuches', role: 'occupiable' },
	'0-1': { kind: 'castillo', role: 'blocking' },
	'0-5': { kind: 'carro de chuches', role: 'occupiable' },
	'1-1': { kind: 'carro de chuches', role: 'occupiable' },

	// Castillo — Yoel en 2-3, carro junto al castillo
	'2-3': { kind: 'carro de chuches', role: 'occupiable' },
	'2-4': { kind: 'castillo', role: 'blocking' },

	// Cuentos — señuelos: carro+castillo (Yoel), carrusel (Saioa), montaña (George)
	'3-5': { kind: 'carro de chuches', role: 'occupiable' },
	'3-6': { kind: 'castillo', role: 'blocking' },
	'4-6': { kind: 'montaña rusa', role: 'blocking' },
	'4-7': { kind: 'carrusel', role: 'occupiable' },

	// Selva — George en 4-1; 3-0 es la otra casilla junto a la montaña rusa
	'4-0': { kind: 'montaña rusa', role: 'blocking' },

	// Plaza — Saioa en 5-5; montaña rusa señuelo (5-1 / 5-3) para George
	'5-2': { kind: 'montaña rusa', role: 'blocking' },
	'5-4': { kind: 'fuente', role: 'blocking' },
	'5-5': { kind: 'carrusel', role: 'occupiable' },

	// Espacio — Luar en 6-2 entre farolas; 7-1 es el otro hueco (ventana señuelo)
	'6-1': { kind: 'farola', role: 'blocking' },
	'6-3': { kind: 'farola', role: 'blocking' },
	'7-0': { kind: 'farola', role: 'blocking' },
	'7-2': { kind: 'farola', role: 'blocking' },
	'7-3': { kind: 'carrusel', role: 'occupiable' },

	// Muelle — Unai junto a barco; ambos ventanas tienen barco al norte
	'6-4': { kind: 'barco', role: 'blocking' },
	'6-6': { kind: 'barco', role: 'blocking' },
};

export const FURNITURE_OBJECT_NAMES = [
	...new Set(
		Object.values(furnitureCells)
			.map((cell) => cell?.kind)
			.filter((kind): kind is string => Boolean(kind))
	),
];

export const HINTS = [
	'Una persona por fila y por columna. Haizea: ventana de la Avenida. La de la fila de arriba no deja carro al norte para Kai, así que se descarta. Ponla en la ventana de la derecha; la del medio de esa fila ahoga el resto.',
	'Kai: carro de chuches al norte de Haizea. Con ella a la derecha, encaja el carro de arriba-izquierda. El otro carro de arriba tapa columnas que harán falta.',
	'Luar: ventana del Espacio, entre dos farolas. El hueco de abajo roba una fila o una columna al final. Colócala en el hueco de arriba.',
	'Yoel: carro junto a un castillo, y no en esquina. El de la esquina de la Avenida sobra. El del medio de la Avenida pisa la fila de Haizea. El de Cuentos deja a Carla sin pareja en el Castillo. Déjalo en el carro del Castillo.',
	'Saioa: carrusel, y no en Cuentos. El del Espacio le roba la fila a Unai. Ponla en el carrusel de la Plaza.',
	'George: junto a una montaña rusa, y no en Cuentos. Las casillas de la Plaza pisan la fila de Saioa. En la Selva, la que comparte columna con Kai se descarta. Usa la otra.',
	'Unai: ventana del Muelle junto a un barco. La de más a la izquierda deja a Carla en una casilla bloqueada. Ponlo en la otra. Carla, al final, en la casilla libre del Castillo, a solas con Yoel, que eligió el regalo.',
];

export const windowCells: Partial<Record<CellKey, WindowEdge>> = {
	'1-7': 'right', // Haizea — Avenida, muro exterior
	'1-3': 'bottom', // señuelo Avenida — también fila de abajo (nudo Kai/Haizea)
	'0-6': 'top', // señuelo Avenida — fila de arriba (sin carro al norte)
	'6-2': 'top', // Luar — Espacio, entre farolas
	'7-1': 'bottom', // señuelo Espacio — también entre farolas
	'6-0': 'left', // señuelo Espacio — ventana sin el «entre»
	'7-6': 'bottom', // Unai — Muelle, junto a barco
	'7-4': 'bottom', // señuelo Muelle — también junto a barco
};

export const ROOM_ORDER: Room[] = [
	'Avenida',
	'Selva',
	'Castillo',
	'Cuentos',
	'Plaza',
	'Espacio',
	'Muelle',
];

export const getRoomClass = (room: Room): string => {
	const classes: Record<Room, string> = {
		Avenida: 'room-avenue',
		Selva: 'room-jungle',
		Castillo: 'room-castle',
		Cuentos: 'room-tales',
		Plaza: 'room-plaza',
		Espacio: 'room-space',
		Muelle: 'room-pier',
	};
	return classes[room];
};
