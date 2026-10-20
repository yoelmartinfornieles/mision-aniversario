import {
	findPlacement,
	getPreVictimError as sharedGetPreVictimError,
	getRoomForPosition,
	hasUniqueRowsAndColumns,
	isBesideFurniture,
	matchesFullSolution,
	placementEntries,
	victimRoomIsValid,
	type Placements,
} from '@/puzzles/shared/murdoku';
import { CARLA_ID, GEORGE_ID, KAI_ID } from './constants';
import { furnitureCells, roomMatrix, suspects } from './data';
import { SOLUTION } from './solution';

export { findPlacement, hasUniqueRowsAndColumns };

export const getPreCarlaError = (placements: Placements): string | null =>
	sharedGetPreVictimError({
		placements,
		victimId: CARLA_ID,
		suspects,
		solution: SOLUTION,
		clueMismatchMessage: 'Alguna pista de los implicados aún no cuadra',
	});

export const isBoardSolved = (placements: Placements): boolean => {
	if (placementEntries(placements).length !== suspects.length) return false;
	if (!hasUniqueRowsAndColumns(placements)) return false;
	if (!victimRoomIsValid(placements, CARLA_ID, roomMatrix)) return false;
	if (!matchesFullSolution(placements, suspects, SOLUTION)) return false;

	const kai = findPlacement(placements, KAI_ID);
	if (!kai || !isBesideFurniture(kai, 'seto', furnitureCells, roomMatrix))
		return false;

	const saioa = findPlacement(placements, 5);
	if (!saioa || furnitureCells[saioa]?.kind !== 'banqueta') return false;

	const george = findPlacement(placements, GEORGE_ID);
	if (
		!george ||
		!isBesideFurniture(george, 'tronco', furnitureCells, roomMatrix)
	) {
		return false;
	}

	const carla = findPlacement(placements, CARLA_ID);
	const kaiCell = findPlacement(placements, KAI_ID);
	if (!carla || !kaiCell) return false;
	if (getRoomForPosition(carla, roomMatrix) !== getRoomForPosition(kaiCell, roomMatrix))
		return false;

	return true;
};
