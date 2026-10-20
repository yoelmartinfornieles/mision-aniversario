import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PUZZLES } from '@/puzzles/catalog';
import { PUZZLE_ORDER, type PuzzleId } from '@/puzzles/types';
import { PROGRESS_STORAGE_KEY } from './constants';
import { ProgressService } from './progressService';

const memoryStore = new Map<string, string>();

const installLocalStorageMock = () => {
	memoryStore.clear();
	vi.stubGlobal('localStorage', {
		getItem: (key: string) => memoryStore.get(key) ?? null,
		setItem: (key: string, value: string) => {
			memoryStore.set(key, value);
		},
		removeItem: (key: string) => {
			memoryStore.delete(key);
		},
		clear: () => {
			memoryStore.clear();
		},
	});
};

describe('ProgressService', () => {
	beforeEach(() => {
		installLocalStorageMock();
	});

	it('starts with an empty progress and unlocks only the first puzzle', () => {
		const progress = ProgressService.getProgress();
		expect(progress.completedPuzzles).toEqual([]);

		expect(ProgressService.isPuzzleUnlocked(PUZZLE_ORDER[0])).toBe(true);
		for (const id of PUZZLE_ORDER.slice(1)) {
			expect(ProgressService.isPuzzleUnlocked(id)).toBe(false);
		}
	});

	it('completePuzzle marks that puzzle and all earlier ones completed', () => {
		const third = PUZZLE_ORDER[2];
		const next = ProgressService.completePuzzle(third);

		expect(next.completedPuzzles).toEqual(PUZZLE_ORDER.slice(0, 3));
		expect(next.lastPlayedPuzzle).toBe(third);
		expect(typeof next.lastPlayedAt).toBe('number');

		expect(ProgressService.isPuzzleCompleted(PUZZLE_ORDER[0])).toBe(true);
		expect(ProgressService.isPuzzleCompleted(PUZZLE_ORDER[1])).toBe(true);
		expect(ProgressService.isPuzzleCompleted(third)).toBe(true);
		if (PUZZLE_ORDER[3]) {
			expect(ProgressService.isPuzzleCompleted(PUZZLE_ORDER[3])).toBe(false);
		}
	});

	it('unlocks the next puzzle only after the previous one is completed', () => {
		const first = PUZZLE_ORDER[0];
		const second = PUZZLE_ORDER[1];
		const third = PUZZLE_ORDER[2];

		expect(ProgressService.isPuzzleUnlocked(second)).toBe(false);
		ProgressService.completePuzzle(first);
		expect(ProgressService.isPuzzleUnlocked(second)).toBe(true);
		expect(ProgressService.isPuzzleUnlocked(third)).toBe(false);

		ProgressService.completePuzzle(second);
		expect(ProgressService.isPuzzleUnlocked(third)).toBe(true);
	});

	it('redeemContinueCode restores progress through the matching puzzle', () => {
		const puzzle = PUZZLES[2];
		const redeemed = ProgressService.redeemContinueCode(`  ${puzzle.code.toLowerCase()}  `);

		expect(redeemed).toBe(puzzle.id);
		expect(ProgressService.getProgress().completedPuzzles).toEqual(
			PUZZLE_ORDER.slice(0, 3)
		);
		expect(ProgressService.isPuzzleUnlocked(PUZZLE_ORDER[3] as PuzzleId)).toBe(
			true
		);
	});

	it('redeemContinueCode returns null for unknown codes', () => {
		expect(ProgressService.redeemContinueCode('NOEXISTE')).toBeNull();
		expect(ProgressService.getProgress().completedPuzzles).toEqual([]);
	});

	it('resetProgress clears stored completion', () => {
		ProgressService.completePuzzle(PUZZLE_ORDER[1]);
		expect(ProgressService.getProgress().completedPuzzles.length).toBeGreaterThan(
			0
		);

		ProgressService.resetProgress();
		expect(ProgressService.getProgress()).toEqual({ completedPuzzles: [] });
		expect(memoryStore.get(PROGRESS_STORAGE_KEY)).toBe(
			JSON.stringify({ completedPuzzles: [] })
		);
	});

	it('getContinueCode returns the catalog code for a puzzle', () => {
		const puzzle = PUZZLES[0];
		expect(ProgressService.getContinueCode(puzzle.id)).toBe(puzzle.code);
	});
});
