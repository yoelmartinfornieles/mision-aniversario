import { describe, expect, it } from 'vitest';
import {
	getRoomForPosition,
	isBesideFurniture,
	parseCellKey,
	toCellKey,
	type CellKey,
	type Placements,
} from '@/puzzles/shared/murdoku';
import {
	furnitureCells as furniture01,
	HINTS as hints01,
	roomMatrix as rooms01,
	suspects as suspects01,
	windowCells as windows01,
} from '@/puzzles/01-cuando-empezo/data';
import { isBoardSolved as solved01 } from '@/puzzles/01-cuando-empezo/logic';
import { SOLUTION as solution01 } from '@/puzzles/01-cuando-empezo/solution';
import {
	furnitureCells as furniture03,
	HINTS as hints03,
	roomMatrix as rooms03,
	suspects as suspects03,
	windowCells as windows03,
} from '@/puzzles/03-nacimiento-kai/data';
import { isBoardSolved as solved03 } from '@/puzzles/03-nacimiento-kai/logic';
import { SOLUTION as solution03 } from '@/puzzles/03-nacimiento-kai/solution';
import {
	furnitureCells as furniture05,
	HINTS as hints05,
	roomMatrix as rooms05,
	suspects as suspects05,
	windowCells as windows05,
} from '@/puzzles/05-complot-regalo/data';
import { isBoardSolved as solved05 } from '@/puzzles/05-complot-regalo/logic';
import { SOLUTION as solution05 } from '@/puzzles/05-complot-regalo/solution';
import type { FurnitureCell, WindowEdge } from './MurdokuBoard';

const CARDINAL = /\b(norte|sur|este|oeste)\b/i;

type Grid = {
	roomMatrix: string[][];
	furniture: Partial<Record<CellKey, FurnitureCell>>;
	windows: Partial<Record<CellKey, WindowEdge>>;
};

const roomOf = (grid: Grid, cell: CellKey) =>
	getRoomForPosition(cell, grid.roomMatrix);

const onKind = (grid: Grid, cell: CellKey, kind: string) =>
	grid.furniture[cell]?.kind === kind;

const beside = (grid: Grid, cell: CellKey, kind: string) =>
	isBesideFurniture(cell, kind, grid.furniture, grid.roomMatrix);

const shelfNeighbors = (grid: Grid, cell: CellKey) => {
	const { row, column } = parseCellKey(cell);
	const room = roomOf(grid, cell);
	return [
		toCellKey(row - 1, column),
		toCellKey(row + 1, column),
		toCellKey(row, column - 1),
		toCellKey(row, column + 1),
	].filter((key) => {
		const furniture = grid.furniture[key];
		return furniture?.kind === 'estantería' && roomOf(grid, key) === room;
	}).length;
};

/** Orthogonal gap flanked by the same furniture kind (same room), e.g. entre dos farolas. */
const betweenKind = (grid: Grid, cell: CellKey, kind: string) => {
	const { row, column } = parseCellKey(cell);
	const room = roomOf(grid, cell);
	const is = (r: number, c: number) => {
		const key = toCellKey(r, c);
		return grid.furniture[key]?.kind === kind && roomOf(grid, key) === room;
	};
	return (
		(is(row, column - 1) && is(row, column + 1)) ||
		(is(row - 1, column) && is(row + 1, column))
	);
};

const isRoomCorner = (grid: Grid, cell: CellKey) => {
	const room = roomOf(grid, cell);
	const { row, column } = parseCellKey(cell);
	let minRow = Infinity;
	let maxRow = -1;
	let minColumn = Infinity;
	let maxColumn = -1;
	grid.roomMatrix.forEach((line, rowIndex) => {
		line.forEach((name, columnIndex) => {
			if (name !== room) return;
			minRow = Math.min(minRow, rowIndex);
			maxRow = Math.max(maxRow, rowIndex);
			minColumn = Math.min(minColumn, columnIndex);
			maxColumn = Math.max(maxColumn, columnIndex);
		});
	});
	return (
		(row === minRow || row === maxRow) &&
		(column === minColumn || column === maxColumn)
	);
};

const candidates = (grid: Grid, accept: (cell: CellKey) => boolean) => {
	const found: CellKey[] = [];
	grid.roomMatrix.forEach((line, row) => {
		line.forEach((_, column) => {
			const cell = toCellKey(row, column);
			if (grid.furniture[cell]?.role === 'blocking') return;
			if (accept(cell)) found.push(cell);
		});
	});
	return found;
};

const placementsOf = (solution: Record<number, CellKey>): Placements =>
	Object.fromEntries(
		Object.entries(solution).map(([id, cell]) => [cell, Number(id)])
	);

