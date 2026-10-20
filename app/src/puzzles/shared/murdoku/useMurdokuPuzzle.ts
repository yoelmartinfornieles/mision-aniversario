import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	DRAFT_CLOCK_FLUSH_MS,
	ProgressService,
	clearDraft,
	loadDraft,
	saveDraft,
	useProgress,
} from '@/lib/progress';
import type { PuzzleId } from '@/puzzles/types';
import type { FurnitureCell, WindowEdge } from './MurdokuBoard';
import { findPlacement, hasUniqueRowsAndColumns } from './logic';
import type { ClueHighlight } from './clueText';
import { keysForHighlight, lockedLinesFromPlacements } from './highlight';
import { letterForSuspect } from './Portrait';
import type {
	BoardSnapshot,
	CellKey,
	MurdokuSuspect,
	Placements,
} from './types';
import { toCellKey } from './types';

type MurdokuDraft = {
	started: boolean;
	placements: Placements;
	emptyMarks: Partial<Record<CellKey, true>>;
	elapsedSeconds: number;
	remainingSeconds: number;
	timedOut: boolean;
};

const isCellKey = (value: string): value is CellKey =>
	/^\d+-\d+$/.test(value);

const isMurdokuDraft = (data: unknown): data is MurdokuDraft => {
	if (!data || typeof data !== 'object') return false;
	const draft = data as Partial<MurdokuDraft>;
	if (typeof draft.started !== 'boolean') return false;
	if (typeof draft.elapsedSeconds !== 'number') return false;
	if (typeof draft.remainingSeconds !== 'number') return false;
	if (typeof draft.timedOut !== 'boolean') return false;
	if (!draft.placements || typeof draft.placements !== 'object') return false;
	if (!draft.emptyMarks || typeof draft.emptyMarks !== 'object') return false;

	for (const [key, value] of Object.entries(draft.placements)) {
		if (!isCellKey(key) || typeof value !== 'number') return false;
	}
	for (const [key, value] of Object.entries(draft.emptyMarks)) {
		if (!isCellKey(key) || value !== true) return false;
	}
	return true;
};

const readMurdokuDraft = (
	puzzleId: PuzzleId,
	countdownSeconds: number
): MurdokuDraft | null => {
	if (ProgressService.isPuzzleCompleted(puzzleId)) {
		clearDraft(puzzleId);
		return null;
	}
	const draft = loadDraft(puzzleId, isMurdokuDraft);
	if (!draft) return null;
	return {
		...draft,
		remainingSeconds:
			typeof draft.remainingSeconds === 'number'
				? draft.remainingSeconds
				: countdownSeconds,
	};
};

export type UseMurdokuPuzzleConfig<TRoom extends string = string> = {
	puzzleId: PuzzleId;
	victimId: number;
	boardRows: number;
	boardColumns: number;
	suspects: MurdokuSuspect[];
	roomMatrix: TRoom[][];
	furnitureCells: Partial<Record<CellKey, FurnitureCell>>;
	windowCells?: Partial<Record<CellKey, WindowEdge>>;
	roomOrder: TRoom[];
	getRoomClass: (room: TRoom) => string;
	hints: string[];
	initialStatus: string;
	solvedStatus: string;
	getPreVictimError: (placements: Placements) => string | null;
	isBoardSolved: (placements: Placements) => boolean;
	/** Count-up (default) or countdown with lock/timeout UX. */
	timer?: 'elapsed' | 'countdown';
	countdownSeconds?: number;
	countdownExtensionSeconds?: number;
	selectPrompt?: string;
	victimWaitPrompt?: string;
	victimCorrectedPrompt?: string;
	onSolved?: () => void;
};

