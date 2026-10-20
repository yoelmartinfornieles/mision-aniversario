import { getPuzzleMeta, PUZZLES } from '@/puzzles/catalog';
import { getPuzzleIndex, PUZZLE_ORDER, type PuzzleId } from '@/puzzles/types';
import { PROGRESS_STORAGE_KEY } from './constants';
import type { Progress } from './types';

const normalizeCode = (code: string) => code.trim().toUpperCase();

const emptyProgress = (): Progress => ({ completedPuzzles: [] });

export const ProgressService = {
	getProgress(): Progress {
		try {
			const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
			if (!stored) return emptyProgress();

			const parsed = JSON.parse(stored) as Progress;
			return {
				completedPuzzles: Array.isArray(parsed.completedPuzzles)
					? parsed.completedPuzzles.filter((id): id is PuzzleId =>
							PUZZLE_ORDER.includes(id)
						)
					: [],
				lastPlayedPuzzle: parsed.lastPlayedPuzzle,
				lastPlayedAt: parsed.lastPlayedAt,
			};
		} catch {
			return emptyProgress();
		}
	},

	saveProgress(progress: Progress): void {
		try {
			localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
		} catch (error) {
			console.error('Error saving progress:', error);
		}
	},

	isPuzzleCompleted(puzzleId: PuzzleId): boolean {
		return this.getProgress().completedPuzzles.includes(puzzleId);
	},

	isPuzzleUnlocked(puzzleId: PuzzleId): boolean {
		const index = getPuzzleIndex(puzzleId);
		if (index <= 0) return true;
		return this.isPuzzleCompleted(PUZZLE_ORDER[index - 1]);
	},

	getContinueCode(puzzleId: PuzzleId): string {
		return getPuzzleMeta(puzzleId).code;
	},

	completePuzzle(puzzleId: PuzzleId): Progress {
		const index = getPuzzleIndex(puzzleId);
		const progress = this.getProgress();
		const completed = new Set(progress.completedPuzzles);

		for (let i = 0; i <= index; i += 1) {
			completed.add(PUZZLE_ORDER[i]);
		}

		const next: Progress = {
			completedPuzzles: PUZZLE_ORDER.filter((id) => completed.has(id)),
			lastPlayedPuzzle: puzzleId,
			lastPlayedAt: Date.now(),
		};
		this.saveProgress(next);
		return next;
	},

	/**
	 * Password-style continue: a code restores progress through that puzzle.
	 */
	redeemContinueCode(rawCode: string): PuzzleId | null {
		const code = normalizeCode(rawCode);
		const match = PUZZLES.find((puzzle) => puzzle.code === code);
		if (!match) return null;
		this.completePuzzle(match.id);
		return match.id;
	},

	resetProgress(): void {
		this.saveProgress(emptyProgress());
	},
};
