import { useId } from 'react';
import type { TileFaceId } from '../types';

const KaiPortrait = () => {
	const id = useId();
	return (
		<svg x="7" y="3" width="50" height="50" viewBox="90 65 86 86">
			<defs>
				<clipPath id={id}>
					<path d="M94 102Q103 104 111 96L119 78Q127 70 140 70L143 67 146 70Q163 72 172 86L173 105 169 111 170 121 158 144 151 140 147 134Q134 141 126 134L124 129 119 127 120 121 116 113Q98 117 94 111Q92 108 94 102Z" />
				</clipPath>
			</defs>
			<image
				clipPath={`url(#${id})`}
				href={`${import.meta.env.BASE_URL}finale/kai-moto.webp`}
				width="315"
				height="420"
			/>
		</svg>
	);
};

export const TileIcon = ({ faceId }: { faceId: TileFaceId }) => (
	<svg viewBox="4 2 56 56" className="mahjong-tile-icon" aria-hidden>
		{faceId === 'kai' ? (
			<KaiPortrait />
		) : (
			<image
				href={`${import.meta.env.BASE_URL}puzzles/04-tiles/${faceId}.png`}
				x="4"
				y="2"
				width="56"
				height="56"
			/>
		)}
	</svg>
);
