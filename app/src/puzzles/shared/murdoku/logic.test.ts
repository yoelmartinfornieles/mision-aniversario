import { describe, expect, it } from 'vitest';
import {
	hasUniqueRowsAndColumns,
	matchesFullSolution,
	matchesSolutionExceptVictim,
} from './logic';
import { toCellKey, type Placements } from './types';

describe('hasUniqueRowsAndColumns', () => {
	it('accepts placements with distinct rows and columns', () => {
		const placements: Placements = {
			[toCellKey(0, 0)]: 1,
			[toCellKey(1, 2)]: 2,
			[toCellKey(2, 1)]: 3,
		};
		expect(hasUniqueRowsAndColumns(placements)).toBe(true);
	});

	it('rejects two people in the same row', () => {
		const placements: Placements = {
			[toCellKey(0, 0)]: 1,
			[toCellKey(0, 2)]: 2,
		};
		expect(hasUniqueRowsAndColumns(placements)).toBe(false);
	});

	it('rejects two people in the same column', () => {
		const placements: Placements = {
			[toCellKey(0, 1)]: 1,
			[toCellKey(2, 1)]: 2,
		};
		expect(hasUniqueRowsAndColumns(placements)).toBe(false);
	});

	it('accepts an empty board', () => {
		expect(hasUniqueRowsAndColumns({})).toBe(true);
	});
});

describe('matchesFullSolution', () => {
	const suspects = [{ id: 1 }, { id: 2 }, { id: 3 }];
	const solution = {
		1: toCellKey(0, 0),
		2: toCellKey(1, 1),
		3: toCellKey(2, 2),
	};

	it('returns true when every suspect is on their solution cell', () => {
		const placements: Placements = {
			[toCellKey(0, 0)]: 1,
			[toCellKey(1, 1)]: 2,
			[toCellKey(2, 2)]: 3,
		};
		expect(matchesFullSolution(placements, suspects, solution)).toBe(true);
	});

	it('returns false when a suspect is missing or misplaced', () => {
		const missing: Placements = {
			[toCellKey(0, 0)]: 1,
			[toCellKey(1, 1)]: 2,
		};
		expect(matchesFullSolution(missing, suspects, solution)).toBe(false);

		const wrong: Placements = {
			[toCellKey(0, 0)]: 1,
			[toCellKey(1, 0)]: 2,
			[toCellKey(2, 2)]: 3,
		};
		expect(matchesFullSolution(wrong, suspects, solution)).toBe(false);
	});
});

describe('matchesSolutionExceptVictim', () => {
	const suspects = [{ id: 1 }, { id: 2 }, { id: 9 }];
	const solution = {
		1: toCellKey(0, 0),
		2: toCellKey(1, 1),
		9: toCellKey(2, 2),
	};

	it('ignores the victim placement', () => {
		const placements: Placements = {
			[toCellKey(0, 0)]: 1,
			[toCellKey(1, 1)]: 2,
			[toCellKey(0, 2)]: 9,
		};
		expect(
			matchesSolutionExceptVictim(placements, 9, suspects, solution)
		).toBe(true);
	});
});
