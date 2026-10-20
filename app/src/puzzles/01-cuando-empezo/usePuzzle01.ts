import { useMurdokuPuzzle } from '@/puzzles/shared/murdoku';
import {
	BOARD_COLUMNS,
	BOARD_ROWS,
	CARLA_ID,
	PUZZLE_ID,
} from './constants';
import {
	furnitureCells,
	getRoomClass,
	HINTS,
	ROOM_ORDER,
	roomMatrix,
	suspects,
	windowCells,
} from './data';
import { getPreVictimError, isBoardSolved } from './logic';

export const usePuzzle01 = () =>
	useMurdokuPuzzle({
		puzzleId: PUZZLE_ID,
		victimId: CARLA_ID,
		boardRows: BOARD_ROWS,
		boardColumns: BOARD_COLUMNS,
		suspects,
		roomMatrix,
		furnitureCells,
		windowCells,
		roomOrder: ROOM_ORDER,
		getRoomClass,
		hints: HINTS,
		initialStatus:
			'Una por fila y columna. Lee las pistas; Carla al final, con quien hablaba.',
		solvedStatus:
			'¡Resuelto! Carla hablaba con Yoel, a solas junto al Almacén.',
		getPreVictimError,
		isBoardSolved,
		victimWaitPrompt:
			'coloca al resto según sus pistas antes de situar a Carla',
		victimCorrectedPrompt:
			'corregido — vuelve a colocar a Carla al final',
	});
