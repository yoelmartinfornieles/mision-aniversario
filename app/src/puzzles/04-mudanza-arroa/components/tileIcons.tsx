import type { ReactNode } from 'react';
import type { TileFaceId } from '../types';

const INK = '#2a2d28';

const svgProps = {
	viewBox: '0 0 64 64',
	className: 'mahjong-tile-icon',
	role: 'presentation' as const,
	'aria-hidden': true as const,
};

/** Cajas apiladas — la mudanza. */
const Cajas = () => (
	<svg {...svgProps}>
		<path
			d="M14 28 H50 V50 H14 Z"
			fill="#d4b896"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinejoin="round"
		/>
		<path
			d="M18 20 H46 V28 H18 Z"
			fill="#c4a882"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinejoin="round"
		/>
		<line x1="32" y1="20" x2="32" y2="50" stroke={INK} strokeWidth="2" />
		<path
			d="M28 20 H36 V24 H28 Z"
			fill="#e2c4b7"
			stroke={INK}
			strokeWidth="1.8"
		/>
	</svg>
);

/** Llaves del nuevo hogar. */
const Llaves = () => (
	<svg {...svgProps}>
		<circle cx="22" cy="24" r="10" fill="#e8d090" stroke={INK} strokeWidth="2.5" />
		<circle cx="22" cy="24" r="4" fill="#f2ebe2" stroke={INK} strokeWidth="2" />
		<path
			d="M30 28 L48 46 M42 40 L48 40 L48 46"
			fill="none"
			stroke={INK}
			strokeWidth="2.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M36 34 L40 38"
			stroke="#c4ad82"
			strokeWidth="2.4"
			strokeLinecap="round"
		/>
	</svg>
);

/** Etxe — casa / hogar en euskera. */
const Etxe = () => (
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
		<rect x="40" y="34" width="8" height="8" fill="#a9dff3" stroke={INK} strokeWidth="1.8" />
	</svg>
);

