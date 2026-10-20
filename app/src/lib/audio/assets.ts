import type { PuzzleId } from '@/puzzles/types';
import type { SfxId } from './types';

const base = () => import.meta.env.BASE_URL;

/** Hub/finale/epilogue beds + per-puzzle lofi track pool. */
export type FixedAmbientBedId = 'hub' | 'finale' | 'epilogue';

export type PuzzleAmbientTrackId =
	| 'puzzle01-a'
	| 'puzzle01-b'
	| 'puzzle01-c'
	| 'puzzle02-a'
	| 'puzzle02-b'
	| 'puzzle02-c'
	| 'puzzle03-a'
	| 'puzzle03-b'
	| 'puzzle03-c'
	| 'puzzle04-a'
	| 'puzzle04-b'
	| 'puzzle04-c'
	| 'puzzle05-a'
	| 'puzzle05-b'
	| 'puzzle05-c';

export type AmbientBedId = FixedAmbientBedId | PuzzleAmbientTrackId;

export const PUZZLE_AMBIENT_POOLS: Record<
	PuzzleId,
	readonly PuzzleAmbientTrackId[]
> = {
	'puzzle01-started-todo': ['puzzle01-a', 'puzzle01-b', 'puzzle01-c'],
	'puzzle02-first-house': ['puzzle02-a', 'puzzle02-b', 'puzzle02-c'],
	'puzzle03-kai-born': ['puzzle03-a', 'puzzle03-b', 'puzzle03-c'],
	'puzzle04-arroa-move': ['puzzle04-a', 'puzzle04-b', 'puzzle04-c'],
	'puzzle05-gift-plot': ['puzzle05-a', 'puzzle05-b', 'puzzle05-c'],
};

/** Pick one lofi bed for this puzzle visit (stable until remount). */
export const pickPuzzleAmbient = (puzzleId: PuzzleId): PuzzleAmbientTrackId => {
	const pool = PUZZLE_AMBIENT_POOLS[puzzleId];
	const index = Math.floor(Math.random() * pool.length);
	return pool[index] ?? pool[0];
};

export const isPuzzleAmbientBed = (
	bed: AmbientBedId
): bed is PuzzleAmbientTrackId => bed.startsWith('puzzle');

export const AMBIENT_FILES: Record<AmbientBedId, string> = {
	hub: 'audio/ambient-moil.mp3',
	finale: 'audio/ambient-finale.mp3',
	epilogue: 'audio/ambient-epilogue.mp3',
	'puzzle01-a': 'audio/puzzles/01-a.mp3',
	'puzzle01-b': 'audio/puzzles/01-b.mp3',
	'puzzle01-c': 'audio/puzzles/01-c.mp3',
	'puzzle02-a': 'audio/puzzles/02-a.mp3',
	'puzzle02-b': 'audio/puzzles/02-b.mp3',
	'puzzle02-c': 'audio/puzzles/02-c.mp3',
	'puzzle03-a': 'audio/puzzles/03-a.mp3',
	'puzzle03-b': 'audio/puzzles/03-b.mp3',
	'puzzle03-c': 'audio/puzzles/03-c.mp3',
	'puzzle04-a': 'audio/puzzles/04-a.mp3',
	'puzzle04-b': 'audio/puzzles/04-b.mp3',
	'puzzle04-c': 'audio/puzzles/04-c.mp3',
	'puzzle05-a': 'audio/puzzles/05-a.mp3',
	'puzzle05-b': 'audio/puzzles/05-b.mp3',
	'puzzle05-c': 'audio/puzzles/05-c.mp3',
};

const FIXED_AMBIENT_VOLUME: Record<FixedAmbientBedId, number> = {
	hub: 0.32,
	finale: 0.4, // last question — cinematic climax
	epilogue: 0.5, // case closed — calm night jazz (louder; track is soft)
};

/** Puzzle lofi beds stay soft under the board. */
const PUZZLE_AMBIENT_VOLUME = 0.28;

export const ambientVolume = (bed: AmbientBedId): number =>
	isPuzzleAmbientBed(bed) ? PUZZLE_AMBIENT_VOLUME : FIXED_AMBIENT_VOLUME[bed];

export const ambientUrl = (bed: AmbientBedId): string =>
	`${base()}${AMBIENT_FILES[bed]}`;

export const SFX_FILES: Record<SfxId, string> = {
	dossier: 'audio/sfx-dossier.ogg',
	place: 'audio/sfx-place.ogg',
	select: 'audio/sfx-select.ogg',
	match: 'audio/sfx-match.ogg',
	hint: 'audio/sfx-hint.ogg',
	error: 'audio/sfx-error.ogg',
	copy: 'audio/sfx-copy.ogg',
	solve: 'audio/sfx-solve.ogg',
	caseClosed: 'audio/sfx-case-closed.ogg',
	ui: 'audio/sfx-ui.ogg',
};

export const SFX_VOLUME: Record<SfxId, number> = {
	dossier: 0.62, // door open / latch — enter a case
	place: 0.52, // desk drawer close — drop a piece / mark
	select: 0.4, // key click — pick suspect / tile / piece
	match: 0.48, // camera shutter — mahjong pair / evidence snap
	hint: 0.5, // paper page — reveal a clue
	error: 0.42, // dry desk slam — reject (gunshot reserved for finale)
	copy: 0.48, // paper rustle — copy continue code
	solve: 0.52, // desk slam / stamp — puzzle cleared
	caseClosed: 0.4, // gunshot sting — only on finale win
	ui: 0.35, // soft lock click — unmute
};

export const sfxUrl = (id: SfxId): string => `${base()}${SFX_FILES[id]}`;
