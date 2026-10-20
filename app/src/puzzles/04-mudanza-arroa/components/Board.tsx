import { useEffect, useMemo, useRef, useState } from 'react';
import {
	TILE_DEPTH,
	TILE_HEIGHT,
	TILE_WIDTH,
} from '../constants';
import { LAYOUT } from '../data';
import { boardBounds } from '../logic';
import type { MahjongTile } from '../types';
import { Tile } from './Tile';

type BoardProps = {
	tiles: MahjongTile[];
	freeIds: Set<string>;
	selectedId: string | null;
	matchedPulse: string[];
	rejectPulse: string[];
	rescueIds: string[];
	backgroundSrc: string;
	onTileClick: (tile: MahjongTile) => void;
};

export const Board = ({
	tiles,
	freeIds,
	selectedId,
	matchedPulse,
	rejectPulse,
	rescueIds,
	backgroundSrc,
	onTileClick,
}: BoardProps) => {
	const frameRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);

	const bounds = boardBounds(LAYOUT);
	const width =
		(bounds.maxX - bounds.minX + 1) * TILE_WIDTH + TILE_DEPTH * 2 + 24;
	const height =
		(bounds.maxY - bounds.minY + 1) * TILE_HEIGHT +
		bounds.maxZ * TILE_DEPTH +
		TILE_DEPTH * 2 +
		24;

	useEffect(() => {
		const frame = frameRef.current;
		const parent = frame?.parentElement;
		if (!frame || !parent) return;

		const updateScale = () => {
			const available = parent.clientWidth;
			if (available <= 0) return;
			setScale(Math.min(1, available / width));
		};

		updateScale();
		const observer = new ResizeObserver(updateScale);
		observer.observe(parent);
		return () => observer.disconnect();
	}, [width]);

	const sorted = useMemo(
		() =>
			[...tiles].sort((a, b) => {
				if (a.z !== b.z) return a.z - b.z;
				if (a.y !== b.y) return a.y - b.y;
				return a.x - b.x;
			}),
		[tiles]
	);

	const scaledWidth = width * scale;
	const scaledHeight = height * scale;

	return (
		<div
			className="mahjong-board-frame"
			ref={frameRef}
			style={{ width: scaledWidth, height: scaledHeight }}
		>
			<div
				className="mahjong-board"
				style={{
					width,
					height,
					transform: `scale(${scale})`,
					transformOrigin: 'top left',
				}}
				role="group"
				aria-label="Tablero de mahjong"
			>
				<img
					className="mahjong-background"
					src={backgroundSrc}
					alt=""
					decoding="async"
					draggable={false}
				/>
				<div className="mahjong-background-veil" aria-hidden />
				{sorted.map((tile) => {
					const left =
						(tile.x - bounds.minX) * TILE_WIDTH +
						tile.z * TILE_DEPTH +
						12;
					const top =
						(tile.y - bounds.minY) * TILE_HEIGHT -
						tile.z * TILE_DEPTH +
						12 +
						bounds.maxZ * TILE_DEPTH;

					return (
						<Tile
							key={tile.uid}
							tile={tile}
							left={left}
							top={top}
							isFree={freeIds.has(tile.uid)}
							isSelected={selectedId === tile.uid}
							isMatched={matchedPulse.includes(tile.uid)}
							isReject={rejectPulse.includes(tile.uid)}
							isRescue={rescueIds.includes(tile.uid)}
							onTileClick={onTileClick}
						/>
					);
				})}
			</div>
		</div>
	);
};
