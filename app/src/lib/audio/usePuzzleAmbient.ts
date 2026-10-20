import { useEffect, useRef } from 'react';
import type { PuzzleId } from '@/puzzles/types';
import {
	pickPuzzleAmbient,
	type PuzzleAmbientTrackId,
} from './assets';
import { audio } from './AudioDirector';

/**
 * Keep hub jazz continuous through the dossier intro.
 * On mount, pick + warm one random lofi track so the start crossfade is ready.
 * On start, crossfade hub → track; on leave, crossfade back to hub
 * (only if nothing else claimed the bed first).
 */
export const usePuzzleAmbient = (
	started: boolean,
	puzzleId: PuzzleId
): void => {
	const bedRef = useRef<PuzzleAmbientTrackId | null>(null);

	useEffect(() => {
		if (!bedRef.current) {
			bedRef.current = pickPuzzleAmbient(puzzleId);
		}
		// Buffer during intro so hub → lofi does not wait on an empty file.
		audio.warmBed(bedRef.current);
	}, [puzzleId]);

	useEffect(() => {
		if (!started || !bedRef.current) return;
		audio.setAmbientBed(bedRef.current);
	}, [started, puzzleId]);

	useEffect(
		() => () => {
			const bed = bedRef.current;
			if (!bed) {
				audio.setAmbientBed('hub');
				return;
			}
			// Defer one tick so the next page (home / finale / puzzle) can claim
			// its bed first — avoids a hub blip between puzzle → puzzle/finale.
			window.setTimeout(() => {
				audio.releaseAmbientBed(bed, 'hub');
			}, 0);
		},
		[]
	);
};