export const useMurdokuPuzzle = <TRoom extends string = string>(
	config: UseMurdokuPuzzleConfig<TRoom>
) => {
	const {
		puzzleId,
		victimId,
		boardRows,
		boardColumns,
		suspects,
		roomMatrix,
		furnitureCells,
		windowCells = {},
		roomOrder,
		getRoomClass,
		hints,
		initialStatus,
		solvedStatus,
		getPreVictimError,
		isBoardSolved,
		timer = 'elapsed',
		countdownSeconds = 0,
		countdownExtensionSeconds = 0,
		selectPrompt = 'Selecciona un personaje o el modo X',
		victimWaitPrompt = 'Coloca al resto según sus pistas antes de situar a la víctima',
		victimCorrectedPrompt = 'Corregido — vuelve a colocar a la víctima al final',
		onSolved,
	} = config;

	const { completePuzzle, getContinueCode, isPuzzleCompleted } = useProgress();

	const [draft] = useState(() => readMurdokuDraft(puzzleId, countdownSeconds));
	const [started, setStarted] = useState(() => draft?.started ?? false);
	const [selectedSuspectId, setSelectedSuspectId] = useState<number | null>(
		null
	);
	const [placements, setPlacements] = useState<Placements>(
		() => draft?.placements ?? {}
	);
	const [emptyMarks, setEmptyMarks] = useState<
		Partial<Record<CellKey, true>>
	>(() => draft?.emptyMarks ?? {});
	const [markMode, setMarkMode] = useState(false);
	const [history, setHistory] = useState<BoardSnapshot[]>([]);
	const [status, setStatus] = useState(initialStatus);
	const initialClockSeconds =
		timer === 'countdown'
			? (draft?.remainingSeconds ?? countdownSeconds)
			: (draft?.elapsedSeconds ?? 0);
	const clockRef = useRef(initialClockSeconds);
	const [clockInitial, setClockInitial] = useState(initialClockSeconds);
	const [clockSession, setClockSession] = useState(0);
	const [timedOut, setTimedOut] = useState(() => draft?.timedOut ?? false);
	const [solved, setSolved] = useState(false);
	const [showSaveCode, setShowSaveCode] = useState(false);
	const [showHints, setShowHints] = useState(false);
	const [activeHighlight, setActiveHighlight] = useState<ClueHighlight | null>(
		null
	);

	const alreadyDone = isPuzzleCompleted(puzzleId);
	const saveCode = getContinueCode(puzzleId);
	const boardLocked = timer === 'countdown' && (timedOut || solved);
	const clockRunning =
		started && !solved && !(timer === 'countdown' && timedOut);

	const buildDraft = (): MurdokuDraft => ({
		started,
		placements,
		emptyMarks,
		elapsedSeconds: timer === 'elapsed' ? clockRef.current : 0,
		remainingSeconds:
			timer === 'countdown' ? clockRef.current : countdownSeconds,
		timedOut,
	});

	useEffect(() => {
		if (alreadyDone || solved) {
			clearDraft(puzzleId);
			return;
		}

		const hasBoard =
			Object.keys(placements).length > 0 ||
			Object.keys(emptyMarks).length > 0;
		if (!started && !hasBoard) {
			clearDraft(puzzleId);
			return;
		}
		if (!started) return;

		saveDraft(puzzleId, buildDraft());
	}, [
		alreadyDone,
		solved,
		puzzleId,
		started,
		placements,
		emptyMarks,
		timedOut,
	]);

	useEffect(() => {
		if (!started || alreadyDone || solved) return;

		const flush = () => saveDraft(puzzleId, buildDraft());
		const id = window.setInterval(flush, DRAFT_CLOCK_FLUSH_MS);
		window.addEventListener('pagehide', flush);
		return () => {
			window.clearInterval(id);
			window.removeEventListener('pagehide', flush);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- intentional throttle
	}, [started, alreadyDone, solved, puzzleId, placements, emptyMarks, timedOut]);

	const boardSuspects = useMemo(
		() =>
			suspects.map((suspect) => {
				const letter = letterForSuspect(suspect.name, suspect.shortName);
				return {
					...suspect,
					letter,
					shortName: suspect.shortName ?? letter,
				};
			}),
		[suspects]
	);

	const selectedSuspect = useMemo(
		() => suspects.find((suspect) => suspect.id === selectedSuspectId) ?? null,
		[selectedSuspectId, suspects]
	);

	const otherSuspectsPlacedCount = suspects.filter(
		(suspect) =>
			suspect.id !== victimId && Object.values(placements).includes(suspect.id)
	).length;

	const victimPlacement = findPlacement(placements, victimId);
	const isVictimPlaced = victimPlacement !== undefined;
	const preVictimError = getPreVictimError(placements);
	const canPlaceVictim =
		otherSuspectsPlacedCount >= suspects.length - 1 && preVictimError === null;
	const allPlaced =
		Object.keys(placements).length === suspects.length && isVictimPlaced;

	const placedSuspectIds = useMemo(
		() =>
			Object.values(placements).filter(
				(id): id is number => id !== undefined
			),
		[placements]
	);

	const highlightedKeys = useMemo(
		() =>
			keysForHighlight({
				highlight: activeHighlight,
				roomMatrix,
				furnitureCells,
				windowCells,
				placements,
				suspects,
			}),
		[activeHighlight, placements, roomMatrix, furnitureCells, windowCells, suspects]
	);

	const { rows: lockedRows, columns: lockedColumns } = useMemo(
		() => lockedLinesFromPlacements(placements),
		[placements]
	);

	const handleClockExpire = useCallback(() => {
		if (timer !== 'countdown') return;
		setTimedOut(true);
		setStatus('Se acabó el tiempo del reloj del castillo.');
	}, [timer]);

	const pushHistory = () => {
		setHistory((previous) => [...previous, { placements, emptyMarks }]);
	};

	const handleCellClick = (row: number, column: number) => {
		if (boardLocked) return;

		const key = toCellKey(row, column);
		const furniture = furnitureCells[key];
		if (furniture?.role === 'blocking') {
			setStatus(`Esa casilla está bloqueada por ${furniture.kind}`);
			return;
		}

		if (markMode) {
			if (placements[key] !== undefined) {
				setStatus('No se puede tachar una casilla ocupada');
				return;
			}
			pushHistory();
			setEmptyMarks((previous) => {
				const next = { ...previous };
				if (next[key]) delete next[key];
				else next[key] = true;
				return next;
			});
			setStatus(emptyMarks[key] ? 'Marca X retirada' : 'Casilla tachada');
			return;
		}

		if (!selectedSuspect) {
			setStatus(selectPrompt);
			return;
		}

		if (selectedSuspect.id === victimId && !canPlaceVictim) {
			setStatus(preVictimError ?? victimWaitPrompt);
			return;
		}

		const room = roomMatrix[row][column];
		const occupantId = placements[key];
		if (occupantId !== undefined && occupantId !== selectedSuspect.id) {
			setStatus(
				`${suspects.find((suspect) => suspect.id === occupantId)?.name} ya ocupa esa casilla`
			);
			return;
		}

		const nextPlacements = Object.fromEntries(
			Object.entries(placements).filter(
				([, suspectId]) =>
					suspectId !== selectedSuspect.id &&
					!(
						isVictimPlaced &&
						selectedSuspect.id !== victimId &&
						suspectId === victimId
					)
			)
		) as Placements;

		if (occupantId !== selectedSuspect.id) {
			nextPlacements[key] = selectedSuspect.id;
		}

		if (!hasUniqueRowsAndColumns(nextPlacements)) {
			setStatus('Esa fila o columna ya está ocupada');
			return;
		}

		pushHistory();
		setPlacements(nextPlacements);

		if (emptyMarks[key]) {
			const nextMarks = { ...emptyMarks };
			delete nextMarks[key];
			setEmptyMarks(nextMarks);
		}

		const onFurniture =
			furniture?.role === 'occupiable' ? ` · ${furniture.kind}` : '';
		setStatus(
			isVictimPlaced && selectedSuspect.id !== victimId
				? victimCorrectedPrompt
				: `${selectedSuspect.name} en ${room}${onFurniture}`
		);
	};

	const handleClearBoard = () => {
		if (boardLocked) return;
		if (
			Object.keys(placements).length > 0 ||
			Object.keys(emptyMarks).length > 0
		) {
			pushHistory();
		}
		setPlacements({});
		setEmptyMarks({});
		setSelectedSuspectId(null);
		setMarkMode(false);
		setStatus('Tablero reiniciado');
	};

	const handleUndo = () => {
		if (boardLocked) return;
		const previous = history.at(-1);
		if (!previous) {
			setStatus('No hay movimientos que deshacer');
			return;
		}
		setPlacements(previous.placements);
		setEmptyMarks(previous.emptyMarks);
		setHistory((entries) => entries.slice(0, -1));
		setStatus('Último movimiento deshecho');
	};

	const toggleMarkMode = () => {
		if (boardLocked) return;
		const nextMode = !markMode;
		setMarkMode(nextMode);
		setSelectedSuspectId(null);
		setStatus(
			nextMode ? 'Modo X: tacha casillas imposibles' : 'Modo X desactivado'
		);
	};

	const selectSuspect = (suspectId: number) => {
		if (boardLocked) return;
		setSelectedSuspectId(suspectId);
		setMarkMode(false);
	};

	const handleSubmit = () => {
		if (boardLocked && !solved) return;
		if (!allPlaced) {
			setStatus(
				`Coloca a todos primero (${Object.keys(placements).length}/${suspects.length})`
			);
			return;
		}
		if (preVictimError) {
			setStatus(preVictimError);
			return;
		}
		if (!isBoardSolved(placements)) {
			setStatus('Aún no cuadra del todo — revisa las pistas');
			return;
		}

		if (timer === 'countdown') {
			setSolved(true);
			setTimedOut(false);
		}
		setStatus(solvedStatus);
		clearDraft(puzzleId);
		completePuzzle(puzzleId);
		onSolved?.();
		setShowSaveCode(true);
	};

	const extendTimer = () => {
		const next = clockRef.current + countdownExtensionSeconds;
		clockRef.current = next;
		setClockInitial(next);
		setClockSession((value) => value + 1);
		setTimedOut(false);
		setStatus('El reloj del castillo da otra vuelta. Cinco minutos extra.');
	};

	const resetTimer = () => {
		clockRef.current = countdownSeconds;
		setClockInitial(countdownSeconds);
		setClockSession((value) => value + 1);
		setTimedOut(false);
		setStatus('Reloj del castillo reiniciado. El parque sigue en marcha.');
	};

	const begin = () => {
		setStarted(true);
		if (timer === 'countdown') {
			clockRef.current = countdownSeconds;
			setClockInitial(countdownSeconds);
			setClockSession((value) => value + 1);
			setTimedOut(false);
			setSolved(false);
		}
	};

	return {
		puzzleId,
		BOARD_ROWS: boardRows,
		BOARD_COLUMNS: boardColumns,
		started,
		setStarted,
		begin,
		status,
		clockRef,
		clockInitial,
		clockSession,
		clockRunning,
		handleClockExpire,
		timedOut,
		boardLocked,
		suspects: boardSuspects,
		selectedSuspectId,
		placements,
		placedSuspectIds,
		emptyMarks,
		markMode,
		isVictimPlaced,
		otherSuspectsPlacedCount,
		preVictimError,
		allPlaced,
		alreadyDone,
		saveCode,
		showSaveCode,
		setShowSaveCode,
		showHints,
		setShowHints,
		HINTS: hints,
		activeHighlight,
		setActiveHighlight,
		highlightedKeys,
		lockedRows,
		lockedColumns,
		roomMatrix,
		furnitureCells,
		windowCells,
		ROOM_ORDER: roomOrder,
		getRoomClass: (room: string) => getRoomClass(room as TRoom),
		victimId,
		selectSuspect,
		handleCellClick,
		handleClearBoard,
		handleUndo,
		toggleMarkMode,
		handleSubmit,
		extendTimer,
		resetTimer,
	};
};
