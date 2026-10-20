import type { PuzzleId, PuzzleMeta } from './types';

export const PUZZLES: PuzzleMeta[] = [
	{
		id: 'puzzle01-started-todo',
		number: 1,
		label: 'Cuando todo comenzó',
		teaser:
			'Barceloneta. Cerveza barata. Una despampanante argentina… y alguien que no debería estar ahí.',
		code: 'ELBARDELBASKO',
	},
	{
		id: 'puzzle02-first-house',
		number: 2,
		label: 'La primera casa',
		teaser:
			'Mallorca. Una casa en ruinas. Ella derribó paredes; el expediente no dice por qué.',
		code: 'MALLORCA',
	},
	{
		id: 'puzzle03-kai-born',
		number: 3,
		label: 'Nacimiento de Kai',
		teaser:
			'Hondarribia. Un piso demasiado perfecto. Tanta gente en casa que costaba seguir al pequeño. ¿Dónde estaba Kai?',
		code: 'KAIMAN',
	},
	{
		id: 'puzzle04-arroa-move',
		number: 4,
		label: 'Mudanza a Arroa',
		teaser:
			'Un clima aterrador, un idioma que aún no entiendes, vecinos que te miran. El paisaje no confesará hasta que retires las fichas.',
		code: 'ARROABEHEA',
	},
	{
		id: 'puzzle05-gift-plot',
		number: 5,
		label: 'El complot del regalo',
		teaser:
			'Último dossier sellado. Demasiados sospechosos. Solo uno eligió el regalo.',
		code: '13NOVIEMBRE',
	},
];

export const getPuzzleMeta = (id: PuzzleId): PuzzleMeta => {
	const puzzle = PUZZLES.find((entry) => entry.id === id);
	if (!puzzle) throw new Error(`Unknown puzzle: ${id}`);
	return puzzle;
};
