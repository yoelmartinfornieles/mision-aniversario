import type { ClueHighlight } from './clueText';
import type { FurnitureCell } from './MurdokuBoard';

type HighlightArgs = {
	highlight: ClueHighlight | null;
	roomMatrix: string[][];
	furnitureCells: Partial<Record<string, FurnitureCell>>;
	placements: Partial<Record<string, number>>;
	suspects: Array<{ id: number; name: string }>;
};

export const keysForHighlight = ({
	highlight,
	roomMatrix,
	furnitureCells,
	placements,
	suspects,
}: HighlightArgs): Set<string> => {
	const keys = new Set<string>();
	if (!highlight) return keys;

	const rows = roomMatrix.length;
	const cols = roomMatrix[0]?.length ?? 0;

	if (highlight.type === 'room') {
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				if (roomMatrix[r][c].toLowerCase() === highlight.value.toLowerCase()) {
					keys.add(`${r}-${c}`);
				}
			}
		}
		return keys;
	}

	if (highlight.type === 'object') {
		const needle = highlight.value.toLowerCase();
		for (const [key, furniture] of Object.entries(furnitureCells)) {
			if (!furniture) continue;
			if (
				furniture.kind.toLowerCase() === needle ||
				furniture.kind.toLowerCase().includes(needle) ||
				needle.includes(furniture.kind.toLowerCase())
			) {
				keys.add(key);
			}
		}
		return keys;
	}

	if (highlight.type === 'person') {
		const suspect = suspects.find(
			(entry) =>
				entry.name.toLowerCase() === highlight.value.toLowerCase() ||
				entry.name.toLowerCase().includes(highlight.value.toLowerCase())
		);
		if (suspect) {
			for (const [key, id] of Object.entries(placements)) {
				if (id === suspect.id) keys.add(key);
			}
		}
		return keys;
	}

	return keys;
};

export const lockedLinesFromPlacements = (
	placements: Partial<Record<string, number>>
): { rows: Set<number>; columns: Set<number> } => {
	const rows = new Set<number>();
	const columns = new Set<number>();
	for (const key of Object.keys(placements)) {
		const [row, column] = key.split('-').map(Number);
		rows.add(row);
		columns.add(column);
	}
	return { rows, columns };
};
