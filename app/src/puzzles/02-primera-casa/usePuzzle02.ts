import { useEffect, useMemo, useRef, useState } from 'react';
import {
	DRAFT_CLOCK_FLUSH_MS,
	ProgressService,
	clearDraft,
	loadDraft,
	saveDraft,
	useProgress,
} from '@/lib/progress';
import { PUZZLE_ID } from './constants';
import {
	FIXED_PLACEMENTS,
	FREE_PIECE_IDS,
	HINTS,
	PIECE_BY_ID,
	PIECES,
} from './data';
import { BOARD_CELLS } from './hex';
import {
	buildOccupancy,
	canPlaceCells,
	getOrientedShape,
	isBoardSolved,
	placeShapeAt,
} from './logic';
import type { Axial, PieceId, Placement } from './types';

type Pose = { face: 0 | 1; rot: number };

type HexDraft = {
	started: boolean;
	placements: Placement[];
	poses: Record<PieceId, Pose>;
	elapsedSeconds: number;
};

const PIECE_IDS = new Set<string>(Object.keys(PIECE_BY_ID));

const defaultPose = (): Pose => ({ face: 0, rot: 0 });

const defaultPoses = (): Record<PieceId, Pose> =>
	Object.fromEntries(FREE_PIECE_IDS.map((id) => [id, defaultPose()])) as Record<
		PieceId,
		Pose
	>;

const isAxial = (value: unknown): value is Axial =>
	Array.isArray(value) &&
	value.length === 2 &&
	typeof value[0] === 'number' &&
	typeof value[1] === 'number';

const isPlacement = (value: unknown): value is Placement => {
	if (!value || typeof value !== 'object') return false;
	const placement = value as Partial<Placement>;
	return (
		typeof placement.pieceId === 'string' &&
		PIECE_IDS.has(placement.pieceId) &&
		(placement.face === 0 || placement.face === 1) &&
		typeof placement.rot === 'number' &&
		Array.isArray(placement.cells) &&
		placement.cells.every(isAxial)
	);
};

const isHexDraft = (data: unknown): data is HexDraft => {
	if (!data || typeof data !== 'object') return false;
	const draft = data as Partial<HexDraft>;
	if (typeof draft.started !== 'boolean') return false;
	if (typeof draft.elapsedSeconds !== 'number') return false;
	if (!Array.isArray(draft.placements) || !draft.placements.every(isPlacement)) {
		return false;
	}
	if (!draft.poses || typeof draft.poses !== 'object') return false;
	for (const id of FREE_PIECE_IDS) {
		const pose = draft.poses[id];
		if (
			!pose ||
			(pose.face !== 0 && pose.face !== 1) ||
			typeof pose.rot !== 'number'
		) {
			return false;
		}
	}
	return true;
};

const readHexDraft = (): HexDraft | null => {
	if (ProgressService.isPuzzleCompleted(PUZZLE_ID)) {
		clearDraft(PUZZLE_ID);
		return null;
	}
	return loadDraft(PUZZLE_ID, isHexDraft);
};

