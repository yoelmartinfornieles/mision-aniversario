import type { CellKey } from './types';

/**
 * Unique Murdoku solution (9×9, one per row & column).
 * Alfombras: Emilio 4-2, Raquel 5-5.
 * Ventanas: Maria 0-7, Inma 7-0, Yoel 8-6.
 */
export const SOLUTION: Record<number, CellKey> = {
	2: '0-7', // Maria y Charly — Sótano, ventana norte
	6: '1-1', // Lourdes y David — Cocina, taburete
	7: '2-3', // Jose y Ramon — Sótano, entre dos estanterías
	5: '3-8', // Presi y el Capi — Sótano, esquina, sin estantería
	1: '4-2', // Emilio y Rafa — Bar, alfombra
	8: '5-5', // Raquel y Jesús — Almacén, alfombra
	4: '6-4', // Carla — Comedor, a solas con Yoel
	3: '7-0', // Inma y la Peque — Bar, ventana
	9: '8-6', // Yoel — Comedor, ventana
};
