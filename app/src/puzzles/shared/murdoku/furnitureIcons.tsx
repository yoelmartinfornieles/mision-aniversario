import type { ReactNode } from 'react';

type IconProps = { className?: string; title?: string };

const svgProps = (title?: string) => ({
	viewBox: '0 0 64 64',
	className: 'furniture-svg',
	role: title ? ('img' as const) : ('presentation' as const),
	'aria-hidden': title ? undefined : true,
	'aria-label': title,
});

const Sofa = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="6" y="28" width="52" height="22" rx="6" fill="#c9a27a" stroke="#2a2d28" strokeWidth="2.5" />
		<rect x="10" y="20" width="18" height="14" rx="4" fill="#ddb892" stroke="#2a2d28" strokeWidth="2" />
		<rect x="36" y="20" width="18" height="14" rx="4" fill="#ddb892" stroke="#2a2d28" strokeWidth="2" />
		<circle cx="14" cy="52" r="3" fill="#2a2d28" />
		<circle cx="50" cy="52" r="3" fill="#2a2d28" />
	</svg>
);

const Chair = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="18" y="14" width="28" height="10" rx="3" fill="#efe6d6" stroke="#2a2d28" strokeWidth="2.5" />
		<rect x="16" y="24" width="32" height="18" rx="4" fill="#f7f1e6" stroke="#2a2d28" strokeWidth="2.5" />
		<rect x="18" y="42" width="4" height="10" fill="#2a2d28" />
		<rect x="42" y="42" width="4" height="10" fill="#2a2d28" />
	</svg>
);

const Bed = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="8" y="26" width="48" height="22" rx="4" fill="#d9e4f0" stroke="#2a2d28" strokeWidth="2.5" />
		<rect x="10" y="18" width="16" height="12" rx="3" fill="#f2ebe0" stroke="#2a2d28" strokeWidth="2" />
		<rect x="8" y="46" width="48" height="6" fill="#8a9098" stroke="#2a2d28" strokeWidth="2" />
	</svg>
);

const Crib = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="12" y="18" width="40" height="28" rx="3" fill="#f0e6da" stroke="#2a2d28" strokeWidth="2.5" />
		{[18, 26, 34, 42, 50].map((x) => (
			<rect key={x} x={x} y="18" width="3" height="28" fill="#2a2d28" opacity="0.55" />
		))}
		<rect x="14" y="28" width="36" height="10" rx="2" fill="#e8c4c0" />
	</svg>
);

const Hammock = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<path
			d="M10 20 C22 42, 42 42, 54 20"
			fill="none"
			stroke="#2a2d28"
			strokeWidth="2.5"
		/>
		<path
			d="M12 22 C24 38, 40 38, 52 22"
			fill="#7eb89a"
			stroke="#2a2d28"
			strokeWidth="2"
		/>
		<line x1="10" y1="20" x2="10" y2="48" stroke="#2a2d28" strokeWidth="2.5" />
		<line x1="54" y1="20" x2="54" y2="48" stroke="#2a2d28" strokeWidth="2.5" />
	</svg>
);

const Plant = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<ellipse cx="32" cy="50" rx="14" ry="6" fill="#5e5e5e" opacity="0.25" />
		<path d="M32 44 C22 34, 20 22, 28 14 C30 24, 34 30, 32 44Z" fill="#6fbf7a" stroke="#2a2d28" strokeWidth="2" />
		<path d="M32 44 C42 32, 46 20, 36 12 C36 24, 34 32, 32 44Z" fill="#58a866" stroke="#2a2d28" strokeWidth="2" />
		<rect x="24" y="42" width="16" height="12" rx="2" fill="#c47a5a" stroke="#2a2d28" strokeWidth="2" />
	</svg>
);

const Shelf = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="10" y="10" width="44" height="44" rx="3" fill="#7a68b5" stroke="#2a2d28" strokeWidth="2.5" />
		{[18, 30, 42].map((y) => (
			<rect key={y} x="14" y={y} width="36" height="3" fill="#2a2d28" opacity="0.35" />
		))}
		<rect x="16" y="12" width="8" height="14" fill="#f4dbff" stroke="#2a2d28" strokeWidth="1.5" />
		<rect x="28" y="12" width="8" height="14" fill="#ffd6d6" stroke="#2a2d28" strokeWidth="1.5" />
		<rect x="40" y="12" width="8" height="14" fill="#d6f0ff" stroke="#2a2d28" strokeWidth="1.5" />
	</svg>
);

