import type { CellKey } from './types';

/**
 * Unique Murdoku solution (8×8, one per row & column).
 * Forzada solo por pistas + fila/columna + víctima a solas en su sala.
 * Castillo: Carla + Yoel (quien eligió el regalo). Selva: solo George.
 */
export const SOLUTION: Record<number, CellKey> = {
	1: '2-3', // Yoel — carro+castillo, no esquina
	2: '0-0', // Kai — carro de chuches al norte de Haizea
	3: '6-2', // Luar — Espacio, ventana entre dos farolas
	4: '1-7', // Haizea — Avenida, ventana
	5: '5-5', // Saioa — carrusel
	6: '7-6', // Unai — Muelle, ventana junto a barco
	7: '4-1', // George — Selva, junto a la montaña rusa
	8: '3-4', // Carla — Castillo (al final)
};