export const usePuzzle02 = () => {
	const { completePuzzle, getContinueCode, isPuzzleCompleted } = useProgress();

	const [draft] = useState(() => readHexDraft());
	const [started, setStarted] = useState(() => draft?.started ?? false);
	const [placements, setPlacements] = useState<Placement[]>(
		() => draft?.placements ?? []
	);
	const [selectedId, setSelectedId] = useState<PieceId | null>(null);
	const [poses, setPoses] = useState<Record<PieceId, Pose>>(
		() => draft?.poses ?? defaultPoses()
	);
	const [hoverCell, setHoverCell] = useState<Axial | null>(null);
	const [status, setStatus] = useState(
		'Elige una estancia y tócala en el plano. Rotar / Voltear abajo.'
	);
	const clockRef = useRef(draft?.elapsedSeconds ?? 0);
	const [clockInitial] = useState(() => draft?.elapsedSeconds ?? 0);
	const [clockSession] = useState(0);
	const [showSaveCode, setShowSaveCode] = useState(false);
	const [showHints, setShowHints] = useState(false);
	const [history, setHistory] = useState<Placement[][]>([]);

	const alreadyDone = isPuzzleCompleted(PUZZLE_ID);
	const saveCode = getContinueCode(PUZZLE_ID);

	const buildDraft = (): HexDraft => ({
		started,
		placements,
		poses,
		elapsedSeconds: clockRef.current,
	});

	useEffect(() => {
		if (alreadyDone) {
			clearDraft(PUZZLE_ID);
			return;
		}
		if (!started && placements.length === 0) {
			clearDraft(PUZZLE_ID);
			return;
		}
		if (!started) return;

		saveDraft(PUZZLE_ID, buildDraft());
	}, [alreadyDone, started, placements, poses]);

	useEffect(() => {
		if (!started || alreadyDone) return;

		const flush = () => saveDraft(PUZZLE_ID, buildDraft());
		const id = window.setInterval(flush, DRAFT_CLOCK_FLUSH_MS);
		window.addEventListener('pagehide', flush);
		return () => {
			window.clearInterval(id);
			window.removeEventListener('pagehide', flush);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- intentional throttle
	}, [started, alreadyDone, placements, poses]);

	useEffect(() => {
		if (!started) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'r' || event.key === 'R') {
				event.preventDefault();
				setSelectedId((current) => {
					if (!current) {
						setStatus('elige una estancia para rotar');
						return current;
					}
					setPoses((previous) => ({
						...previous,
						[current]: {
							...previous[current],
							rot: (previous[current].rot + 1) % 6,
						},
					}));
					setStatus('rotada 60°');
					return current;
				});
			}
			if (event.key === 'f' || event.key === 'F') {
				event.preventDefault();
				setSelectedId((current) => {
					if (!current) {
						setStatus('elige una estancia para voltear');
						return current;
					}
					setPoses((previous) => ({
						...previous,
						[current]: {
							...previous[current],
							face: previous[current].face === 0 ? 1 : 0,
						},
					}));
					setStatus('cara volteada');
					return current;
				});
			}
			if (event.key === 'Escape') {
				setSelectedId(null);
				setStatus('pieza soltada');
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [started]);

	const occupancy = useMemo(
		() => buildOccupancy([...FIXED_PLACEMENTS, ...placements]),
		[placements]
	);

	const trayPieceIds = useMemo(
		() =>
			FREE_PIECE_IDS.filter(
				(id) => !placements.some((placement) => placement.pieceId === id)
			),
		[placements]
	);

	const selectedPose = selectedId ? poses[selectedId] : null;

	const ghostCells = useMemo(() => {
		if (!selectedId || !selectedPose || !hoverCell) return null;
		const shape = getOrientedShape(
			PIECE_BY_ID[selectedId].base,
			selectedPose.face,
			selectedPose.rot
		);
		const cells = placeShapeAt(shape, hoverCell, 0);
		const valid = canPlaceCells(cells, occupancy, selectedId);
		return { cells, valid };
	}, [selectedId, selectedPose, hoverCell, occupancy]);

	const pushHistory = () => {
		setHistory((previous) => [...previous, placements]);
	};

	const selectPiece = (pieceId: PieceId) => {
		if (PIECE_BY_ID[pieceId].locked) return;
		// Picking from board returns it to hand
		const onBoard = placements.find((p) => p.pieceId === pieceId);
		if (onBoard) {
			pushHistory();
			setPlacements((previous) =>
				previous.filter((placement) => placement.pieceId !== pieceId)
			);
		}
		setSelectedId(pieceId);
		setStatus(`${PIECE_BY_ID[pieceId].label}: colócala en el plano`);
	};

	const rotateSelected = () => {
		if (!selectedId) {
			setStatus('elige una estancia para rotar');
			return;
		}
		setPoses((previous) => ({
			...previous,
			[selectedId]: {
				...previous[selectedId],
				rot: (previous[selectedId].rot + 1) % 6,
			},
		}));
		setStatus('rotada 60°');
	};

	const flipSelected = () => {
		if (!selectedId) {
			setStatus('elige una estancia para voltear');
			return;
		}
		setPoses((previous) => ({
			...previous,
			[selectedId]: {
				...previous[selectedId],
				face: previous[selectedId].face === 0 ? 1 : 0,
			},
		}));
		setStatus('cara volteada');
	};

	const tryPlaceAt = (anchor: Axial) => {
		if (!selectedId || !selectedPose) {
			setStatus('elige una estancia del taller');
			return false;
		}
		const shape = getOrientedShape(
			PIECE_BY_ID[selectedId].base,
			selectedPose.face,
			selectedPose.rot
		);
		const cells = placeShapeAt(shape, anchor, 0);
		if (!canPlaceCells(cells, occupancy, selectedId)) {
			setStatus('no encaja ahí — rota, voltea o elige otro hueco');
			return false;
		}

		pushHistory();
		const next: Placement = {
			pieceId: selectedId,
			face: selectedPose.face,
			rot: selectedPose.rot,
			cells,
		};
		const nextPlacements = [
			...placements.filter((placement) => placement.pieceId !== selectedId),
			next,
		];
		setPlacements(nextPlacements);
		setSelectedId(null);
		setHoverCell(null);

		if (isBoardSolved(nextPlacements)) {
			setStatus('¡La casa vuelve a ser un hogar!');
			clearDraft(PUZZLE_ID);
			completePuzzle(PUZZLE_ID);
			setShowSaveCode(true);
		} else {
			const remaining = FREE_PIECE_IDS.length - nextPlacements.length;
			setStatus(
				remaining === 0
					? 'algo no cuadra — revisa las estancias'
					: `${PIECE_BY_ID[next.pieceId].label} colocada · faltan ${remaining}`
			);
		}
		return true;
	};

	const handleCellClick = (cell: Axial) => {
		const key = `${cell[0]},${cell[1]}`;
		const owner = occupancy.get(key as `${number},${number}`);
		if (owner && !PIECE_BY_ID[owner].locked && !selectedId) {
			selectPiece(owner);
			return;
		}
		tryPlaceAt(cell);
	};

	const handleClear = () => {
		if (placements.length === 0) {
			setStatus('el plano ya está vacío');
			return;
		}
		pushHistory();
		setPlacements([]);
		setSelectedId(null);
		setStatus('plano vaciado — quedan las ruinas fijas');
	};

	const handleUndo = () => {
		const previous = history.at(-1);
		if (!previous) {
			setStatus('no hay movimientos que deshacer');
			return;
		}
		setPlacements(previous);
		setHistory((entries) => entries.slice(0, -1));
		setSelectedId(null);
		setStatus('último movimiento deshecho');
	};

	const handleSubmit = () => {
		if (placements.length < FREE_PIECE_IDS.length) {
			setStatus(
				`faltan ${FREE_PIECE_IDS.length - placements.length} estancias por colocar`
			);
			return;
		}
		if (!isBoardSolved(placements)) {
			setStatus('aún no es hogar — prueba otra disposición');
			return;
		}
		setStatus('¡La casa vuelve a ser un hogar!');
		clearDraft(PUZZLE_ID);
		completePuzzle(PUZZLE_ID);
		setShowSaveCode(true);
	};

	return {
		started,
		setStarted,
		status,
		clockRef,
		clockInitial,
		clockSession,
		alreadyDone,
		saveCode,
		showSaveCode,
		setShowSaveCode,
		showHints,
		setShowHints,
		HINTS,
		PIECES,
		FIXED_PLACEMENTS,
		BOARD_CELLS,
		placements,
		trayPieceIds,
		selectedId,
		poses,
		ghostCells,
		hoverCell,
		setHoverCell,
		selectPiece,
		rotateSelected,
		flipSelected,
		tryPlaceAt,
		handleCellClick,
		handleClear,
		handleUndo,
		handleSubmit,
		occupancy,
	};
};