const Table = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="10" y="22" width="44" height="18" rx="3" fill="#d996d7" stroke="#2a2d28" strokeWidth="2.5" />
		<rect x="14" y="40" width="5" height="12" fill="#2a2d28" />
		<rect x="45" y="40" width="5" height="12" fill="#2a2d28" />
	</svg>
);

const Tv = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="12" y="14" width="40" height="28" rx="3" fill="#3d4654" stroke="#2a2d28" strokeWidth="2.5" />
		<rect x="16" y="18" width="32" height="20" fill="#7ec8e8" />
		<rect x="28" y="42" width="8" height="6" fill="#2a2d28" />
		<rect x="20" y="48" width="24" height="4" rx="1" fill="#2a2d28" />
	</svg>
);

const Fridge = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="16" y="8" width="32" height="48" rx="3" fill="#dce6ec" stroke="#2a2d28" strokeWidth="2.5" />
		<line x1="16" y1="28" x2="48" y2="28" stroke="#2a2d28" strokeWidth="2" />
		<rect x="42" y="14" width="3" height="8" fill="#2a2d28" />
		<rect x="42" y="34" width="3" height="10" fill="#2a2d28" />
	</svg>
);

const Sink = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="12" y="22" width="40" height="24" rx="4" fill="#c5d8e4" stroke="#2a2d28" strokeWidth="2.5" />
		<ellipse cx="32" cy="34" rx="12" ry="8" fill="#9ec4d8" stroke="#2a2d28" strokeWidth="2" />
		<path d="M32 14 v10" stroke="#2a2d28" strokeWidth="2.5" />
		<path d="M26 16 h12" stroke="#2a2d28" strokeWidth="2.5" />
	</svg>
);

const Toilet = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="20" y="10" width="24" height="14" rx="2" fill="#e8eef2" stroke="#2a2d28" strokeWidth="2.5" />
		<ellipse cx="32" cy="38" rx="14" ry="12" fill="#f4f7fa" stroke="#2a2d28" strokeWidth="2.5" />
		<ellipse cx="32" cy="38" rx="8" ry="6" fill="#c5d8e4" />
	</svg>
);

const Washer = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="12" y="10" width="40" height="44" rx="4" fill="#d0d8e0" stroke="#2a2d28" strokeWidth="2.5" />
		<circle cx="32" cy="34" r="12" fill="#9eb8c8" stroke="#2a2d28" strokeWidth="2.5" />
		<circle cx="32" cy="34" r="6" fill="#cfe0ea" />
		<rect x="16" y="14" width="10" height="4" rx="1" fill="#2a2d28" opacity="0.4" />
	</svg>
);

const CoatRack = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<line x1="32" y1="12" x2="32" y2="52" stroke="#2a2d28" strokeWidth="3" />
		<line x1="18" y1="22" x2="46" y2="22" stroke="#2a2d28" strokeWidth="2.5" />
		<line x1="22" y1="30" x2="42" y2="30" stroke="#2a2d28" strokeWidth="2.5" />
		<ellipse cx="32" cy="54" rx="10" ry="3" fill="#2a2d28" opacity="0.35" />
	</svg>
);

const Piano = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="8" y="20" width="48" height="28" rx="3" fill="#3a3030" stroke="#2a2d28" strokeWidth="2.5" />
		{[14, 20, 26, 32, 38, 44, 50].map((x) => (
			<rect key={x} x={x} y="28" width="4" height="14" fill="#f5f0e8" stroke="#2a2d28" strokeWidth="1" />
		))}
	</svg>
);

const Bar = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="8" y="18" width="48" height="28" rx="3" fill="#8b5a3c" stroke="#2a2d28" strokeWidth="2.5" />
		<rect x="12" y="14" width="40" height="8" rx="2" fill="#a6714c" stroke="#2a2d28" strokeWidth="2" />
	</svg>
);

