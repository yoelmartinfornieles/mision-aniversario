import { useId } from 'react';
import { PIECE_BY_ID } from '../data';
import { HEX_SIZE, axialToPixel, hexPolygonPoints } from '../hex';
import { getOrientedShape } from '../logic';
import type { Axial, PieceId } from '../types';
import { RoomFloors } from './RoomFloors';

type PieceShapeProps = {
	pieceId: PieceId;
	face?: 0 | 1;
	rot?: number;
	/** Absolute cells — if set, ignores face/rot base rendering origin. */
	cells?: Axial[];
	size?: number;
	opacity?: number;
	className?: string;
	dimmed?: boolean;
	interactive?: boolean;
	onPointerDown?: (event: React.PointerEvent) => void;
};

export const PieceShape = ({
	pieceId,
	face = 0,
	rot = 0,
	cells,
	size = HEX_SIZE * 0.72,
	opacity = 1,
	className,
	dimmed = false,
	interactive = false,
	onPointerDown,
}: PieceShapeProps) => {
	const floorId = useId();
	const piece = PIECE_BY_ID[pieceId];
	const shape = cells ?? getOrientedShape(piece.base, face, rot);
	const points = hexPolygonPoints(size);

	const centers = shape.map(([q, r]) => {
		const { x, y } = axialToPixel(q, r, size);
		return { x, y, q, r };
	});
	const xs = centers.map((c) => c.x);
	const ys = centers.map((c) => c.y);
	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);

	const pad = size * 1.15;
	const width = maxX - minX + pad * 2;
	const height = maxY - minY + pad * 2;

	return (
		<svg
			className={`hex-piece${className ? ` ${className}` : ''}${dimmed ? ' dimmed' : ''}${interactive ? ' interactive' : ''}`}
			viewBox={`${minX - pad} ${minY - pad} ${width} ${height}`}
			opacity={opacity}
			aria-hidden={!interactive}
			onPointerDown={onPointerDown}
		>
			<RoomFloors idPrefix={floorId} size={size} />
			{centers.map(({ x, y, q, r }) => (
				<g key={`${q},${r}`} transform={`translate(${x} ${y})`}>
					<polygon
						points={points}
						fill={`url(#${floorId}-${pieceId})`}
						stroke="#2e2923"
						strokeWidth={2}
						strokeLinejoin="round"
					/>
					<polygon
						points={points}
						fill="none"
						stroke="rgba(255,255,255,0.3)"
						strokeWidth={1}
						transform="scale(0.78)"
					/>
				</g>
			))}
		</svg>
	);
};
