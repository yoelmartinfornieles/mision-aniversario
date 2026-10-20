import type { CellKey } from './types';

/**
 * Unique Murdoku solution (10×10, one per row & column).
 * Forzada solo por pistas + fila/columna + víctima a solas en su sala.
 * Habitación grande: solo Kai + Carla.
 */
export const SOLUTION: Record<number, CellKey> = {
	9: '0-5', // AbuPepe — WC, junto al lavabo
	5: '1-6', // Berta — Entrada, ventana
	7: '2-1', // Asun y Luis — Cocina, entre nevera y fregadera
	3: '3-7', // Kai — Habitación grande
	2: '4-8', // Carla — Habitación grande, alfombra junto a la cuna
	8: '5-2', // Tania y Luis — Salón, sentados en el sofá
	10: '6-3', // Juani y Luca — Salón, alfombra
	4: '7-0', // Eloy e Isa — Salón, ventana
	1: '8-9', // Yoel — Balcón, ventana
	6: '9-4', // Isabel y Paco — Balcón, en el banco
};