const Stairs = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<path d="M12 48 h12 v-10 h12 v-10 h12 v-10 h12" fill="none" stroke="#2a2d28" strokeWidth="2.5" />
		<rect x="12" y="38" width="12" height="10" fill="#c4b49a" stroke="#2a2d28" strokeWidth="2" />
		<rect x="24" y="28" width="12" height="10" fill="#d0c0a6" stroke="#2a2d28" strokeWidth="2" />
		<rect x="36" y="18" width="12" height="10" fill="#dcccb2" stroke="#2a2d28" strokeWidth="2" />
	</svg>
);

const Lamp = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<line x1="32" y1="24" x2="32" y2="50" stroke="#2a2d28" strokeWidth="2.5" />
		<path d="M18 24 L32 8 L46 24 Z" fill="#f0d878" stroke="#2a2d28" strokeWidth="2.5" />
		<ellipse cx="32" cy="52" rx="10" ry="3" fill="#2a2d28" opacity="0.3" />
	</svg>
);

const Cart = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="12" y="22" width="36" height="20" rx="3" fill="#e8a05a" stroke="#2a2d28" strokeWidth="2.5" />
		<circle cx="20" cy="46" r="5" fill="#2a2d28" />
		<circle cx="44" cy="46" r="5" fill="#2a2d28" />
		<path d="M48 22 L56 12" stroke="#2a2d28" strokeWidth="2.5" />
	</svg>
);

const Hedge = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<ellipse cx="32" cy="36" rx="22" ry="16" fill="#5f9e68" stroke="#2a2d28" strokeWidth="2.5" />
		<ellipse cx="22" cy="30" rx="10" ry="8" fill="#6fb078" stroke="#2a2d28" strokeWidth="2" />
		<ellipse cx="42" cy="30" rx="10" ry="8" fill="#6fb078" stroke="#2a2d28" strokeWidth="2" />
	</svg>
);

const Fountain = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<ellipse cx="32" cy="48" rx="20" ry="8" fill="#8eb8c8" stroke="#2a2d28" strokeWidth="2.5" />
		<rect x="28" y="24" width="8" height="24" fill="#b0c8d4" stroke="#2a2d28" strokeWidth="2" />
		<path d="M32 14 c-8 6 -8 12 0 14 c8 -2 8 -8 0 -14z" fill="#7ec8e8" stroke="#2a2d28" strokeWidth="2" />
	</svg>
);

const Rocket = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<path d="M32 6 L42 36 L32 32 L22 36 Z" fill="#e87878" stroke="#2a2d28" strokeWidth="2.5" />
		<circle cx="32" cy="22" r="4" fill="#7ec8e8" stroke="#2a2d28" strokeWidth="2" />
		<path d="M22 36 L18 48 L26 40 Z" fill="#f0a050" stroke="#2a2d28" strokeWidth="2" />
		<path d="M42 36 L46 48 L38 40 Z" fill="#f0a050" stroke="#2a2d28" strokeWidth="2" />
	</svg>
);

const Boat = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<path d="M10 34 L54 34 L46 48 L18 48 Z" fill="#c47a5a" stroke="#2a2d28" strokeWidth="2.5" />
		<path d="M32 12 L32 34" stroke="#2a2d28" strokeWidth="2.5" />
		<path d="M32 12 L48 32 L32 32 Z" fill="#e8eef4" stroke="#2a2d28" strokeWidth="2" />
	</svg>
);

const Bench = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="10" y="28" width="44" height="10" rx="2" fill="#c9a27a" stroke="#2a2d28" strokeWidth="2.5" />
		<rect x="12" y="18" width="40" height="10" rx="2" fill="#ddb892" stroke="#2a2d28" strokeWidth="2" />
		<rect x="14" y="38" width="4" height="12" fill="#2a2d28" />
		<rect x="46" y="38" width="4" height="12" fill="#2a2d28" />
	</svg>
);

const Tree = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="28" y="36" width="8" height="16" fill="#8b5a3c" stroke="#2a2d28" strokeWidth="2" />
		<circle cx="32" cy="26" r="16" fill="#5f9e68" stroke="#2a2d28" strokeWidth="2.5" />
	</svg>
);

const Cup = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<path d="M18 20 h24 v22 a10 10 0 0 1 -24 0z" fill="#f2e6d8" stroke="#2a2d28" strokeWidth="2.5" />
		<path d="M42 26 h6 a6 6 0 0 1 0 12 h-6" fill="none" stroke="#2a2d28" strokeWidth="2.5" />
	</svg>
);

