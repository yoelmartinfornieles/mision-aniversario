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
		clue: 'Estaba en la Avenida, junto a una farola. Nadie de la Avenida estaba más al oeste.',
		portraitSrc: portrait('yoel'),
	},
	{
		id: 2,
		name: 'Kai',
		shortName: 'Kai',
		gender: 'male',
		clue: 'Estaba en el Castillo, junto a un seto. Nadie del Castillo estaba más al norte.',
		portraitSrc: portrait('kai'),
	},
	{
		id: 3,
		name: 'Luar',
		shortName: 'Luar',
		gender: 'male',
		clue: 'Estaba en el Espacio, junto a un cohete. Nadie del Espacio estaba más al oeste.',
		portraitSrc: portrait('luar'),
	},
	{
		id: 4,
		name: 'Haizea',
		shortName: 'Haizea',
		gender: 'female',
		clue: 'Estaba en la Avenida, junto a un carro. Nadie de la Avenida estaba más al este.',
		portraitSrc: portrait('haizea'),
	},
	{
		id: 5,
		name: 'Saioa',
		shortName: 'Saioa',
		gender: 'female',
		clue: 'Estaba sola en la Plaza, sentada en una banqueta, al este de la fuente.',
		portraitSrc: portrait('saioa'),
	},
	{
		id: 6,
		name: 'Unai',
		shortName: 'Unai',
		gender: 'male',
		clue: 'Estaba en el Muelle, al este de un barco. Nadie del parque estaba más al sur.',
		portraitSrc: portrait('unai'),
	},
	{
		id: 7,
		name: 'George',
		shortName: 'George',
		gender: 'male',
		clue: 'Estaba solo en la Selva, junto a un tronco.',
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
 * Parque 8×8 — zonas claras, casi vacío:
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
 * Solo props citados en las pistas.
 * Libres: 0-0, 1-7, 2-3, 3-4, 4-1, 5-5*, 6-2, 7-6
 */
export const furnitureCells: Partial<Record<CellKey, FurnitureCell>> = {
	// Avenida — Yoel 0-0 / Haizea 1-7
	'0-1': { kind: 'farola', role: 'blocking' },
	'1-6': { kind: 'carro', role: 'blocking' },

	// Castillo — Kai 2-3 (Carla 3-4 sin mueble propio)
	'2-4': { kind: 'seto', role: 'blocking' },

	// Selva — George 4-1
	'4-0': { kind: 'tronco', role: 'blocking' },

	// Plaza — Saioa 5-5 encima de la banqueta
	'5-4': { kind: 'fuente', role: 'blocking' },
	'5-5': { kind: 'banqueta', role: 'occupiable' },

	// Espacio — Luar 6-2
	'6-1': { kind: 'cohete', role: 'blocking' },

	// Muelle — Unai 7-6
	'7-5': { kind: 'barco', role: 'blocking' },

	// Anclas visuales
	'2-6': { kind: 'taza', role: 'blocking' },
	'6-5': { kind: 'toldo', role: 'blocking' },
};

export const FURNITURE_OBJECT_NAMES = [
	...new Set(
		Object.values(furnitureCells)
			.map((cell) => cell?.kind)
			.filter((kind): kind is string => Boolean(kind))
	),
];

export const HINTS = [
	'Relee las pistas de la Avenida: farola y carro marcan dos extremos. Coloca primero a quien fija el oeste y quien fija el este.',
	'La Plaza es un caso limpio: alguien sola, una banqueta y una fuente. Si te atascas, empieza por ahí.',
	'George es el más fácil del parque: solo en la Selva, junto al tronco. Fíjalo y libera fila y columna.',
	'En el Castillo, el seto restringe al más al norte de esa zona. Deja a Carla para el final: va con quien eligió el regalo.',
	'Espacio (cohete) y Muelle (barco) cierran el sur del mapa: úsalos cuando el centro ya esté claro.',
	'Si te falta alguien, tacha casillas imposibles por fila y columna: el hueco que queda suele ser obvio.',
];

export const windowCells: Partial<Record<CellKey, WindowEdge>> = {
	'7-6': 'bottom',
	'1-7': 'right',
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
