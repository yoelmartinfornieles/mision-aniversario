import type { Axial, PieceDef, PieceId, Placement } from './types';

export const PIECES: PieceDef[] = [
	{
		id: 'bano',
		label: 'Baño',
		hint: 'Suelo de parqué!',
		color: '#9eb8b0',
		base: [
			[0, 1],
			[1, 0],
			[1, 1],
			[1, 2],
		],
		locked: false,
	},
	{
		id: 'salon',
		label: 'Salón',
		hint: 'El corazón de la casa',
		color: '#d4c9b8',
		base: [
			[0, 2],
			[1, 2],
			[2, 0],
			[2, 1],
			[2, 2],
		],
		locked: false,
	},
	{
		id: 'invitados',
		label: 'Habitación de invitados',
		hint: 'Sería la de Kai y no lo sabiamos!',
		color: '#c9b8d4',
		base: [
			[0, 1],
			[0, 2],
			[0, 3],
			[0, 4],
			[1, 0],
		],
		locked: false,
	},
	{
		id: 'dormitorio',
		label: 'Dormitorio',
		hint: 'Con un pedazo de armario!',
		color: '#b8b0d4',
		base: [
			[0, 1],
			[1, 0],
			[2, 0],
			[2, 1],
			[2, 2],
		],
		locked: false,
	},
	{
		id: 'cocina',
		label: 'Cocina',
		hint: 'Donde se improvisaban cenas',
		color: '#e2b4a8',
		base: [
			[0, 0],
			[1, 0],
			[1, 1],
			[2, 0],
			[2, 1],
		],
		locked: false,
	},
	{
		id: 'terraza',
		label: 'Terraza',
		hint: 'Sol de Mallorca',
		color: '#e0d090',
		base: [
			[0, 0],
			[0, 1],
			[0, 2],
			[1, 2],
		],
		locked: true,
	},
	{
		id: 'entrada',
		label: 'Habitación de la entrada',
		hint: 'Futuro despacho',
		color: '#cfc6b6',
		base: [
			[0, 1],
			[0, 2],
			[1, 0],
			[1, 2],
		],
		locked: true,
	},
	{
		id: 'lavadero',
		label: 'Lavadero',
		hint: 'Conseguiste ordenarlo todo',
		color: '#b8d1c8',
		base: [
			[0, 1],
			[1, 1],
			[1, 2],
			[2, 1],
			[3, 0],
		],
		locked: false,
	},
];

export const PIECE_BY_ID: Record<PieceId, PieceDef> = Object.fromEntries(
	PIECES.map((piece) => [piece.id, piece])
) as Record<PieceId, PieceDef>;

/** Pre-placed ruins Carla left standing. */
export const FIXED_PLACEMENTS: Placement[] = [
	{
		pieceId: 'entrada',
		face: 0,
		rot: 0,
		cells: [
			[0, -2],
			[0, -1],
			[1, -3],
			[1, -1],
		],
	},
	{
		pieceId: 'terraza',
		face: 0,
		rot: 0,
		cells: [
			[-3, 1],
			[-3, 2],
			[-3, 3],
			[-2, 3],
		],
	},
];

/** Unique solution for the hard challenge. */
export const SOLUTION_CELLS: Record<PieceId, Axial[]> = {
	bano: [
		[-3, 0],
		[-2, -1],
		[-2, 0],
		[-2, 1],
	],
	salon: [
		[0, 0],
		[1, 0],
		[2, -2],
		[2, -1],
		[2, 0],
	],
	invitados: [
		[-1, -2],
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -3],
	],
	dormitorio: [
		[1, -2],
		[2, -3],
		[3, -3],
		[3, -2],
		[3, -1],
	],
	cocina: [
		[-2, 2],
		[-1, 2],
		[-1, 3],
		[0, 2],
		[0, 3],
	],
	terraza: [
		[-3, 1],
		[-3, 2],
		[-3, 3],
		[-2, 3],
	],
	entrada: [
		[0, -2],
		[0, -1],
		[1, -3],
		[1, -1],
	],
	lavadero: [
		[0, 1],
		[1, 1],
		[1, 2],
		[2, 1],
		[3, 0],
	],
};

export const FREE_PIECE_IDS = PIECES.filter((p) => !p.locked).map((p) => p.id);

export const HINTS = [
	'La Entrada y la Terraza ya están fijas (puntos): úsalas como anclas y no las muevas.',
	'Empieza por el Baño: es la pieza más pequeña (4 celdas) y encaja junto a la Terraza, al noroeste del plano.',
	'La Cocina (5 celdas, tono terracota) abraza el borde de la Terraza por el sureste — si la Terraza queda “aislada”, reorienta.',
	'El Dormitorio se apoya en el flanco este, pegado a la Entrada; prueba rotar hasta que no deje huecos raros.',
	'Cuando Baño, Cocina y Dormitorio estén bien, Salón, Invitados y Lavadero solo tienen un hueco cada uno.',
];
