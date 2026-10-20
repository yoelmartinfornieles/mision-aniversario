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
			}}
			aria-label={`${face.label}${isFree ? '' : ' (bloqueada)'}${isRescue ? ' (pareja de rescate)' : ''}`}
			aria-pressed={isSelected}
			disabled={isMatched}
			onClick={() => onTileClick(tile)}
		>
			<span className="mahjong-tile-edge" aria-hidden />
			<span className="mahjong-tile-face">
				<span className="mahjong-tile-stamp" aria-hidden />
				<span className="mahjong-tile-glyph" aria-hidden>
					<TileIcon faceId={tile.faceId} />
				</span>
				<span className="mahjong-tile-label">{face.label}</span>
			</span>
		</button>
	);
});
