import { lazy, type ComponentType } from 'react';
import type { PuzzleId } from '@/puzzles/types';

export const PUZZLE_SCREENS: Record<PuzzleId, ComponentType> = {
	'puzzle01-started-todo': lazy(() =>
		import('@/puzzles/01-cuando-empezo').then((m) => ({
			default: m.Puzzle01Screen,
		})),
	),
	'puzzle02-first-house': lazy(() =>
		import('@/puzzles/02-primera-casa').then((m) => ({
			default: m.Puzzle02Screen,
		})),
	),
	'puzzle03-kai-born': lazy(() =>
		import('@/puzzles/03-nacimiento-kai').then((m) => ({
			default: m.Puzzle03Screen,
		})),
	),
	'puzzle04-arroa-move': lazy(() =>
		import('@/puzzles/04-mudanza-arroa').then((m) => ({
			default: m.Puzzle04Screen,
		})),
	),
	'puzzle05-gift-plot': lazy(() =>
		import('@/puzzles/05-complot-regalo').then((m) => ({
			default: m.Puzzle05Screen,
		})),
	),
};
