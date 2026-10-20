import type { ReactNode } from 'react';
import type { TileFaceId } from '../types';

const INK = '#2a2d28';

const svgProps = {
	viewBox: '0 0 64 64',
	className: 'mahjong-tile-icon',
	role: 'presentation' as const,
	'aria-hidden': true as const,
};

const Monte = () => (
	<svg {...svgProps}>
		<path
			d="M8 48 L24 22 L32 34 L40 18 L56 48 Z"
			fill="#7a9a78"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinejoin="round"
		/>
		<path
			d="M24 22 L28 28 L32 34"
			fill="none"
			stroke="#f2ebe2"
			strokeWidth="2"
			strokeLinecap="round"
		/>
	</svg>
);

const Mar = () => (
	<svg {...svgProps}>
		<rect x="8" y="14" width="48" height="36" rx="4" fill="#9ec4d8" stroke={INK} strokeWidth="2.5" />
		<path
			d="M12 28 Q20 22 28 28 T44 28 T56 28"
			fill="none"
			stroke={INK}
			strokeWidth="2.2"
			strokeLinecap="round"
		/>
		<path
			d="M12 38 Q20 32 28 38 T44 38 T56 38"
			fill="none"
			stroke="#42566a"
			strokeWidth="2.2"
			strokeLinecap="round"
			opacity="0.7"
		/>
	</svg>
);

const Hogar = () => (
	<svg {...svgProps}>
		<path
			d="M10 30 L32 12 L54 30 V52 H10 Z"
			fill="#e2c4b7"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinejoin="round"
		/>
		<path d="M10 30 L32 12 L54 30" fill="none" stroke={INK} strokeWidth="2.5" />
		<rect x="26" y="36" width="12" height="16" fill="#f2ebe2" stroke={INK} strokeWidth="2" />
		<rect x="16" y="34" width="8" height="8" fill="#a9dff3" stroke={INK} strokeWidth="1.8" />
	</svg>
);

const Camino = () => (
	<svg {...svgProps}>
		<path
			d="M18 52 C22 40, 20 28, 28 18 C34 28, 40 36, 46 12"
			fill="none"
			stroke="#c4ad82"
			strokeWidth="10"
			strokeLinecap="round"
		/>
		<path
			d="M18 52 C22 40, 20 28, 28 18 C34 28, 40 36, 46 12"
			fill="none"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinecap="round"
		/>
		<circle cx="28" cy="18" r="3" fill={INK} />
		<circle cx="46" cy="12" r="3" fill={INK} />
	</svg>
);

const Lluvia = () => (
	<svg {...svgProps}>
		<path
			d="M16 24 C16 14, 48 14, 48 24 C54 24, 54 34, 46 34 H18 C10 34, 10 24, 16 24 Z"
			fill="#c5d8e4"
			stroke={INK}
			strokeWidth="2.5"
		/>
		{[20, 28, 36, 44].map((x) => (
			<line
				key={x}
				x1={x}
				y1="40"
				x2={x - 2}
				y2="54"
				stroke="#42566a"
				strokeWidth="2.4"
				strokeLinecap="round"
			/>
		))}
	</svg>
);

const Sol = () => (
	<svg {...svgProps}>
		<circle cx="32" cy="32" r="12" fill="#f0d878" stroke={INK} strokeWidth="2.5" />
		{[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
			const rad = (deg * Math.PI) / 180;
			const x1 = 32 + Math.cos(rad) * 16;
			const y1 = 32 + Math.sin(rad) * 16;
			const x2 = 32 + Math.cos(rad) * 24;
			const y2 = 32 + Math.sin(rad) * 24;
			return (
				<line
					key={deg}
					x1={x1}
					y1={y1}
					x2={x2}
					y2={y2}
					stroke={INK}
					strokeWidth="2.4"
					strokeLinecap="round"
				/>
			);
		})}
	</svg>
);

const Coche = () => (
	<svg {...svgProps}>
		<path
			d="M12 36 L16 26 H28 L34 20 H48 L54 28 V40 H12 Z"
			fill="#cfc6b6"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinejoin="round"
		/>
		<path d="M28 26 L34 20 H46 L50 26 Z" fill="#a9dff3" stroke={INK} strokeWidth="2" />
		<circle cx="22" cy="40" r="5" fill="#2e2923" stroke={INK} strokeWidth="2" />
		<circle cx="46" cy="40" r="5" fill="#2e2923" stroke={INK} strokeWidth="2" />
		<circle cx="22" cy="40" r="2" fill="#f3ebde" />
		<circle cx="46" cy="40" r="2" fill="#f3ebde" />
	</svg>
);

const Rio = () => (
	<svg {...svgProps}>
		<path
			d="M10 18 C22 28, 18 40, 32 46 C44 40, 42 28, 54 18"
			fill="#7eb8c8"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinejoin="round"
		/>
		<path
			d="M16 28 C24 34, 28 38, 32 40 C38 36, 42 32, 48 26"
			fill="none"
			stroke="#f2ebe2"
			strokeWidth="2"
			strokeLinecap="round"
			opacity="0.7"
		/>
	</svg>
);

