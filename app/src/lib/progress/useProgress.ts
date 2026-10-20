import { useCallback, useEffect, useState } from 'react';
import type { PuzzleId } from '@/puzzles/types';
import { PROGRESS_STORAGE_KEY } from './constants';
import { ProgressService } from './progressService';
import type { Progress } from './types';

export const useProgress = () => {
	const [progress, setProgress] = useState<Progress>(() =>
		ProgressService.getProgress()
	);

	const refresh = useCallback(() => {
		setProgress(ProgressService.getProgress());
	}, []);

	useEffect(() => {
		refresh();

		const onStorage = (event: StorageEvent) => {
			if (event.key === PROGRESS_STORAGE_KEY) refresh();
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	}, [refresh]);

	const completePuzzle = useCallback((puzzleId: PuzzleId) => {
		const next = ProgressService.completePuzzle(puzzleId);
		setProgress(next);
		return next;
	}, []);

	const redeemContinueCode = useCallback((code: string) => {
		const puzzleId = ProgressService.redeemContinueCode(code);
		if (puzzleId) setProgress(ProgressService.getProgress());
		return puzzleId;
	}, []);

	const resetProgress = useCallback(() => {
		ProgressService.resetProgress();
		setProgress(ProgressService.getProgress());
	}, []);

	return {
		progress,
		refresh,
		completePuzzle,
		redeemContinueCode,
		resetProgress,
		isPuzzleCompleted: (puzzleId: PuzzleId) =>
			ProgressService.isPuzzleCompleted(puzzleId),
		isPuzzleUnlocked: (puzzleId: PuzzleId) =>
			ProgressService.isPuzzleUnlocked(puzzleId),
		getContinueCode: (puzzleId: PuzzleId) =>
			ProgressService.getContinueCode(puzzleId),
	};
};