const Awning = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<path d="M8 28 L32 12 L56 28 Z" fill="#e87878" stroke="#2a2d28" strokeWidth="2.5" />
		{[16, 24, 32, 40, 48].map((x, i) => (
			<path
				key={x}
				d={`M${x} 28 L${x + 4} 36`}
				stroke={i % 2 ? '#f5f0e8' : '#e87878'}
				strokeWidth="4"
			/>
		))}
	</svg>
);

const ShoeRack = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="12" y="16" width="40" height="32" rx="2" fill="#c9b8a0" stroke="#2a2d28" strokeWidth="2.5" />
		{[24, 36].map((y) => (
			<rect key={y} x="16" y={y} width="32" height="6" rx="2" fill="#6a5a4a" stroke="#2a2d28" strokeWidth="1.5" />
		))}
	</svg>
);

const ChangingTable = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="10" y="20" width="44" height="24" rx="3" fill="#e8d8e0" stroke="#2a2d28" strokeWidth="2.5" />
		<rect x="14" y="24" width="36" height="12" rx="2" fill="#f5eef2" />
		<rect x="14" y="44" width="5" height="10" fill="#2a2d28" />
		<rect x="45" y="44" width="5" height="10" fill="#2a2d28" />
	</svg>
);

const ClothesLine = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<line x1="8" y1="22" x2="56" y2="22" stroke="#2a2d28" strokeWidth="2.5" />
		<rect x="16" y="22" width="10" height="18" fill="#7ec8e8" stroke="#2a2d28" strokeWidth="2" />
		<rect x="30" y="22" width="10" height="20" fill="#e8c4c0" stroke="#2a2d28" strokeWidth="2" />
		<rect x="44" y="22" width="8" height="16" fill="#c9e8c4" stroke="#2a2d28" strokeWidth="2" />
	</svg>
);

const Tap = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="14" y="18" width="36" height="28" rx="3" fill="#b0b8c0" stroke="#2a2d28" strokeWidth="2.5" />
		{[22, 32, 42].map((x) => (
			<rect key={x} x={x} y="24" width="4" height="16" rx="1" fill="#dce4ec" stroke="#2a2d28" strokeWidth="1.5" />
		))}
	</svg>
);

const Fallback = ({ title, label }: IconProps & { label: string }) => (
	<svg {...svgProps(title)}>
		<rect x="8" y="8" width="48" height="48" rx="6" fill="#d8d4c8" stroke="#2a2d28" strokeWidth="2.5" />
		<text
			x="32"
			y="36"
			textAnchor="middle"
			fontSize="10"
			fontWeight="700"
			fill="#2a2d28"
		>
			{label.slice(0, 6)}
		</text>
	</svg>
);

const ICONS: Record<string, (props: IconProps) => ReactNode> = {
	sofá: Sofa,
	sofa: Sofa,
	silla: Chair,
	taburete: Chair,
	banqueta: Bench,
	cama: Bed,
	cuna: Crib,
	hamaca: Hammock,
	planta: Plant,
	maceta: Plant,
	estantería: Shelf,
	mesa: Table,
	tele: Tv,
	nevera: Fridge,
	fregadera: Sink,
	lavabo: Sink,
	inodoro: Toilet,
	lavadora: Washer,
	perchero: CoatRack,
	piano: Piano,
	barra: Bar,
	escalera: Stairs,
	farola: Lamp,
	carro: Cart,
	seto: Hedge,
	fuente: Fountain,
	cohete: Rocket,
	barco: Boat,
	tronco: Tree,
	taza: Cup,
	toldo: Awning,
	zapatero: ShoeRack,
	cambiador: ChangingTable,
	tendedero: ClothesLine,
	cañero: Tap,
};

export const FurnitureIcon = ({
	kind,
	className,
}: {
	kind: string;
	className?: string;
}) => {
	const Icon = ICONS[kind] ?? ((props: IconProps) => (
		<Fallback {...props} label={kind} />
	));
	const glow =
		kind === 'farola'
			? ' is-glow-lamp'
			: kind === 'fuente'
				? ' is-glow-water'
				: kind === 'cohete'
					? ' is-glow-fire'
					: '';
	return (
		<span
			className={`furniture-icon${glow}${className ? ` ${className}` : ''}`}
			data-kind={kind}
			title={kind}
		>
			<Icon title={kind} />
		</span>
	);
};
