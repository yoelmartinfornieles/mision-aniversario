import { COPIES_PER_FACE, LAYOUT, TILE_FACES } from './data';
import type { GridPos, MahjongTile, TileFaceId } from './types';

/** Mulberry32 — small deterministic PRNG. */
export const createRng = (seed: number) => {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};

const shuffleInPlace = <T>(items: T[], rng: () => number): T[] => {
	for (let i = items.length - 1; i > 0; i -= 1) {
		const j = Math.floor(rng() * (i + 1));
		[items[i], items[j]] = [items[j], items[i]];
	}
	return items;
};

const posKey = (pos: GridPos): string => `${pos.x},${pos.y},${pos.z}`;

export const isCovered = (
	tile: GridPos,
	tiles: readonly GridPos[]
): boolean =>
	tiles.some(
		(other) =>
			other.x === tile.x && other.y === tile.y && other.z > tile.z
	);

export const hasNeighbor = (
	tile: GridPos,
	tiles: readonly GridPos[],
	dx: -1 | 1
): boolean =>
	tiles.some(
		(other) =>
			other.x === tile.x + dx &&
			other.y === tile.y &&
			other.z === tile.z
	);

/** Classic rule: nothing above, and open on the left or the right. */
export const isFree = (tile: GridPos, tiles: readonly GridPos[]): boolean => {
	if (isCovered(tile, tiles)) return false;
	const blockedLeft = hasNeighbor(tile, tiles, -1);
	const blockedRight = hasNeighbor(tile, tiles, 1);
	return !blockedLeft || !blockedRight;
};

export const getFreeTiles = <T extends GridPos>(tiles: readonly T[]): T[] =>
	tiles.filter((tile) => isFree(tile, tiles));

export const canMatch = (a: MahjongTile, b: MahjongTile): boolean =>
	a.uid !== b.uid && a.faceId === b.faceId;

export const countFreeMatches = (tiles: readonly MahjongTile[]): number => {
	const free = getFreeTiles(tiles);
	const counts = new Map<TileFaceId, number>();
	for (const tile of free) {
		counts.set(tile.faceId, (counts.get(tile.faceId) ?? 0) + 1);
	}
	let pairs = 0;
	for (const count of counts.values()) {
		pairs += Math.floor(count / 2);
	}
	return pairs;
};

/** One entry per match-pair (16 faces × 2 pairs = 32). */
const buildPairFaces = (): TileFaceId[] => {
	const pairs: TileFaceId[] = [];
	for (const face of TILE_FACES) {
		const pairCount = COPIES_PER_FACE / 2;
		for (let i = 0; i < pairCount; i += 1) {
			pairs.push(face.id);
		}
	}
	return pairs;
};

/**
 * Deal by simulating classic play: repeatedly remove a free pair from the
 * full layout and stamp matching faces. The resulting board is solvable
 * (at least along this removal order).
 */
export const dealTiles = (seed: number): MahjongTile[] => {
	if (LAYOUT.length !== TILE_FACES.length * COPIES_PER_FACE) {
		throw new Error('Layout size must match face copies');
	}

	for (let attempt = 0; attempt < 200; attempt += 1) {
		const rng = createRng(seed + attempt * 9973);
		const pairFaces = shuffleInPlace(buildPairFaces(), rng);
		let remaining: GridPos[] = LAYOUT.map((pos) => ({ ...pos }));
		const assigned: MahjongTile[] = [];
		let pairIndex = 0;
		let failed = false;

		while (remaining.length > 0) {
			const free = getFreeTiles(remaining);
			if (free.length < 2) {
				failed = true;
				break;
			}

			shuffleInPlace(free, rng);
			const posA = free[0];
			const posB = free[1];
			const faceId = pairFaces[pairIndex];
			pairIndex += 1;

			assigned.push(
				{
					...posA,
					uid: `t-${assigned.length}`,
					faceId,
				},
				{
					...posB,
					uid: `t-${assigned.length + 1}`,
					faceId,
				}
			);

			const removeKeys = new Set([posKey(posA), posKey(posB)]);
			remaining = remaining.filter((pos) => !removeKeys.has(posKey(pos)));
		}

		if (!failed && remaining.length === 0) {
			return assigned;
		}
	}

	throw new Error('Could not deal a solvable mahjong layout');
};

export const boardBounds = (tiles: readonly GridPos[]) => {
	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;
	let maxZ = 0;
	for (const tile of tiles) {
		minX = Math.min(minX, tile.x);
		maxX = Math.max(maxX, tile.x);
		minY = Math.min(minY, tile.y);
		maxY = Math.max(maxY, tile.y);
		maxZ = Math.max(maxZ, tile.z);
	}
	return { minX, maxX, minY, maxY, maxZ };
};
