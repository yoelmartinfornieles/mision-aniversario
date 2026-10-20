import type { PuzzleId } from '@/puzzles/types';

/** sessionStorage key prefix — separate from ProgressService localStorage. */
export const DRAFT_STORAGE_PREFIX = 'disney-sorpresa-draft:';

/** Bump when draft payloads are incompatible with older shapes. */
export const DRAFT_SCHEMA_VERSION = 1;

/** How often to persist clock-only progress while a puzzle is running. */
export const DRAFT_CLOCK_FLUSH_MS = 10_000;

type DraftEnvelope = {
	v: number;
	updatedAt: number;
	data: unknown;
};

export const draftStorageKey = (puzzleId: PuzzleId): string =>
	`${DRAFT_STORAGE_PREFIX}${puzzleId}`;

/**
 * Load a mid-session board draft. Corrupt / wrong-version / invalid payloads
 * are ignored (treated as no draft).
 */
export const loadDraft = <T>(
	puzzleId: PuzzleId,
	isValid: (data: unknown) => data is T
): T | null => {
	try {
		const raw = sessionStorage.getItem(draftStorageKey(puzzleId));
		if (!raw) return null;

		const parsed: unknown = JSON.parse(raw);
		if (!parsed || typeof parsed !== 'object') return null;

		const envelope = parsed as DraftEnvelope;
		if (envelope.v !== DRAFT_SCHEMA_VERSION) return null;
		if (!isValid(envelope.data)) return null;

		return envelope.data;
	} catch {
		return null;
	}
};

export const saveDraft = (puzzleId: PuzzleId, data: unknown): void => {
	try {
		const envelope: DraftEnvelope = {
			v: DRAFT_SCHEMA_VERSION,
			updatedAt: Date.now(),
			data,
		};
		sessionStorage.setItem(
			draftStorageKey(puzzleId),
			JSON.stringify(envelope)
		);
	} catch (error) {
		console.error('Error saving puzzle draft:', error);
	}
};

export const clearDraft = (puzzleId: PuzzleId): void => {
	try {
		sessionStorage.removeItem(draftStorageKey(puzzleId));
	} catch {
		// ignore quota / private-mode edge cases
	}
};
