import type { CellKey } from './types';

/**
 * Unique Murdoku solution (9×9, one per row & column).
 * All cells below are free of furniture blockers.
 * Barra on C6–C9 (cells 5-2…8-2) forces Emilio north of it and Yoel east.
 */
export const SOLUTION: Record<number, CellKey> = {
	6: '0-1', // Lourdes y David — Cocina, on taburete beside fregadera
	7: '1-3', // Jose y Ramon — Sótano, between shelves, northernmost there
	2: '2-7', // Maria y Charly — Sótano, east of Jose y Ramon
	5: '3-8', // Presi y el Capi — Sótano, easternmost there
	1: '4-2', // Emilio y Rafa — only men in the Bar, beside barra (C6)
	8: '5-5', // Raquel y Jesús — alone together in Almacén
	4: '6-4', // Carla — Comedor, touches Almacén
	3: '7-0', // Inma y la Peque — Bar, south and west of Emilio
	9: '8-6', // Yoel — Comedor, south of Carla, clear of furniture
};
