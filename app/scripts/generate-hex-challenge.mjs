/**
 * Emit the hard challenge for seed 136 (already verified unique with entrada+terraza fixed).
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const rotate = ([q, r]) => [-r, q + r];
const flip = ([q, r]) => [q, -q - r];
const cellKey = (q, r) => `${q},${r}`;

const normalize = (cells) => {
	const minQ = Math.min(...cells.map(([q]) => q));
	const minR = Math.min(...cells.map(([, r]) => r));
	return cells
		.map(([q, r]) => [q - minQ, r - minR])
		.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};

const keyOf = (cells) =>
	normalize(cells)
		.map(([q, r]) => cellKey(q, r))
		.join('|');

const orientationsOf = (base) => {
	const seen = new Set();
	const out = [];
	let shape = base.map((c) => [...c]);
	for (let face = 0; face < 2; face++) {
		for (let rot = 0; rot < 6; rot++) {
			const k = keyOf(shape);
			if (!seen.has(k)) {
				seen.add(k);
				out.push({ face, rot, cells: normalize(shape) });
			}
			shape = shape.map(rotate);
		}
		shape = base.map(flip);
	}
	return out;
};

const R = 3;
const boardCells = [];
for (let q = -R; q <= R; q++) {
	for (let r = Math.max(-R, -q - R); r <= Math.min(R, -q + R); r++) {
		boardCells.push([q, r]);
	}
}
const boardSet = new Set(boardCells.map(([q, r]) => cellKey(q, r)));

const neighbors = (q, r) => [
	[q + 1, r],
	[q + 1, r - 1],
	[q, r - 1],
	[q - 1, r],
	[q - 1, r + 1],
	[q, r + 1],
];

const isConnected = (cells) => {
	const set = new Set(cells.map(([q, r]) => cellKey(q, r)));
	const stack = [cellKey(...cells[0])];
	const seen = new Set(stack);
	while (stack.length) {
		const [q, r] = stack.pop().split(',').map(Number);
		for (const [nq, nr] of neighbors(q, r)) {
			const nk = cellKey(nq, nr);
			if (set.has(nk) && !seen.has(nk)) {
				seen.add(nk);
				stack.push(nk);
			}
		}
	}
	return seen.size === cells.length;
};

const pieceSizes = {
	salon: 5,
	cocina: 5,
	dormitorio: 5,
	invitados: 5,
	lavadero: 5,
	terraza: 4,
	bano: 4,
	entrada: 4,
};

const mulberry = (seed) => {
	let t = seed >>> 0;
	return () => {
		t += 0x6d2b79f5;
		let r = Math.imul(t ^ (t >>> 15), 1 | t);
		r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
		return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
	};
};

const growPiece = (start, size, free, rng) => {
	const cells = [start];
	const used = new Set([cellKey(...start)]);
	while (cells.length < size) {
		const frontier = [];
		for (const [q, r] of cells) {
			for (const [nq, nr] of neighbors(q, r)) {
				const nk = cellKey(nq, nr);
				if (free.has(nk) && !used.has(nk)) frontier.push([nq, nr]);
			}
		}
		if (!frontier.length) return null;
		const next = frontier[Math.floor(rng() * frontier.length)];
		cells.push(next);
		used.add(cellKey(...next));
	}
	return isConnected(cells) ? cells : null;
};

const randomTiling = (rng) => {
	const free = new Set(boardCells.map(([q, r]) => cellKey(q, r)));
	const result = {};
	const order = Object.keys(pieceSizes)
		.map((id) => ({ id, w: rng() }))
		.sort((a, b) => a.w - b.w)
		.map((x) => x.id);
	for (const id of order) {
		const freeList = [...free].map((k) => k.split(',').map(Number));
		const start = freeList[Math.floor(rng() * freeList.length)];
		const cells = growPiece(start, pieceSizes[id], free, rng);
		if (!cells) return null;
		result[id] = cells;
		for (const [q, r] of cells) free.delete(cellKey(q, r));
	}
	return free.size === 0 ? result : null;
};

const translate = (cells, dq, dr) => cells.map(([q, r]) => [q + dq, r + dr]);

const buildPlacements = (pieces) => {
	const allPlacements = {};
	for (const p of pieces) {
		const uniq = new Map();
		for (const orient of orientationsOf(p.base)) {
			for (const [bq, br] of boardCells) {
				for (const [oq, or_] of orient.cells) {
					const placed = translate(orient.cells, bq - oq, br - or_);
					if (placed.every(([q, r]) => boardSet.has(cellKey(q, r)))) {
						const key = placed
							.map(([q, r]) => cellKey(q, r))
							.sort()
							.join('|');
						uniq.set(key, {
							face: orient.face,
							rot: orient.rot,
							cells: placed,
							key,
						});
					}
				}
			}
		}
		allPlacements[p.id] = [...uniq.values()];
	}
	return allPlacements;
};

/** Exact cover uniqueness check with MRV + forward check; cap at 2. */
const solveCount = (pieces, allPlacements, fixed, cap = 2) => {
	const occupied = new Map();
	for (const [id, pl] of Object.entries(fixed)) {
		for (const [q, r] of pl.cells) occupied.set(cellKey(q, r), id);
	}
	const freeIds = pieces.map((p) => p.id).filter((id) => !(id in fixed));
	let count = 0;

	const dfs = () => {
		if (count >= cap) return;
		if (freeIds.every((id) => occupiedHasPiece(id))) {
			// all placed tracked differently
		}
	};

	const placed = new Set(Object.keys(fixed));
	const path = { ...fixed };

	const run = () => {
		if (count >= cap) return;
		if (placed.size === pieces.length) {
			count += 1;
			return;
		}
		// MRV among unplaced
		let bestId = null;
		let bestOpts = null;
		for (const id of freeIds) {
			if (placed.has(id)) continue;
			const opts = allPlacements[id].filter(
				(pl) => !pl.cells.some(([q, r]) => occupied.has(cellKey(q, r)))
			);
			if (opts.length === 0) return;
			if (!bestOpts || opts.length < bestOpts.length) {
				bestId = id;
				bestOpts = opts;
				if (opts.length === 1) break;
			}
		}
		for (const pl of bestOpts) {
			for (const [q, r] of pl.cells) occupied.set(cellKey(q, r), bestId);
			placed.add(bestId);
			path[bestId] = pl;
			run();
			placed.delete(bestId);
			delete path[bestId];
			for (const [q, r] of pl.cells) occupied.delete(cellKey(q, r));
			if (count >= cap) return;
		}
	};

	const occupiedHasPiece = () => false;
	void occupiedHasPiece;
	void dfs;
	run();
	return count;
};

