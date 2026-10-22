import type { ReactNode } from 'react';
import { PIECES } from '../data';
import { HEX_SIZE } from '../hex';
import type { PieceId } from '../types';

/** Soft paper-texture marks — warmer, less blueprint-technical. */
const FLOOR_MARKS: Record<PieceId, ReactNode> = {
	bano: (
		<>
			<path d="M0 0H12V12H0Z M12 12H24V24H12Z" fill="#f6f1e4" opacity=".55" />
			<path
				d="M0 0H24V24H0Z M12 0V24 M0 12H24"
				fill="none"
				strokeOpacity=".35"
			/>
			<circle cx="6" cy="6" r="1.1" fill="currentColor" stroke="none" opacity=".2" />
			<circle cx="18" cy="18" r="1.1" fill="currentColor" stroke="none" opacity=".2" />
		</>
	),
	salon: (
		<>
			<path d="M0 0H12V24H0Z" fill="#efd7ad" opacity=".45" />
			<path
				d="M0 0V24 M12 0V24 M24 0V24"
				strokeOpacity=".4"
			/>
			<path
				d="M1 7Q6 5 11 8 M13 16Q18 14 23 17 M2 19Q7 21 11 18 M14 4Q19 6 22 3"
				fill="none"
				strokeOpacity=".28"
				strokeWidth="1"
			/>
		</>
	),
	invitados: (
		<>
			<path d="M0 6H24 M0 18H24" strokeWidth="3.2" opacity=".18" />
			<path d="M0 0H24 M0 12H24 M0 24H24" strokeOpacity=".32" />
			<path
				d="M3 3Q8 5 11 2 M14 14Q19 12 22 15 M2 20Q7 22 12 19"
				fill="none"
				strokeOpacity=".28"
				strokeWidth="1"
			/>
		</>
	),
	dormitorio: (
		<>
			<path d="M0 0H6V12H18V24H24V0Z" fill="#e8c8b4" opacity=".5" />
			<path
				d="M0 0H12V12H24 M0 12H12V24H24"
				strokeOpacity=".32"
			/>
			<path
				d="M7 4Q10 7 9 11 M15 13Q18 16 17 20"
				fill="none"
				strokeOpacity=".22"
				strokeWidth="1.1"
			/>
		</>
	),
	cocina: (
		<>
			<path d="M12 2L22 12 12 22 2 12Z" fill="#f4ddc4" opacity=".55" />
			<path d="M12 2L22 12 12 22 2 12Z" fill="none" strokeOpacity=".38" />
			<path
				d="M12 8L16 12 12 16 8 12Z"
				fill="currentColor"
				stroke="none"
				opacity=".28"
			/>
		</>
	),
	terraza: (
		<>
			<path d="M0 0H24V12H0Z" fill="#e6c48f" opacity=".35" />
			<path d="M0 0H24 M0 12H24 M0 24H24" strokeOpacity=".34" />
			<path
				d="M4 3Q7 5 10 3 M15 15Q18 17 21 15"
				fill="none"
				strokeOpacity=".26"
				strokeWidth="1"
			/>
			<circle cx="6" cy="19" r="1.4" fill="currentColor" stroke="none" opacity=".18" />
			<circle cx="18" cy="6" r="1.4" fill="currentColor" stroke="none" opacity=".18" />
		</>
	),
	entrada: (
		<>
			<path
				d="M0 0L24 24 M24 0L0 24"
				fill="none"
				strokeOpacity=".28"
			/>
			<path d="M12 7L17 12 12 17 7 12Z" fill="#f0e8d4" opacity=".7" />
			<path d="M12 7L17 12 12 17 7 12Z" fill="none" strokeOpacity=".35" />
		</>
	),
	lavadero: (
		<>
			<path
				d="M8 0V24 M16 0V24 M0 8H24 M0 16H24"
				fill="none"
				strokeOpacity=".3"
			/>
			<path d="M8 8H16V16H8Z" fill="#efeae0" opacity=".55" />
			<path
				d="M10 10Q12 12 14 10 M10 14Q12 12 14 14"
				fill="none"
				strokeOpacity=".25"
				strokeWidth="1"
			/>
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
					color="#6a5746"
					stroke="#6a5746"
					strokeWidth={0.7}
					strokeOpacity={0.42}
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					{FLOOR_MARKS[piece.id]}
				</g>
			</pattern>
		))}
	</defs>
);