const Puente = () => (
	<svg {...svgProps}>
		<path d="M8 40 H56" stroke="#8eb8c8" strokeWidth="6" strokeLinecap="round" />
		<path
			d="M12 40 C20 22, 44 22, 52 40"
			fill="none"
			stroke="#c4ad82"
			strokeWidth="5"
			strokeLinecap="round"
		/>
		<path
			d="M12 40 C20 22, 44 22, 52 40"
			fill="none"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinecap="round"
		/>
		<line x1="20" y1="34" x2="20" y2="40" stroke={INK} strokeWidth="2" />
		<line x1="32" y1="28" x2="32" y2="40" stroke={INK} strokeWidth="2" />
		<line x1="44" y1="34" x2="44" y2="40" stroke={INK} strokeWidth="2" />
	</svg>
);

const Cambios = () => (
	<svg {...svgProps}>
		<path
			d="M18 20 H40 A12 12 0 0 1 40 44 H36"
			fill="none"
			stroke="#e2b4a8"
			strokeWidth="5"
			strokeLinecap="round"
		/>
		<path
			d="M18 20 H40 A12 12 0 0 1 40 44 H36"
			fill="none"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinecap="round"
		/>
		<path d="M34 40 L36 48 L42 42 Z" fill={INK} />
		<path
			d="M46 44 H24 A12 12 0 0 1 24 20 H28"
			fill="none"
			stroke="#c4ad82"
			strokeWidth="5"
			strokeLinecap="round"
		/>
		<path
			d="M46 44 H24 A12 12 0 0 1 24 20 H28"
			fill="none"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinecap="round"
		/>
		<path d="M30 24 L28 16 L22 22 Z" fill={INK} />
	</svg>
);

const Euskera = () => (
	<svg {...svgProps}>
		<rect x="10" y="10" width="44" height="44" rx="6" fill="#c9dbc8" stroke={INK} strokeWidth="2.5" />
		<text
			x="32"
			y="40"
			textAnchor="middle"
			fontFamily="'Special Elite', 'Courier New', monospace"
			fontSize="26"
			fill={INK}
		>
			E
		</text>
	</svg>
);

const Amigos = () => (
	<svg {...svgProps}>
		<circle cx="22" cy="22" r="8" fill="#b8d1d2" stroke={INK} strokeWidth="2.2" />
		<path
			d="M10 48 C12 36, 18 32, 22 32 C26 32, 32 36, 34 48 Z"
			fill="#b8d1d2"
			stroke={INK}
			strokeWidth="2.2"
		/>
		<circle cx="42" cy="22" r="8" fill="#e2c4b7" stroke={INK} strokeWidth="2.2" />
		<path
			d="M30 48 C32 36, 38 32, 42 32 C46 32, 52 36, 54 48 Z"
			fill="#e2c4b7"
			stroke={INK}
			strokeWidth="2.2"
		/>
	</svg>
);

const Miedos = () => (
	<svg {...svgProps}>
		<path
			d="M32 10 C42 10, 50 18, 50 30 C50 42, 42 46, 38 52 L32 48 L26 52 C22 46, 14 42, 14 30 C14 18, 22 10, 32 10 Z"
			fill="#c9b8d4"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinejoin="round"
		/>
		<circle cx="25" cy="28" r="3" fill={INK} />
		<circle cx="39" cy="28" r="3" fill={INK} />
		<path
			d="M26 38 Q32 34 38 38"
			fill="none"
			stroke={INK}
			strokeWidth="2.2"
			strokeLinecap="round"
		/>
	</svg>
);

const Roble = () => (
	<svg {...svgProps}>
		<ellipse cx="32" cy="28" rx="18" ry="16" fill="#6fbf7a" stroke={INK} strokeWidth="2.5" />
		<ellipse cx="22" cy="24" rx="9" ry="8" fill="#58a866" stroke={INK} strokeWidth="2" />
		<ellipse cx="42" cy="24" rx="9" ry="8" fill="#58a866" stroke={INK} strokeWidth="2" />
		<rect x="28" y="40" width="8" height="14" rx="1" fill="#8b5a3c" stroke={INK} strokeWidth="2" />
	</svg>
);

const Ola = () => (
	<svg {...svgProps}>
		<path
			d="M8 40 C16 28, 24 28, 32 40 C40 52, 48 52, 56 40 V50 H8 Z"
			fill="#7ec8e8"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinejoin="round"
		/>
		<path
			d="M10 36 C18 26, 26 26, 32 36"
			fill="none"
			stroke="#f2ebe2"
			strokeWidth="2.2"
			strokeLinecap="round"
		/>
	</svg>
);

const Familia = () => (
	<svg {...svgProps}>
		<path
			d="M32 48 C32 48, 12 34, 12 22 C12 14, 18 10, 24 10 C28 10, 31 12, 32 16 C33 12, 36 10, 40 10 C46 10, 52 14, 52 22 C52 34, 32 48, 32 48 Z"
			fill="#e2b4a8"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinejoin="round"
		/>
	</svg>
);

const ICONS: Record<TileFaceId, () => ReactNode> = {
	monte: Monte,
	mar: Mar,
	hogar: Hogar,
	camino: Camino,
	lluvia: Lluvia,
	sol: Sol,
	coche: Coche,
	rio: Rio,
	puente: Puente,
	cambios: Cambios,
	euskera: Euskera,
	amigos: Amigos,
	miedos: Miedos,
	roble: Roble,
	ola: Ola,
	familia: Familia,
};

export const TileIcon = ({ faceId }: { faceId: TileFaceId }) => {
	const Icon = ICONS[faceId];
	return <Icon />;
};
