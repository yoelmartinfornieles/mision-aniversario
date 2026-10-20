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
			'Una por fila y columna. Lee las pistas; Kai al final, con quien lo cuidaba.',
		solvedStatus:
			'Archivo: quien cuidaba a Kai era Carla, a solas en la Habitación grande.',
		getPreVictimError: getPreKaiError,
		isBoardSolved,
		victimWaitPrompt:
			'coloca al resto según sus pistas antes de situar a Kai',
		victimCorrectedPrompt: 'corregido — vuelve a colocar a Kai al final',
	});
