import {
	findPlacement,
	getPreVictimError as sharedGetPreVictimError,
	hasUniqueRowsAndColumns,
	isAdjacentToRoom,
	matchesFullSolution,
	placementEntries,
	victimRoomIsValid,
	type Placements,
} from '@/puzzles/shared/murdoku';
import { CARLA_ID } from './constants';
import { furnitureCells, roomMatrix, suspects } from './data';
import { SOLUTION } from './solution';

export { findPlacement, hasUniqueRowsAndColumns };

export const getPreVictimError = (placements: Placements): string | null =>
	sharedGetPreVictimError({
		placements,
		victimId: CARLA_ID,
		suspects,
		solution: SOLUTION,
	});

export const isBoardSolved = (placements: Placements): boolean => {
	if (placementEntries(placements).length !== suspects.length) return false;
	if (!hasUniqueRowsAndColumns(placements)) return false;
	if (!victimRoomIsValid(placements, CARLA_ID, roomMatrix)) return false;
	if (!matchesFullSolution(placements, suspects, SOLUTION)) return false;

	const carla = findPlacement(placements, CARLA_ID);
	if (!carla || !isAdjacentToRoom(carla, 'Almacén', roomMatrix)) return false;

	const lourdesDavid = findPlacement(placements, 6);
	if (!lourdesDavid || furnitureCells[lourdesDavid]?.kind !== 'taburete') {
		return false;
	}

	return true;
};
