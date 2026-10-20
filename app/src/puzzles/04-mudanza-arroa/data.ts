import type { GridPos, TileFace, TileFaceId } from './types';

/**
 * 16 faces × 4 copies = 64 tiles — medium board.
 */
export const TILE_FACES: TileFace[] = [
	{ id: 'boxes', label: 'Kutxak', tone: '#6a5438' },
	{ id: 'keys', label: 'Giltzak', tone: '#8a6a2e' },
	{ id: 'home', label: 'Etxea', tone: '#6a4a28' },
	{ id: 'path', label: 'Bidea', tone: '#6e5632' },
	{ id: 'table', label: 'Mahaia', tone: '#5a4030' },
	{ id: 'coffee', label: 'Kafea', tone: '#5c4030' },
	{ id: 'nest', label: 'Habia', tone: '#6a5030' },
	{ id: 'kai', label: 'Kai', tone: '#a43d32' },
	{ id: 'friends', label: 'Lagunak', tone: '#5a3a28' },
	{ id: 'toast', label: 'Topa', tone: '#7a4a38' },
	{ id: 'neighbors', label: 'Bizilagunak', tone: '#5a4838' },
	{ id: 'mountain', label: 'Mendia', tone: '#476044' },
	{ id: 'fog', label: 'Lainoa', tone: '#4a5e6e' },
	{ id: 'sea', label: 'Itsasoa', tone: '#3a5a6e' },
	{ id: 'bow', label: 'Lotura', tone: '#8b3a4a' },
	{ id: 'heart', label: 'Bihotza', tone: '#a43d42' },
];

export const FACE_BY_ID: Record<TileFaceId, TileFace> = Object.fromEntries(
	TILE_FACES.map((face) => [face.id, face])
) as Record<TileFaceId, TileFace>;

export const LAYOUT: GridPos[] = (() => {
	const positions: GridPos[] = [];

	for (let y = 0; y <= 4; y += 1) {
		for (let x = 0; x <= 7; x += 1) {
			const isCorner = (x === 0 || x === 7) && (y === 0 || y === 4);
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
	'¿Atascado? Pulsa Ayuda de rescate: marca dos fichas que permiten terminar el tablero, sin retirarlas. Si la posición ya no tiene salida, te dirá que deshagas o reinicies.',
	'Dos fichas con el mismo dibujo, las dos libres: nada encima y un lado abierto, el izquierdo o el derecho. Hueco solo arriba o abajo no basta.',
	'Las libres tienen el papel más claro; las bloqueadas, más gris. Toca una libre y busca su pareja. Si quieres soltarla, tócala otra vez.',
	'Las dos fichas de la cima no tienen por qué ser pareja entre sí. Busca sus dibujos también en los laterales. Si una pareja destapa fichas de abajo, suele abrir más opciones.',
	'Hay cuatro copias de cada dibujo. Si dudas entre varias parejas, mira qué quedaría libre al quitar cada una y elige la que destape más.',
	'El contador de «parejas libres» dice cuántas puedes quitar ahora. Si marca más de cero y no las ves, revisa los extremos y las capas superiores.',
	'Si el contador llega a cero y aún quedan fichas, estás en un callejón sin salida. Deshaz y prueba otra pareja; a veces hay que retroceder varios pasos.',
	'Reiniciar devuelve el mismo reparto y pone el reloj a cero. Ese reparto tiene solución: prueba otro orden. No hace falta reconocer la foto; aparece al retirar todas las fichas.',
];
