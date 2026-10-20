import { useId, useRef } from 'react';
import { FIXED_PLACEMENTS } from '../data';
import {
	BOARD_CELLS,
	HEX_SIZE,
	axialToPixel,
	boardBounds,
	hexPolygonPoints,
	pixelToAxial,
} from '../hex';
import type { Axial, PieceId, Placement } from '../types';
import { toCellKey } from '../types';
import { RoomFloors } from './RoomFloors';

type Ghost = { cells: Axial[]; valid: boolean } | null;

type HexBoardProps = {
	placements: Placement[];
	ghost: Ghost;
	onHoverCell: (cell: Axial | null) => void;
	onCellActivate: (cell: Axial) => void;
};

export const HexBoard = ({
	placements,
	ghost,
	onHoverCell,
	onCellActivate,
}: HexBoardProps) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const floorId = useId();
	const bounds = boardBounds();
	const points = hexPolygonPoints(HEX_SIZE * 0.96);

	const occupancy = new Map<string, { pieceId: PieceId; locked: boolean }>();
	for (const placement of FIXED_PLACEMENTS) {
		for (const [q, r] of placement.cells) {
			occupancy.set(toCellKey(q, r), {
				pieceId: placement.pieceId,
				locked: true,
			});
		}
	}
	for (const placement of placements) {
		for (const [q, r] of placement.cells) {
			occupancy.set(toCellKey(q, r), {
				pieceId: placement.pieceId,
				locked: false,
			});
		}
	}

	const ghostSet = new Map<string, boolean>();
	if (ghost) {
		for (const [q, r] of ghost.cells) {
			ghostSet.set(toCellKey(q, r), ghost.valid);
		}
	}

	const eventToCell = (
		event: React.PointerEvent | React.MouseEvent
	): Axial | null => {
		const svg = svgRef.current;
		if (!svg) return null;
		const rect = svg.getBoundingClientRect();
		const viewX =
			((event.clientX - rect.left) / rect.width) * bounds.width + bounds.minX;
		const viewY =
			((event.clientY - rect.top) / rect.height) * bounds.height + bounds.minY;
		const cell = pixelToAxial(viewX, viewY);
		const key = toCellKey(cell[0], cell[1]);
		return BOARD_CELLS.some(([q, r]) => toCellKey(q, r) === key) ? cell : null;
	};

	return (
		<svg
			ref={svgRef}
			className="hex-board"
			viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
			role="img"
			aria-label="Plano hexagonal de la primera casa"
			onPointerMove={(event) => onHoverCell(eventToCell(event))}
			onPointerLeave={() => onHoverCell(null)}
			onPointerUp={(event) => {
				const cell = eventToCell(event);
				if (cell) onCellActivate(cell);
			}}
		>
			<RoomFloors idPrefix={floorId} />
			{BOARD_CELLS.map(([q, r]) => {
				const { x, y } = axialToPixel(q, r);
				const key = toCellKey(q, r);
				const owner = occupancy.get(key);
				const ghostValid = ghostSet.get(key);
				const fill = owner
					? `url(#${floorId}-${owner.pieceId})`
					: ghostValid === true
						? 'rgba(71, 96, 68, 0.38)'
						: ghostValid === false
							? 'rgba(164, 61, 50, 0.32)'
							: '#ebe6da';

				return (
					<g key={key} transform={`translate(${x} ${y})`}>
						<polygon
							points={points}
							fill={fill}
							stroke={owner?.locked ? '#2e2923' : 'rgba(46,41,35,0.55)'}
							strokeWidth={owner?.locked ? 2.6 : owner ? 2 : 1.6}
							className={
								owner && !owner.locked ? 'hex-cell placed' : 'hex-cell'
							}
						/>
						{owner && (
							<polygon
								points={points}
								fill="none"
								stroke="rgba(255,255,255,0.28)"
								strokeWidth={1}
								transform="scale(0.82)"
								pointerEvents="none"
							/>
						)}
						{owner?.locked && (
							<circle
								r={3.5}
								fill="#2e2923"
								stroke="#f3ebde"
								strokeWidth={1.2}
							/>
						)}
					</g>
				);
			})}
		</svg>
	);
};
