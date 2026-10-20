import {
	findPlacement,
	getPreVictimError as sharedGetPreVictimError,
	hasUniqueRowsAndColumns,
	isBesideFurniture,
	matchesFullSolution,
	placementEntries,
	victimRoomIsValid,
	type Placements,
} from '@/puzzles/shared/murdoku';
import { KAI_ID } from './constants';
import { furnitureCells, roomMatrix, suspects } from './data';
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
	if (!matchesFullSolution(placements, suspects, SOLUTION)) return false;

	const carla = findPlacement(placements, 2);
	if (!carla || !isBesideFurniture(carla, 'cuna', furnitureCells, roomMatrix))
		return false;

	const tania = findPlacement(placements, 8);
	if (!tania || furnitureCells[tania]?.kind !== 'sofá') return false;

	const isabel = findPlacement(placements, 6);
	if (!isabel || furnitureCells[isabel]?.kind !== 'hamaca') return false;

	return true;
};
