import { useMurdokuPuzzle } from '@/puzzles/shared/murdoku';
import {
	BOARD_COLUMNS,
	BOARD_ROWS,
	KAI_ID,
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
import { getPreKaiError, isBoardSolved } from './logic';

export const usePuzzle03 = () =>
	useMurdokuPuzzle({
		puzzleId: PUZZLE_ID,
		victimId: KAI_ID,
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
			'Una por fila y columna. Lee las pistas; Kai al final, a solas con alguien.',
		solvedStatus:
			'Archivo: Kai estaba en la Habitación grande, a solas con Carla.',
		getPreVictimError: getPreKaiError,
		isBoardSolved,
		victimWaitPrompt:
			'Coloca al resto según sus pistas antes de situar a Kai',
		victimCorrectedPrompt: 'Corregido — vuelve a colocar a Kai al final',
	});