/** Ruta — el camino hasta Arroa. */
const Ruta = () => (
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

/** Mesa compartida — vida cotidiana. */
const Mesa = () => (
	<svg {...svgProps}>
		<path
			d="M12 28 H52 V36 H12 Z"
			fill="#c4a882"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinejoin="round"
		/>
		<line x1="18" y1="36" x2="16" y2="50" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
		<line x1="46" y1="36" x2="48" y2="50" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
		<ellipse cx="32" cy="24" rx="8" ry="4" fill="#e2c4b7" stroke={INK} strokeWidth="2" />
		<circle cx="24" cy="30" r="2.5" fill="#f2ebe2" stroke={INK} strokeWidth="1.5" />
		<circle cx="40" cy="30" r="2.5" fill="#f2ebe2" stroke={INK} strokeWidth="1.5" />
	</svg>
);

/** Café — mañanas juntos. */
const Cafe = () => (
	<svg {...svgProps}>
		<path
			d="M18 22 H42 V44 C42 50, 22 50, 22 44 V22 Z"
			fill="#f2ebe2"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinejoin="round"
		/>
		<path
			d="M42 28 H50 C54 28, 54 40, 50 40 H42"
			fill="none"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinecap="round"
		/>
		<path
			d="M24 16 C26 12, 28 12, 30 16 M32 16 C34 12, 36 12, 38 16"
			fill="none"
			stroke="#8a6a2e"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<path d="M22 30 H38" stroke="#6a4a28" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
	</svg>
);

/** Nido — el hogar que construís. */
const Nido = () => (
	<svg {...svgProps}>
		<path
			d="M12 38 C16 28, 24 24, 32 24 C40 24, 48 28, 52 38 C48 48, 16 48, 12 38 Z"
			fill="#c4a882"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinejoin="round"
		/>
		<path
			d="M18 36 C22 32, 28 30, 32 30 C36 30, 42 32, 46 36"
			fill="none"
			stroke="#8b5a3c"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<ellipse cx="28" cy="34" rx="4" ry="3" fill="#e2c4b7" stroke={INK} strokeWidth="1.8" />
		<ellipse cx="38" cy="34" rx="4" ry="3" fill="#e2c4b7" stroke={INK} strokeWidth="1.8" />
	</svg>
);

/** Kai — la pieza que lo cambió todo. */
const Kai = () => (
	<svg {...svgProps}>
		<circle cx="32" cy="22" r="10" fill="#e2c4b7" stroke={INK} strokeWidth="2.5" />
		<path
			d="M18 52 C18 38, 24 34, 32 34 C40 34, 46 38, 46 52 Z"
			fill="#b8d1d2"
			stroke={INK}
			strokeWidth="2.5"
		/>
		<circle cx="28" cy="22" r="1.8" fill={INK} />
		<circle cx="36" cy="22" r="1.8" fill={INK} />
		<path
			d="M28 27 Q32 30 36 27"
			fill="none"
			stroke={INK}
			strokeWidth="1.8"
			strokeLinecap="round"
		/>
	</svg>
);

/** Lagun — amigo en euskera. */
const Lagun = () => (
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

/** Brindis — celebrar con la gente nueva. */
const Brindis = () => (
	<svg {...svgProps}>
		<path
			d="M18 14 H30 L28 36 C28 42, 20 42, 20 36 Z"
			fill="#c9dbc8"
			stroke={INK}
			strokeWidth="2.3"
			strokeLinejoin="round"
		/>
		<path
			d="M34 18 H48 L45 40 C45 46, 36 46, 37 40 Z"
			fill="#e2b4a8"
			stroke={INK}
			strokeWidth="2.3"
			strokeLinejoin="round"
		/>
		<line x1="24" y1="42" x2="24" y2="52" stroke={INK} strokeWidth="2.2" />
		<line x1="41" y1="46" x2="41" y2="54" stroke={INK} strokeWidth="2.2" />
		<line x1="18" y1="52" x2="30" y2="52" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
		<line x1="35" y1="54" x2="47" y2="54" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
	</svg>
);

/** Vecinos — la gente del nuevo lugar. */
const Vecinos = () => (
	<svg {...svgProps}>
		<path
			d="M8 40 L8 24 L20 14 L32 24 V40 Z"
			fill="#e2c4b7"
			stroke={INK}
			strokeWidth="2.2"
			strokeLinejoin="round"
		/>
		<path
			d="M32 40 V26 L44 16 L56 26 V40 Z"
			fill="#c9dbc8"
			stroke={INK}
			strokeWidth="2.2"
			strokeLinejoin="round"
		/>
		<rect x="16" y="30" width="6" height="10" fill="#f2ebe2" stroke={INK} strokeWidth="1.6" />
		<rect x="42" y="30" width="6" height="10" fill="#f2ebe2" stroke={INK} strokeWidth="1.6" />
	</svg>
);

/** Mendi — monte. */
const Mendi = () => (
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

/** Niebla — el País Vasco cuando se esconde. */
const Niebla = () => (
	<svg {...svgProps}>
		<path
			d="M10 28 C16 22, 28 22, 34 28 C40 22, 50 24, 54 30"
			fill="none"
			stroke="#c5d8e4"
			strokeWidth="5"
			strokeLinecap="round"
		/>
		<path
			d="M8 38 C16 32, 26 34, 34 38 C42 32, 52 34, 56 40"
			fill="none"
			stroke="#a8c0d0"
			strokeWidth="5"
			strokeLinecap="round"
		/>
		<path
			d="M12 48 C20 42, 30 44, 38 48 C46 42, 52 44, 56 48"
			fill="none"
			stroke="#c5d8e4"
			strokeWidth="4"
			strokeLinecap="round"
		/>
		<path
			d="M10 28 C16 22, 28 22, 34 28 C40 22, 50 24, 54 30"
			fill="none"
			stroke={INK}
			strokeWidth="2"
			strokeLinecap="round"
			opacity="0.55"
		/>
	</svg>
);

/** Marea — la costa. */
const Marea = () => (
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
		<path
			d="M8 22 L20 30 L28 18 L40 28 L56 16"
			fill="none"
			stroke="#5a6a58"
			strokeWidth="2.2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

/** Lazo — el vínculo. */
const Lazo = () => (
	<svg {...svgProps}>
		<path
			d="M20 20 C12 20, 12 34, 22 34 C30 34, 30 26, 32 26 C34 26, 34 34, 42 34 C52 34, 52 20, 44 20 C36 20, 36 28, 32 28 C28 28, 28 20, 20 20 Z"
			fill="#e2b4a8"
			stroke={INK}
			strokeWidth="2.5"
			strokeLinejoin="round"
		/>
		<path
			d="M28 34 L24 50 M36 34 L40 50"
			fill="none"
			stroke={INK}
			strokeWidth="2.4"
			strokeLinecap="round"
		/>
		<path
			d="M24 50 L20 46 M24 50 L28 46 M40 50 L36 46 M40 50 L44 46"
			fill="none"
			stroke={INK}
			strokeWidth="2"
			strokeLinecap="round"
		/>
	</svg>
);

/** Bihotz — corazón. */
const Bihotz = () => (
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
	boxes: Cajas,
	keys: Llaves,
	home: Etxe,
	path: Ruta,
	table: Mesa,
	coffee: Cafe,
	nest: Nido,
	kai: Kai,
	friends: Lagun,
	toast: Brindis,
	neighbors: Vecinos,
	mountain: Mendi,
	fog: Niebla,
	sea: Marea,
	bow: Lazo,
	heart: Bihotz,
};

export const TileIcon = ({ faceId }: { faceId: TileFaceId }) => {
	const Icon = ICONS[faceId];
	return <Icon />;
};