const countSolutions = (
	size: number,
	people: Array<{ id: number; cells: CellKey[] }>,
	victimId: number,
	blocked: (cell: CellKey) => boolean,
	accept: (placement: Record<number, CellKey>) => boolean
) => {
	const solutions: Array<Record<number, CellKey>> = [];
	const usedRows = new Set<number>();
	const usedColumns = new Set<number>();
	const placement: Record<number, CellKey> = {};

	const walk = (index: number) => {
		if (index === people.length) {
			let row = -1;
			let column = -1;
			for (let index = 0; index < size; index += 1) {
				if (!usedRows.has(index)) row = index;
				if (!usedColumns.has(index)) column = index;
			}
			const cell = toCellKey(row, column);
			if (blocked(cell)) return;
			placement[victimId] = cell;
			if (accept({ ...placement })) solutions.push({ ...placement });
			delete placement[victimId];
			return;
		}

		for (const cell of people[index].cells) {
			const { row, column } = parseCellKey(cell);
			if (usedRows.has(row) || usedColumns.has(column)) continue;
			usedRows.add(row);
			usedColumns.add(column);
			placement[people[index].id] = cell;
			walk(index + 1);
			delete placement[people[index].id];
			usedRows.delete(row);
			usedColumns.delete(column);
		}
	};

	walk(0);
	return solutions;
};

const sameAs = (
	found: Record<number, CellKey>,
	expected: Record<number, CellKey>
) =>
	Object.entries(expected).every(
		([id, cell]) => found[Number(id)] === cell
	);

const roomCount = (
	grid: Grid,
	placement: Record<number, CellKey>,
	room: string
) =>
	Object.values(placement).filter((cell) => roomOf(grid, cell) === room)
		.length;

