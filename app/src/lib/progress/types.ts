import type { PuzzleId } from '@/puzzles/types';

export type Progress = {
	completedPuzzles: PuzzleId[];
	lastPlayedPuzzle?: PuzzleId;
	lastPlayedAt?: number;
};
