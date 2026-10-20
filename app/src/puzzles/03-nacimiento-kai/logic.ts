import {
	findPlacement,
	getPreVictimError as sharedGetPreVictimError,
	hasUniqueRowsAndColumns,
	matchesFullSolution,
	placementEntries,
	victimRoomIsValid,
	type Placements,
} from '@/puzzles/shared/murdoku';
import { KAI_ID } from './constants';
import { roomMatrix, suspects } from './data';
import { SOLUTION } from './solution';

export { findPlacement, hasUniqueRowsAndColumns };

export const getPreKaiError = (placements: Placements): string | null =>
	sharedGetPreVictimError({
		placements,
		victimId: KAI_ID,
		suspects,
		solution: SOLUTION,
	});

export const isBoardSolved = (placements: Placements): boolean => {
	if (placementEntries(placements).length !== suspects.length) return false;
	if (!hasUniqueRowsAndColumns(placements)) return false;
	if (!victimRoomIsValid(placements, KAI_ID, roomMatrix)) return false;
	return matchesFullSolution(placements, suspects, SOLUTION);
};
