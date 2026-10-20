import { describe, expect, it } from 'vitest';
import { COPIES_PER_FACE, LAYOUT, TILE_FACES } from './data';
import { DEAL_SEED } from './constants';
import {
	canMatch,
	countFreeMatches,
	dealTiles,
	findRescuePair,
	getFreeTiles,
	isFree,
} from './logic';
import type { MahjongTile } from './types';

/**
 * `dealTiles` assigns faces while removing free pairs in play order, so
 * consecutive pairs in the returned array are a valid solution path.
 */
const followsDealSolutionPath = (tiles: MahjongTile[]): boolean => {
	let remaining = [...tiles];
	for (let i = 0; i < tiles.length; i += 2) {
		const a = tiles[i];
		const b = tiles[i + 1];
		if (!a || !b || !canMatch(a, b)) return false;
		if (!isFree(a, remaining) || !isFree(b, remaining)) return false;
		const remove = new Set([a.uid, b.uid]);
		remaining = remaining.filter((tile) => !remove.has(tile.uid));
	}
	return remaining.length === 0;
};

describe('dealTiles', () => {
	it('deals a full board for DEAL_SEED', () => {
		const tiles = dealTiles(DEAL_SEED);
		expect(tiles).toHaveLength(LAYOUT.length);
		expect(LAYOUT.length).toBe(TILE_FACES.length * COPIES_PER_FACE);

		const faceCounts = new Map<string, number>();
		for (const tile of tiles) {
			faceCounts.set(tile.faceId, (faceCounts.get(tile.faceId) ?? 0) + 1);
		}
		for (const face of TILE_FACES) {
			expect(faceCounts.get(face.id)).toBe(COPIES_PER_FACE);
		}
	});

	describe('findRescuePair', () => {
		it('guides the fixed deal all the way to an empty board', async () => {
			let remaining = dealTiles(DEAL_SEED);
			for (let move = 0; move < 32; move += 1) {
				const result = await findRescuePair(remaining);
				expect(result.kind).toBe('pair');
				if (result.kind !== 'pair') throw new Error('Expected a safe pair');
				const [a, b] = result.tiles;
				expect(canMatch(a, b)).toBe(true);
				expect(isFree(a, remaining)).toBe(true);
				expect(isFree(b, remaining)).toBe(true);
				remaining = remaining.filter(
					(tile) => tile.uid !== a.uid && tile.uid !== b.uid
				);
			}
			expect(remaining).toHaveLength(0);
			expect(await findRescuePair(remaining)).toEqual({ kind: 'complete' });
		});

		it('rejects a dead end even when a legal pair is available', async () => {
			const tiles: MahjongTile[] = [
				{ uid: 'a', faceId: 'home', x: 0, y: 0, z: 0 },
				{ uid: 'b', faceId: 'keys', x: 0, y: 0, z: 1 },
				{ uid: 'c', faceId: 'keys', x: 2, y: 0, z: 0 },
				{ uid: 'd', faceId: 'home', x: 2, y: 0, z: 1 },
				{ uid: 'e', faceId: 'heart', x: 4, y: 0, z: 0 },
				{ uid: 'f', faceId: 'heart', x: 6, y: 0, z: 0 },
			];
			expect(countFreeMatches(tiles)).toBe(1);
			expect(await findRescuePair(tiles)).toEqual({ kind: 'unsolvable' });
		});

		it('does not report a cancelled search as an unsolvable board', async () => {
			expect(await findRescuePair(dealTiles(DEAL_SEED), () => true)).toEqual({
				kind: 'inconclusive',
			});
		});
	});

	it('produces a solvable deal for the fixed DEAL_SEED', () => {
		const tiles = dealTiles(DEAL_SEED);
		expect(countFreeMatches(tiles)).toBeGreaterThan(0);
		expect(getFreeTiles(tiles).length).toBeGreaterThan(0);
		expect(followsDealSolutionPath(tiles)).toBe(true);
	});

	it('is deterministic for the same seed', () => {
		const a = dealTiles(DEAL_SEED);
		const b = dealTiles(DEAL_SEED);
		expect(a.map((t) => `${t.uid}:${t.faceId}:${t.x},${t.y},${t.z}`)).toEqual(
			b.map((t) => `${t.uid}:${t.faceId}:${t.x},${t.y},${t.z}`)
		);
	});
});
