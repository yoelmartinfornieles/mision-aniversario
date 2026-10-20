import type { PuzzleId, PuzzleMeta } from './types';

export const PUZZLES: PuzzleMeta[] = [
	{
		id: 'puzzle01-started-todo',
		number: 1,
		label: 'Cuando todo comenzó',
		teaser: 'Un bar, un sótano secreto y la primera pista.',
		code: 'ELBARDELBASKO',
	},
	{
		id: 'puzzle02-first-house',
		number: 2,
		label: 'La primera casa',
		teaser: 'Carla tiró abajo la casa… para construir un hogar.',
		code: 'MALLORCA',
	},
	{
		id: 'puzzle03-kai-born',
		number: 3,
		label: 'Nacimiento de Kai',
		teaser: 'La pieza que lo cambió todo.',
		code: 'KAIMAN',
	},
	{
		id: 'puzzle04-arroa-move',
		number: 4,
		label: 'Mudanza a Arroa',
		teaser: 'Un nuevo comienzo lleno de retos.',
		code: 'ARROABEHEA',
	},
	{
		id: 'puzzle05-gift-plot',
		number: 5,
		label: 'El complot del regalo',
		teaser: '¿Quién eligió el regalo de aniversario?',
		code: 'COMPLOTREGALO',
	},
];

export const getPuzzleMeta = (id: PuzzleId): PuzzleMeta => {
	const puzzle = PUZZLES.find((entry) => entry.id === id);
	if (!puzzle) throw new Error(`Unknown puzzle: ${id}`);
	return puzzle;
};
