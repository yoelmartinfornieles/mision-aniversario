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

export const isCovered = (tile: GridPos, tiles: readonly GridPos[]): boolean =>
	tiles.some(
		(other) => other.x === tile.x && other.y === tile.y && other.z > tile.z
	);

export const hasNeighbor = (
	tile: GridPos,
	tiles: readonly GridPos[],
	dx: -1 | 1
): boolean =>
	tiles.some(
		(other) =>
			other.x === tile.x + dx && other.y === tile.y && other.z === tile.z
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

export type RescueResult =
	| { kind: 'pair'; tiles: [MahjongTile, MahjongTile] }
	| { kind: 'unsolvable' }
	| { kind: 'complete' }
	| { kind: 'inconclusive' };

export const findRescuePair = async (
	tiles: readonly MahjongTile[],
	isCancelled: () => boolean = () => false
): Promise<RescueResult> => {
	if (tiles.length === 0) return { kind: 'complete' };

	const bits = tiles.map((_, index) => 1n << BigInt(index));
	const maskFor = (predicate: (other: MahjongTile) => boolean) =>
		tiles.reduce(
			(mask, other, index) => (predicate(other) ? mask | bits[index] : mask),
			0n
		);
	const blockers = tiles.map((tile) => ({
		above: maskFor(
			(other) => other.x === tile.x && other.y === tile.y && other.z > tile.z
		),
		left: maskFor(
			(other) =>
				other.x === tile.x - 1 && other.y === tile.y && other.z === tile.z
		),
		right: maskFor(
			(other) =>
				other.x === tile.x + 1 && other.y === tile.y && other.z === tile.z
		),
	}));
	const dead = new Set<bigint>();
	let visited = 0;
	let exhausted = false;

	const solve = async (mask: bigint): Promise<[number, number] | null> => {
		visited += 1;
		if (visited % 512 === 0) {
			await new Promise<void>((resolve) => setTimeout(resolve, 0));
		}
		if (isCancelled() || visited > 100_000) {
			exhausted = true;
			return null;
		}
		if (dead.has(mask)) return null;
		const free = tiles
			.map((_, index) => index)
			.filter((index) => {
				const block = blockers[index];
				return (
					(mask & bits[index]) !== 0n &&
					(mask & block.above) === 0n &&
					((mask & block.left) === 0n || (mask & block.right) === 0n)
				);
			});
		for (let i = 0; i < free.length; i += 1) {
			for (let j = i + 1; j < free.length; j += 1) {
				const a = free[i];
				const b = free[j];
				if (!canMatch(tiles[a], tiles[b])) continue;
				const next = mask & ~bits[a] & ~bits[b];
				if (next === 0n || (await solve(next))) return [a, b];
				if (exhausted) return null;
			}
		}
		dead.add(mask);
		return null;
	};

	const pair = await solve((1n << BigInt(tiles.length)) - 1n);
	if (exhausted) return { kind: 'inconclusive' };
	if (!pair) return { kind: 'unsolvable' };
	return { kind: 'pair', tiles: [tiles[pair[0]], tiles[pair[1]]] };
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
