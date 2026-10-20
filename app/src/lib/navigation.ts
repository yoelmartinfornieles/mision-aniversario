import type { PuzzleId } from '@/puzzles/types';

export const HOME_HASH = '';
export const FINALE_HASH = 'finale';

export type AppRoute =
	| { kind: 'home' }
	| { kind: 'finale' }
	| { kind: 'puzzle'; puzzleId: PuzzleId };

export const readRouteFromHash = (
	hash: string,
	isValid: (value: string) => value is PuzzleId
): AppRoute => {
	const value = hash.replace(/^#/, '');
	if (!value) return { kind: 'home' };
	if (value === FINALE_HASH) return { kind: 'finale' };
	if (isValid(value)) return { kind: 'puzzle', puzzleId: value };
	return { kind: 'home' };
};

export const goHome = (): void => {
	window.location.hash = HOME_HASH;
};

export const goToFinale = (): void => {
	window.location.hash = FINALE_HASH;
};

export const goToPuzzle = (puzzleId: PuzzleId): void => {
	window.location.hash = puzzleId;
};
