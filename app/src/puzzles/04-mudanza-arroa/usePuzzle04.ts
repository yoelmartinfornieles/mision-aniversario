import { useEffect, useMemo, useRef, useState } from 'react';
import { audio, usePuzzleAmbient } from '@/lib/audio';
import {
	DRAFT_CLOCK_FLUSH_MS,
	ProgressService,
	clearDraft,
	loadDraft,
	saveDraft,
	useProgress,
} from '@/lib/progress';
import { DEAL_SEED, PUZZLE_ID } from './constants';
import { FACE_BY_ID, HINTS } from './data';
import {
	canMatch,
	countFreeMatches,
	dealTiles,
	findRescuePair,
	getFreeTiles,
	isFree,
} from './logic';
import type { MahjongTile } from './types';

const INITIAL_TILES = dealTiles(DEAL_SEED);
const FACE_IDS = new Set<string>(Object.keys(FACE_BY_ID));

type MahjongDraft = {
	started: boolean;
	tiles: MahjongTile[];
	elapsedSeconds: number;
};

const isMahjongTile = (value: unknown): value is MahjongTile => {
	if (!value || typeof value !== 'object') return false;
	const tile = value as Partial<MahjongTile>;
	return (
		typeof tile.uid === 'string' &&
		typeof tile.faceId === 'string' &&
		FACE_IDS.has(tile.faceId) &&
		typeof tile.x === 'number' &&
		typeof tile.y === 'number' &&
		typeof tile.z === 'number'
	);
};

const isMahjongDraft = (data: unknown): data is MahjongDraft => {
	if (!data || typeof data !== 'object') return false;
	const draft = data as Partial<MahjongDraft>;
	return (
		typeof draft.started === 'boolean' &&
		typeof draft.elapsedSeconds === 'number' &&
		Array.isArray(draft.tiles) &&
		draft.tiles.every(isMahjongTile)
	);
};

const readMahjongDraft = (): MahjongDraft | null => {
	if (ProgressService.isPuzzleCompleted(PUZZLE_ID)) {
		clearDraft(PUZZLE_ID);
		return null;
	}
	return loadDraft(PUZZLE_ID, isMahjongDraft);
};

