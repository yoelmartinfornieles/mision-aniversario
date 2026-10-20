import { useMurdokuPuzzle } from '@/puzzles/shared/murdoku';
import {
	BOARD_COLUMNS,
	BOARD_ROWS,
	CARLA_ID,
	PUZZLE_ID,
	TIMER_EXTENSION_SECONDS,
	TIMER_SECONDS,
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
import { getPreCarlaError, isBoardSolved } from './logic';

export const usePuzzle05 = () =>
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
			'¿Quién ha elegido el regalo de aniversario? Coloca al resto; Carla, al final.',
		solvedStatus:
			'Archivo: eligió Yoel. A solas con Carla, en el Castillo.',
		getPreVictimError: getPreCarlaError,
		isBoardSolved,
		timer: 'countdown',
		countdownSeconds: TIMER_SECONDS,
		countdownExtensionSeconds: TIMER_EXTENSION_SECONDS,
		selectPrompt: 'Selecciona un implicado o el modo X',
		victimWaitPrompt:
			'Coloca al resto según sus pistas antes de situar a Carla',
		victimCorrectedPrompt:
			'Corregido — vuelve a colocar a Carla al final',
	});
