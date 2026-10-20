import { PIECE_BY_ID } from '../data';
import type { PieceId } from '../types';
import { PieceShape } from './PieceShape';

type PieceTrayProps = {
	trayPieceIds: PieceId[];
	selectedId: PieceId | null;
	poses: Record<PieceId, { face: 0 | 1; rot: number }>;
	onSelect: (pieceId: PieceId) => void;
};

export const PieceTray = ({
	trayPieceIds,
	selectedId,
	poses,
	onSelect,
}: PieceTrayProps) => (
	<ul className="hex-tray" aria-label="Estancias por colocar">
		{trayPieceIds.map((pieceId) => {
			const piece = PIECE_BY_ID[pieceId];
			const pose = poses[pieceId];
			const selected = selectedId === pieceId;
			const letter = piece.label.charAt(0).toUpperCase();
			return (
				<li key={pieceId}>
					<button
						type="button"
						className={`hex-tray-item${selected ? ' selected' : ''}`}
						onPointerDown={() => onSelect(pieceId)}
						aria-pressed={selected}
					>
						<span className="hex-tray-header">
							<span className="hex-tray-letter">{letter}</span>
							<span className="hex-tray-label">{piece.label}</span>
						</span>
						<span className="hex-tray-hint">{piece.hint}</span>
						<PieceShape
							pieceId={pieceId}
							face={pose.face}
							rot={pose.rot}
							interactive
						/>
						<span className="hex-tray-face">
							cara {pose.face === 0 ? 'A' : 'B'} · {pose.rot * 60}°
						</span>
					</button>
				</li>
			);
		})}
		{trayPieceIds.length === 0 && (
			<li className="hex-tray-empty">Todas las estancias están en el plano.</li>
		)}
	</ul>
);