export const usePuzzle04 = () => {
	const { completePuzzle, getContinueCode, isPuzzleCompleted } = useProgress();

	const [draft] = useState(() => readMahjongDraft());
	const [started, setStarted] = useState(() => draft?.started ?? false);
	usePuzzleAmbient(started, PUZZLE_ID);
	const [tiles, setTiles] = useState<MahjongTile[]>(
		() => draft?.tiles ?? INITIAL_TILES
	);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [history, setHistory] = useState<MahjongTile[][]>([]);
	const [status, setStatus] = useState(
		'Toca una ficha libre, luego su pareja. Reglas clásicas de mahjong solitaire.'
	);
	const clockRef = useRef(draft?.elapsedSeconds ?? 0);
	const [clockInitial, setClockInitial] = useState(
		() => draft?.elapsedSeconds ?? 0
	);
	const [clockSession, setClockSession] = useState(0);
	const [showSaveCode, setShowSaveCode] = useState(false);
	const [showHints, setShowHints] = useState(false);
	const [matchedPulse, setMatchedPulse] = useState<string[]>([]);
	const [rejectPulse, setRejectPulse] = useState<string[]>([]);
	const [rescueIds, setRescueIds] = useState<string[]>([]);
	const [rescueBusy, setRescueBusy] = useState(false);
	const rescueRequest = useRef(0);

	useEffect(
		() => () => {
			rescueRequest.current += 1;
		},
		[]
	);

	const clearRescue = () => {
		rescueRequest.current += 1;
		setRescueIds([]);
		setRescueBusy(false);
	};

	const handleRescue = async () => {
		if (rescueBusy || matchedPulse.length > 0 || tiles.length === 0) return;
		const request = ++rescueRequest.current;
		setRescueBusy(true);
		setRescueIds([]);
		setSelectedId(null);
		setStatus('Analizando una ruta para despejar el tablero…');
		try {
			const result = await findRescuePair(
				tiles,
				() => rescueRequest.current !== request
			);
			if (rescueRequest.current !== request) return;
			if (result.kind === 'pair') {
				setRescueIds(result.tiles.map((tile) => tile.uid));
				setStatus(
					`Rescate: retira las dos fichas marcadas de ${FACE_BY_ID[result.tiles[0].faceId].label}. Esta pareja permite completar el tablero.`
				);
			} else if (result.kind === 'unsolvable') {
				setStatus(
					history.length > 0
						? 'Esta posición ya no tiene solución. Pulsa Deshacer y vuelve a pedir ayuda; puede hacer falta retroceder varias parejas.'
						: 'Esta posición ya no tiene solución y no queda historial para deshacer. Pulsa Reiniciar para recuperar el reparto con solución.'
				);
			} else if (result.kind === 'inconclusive') {
				setStatus(
					'El archivo no logra confirmar una pareja segura. No significa que no haya salida.'
				);
			} else {
				setStatus('El tablero ya está despejado.');
			}
		} catch (error) {
			console.error('Mahjong rescue analysis failed', error);
			if (rescueRequest.current === request) {
				setStatus(
					'No se ha podido analizar el tablero. Puedes seguir jugando o volver a pedir ayuda.'
				);
			}
		} finally {
			if (rescueRequest.current === request) setRescueBusy(false);
		}
	};

	const alreadyDone = isPuzzleCompleted(PUZZLE_ID);
	const saveCode = getContinueCode(PUZZLE_ID);

	const freeIds = useMemo(() => {
		const free = getFreeTiles(tiles);
		return new Set(free.map((tile) => tile.uid));
	}, [tiles]);

	const freeMatchCount = useMemo(() => countFreeMatches(tiles), [tiles]);
	const remaining = tiles.length;

	const buildDraft = (): MahjongDraft => ({
		started,
		tiles,
		elapsedSeconds: clockRef.current,
	});

	useEffect(() => {
		if (alreadyDone) {
			clearDraft(PUZZLE_ID);
			return;
		}
		const isPristine =
			tiles.length === INITIAL_TILES.length &&
			tiles.every(
				(tile, index) =>
					tile.uid === INITIAL_TILES[index]?.uid &&
					tile.faceId === INITIAL_TILES[index]?.faceId
			);
		if (!started && isPristine) {
			clearDraft(PUZZLE_ID);
			return;
		}
		if (!started) return;

		saveDraft(PUZZLE_ID, buildDraft());
	}, [alreadyDone, started, tiles]);

	useEffect(() => {
		if (!started || alreadyDone) return;

		const flush = () => saveDraft(PUZZLE_ID, buildDraft());
		const id = window.setInterval(flush, DRAFT_CLOCK_FLUSH_MS);
		window.addEventListener('pagehide', flush);
		return () => {
			window.clearInterval(id);
			window.removeEventListener('pagehide', flush);
		};
		// Board fields are read via closure on each flush; clock lives in ref.
		// eslint-disable-next-line react-hooks/exhaustive-deps -- intentional throttle
	}, [started, alreadyDone, tiles]);

	const finishIfCleared = (nextTiles: MahjongTile[]) => {
		if (nextTiles.length > 0) return;
		audio.play('solve');
		setStatus('Las fichas caen y la foto habla.');
		clearDraft(PUZZLE_ID);
		completePuzzle(PUZZLE_ID);
		setShowSaveCode(true);
	};

	const handleTileClick = (tile: MahjongTile) => {
		if (matchedPulse.length > 0 || rescueBusy) return;

		if (!isFree(tile, tiles)) {
			audio.play('error');
			setStatus(
				'Esa ficha está bloqueada. Solo bordes libres, sin nada encima.'
			);
			return;
		}

		if (selectedId === null) {
			audio.play('select');
			setSelectedId(tile.uid);
			setStatus(
				`Seleccionada: ${FACE_BY_ID[tile.faceId].label}. Busca su pareja libre.`
			);
			return;
		}

		if (selectedId === tile.uid) {
			setSelectedId(null);
			setStatus('Selección descartada.');
			return;
		}

		const selected = tiles.find((entry) => entry.uid === selectedId);
		if (!selected) {
			setSelectedId(null);
			return;
		}

		if (!canMatch(selected, tile)) {
			audio.play('error');
			setRejectPulse([selected.uid, tile.uid]);
			window.setTimeout(() => setRejectPulse([]), 380);
			setSelectedId(tile.uid);
			setStatus('No casan. Prueba otra.');
			return;
		}

		if (!isFree(selected, tiles)) {
			audio.play('error');
			setSelectedId(null);
			setStatus('La primera ficha ya no está libre.');
			return;
		}

		const removeIds = new Set([selected.uid, tile.uid]);
		clearRescue();
		const snapshot = tiles;
		setHistory((previous) => [...previous, snapshot]);
		setMatchedPulse([selected.uid, tile.uid]);
		setSelectedId(null);
		audio.play('match');
		setStatus('Pareja archivada.');

		window.setTimeout(() => {
			const next = snapshot.filter((entry) => !removeIds.has(entry.uid));
			setTiles(next);
			setMatchedPulse([]);

			const matchesLeft = countFreeMatches(next);
			if (next.length === 0) {
				finishIfCleared(next);
			} else if (matchesLeft === 0) {
				setStatus(
					'Sin parejas libres. Deshaz un movimiento o reinicia el tablero.'
				);
			} else {
				setStatus(
					`Bien. Quedan ${next.length} fichas · ${matchesLeft} parejas libres.`
				);
			}
		}, 300);
	};

	const handleUndo = () => {
		if (matchedPulse.length > 0) return;
		clearRescue();
		const previous = history[history.length - 1];
		if (!previous) {
			setStatus('No hay nada que deshacer.');
			return;
		}
		setHistory((entries) => entries.slice(0, -1));
		setTiles(previous);
		setSelectedId(null);
		setStatus('Movimiento deshecho.');
	};

	const handleReset = () => {
		if (matchedPulse.length > 0) return;
		clearRescue();
		clearDraft(PUZZLE_ID);
		setTiles(INITIAL_TILES);
		setHistory([]);
		setSelectedId(null);
		clockRef.current = 0;
		setClockInitial(0);
		setClockSession((value) => value + 1);
		setStatus('Tablero reiniciado. Quita capas hasta ver la imagen.');
	};

	return {
		started,
		setStarted,
		alreadyDone,
		saveCode,
		tiles,
		selectedId,
		freeIds,
		freeMatchCount,
		remaining,
		status,
		clockRef,
		clockInitial,
		clockSession,
		matchedPulse,
		rejectPulse,
		rescueIds,
		rescueBusy,
		handleRescue,
		showSaveCode,
		setShowSaveCode,
		showHints,
		setShowHints,
		HINTS,
		handleTileClick,
		handleUndo,
		handleReset,
		canUndo: history.length > 0,
	};
};