describe('murdoku clues avoid cardinal directions and stay unique', () => {
	it('keeps norte/sur/este/oeste out of dossiers 01 and 03', () => {
		for (const { suspects, hints } of [
			{ suspects: suspects01, hints: hints01 },
			{ suspects: suspects03, hints: hints03 },
		]) {
			for (const suspect of suspects) {
				expect(suspect.clue).not.toMatch(CARDINAL);
			}
			for (const hint of hints) {
				expect(hint).not.toMatch(CARDINAL);
			}
		}
	});

	it('allows a single cardinal in puzzle 05 (Kai north of Haizea)', () => {
		const clueHits = suspects05.flatMap((suspect) => {
			const match = suspect.clue.match(CARDINAL);
			return match?.[1] ? [match[1].toLowerCase()] : [];
		});
		expect(clueHits).toEqual(['norte']);
		expect(suspects05[1]?.clue).toMatch(/al norte de Haizea/i);
		expect(hints05.filter((hint) => CARDINAL.test(hint))).toHaveLength(2);
	});

	it('forces a Kai/Haizea norte fork before the unique pair survives', () => {
		const grid: Grid = {
			roomMatrix: rooms05,
			furniture: furniture05,
			windows: windows05,
		};
		const yoelCarros = candidates(grid, (cell) =>
			onKind(grid, cell, 'carro de chuches')
		);
		const haizeaWindows = candidates(
			grid,
			(cell) =>
				roomOf(grid, cell) === 'Avenida' && grid.windows[cell] !== undefined
		);
		const nortePairs = yoelCarros.flatMap((yoel) =>
			haizeaWindows
				.filter(
					(haizea) =>
						parseCellKey(yoel).row < parseCellKey(haizea).row
				)
				.map((haizea) => `${yoel}+${haizea}`)
		);
		expect(nortePairs.length).toBeGreaterThanOrEqual(4);
		expect(nortePairs).toContain('0-0+1-7');
	});

	it('gives puzzle 05 a full ask-a-hint walkthrough that names each placement', () => {
		const joined = hints05.join('\n');
		for (const name of [
			'Haizea',
			'Yoel',
			'Luar',
			'Kai',
			'Saioa',
			'George',
			'Unai',
			'Carla',
		]) {
			expect(joined, name).toContain(name);
		}
		// Actionable placements — not “try and backtrack”.
		expect(joined).toMatch(/Ponla en la ventana de la derecha/i);
		expect(joined).toMatch(/carro de arriba-izquierda/i);
		expect(joined).toMatch(/hueco de arriba/i);
		expect(joined).toMatch(/carro del Castillo/i);
		expect(joined).toMatch(/carrusel de la Plaza/i);
		expect(joined).toMatch(/Ponlo en la otra/i);
		expect(joined).not.toMatch(/vuelve atrás|prueba un par/i);
	});

	it('has a single solution for Cuando todo comenzó', () => {
		const grid: Grid = {
			roomMatrix: rooms01,
			furniture: furniture01,
			windows: windows01,
		};
		const people = [
			{
				id: 1,
				cells: candidates(
					grid,
					(cell) =>
						roomOf(grid, cell) === 'Bar' &&
						onKind(grid, cell, 'alfombra')
				),
			},
			{
				id: 2,
				cells: candidates(
					grid,
					(cell) =>
						roomOf(grid, cell) === 'Sótano Secreto' &&
						grid.windows[cell] !== undefined
				),
			},
			{
				id: 3,
				cells: candidates(
					grid,
					(cell) =>
						roomOf(grid, cell) === 'Bar' &&
						grid.windows[cell] !== undefined &&
						!onKind(grid, cell, 'alfombra')
				),
			},
			{
				id: 5,
				cells: candidates(
					grid,
					(cell) =>
						roomOf(grid, cell) === 'Sótano Secreto' &&
						isRoomCorner(grid, cell) &&
						!beside(grid, cell, 'estantería')
				),
			},
			{
				id: 6,
				cells: candidates(
					grid,
					(cell) =>
						onKind(grid, cell, 'taburete') &&
						roomOf(grid, cell) !== 'Bar'
				),
			},
			{
				id: 7,
				cells: candidates(
					grid,
					(cell) =>
						shelfNeighbors(grid, cell) >= 2 &&
						!isRoomCorner(grid, cell)
				),
			},
			{
				id: 8,
				cells: candidates(
					grid,
					(cell) =>
						roomOf(grid, cell) === 'Almacén' &&
						onKind(grid, cell, 'alfombra')
				),
			},
			{
				id: 9,
				cells: candidates(
					grid,
					(cell) =>
						roomOf(grid, cell) === 'Comedor' &&
						grid.windows[cell] !== undefined
				),
			},
		];

		const solutions = countSolutions(
			9,
			people,
			4,
			(cell) => grid.furniture[cell]?.role === 'blocking',
			(placement) =>
				roomCount(grid, placement, roomOf(grid, placement[4])!) === 2
		);

		expect(solutions).toHaveLength(1);
		expect(sameAs(solutions[0], solution01)).toBe(true);
		expect(solved01(placementsOf(solution01))).toBe(true);
	});

	it('has a single solution for Nacimiento de Kai', () => {
		const grid: Grid = {
			roomMatrix: rooms03,
			furniture: furniture03,
			windows: windows03,
		};
		const people = [
			{
				id: 1,
				cells: candidates(
					grid,
					(cell) =>
						roomOf(grid, cell) === 'Balcón' &&
						grid.windows[cell] !== undefined
				),
			},
			{
				id: 2,
				cells: candidates(
					grid,
					(cell) =>
						onKind(grid, cell, 'alfombra') &&
						beside(grid, cell, 'cuna')
				),
			},
			{
				id: 4,
				cells: candidates(
					grid,
					(cell) =>
						roomOf(grid, cell) === 'Salón' &&
						grid.windows[cell] !== undefined
				),
			},
			{
				id: 5,
				cells: candidates(
					grid,
					(cell) =>
						roomOf(grid, cell) === 'Entrada' &&
						grid.windows[cell] !== undefined
				),
			},
			{
				id: 6,
				cells: candidates(
					grid,
					(cell) =>
						onKind(grid, cell, 'banco') &&
						roomOf(grid, cell) !== 'Salón'
				),
			},
			{
				id: 7,
				cells: candidates(
					grid,
					(cell) =>
						beside(grid, cell, 'nevera') &&
						beside(grid, cell, 'fregadera')
				),
			},
			{
				id: 8,
				cells: candidates(
					grid,
					(cell) =>
						onKind(grid, cell, 'sofá') &&
						beside(grid, cell, 'tele')
				),
			},
			{
				id: 9,
				cells: candidates(
					grid,
					(cell) =>
						roomOf(grid, cell) === 'WC' && beside(grid, cell, 'lavabo')
				),
			},
			{
				id: 10,
				cells: candidates(
					grid,
					(cell) =>
						roomOf(grid, cell) === 'Salón' &&
						onKind(grid, cell, 'alfombra')
				),
			},
		];

		const solutions = countSolutions(
			10,
			people,
			3,
			(cell) => grid.furniture[cell]?.role === 'blocking',
			(placement) =>
				roomCount(grid, placement, roomOf(grid, placement[3])!) === 2
		);

		expect(solutions).toHaveLength(1);
		expect(sameAs(solutions[0], solution03)).toBe(true);
		expect(solved03(placementsOf(solution03))).toBe(true);
	});

	it('has a single solution for El complot del regalo', () => {
		const grid: Grid = {
			roomMatrix: rooms05,
			furniture: furniture05,
			windows: windows05,
		};
		const people = [
			{
				id: 1,
				cells: candidates(
					grid,
					(cell) =>
						onKind(grid, cell, 'carro de chuches') &&
						beside(grid, cell, 'castillo') &&
						!isRoomCorner(grid, cell)
				),
			},
			{
				id: 2,
				cells: candidates(grid, (cell) =>
					onKind(grid, cell, 'carro de chuches')
				),
			},
			{
				id: 3,
				cells: candidates(
					grid,
					(cell) =>
						roomOf(grid, cell) === 'Espacio' &&
						grid.windows[cell] !== undefined &&
						betweenKind(grid, cell, 'farola')
				),
			},
			{
				id: 4,
				cells: candidates(
					grid,
					(cell) =>
						roomOf(grid, cell) === 'Avenida' &&
						grid.windows[cell] !== undefined
				),
			},
			{
				id: 5,
				cells: candidates(
					grid,
					(cell) =>
						onKind(grid, cell, 'carrusel') &&
						roomOf(grid, cell) !== 'Cuentos'
				),
			},
			{
				id: 6,
				cells: candidates(
					grid,
					(cell) =>
						roomOf(grid, cell) === 'Muelle' &&
						grid.windows[cell] !== undefined &&
						beside(grid, cell, 'barco')
				),
			},
			{
				id: 7,
				cells: candidates(
					grid,
					(cell) =>
						beside(grid, cell, 'montaña rusa') &&
						roomOf(grid, cell) !== 'Cuentos'
				),
			},
		];

		const solutions = countSolutions(
			8,
			people,
			8,
			(cell) => grid.furniture[cell]?.role === 'blocking',
			(placement) => {
				if (roomCount(grid, placement, roomOf(grid, placement[8])!) !== 2) {
					return false;
				}
				// Kai al norte de Haizea
				return (
					parseCellKey(placement[2]!).row < parseCellKey(placement[4]!).row
				);
			}
		);

		expect(solutions).toHaveLength(1);
		expect(sameAs(solutions[0], solution05)).toBe(true);
		expect(solved05(placementsOf(solution05))).toBe(true);
	});

	it('plants extra carpets and windows in every room that uses them', () => {
		const grids = [
			{
				suspects: suspects01,
				grid: {
					roomMatrix: rooms01,
					furniture: furniture01,
					windows: windows01,
				} satisfies Grid,
			},
			{
				suspects: suspects03,
				grid: {
					roomMatrix: rooms03,
					furniture: furniture03,
					windows: windows03,
				} satisfies Grid,
			},
			{
				suspects: suspects05,
				grid: {
					roomMatrix: rooms05,
					furniture: furniture05,
					windows: windows05,
				} satisfies Grid,
			},
		];

		for (const { suspects, grid } of grids) {
			const rooms = [...new Set(grid.roomMatrix.flat())].sort(
				(a, b) => b.length - a.length
			);
			const tally = (room: string, kind: 'alfombra' | 'ventana') => {
				let count = 0;
				grid.roomMatrix.forEach((line, row) => {
					line.forEach((name, column) => {
						if (name !== room) return;
						const cell = toCellKey(row, column);
						if (kind === 'alfombra' && onKind(grid, cell, 'alfombra')) {
							count += 1;
						}
						if (kind === 'ventana' && grid.windows[cell]) count += 1;
					});
				});
				return count;
			};

			for (const suspect of suspects) {
				const room = rooms.find((name) => suspect.clue.includes(name));
				if (!room) continue;
				if (suspect.clue.includes('alfombra')) {
					expect(tally(room, 'alfombra'), suspect.clue).toBeGreaterThan(1);
				}
				if (suspect.clue.includes('ventana')) {
					expect(tally(room, 'ventana'), suspect.clue).toBeGreaterThan(1);
				}
			}
		}
	});

	it('puts every window on a wall', () => {
		const facesWall = (
			grid: Grid,
			cell: CellKey,
			edge: 'top' | 'bottom' | 'left' | 'right'
		) => {
			const { row, column } = parseCellKey(cell);
			const room = roomOf(grid, cell);
			const nextRow = row + (edge === 'top' ? -1 : edge === 'bottom' ? 1 : 0);
			const nextColumn =
				column + (edge === 'left' ? -1 : edge === 'right' ? 1 : 0);
			const lines = grid.roomMatrix;
			if (
				nextRow < 0 ||
				nextColumn < 0 ||
				nextRow >= lines.length ||
				nextColumn >= lines[0].length
			) {
				return true;
			}
			return lines[nextRow][nextColumn] !== room;
		};

		for (const grid of [
			{ roomMatrix: rooms01, furniture: furniture01, windows: windows01 },
			{ roomMatrix: rooms03, furniture: furniture03, windows: windows03 },
			{ roomMatrix: rooms05, furniture: furniture05, windows: windows05 },
		] satisfies Grid[]) {
			for (const [cell, edge] of Object.entries(grid.windows)) {
				if (!edge) continue;
				expect(facesWall(grid, cell as CellKey, edge), cell).toBe(true);
			}
		}
	});
});
