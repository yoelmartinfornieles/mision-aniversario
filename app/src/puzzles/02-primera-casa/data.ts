import type { Axial, PieceDef, PieceId, Placement } from './types';

export const PIECES: PieceDef[] = [
	{
		id: 'bano',
		label: 'Baño',
		hint: 'El WC de Hannibal Lecter',
		color: '#91aaa4',
		base: [
			[0, 0],
			[0, 1],
			[1, 0],
			[2, 0],
		],
		locked: false,
	},
	{
		id: 'salon',
		label: 'Salón',
		hint: 'El corazón del expediente',
		color: '#c6a16d',
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
		hint: 'Sería la de Kai… y aún no lo sabíamos',
		color: '#b6b19a',
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
		hint: '¡Con un pedazo de armario!',
		color: '#b88e7e',
		base: [
			[0, 1],
			[0, 2],
			[1, 2],
			[2, 1],
			[3, 0],
		],
		locked: false,
	},
	{
		id: 'cocina',
		label: 'Cocina',
		hint: 'Cenas improvisadas, pruebas a fuego',
		color: '#c68770',
		base: [
			[0, 3],
			[1, 1],
			[1, 2],
			[2, 0],
			[2, 1],
		],
		locked: false,
	},
	{
		id: 'terraza',
		label: 'Terraza',
		hint: 'Un respiro entre cuatro paredes',
		color: '#c5a05d',
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
		hint: 'Futuro despacho; por ahora, umbral',
		color: '#c8bea8',
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
		hint: 'Aquí sí conseguiste ordenarlo todo',
		color: '#a8b5b8',
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

export const SOLUTION_POSES: Record<
	PieceId,
	Pick<Placement, 'face' | 'rot'>
> = {
	bano: { face: 0, rot: 1 },
	salon: { face: 0, rot: 0 },
	invitados: { face: 0, rot: 0 },
	dormitorio: { face: 1, rot: 1 },
	cocina: { face: 1, rot: 0 },
	terraza: { face: 0, rot: 0 },
	entrada: { face: 0, rot: 0 },
	lavadero: { face: 0, rot: 0 },
};

export const FREE_PIECE_IDS = PIECES.filter((p) => !p.locked).map((p) => p.id);

export const HINTS = [
	'La Entrada y la Terraza son las piezas fijas: no las muevas. Para colocar una estancia, elige su pieza y pulsa su casilla de ancla, la más alta de la columna más a la izquierda de su silueta. Las columnas se cuentan desde la izquierda; las filas, desde arriba dentro de cada columna.',
	'Baño: pulsa Rotar una vez (60°) y ponlo con el ancla en la columna 1, fila 1.',
	'Cocina: pulsa Voltear una vez para usar la cara B y ponla con el ancla en la columna 2, fila 4.',
	'Habitación de invitados: cara A y 0°. Ancla en la columna 3, fila 1.',
	'Dormitorio: pulsa Voltear una vez y Rotar una vez (60°). Ancla en la columna 5, fila 2.',
	'Ya casi está. Salón: cara A y 0°, ancla en la columna 4, fila 4. Lavadero: cara A y 0°, ancla justo debajo, en la columna 4, fila 5.',
];
