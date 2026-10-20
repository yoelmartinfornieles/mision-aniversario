import type { GridPos, TileFace, TileFaceId } from './types';

/** 16 faces × 4 copies = 64 tiles — medium board. */
export const TILE_FACES: TileFace[] = [
	{ id: 'monte', label: 'Monte', tone: '#476044' },
	{ id: 'mar', label: 'Mar', tone: '#42566a' },
	{ id: 'hogar', label: 'Hogar', tone: '#6a4a28' },
	{ id: 'camino', label: 'Camino', tone: '#6e5632' },
	{ id: 'lluvia', label: 'Lluvia', tone: '#4a5e6e' },
	{ id: 'sol', label: 'Sol', tone: '#9a6e28' },
	{ id: 'coche', label: 'Coche', tone: '#5c584e' },
	{ id: 'rio', label: 'Río', tone: '#3a5a6e' },
	{ id: 'puente', label: 'Puente', tone: '#5a4838' },
	{ id: 'cambios', label: 'Cambios', tone: '#8b3a2a' },
	{ id: 'euskera', label: 'Euskera', tone: '#3d5a4a' },
	{ id: 'amigos', label: 'Amigos', tone: '#5a3a28' },
	{ id: 'miedos', label: 'Miedos', tone: '#5a3a4a' },
	{ id: 'roble', label: 'Roble', tone: '#2f4a2e' },
	{ id: 'ola', label: 'Ola', tone: '#2f4a5e' },
	{ id: 'familia', label: 'Familia', tone: '#a43d32' },
];

export const FACE_BY_ID: Record<TileFaceId, TileFace> = Object.fromEntries(
	TILE_FACES.map((face) => [face.id, face])
) as Record<TileFaceId, TileFace>;

/**
 * Medium “turtle-lite”: base 36 + mid 18 + upper 8 + peak 2 = 64.
 * Classic adjacency on integer grid (x, y) with layers (z).
 */
export const LAYOUT: GridPos[] = (() => {
	const positions: GridPos[] = [];

	for (let y = 0; y <= 4; y += 1) {
		for (let x = 0; x <= 7; x += 1) {
			const isCorner =
				(x === 0 || x === 7) && (y === 0 || y === 4);
			if (isCorner) continue;
			positions.push({ x, y, z: 0 });
		}
	}

	for (let y = 1; y <= 3; y += 1) {
		for (let x = 1; x <= 6; x += 1) {
			positions.push({ x, y, z: 1 });
		}
	}

	for (let y = 1; y <= 2; y += 1) {
		for (let x = 2; x <= 5; x += 1) {
			positions.push({ x, y, z: 2 });
		}
	}

	positions.push({ x: 3, y: 2, z: 3 });
	positions.push({ x: 4, y: 2, z: 3 });

	return positions;
})();

export const COPIES_PER_FACE = 4;

export const HINTS = [
	'Solo puedes tocar fichas libres: sin nada encima y con el lado izquierdo o derecho abierto.',
	'Empieza por la cima (las 2 del pico): suelen liberar el centro y abrir más parejas.',
	'Si ves dos iguales libres, emparéjalas ya — no “guardes” parejas obvias para después.',
	'Cuando te atasques, mira los bordes del tablero: ahí suele haber más fichas con un flanco libre.',
	'Si no queda ninguna pareja libre, deshaz el último movimiento: el tablero tiene solución sin adivinar.',
];
