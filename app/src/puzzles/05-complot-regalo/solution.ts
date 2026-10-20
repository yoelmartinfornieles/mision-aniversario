import type { CellKey } from './types';

/**
 * Unique Murdoku solution (8×8, one per row & column).
 * Castillo: solo Carla + Kai (quien eligió el regalo).
 * Selva: solo George.
 */
export const SOLUTION: Record<number, CellKey> = {
	1: '0-0', // Yoel — Avenida, farola
	2: '2-3', // Kai — Castillo (eligió el regalo)
	3: '6-2', // Luar — Espacio, cohete
	4: '1-7', // Haizea — Avenida, carro
	5: '5-5', // Saioa — Plaza, sentada en banqueta (este de fuente)
	6: '7-6', // Unai — Muelle, barco
	7: '4-1', // George — Selva, tronco
	8: '3-4', // Carla — Castillo (al final)
};