const SEED = 136;
const FIXED_IDS = ['entrada', 'terraza'];

const tiling = randomTiling(mulberry(SEED));
if (!tiling) {
	console.error('tiling failed for seed', SEED);
	process.exit(1);
}

const pieces = Object.entries(tiling).map(([id, cells]) => ({
	id,
	base: normalize(cells),
	solutionCells: cells,
}));

const allPlacements = buildPlacements(pieces);
const solutionPlacement = {};
for (const p of pieces) {
	const key = p.solutionCells
		.map(([q, r]) => cellKey(q, r))
		.sort()
		.join('|');
	const match = allPlacements[p.id].find((pl) => pl.key === key);
	if (!match) {
		console.error('no match', p.id);
		process.exit(1);
	}
	solutionPlacement[p.id] = match;
}

const fixed = Object.fromEntries(
	FIXED_IDS.map((id) => [id, solutionPlacement[id]])
);

console.log('verifying uniqueness...');
const n = solveCount(pieces, allPlacements, fixed, 2);
console.log('solutions:', n);
if (n !== 1) {
	console.error('expected unique');
	process.exit(1);
}

const labels = {
	salon: { label: 'Salón', hint: 'El corazón de la casa', color: '#c4a574' },
	cocina: {
		label: 'Cocina',
		hint: 'Donde se improvisaban cenas',
		color: '#d4896a',
	},
	dormitorio: {
		label: 'Dormitorio',
		hint: 'Cuatro paredes y un nuevo comienzo',
		color: '#7f9eb5',
	},
	invitados: {
		label: 'Habitación de invitados',
		hint: 'La cama de más',
		color: '#9b8bb8',
	},
	lavadero: {
		label: 'Lavadero',
		hint: 'Agua, jabón y ropa tendida',
		color: '#8fbc8f',
	},
	terraza: { label: 'Terraza', hint: 'Sol de Mallorca', color: '#e0c56a' },
	bano: { label: 'Baño', hint: 'Azulejos fríos', color: '#6faba0' },
	entrada: {
		label: 'Habitación de la entrada',
		hint: 'Lo primero que se veía al llegar',
		color: '#b0a89a',
	},
};

const fmt = (pl) => ({ face: pl.face, rot: pl.rot, cells: pl.cells });
const interest = pieces.reduce((s, p) => s + orientationsOf(p.base).length, 0);

const out = {
	boardRadius: R,
	seed: SEED,
	pieces: pieces.map((p) => ({
		id: p.id,
		...labels[p.id],
		base: p.base,
		locked: FIXED_IDS.includes(p.id),
	})),
	fixed: Object.fromEntries(
		Object.entries(fixed).map(([id, pl]) => [id, fmt(pl)])
	),
	solution: Object.fromEntries(
		Object.entries(solutionPlacement).map(([id, pl]) => [id, fmt(pl)])
	),
};

const dest = join(__dirname, '../src/puzzles/02-primera-casa/challenge.json');
writeFileSync(dest, JSON.stringify(out, null, 2));
console.log('RESULT wrote', dest, 'interest', interest, 'fixed', FIXED_IDS.join('+'));
