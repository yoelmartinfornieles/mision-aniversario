import { memo } from 'react';
import { FACE_BY_ID } from '../data';
import type { MahjongTile } from '../types';
import { TileIcon } from './tileIcons';

type TileProps = {
	tile: MahjongTile;
	left: number;
	top: number;
	isFree: boolean;
	isSelected: boolean;
	isMatched: boolean;
	isReject: boolean;
	isRescue: boolean;
	onTileClick: (tile: MahjongTile) => void;
};

export const Tile = memo(function Tile({
	tile,
	left,
	top,
	isFree,
	isSelected,
	isMatched,
	isReject,
	isRescue,
	onTileClick,
}: TileProps) {
	const face = FACE_BY_ID[tile.faceId];

	return (
		<button
			type="button"
			className={[
				'mahjong-tile',
				isFree ? 'is-free' : 'is-blocked',
				isSelected ? 'is-selected' : '',
				isMatched ? 'is-matched' : '',
				isReject ? 'is-reject' : '',
				isRescue ? 'is-rescue' : '',
			]
				.filter(Boolean)
				.join(' ')}
			style={{
				left,
				top,
				zIndex: 10 + tile.z * 20 + tile.y,
				['--tile-tone' as string]: face.tone,
				['--tile-level' as string]: tile.z,
			}}
			aria-label={`${face.label}${isFree ? '' : ' (bloqueada)'}${isRescue ? ' (pareja de rescate)' : ''}`}
			aria-pressed={isSelected}
			disabled={isMatched}
			onClick={() => onTileClick(tile)}
		>
			<span className="mahjong-tile-edge" aria-hidden />
			<span className="mahjong-tile-face">
				<svg
					className="mahjong-tile-stamp"
					viewBox="0 0 32 32"
					aria-hidden
					focusable="false"
				>
					<path
						fill="currentColor"
						d="M13 29C5 28 1 22 2 14C3 6 10 1 18 3C26 4 31 11 29 19C28 23 25 27 21 28C25 25 27 21 27 17C28 10 23 5 17 5C10 5 6 10 6 16C5 22 9 25 14 25L16 26 15 28Z"
					/>
					<path
						d="M17 29C25 29 31 21 30 14C29 6 22 1 14 2M12 27C5 25 2 19 4 12M21 26C27 23 29 16 26 10"
						fill="none"
						stroke="currentColor"
						strokeWidth=".65"
						strokeLinecap="round"
						opacity=".65"
					/>
				</svg>
				<span className="mahjong-tile-glyph" aria-hidden>
					<TileIcon faceId={tile.faceId} />
				</span>
				<span
					className={`mahjong-tile-label${face.label.length > 9 ? ' is-long' : ''}`}
				>
					{face.label}
				</span>
			</span>
		</button>
	);
});
