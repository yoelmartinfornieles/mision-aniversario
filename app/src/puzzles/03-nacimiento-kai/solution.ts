import type { CellKey } from './types';

/**
 * Unique Murdoku solution (10×10, one per row & column).
 * Habitación grande: solo Kai + Carla.
 */
export const SOLUTION: Record<number, CellKey> = {
	9: '0-5', // AbuPepe — WC, junto al lavabo
	5: '1-8', // Berta — Entrada, junto al perchero
	7: '2-1', // Asun y Luis — Cocina, entre nevera y fregadera
	3: '3-6', // Kai — Habitación grande
	2: '4-8', // Carla — Habitación grande, junto a la cuna
	8: '5-2', // Tania y Luis — Salón, sentados en el sofá
	10: '6-3', // Juani y Luca — Salón, junto a la tele
	4: '7-0', // Eloy e Isa — Salón, más al oeste y al sur
	1: '8-9', // Yoel — Balcón, ventana
	6: '9-4', // Isabel y Paco — Balcón, en la hamaca
};
