import type { ReactNode } from 'react';
import { PIECES } from '../data';
import { HEX_SIZE } from '../hex';
import type { PieceId } from '../types';

const FLOOR_MARKS: Record<PieceId, ReactNode> = {
	bano: (
		<>
			<path d="M0 0H12V12H0Z M12 12H24V24H12Z" fill="#f2eee0" />
			<path d="M0 0H24V24H0Z M12 0V24 M0 12H24" fill="none" />
		</>
	),
	salon: (
		<>
			<path d="M0 0H12V24H0Z" fill="#eed4a5" />
			<path d="M0 0V24 M12 0V24 M24 0V24 M0 8H12 M12 18H24" />
			<path d="M4 12V21 M8 1V5 M16 3V13 M20 20V24" opacity=".4" />
		</>
	),
	invitados: (
		<>
			<path d="M0 6H24 M0 18H24" strokeWidth="4" opacity=".25" />
			<path d="M0 0H24 M0 12H24 M0 24H24 M8 0V12 M18 12V24" />
			<path d="M12 5H21 M2 17H12" opacity=".45" />
		</>
	),
	dormitorio: (
		<>
			<path d="M0 0H6V12H18V24H24V0Z" fill="#e5c3a9" opacity=".65" />
			<path d="M0 0H12V12H24 M0 12H12V24H24 M0 6H6V18H18V24 M6 0V6H18V18H24" />
		</>
	),
	cocina: (
		<>
			<path d="M12 2L22 12 12 22 2 12Z" fill="#f2d9bc" />
			<path d="M0 0H24V24H0Z M12 2L22 12 12 22 2 12Z" fill="none" />
			<path d="M12 8L16 12 12 16 8 12Z" fill="currentColor" stroke="none" />
		</>
	),
	terraza: (
		<>
			<path d="M0 0H24V12H0Z" fill="#e0bd88" opacity=".4" />
			<path d="M0 0H24 M0 12H24 M0 24H24 M12 0V12 M0 12V24 M24 12V24" />
			<path d="M5 4H8 M16 17H19" opacity=".35" />
		</>
	),
	entrada: (
		<>
			<path d="M0 0H24V24H0Z M0 0L24 24 M24 0L0 24" fill="none" />
			<path d="M12 7L17 12 12 17 7 12Z" fill="#eee5ce" />
		</>
	),
	lavadero: (
		<>
			<path d="M0 0H24V24H0Z M8 0V24 M16 0V24 M0 8H24 M0 16H24" fill="none" />
			<path d="M8 8H16V16H8Z" fill="#ece8d9" />
		</>
	),
};

type RoomFloorsProps = {
	idPrefix: string;
	size?: number;
};

export const RoomFloors = ({ idPrefix, size = HEX_SIZE }: RoomFloorsProps) => (
	<defs>
		{PIECES.map((piece) => (
			<pattern
				key={piece.id}
				id={`${idPrefix}-${piece.id}`}
				width={24}
				height={24}
				patternUnits="userSpaceOnUse"
				patternTransform={`scale(${size / HEX_SIZE})`}
			>
				<rect width={24} height={24} fill={piece.color} />
				<g
					color="#574b3c"
					stroke="#574b3c"
					strokeWidth={0.75}
					strokeOpacity={0.5}
					fill="none"
				>
					{FLOOR_MARKS[piece.id]}
				</g>
			</pattern>
		))}
	</defs>
);
