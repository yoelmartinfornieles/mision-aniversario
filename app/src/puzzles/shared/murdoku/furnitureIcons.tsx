import type { ReactNode } from 'react';

type IconProps = { className?: string; title?: string };

const svgProps = (title?: string) => ({
	viewBox: '0 0 64 64',
	className: 'furniture-svg',
	role: title ? ('img' as const) : ('presentation' as const),
	'aria-hidden': title ? undefined : true,
	'aria-label': title,
	strokeLinecap: 'round' as const,
	strokeLinejoin: 'round' as const,
});

const Sofa = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="6" y="28" width="52" height="22" rx="6" fill="#c9a27a" stroke="#473b30" strokeWidth="2.5" />
		<rect x="10" y="20" width="18" height="14" rx="4" fill="#ddb892" stroke="#473b30" strokeWidth="2" />
		<rect x="36" y="20" width="18" height="14" rx="4" fill="#ddb892" stroke="#473b30" strokeWidth="2" />
		<path d="M8 40H56V45Q56 49 51 49H13Q8 49 8 45Z" fill="#a87b55" />
		<path
			d="M14 24H24M40 24H50M10 36V42M54 36V42"
			fill="none"
			stroke="#efcf9f"
			strokeWidth="2"
		/>
		<path d="M32 35V45" stroke="#8b6548" strokeWidth="1.5" />
		<circle cx="14" cy="52" r="3" fill="#473b30" />
		<circle cx="50" cy="52" r="3" fill="#473b30" />
	</svg>
);

const Chair = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="18" y="14" width="28" height="10" rx="3" fill="#efe6d6" stroke="#473b30" strokeWidth="2.5" />
		<rect x="16" y="24" width="32" height="18" rx="4" fill="#f7f1e6" stroke="#473b30" strokeWidth="2.5" />
		<path d="M18 36H46V39H18Z" fill="#d0bea1" />
		<path d="M21 17H43M20 28H44" stroke="#fffaf0" strokeWidth="1.5" />
		<rect x="18" y="42" width="4" height="10" fill="#473b30" />
		<rect x="42" y="42" width="4" height="10" fill="#473b30" />
	</svg>
);

const Bed = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="8" y="26" width="48" height="22" rx="4" fill="#a6bdba" stroke="#473b30" strokeWidth="2.5" />
		<rect x="10" y="18" width="16" height="12" rx="3" fill="#f2ebe0" stroke="#473b30" strokeWidth="2" />
		<rect x="8" y="46" width="48" height="6" fill="#8a9098" stroke="#473b30" strokeWidth="2" />
		<path d="M30 28H53V44H30Z" fill="#829e9a" />
		<path d="M13 21H22M33 30H50" stroke="#f9efdc" strokeWidth="1.5" />
	</svg>
);

const Crib = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="12" y="18" width="40" height="28" rx="3" fill="#f0e6da" stroke="#473b30" strokeWidth="2.5" />
		{[18, 26, 34, 42, 50].map((x) => (
			<rect key={x} x={x} y="18" width="3" height="28" fill="#473b30" opacity="0.55" />
		))}
		<rect x="14" y="28" width="36" height="10" rx="2" fill="#e8c4c0" />
	</svg>
);

const Hammock = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<path
			d="M10 20 C22 42, 42 42, 54 20"
			fill="none"
			stroke="#473b30"
			strokeWidth="2.5"
		/>
		<path
			d="M12 22 C24 38, 40 38, 52 22"
			fill="#88a58b"
			stroke="#473b30"
			strokeWidth="2"
		/>
		<line x1="10" y1="20" x2="10" y2="48" stroke="#473b30" strokeWidth="2.5" />
		<line x1="54" y1="20" x2="54" y2="48" stroke="#473b30" strokeWidth="2.5" />
	</svg>
);

const Plant = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<ellipse cx="32" cy="50" rx="14" ry="6" fill="#5e5e5e" opacity="0.25" />
		<path d="M32 44 C22 34, 20 22, 28 14 C30 24, 34 30, 32 44Z" fill="#8da475" stroke="#473b30" strokeWidth="2" />
		<path d="M32 44 C42 32, 46 20, 36 12 C36 24, 34 32, 32 44Z" fill="#627f5b" stroke="#473b30" strokeWidth="2" />
		<rect x="24" y="42" width="16" height="12" rx="2" fill="#c47a5a" stroke="#473b30" strokeWidth="2" />
		<path d="M34 44H39V52H34Z" fill="#9d5d44" />
		<path d="M25 44H39" stroke="#e1aa7d" strokeWidth="1.5" />
	</svg>
);

const Shelf = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="10" y="10" width="44" height="44" rx="3" fill="#a57a50" stroke="#473b30" strokeWidth="2.5" />
		{[18, 30, 42].map((y) => (
			<rect key={y} x="14" y={y} width="36" height="3" fill="#473b30" opacity="0.35" />
		))}
		<rect x="16" y="12" width="8" height="14" fill="#ddd3b3" stroke="#473b30" strokeWidth="1.5" />
		<rect x="28" y="12" width="8" height="14" fill="#c88c72" stroke="#473b30" strokeWidth="1.5" />
		<rect x="40" y="12" width="8" height="14" fill="#a3b9b6" stroke="#473b30" strokeWidth="1.5" />
		<path d="M14 34H50V40H14ZM14 46H50V50H14Z" fill="#795437" />
		<path d="M13 29H51M13 42H51M14 13V51" stroke="#dbb985" strokeWidth="1.5" />
	</svg>
);

const Table = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="10" y="22" width="44" height="18" rx="3" fill="#bf925f" stroke="#473b30" strokeWidth="2.5" />
		<path d="M12 34H52V39H12Z" fill="#976e46" />
		<path d="M14 25H50" stroke="#e9c693" strokeWidth="2" />
		<rect x="14" y="40" width="5" height="12" fill="#735037" />
		<rect x="45" y="40" width="5" height="12" fill="#735037" />
	</svg>
);

const Tv = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="12" y="14" width="40" height="28" rx="3" fill="#555651" stroke="#473b30" strokeWidth="2.5" />
		<rect x="16" y="18" width="32" height="20" fill="#83adb4" />
		<path d="M18 20H44L18 34Z" fill="#bfd7d4" opacity=".65" />
		<rect x="28" y="42" width="8" height="6" fill="#473b30" />
		<rect x="20" y="48" width="24" height="4" rx="1" fill="#473b30" />
	</svg>
);

const Fridge = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="16" y="8" width="32" height="48" rx="3" fill="#dce0d8" stroke="#473b30" strokeWidth="2.5" />
		<line x1="16" y1="28" x2="48" y2="28" stroke="#473b30" strokeWidth="2" />
		<rect x="42" y="14" width="3" height="8" fill="#473b30" />
		<rect x="42" y="34" width="3" height="10" fill="#473b30" />
		<path
			d="M19 11V53M19 11H44"
			fill="none"
			stroke="#fff7e9"
			strokeWidth="1.5"
		/>
		<path d="M46 10V54" stroke="#adb9b2" strokeWidth="2" />
	</svg>
);

const Sink = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="12" y="22" width="40" height="24" rx="4" fill="#c4d6d3" stroke="#473b30" strokeWidth="2.5" />
		<ellipse cx="32" cy="34" rx="12" ry="8" fill="#90b2b5" stroke="#473b30" strokeWidth="2" />
		<path d="M32 14 v10" stroke="#473b30" strokeWidth="2.5" />
		<path d="M26 16 h12" stroke="#473b30" strokeWidth="2.5" />
	</svg>
);

const Toilet = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="20" y="10" width="24" height="14" rx="2" fill="#e8eef2" stroke="#473b30" strokeWidth="2.5" />
		<ellipse cx="32" cy="38" rx="14" ry="12" fill="#f4f7fa" stroke="#473b30" strokeWidth="2.5" />
		<ellipse cx="32" cy="38" rx="8" ry="6" fill="#c4d6d3" />
	</svg>
);

const Washer = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="12" y="10" width="40" height="44" rx="4" fill="#d2d7cf" stroke="#473b30" strokeWidth="2.5" />
		<circle cx="32" cy="34" r="12" fill="#85a5aa" stroke="#473b30" strokeWidth="2.5" />
		<circle cx="32" cy="34" r="6" fill="#cfe0ea" />
		<path d="M24 34Q24 27 31 26" fill="none" stroke="#f5edda" strokeWidth="2" />
		<rect x="16" y="14" width="10" height="4" rx="1" fill="#473b30" opacity="0.4" />
	</svg>
);

const CoatRack = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<line x1="32" y1="12" x2="32" y2="52" stroke="#473b30" strokeWidth="3" />
		<line x1="18" y1="22" x2="46" y2="22" stroke="#473b30" strokeWidth="2.5" />
		<line x1="22" y1="30" x2="42" y2="30" stroke="#473b30" strokeWidth="2.5" />
		<ellipse cx="32" cy="54" rx="10" ry="3" fill="#473b30" opacity="0.35" />
	</svg>
);

const Piano = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="8" y="20" width="48" height="28" rx="3" fill="#3a3030" stroke="#473b30" strokeWidth="2.5" />
		{[14, 20, 26, 32, 38, 44, 50].map((x) => (
			<rect key={x} x={x} y="28" width="4" height="14" fill="#f5f0e8" stroke="#473b30" strokeWidth="1" />
		))}
	</svg>
);

const Bar = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="8" y="18" width="48" height="28" rx="3" fill="#8b5a3c" stroke="#473b30" strokeWidth="2.5" />
		<rect x="12" y="14" width="40" height="8" rx="2" fill="#a6714c" stroke="#473b30" strokeWidth="2" />
		<path
			d="M13 27H51M15 29V41M49 29V41"
			fill="none"
			stroke="#b48459"
			strokeWidth="1.5"
		/>
	</svg>
);

const Stairs = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<path d="M12 48 h12 v-10 h12 v-10 h12 v-10 h12" fill="none" stroke="#473b30" strokeWidth="2.5" />
		<rect x="12" y="38" width="12" height="10" fill="#c4b49a" stroke="#473b30" strokeWidth="2" />
		<rect x="24" y="28" width="12" height="10" fill="#d0c0a6" stroke="#473b30" strokeWidth="2" />
		<rect x="36" y="18" width="12" height="10" fill="#dcccb2" stroke="#473b30" strokeWidth="2" />
	</svg>
);

const Lamp = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<line x1="32" y1="24" x2="32" y2="50" stroke="#473b30" strokeWidth="2.5" />
		<path d="M18 24 L32 8 L46 24 Z" fill="#f0d878" stroke="#473b30" strokeWidth="2.5" />
		<ellipse cx="32" cy="52" rx="10" ry="3" fill="#473b30" opacity="0.3" />
	</svg>
);

const Cart = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="10" y="24" width="38" height="18" rx="3" fill="#f2e6d8" stroke="#473b30" strokeWidth="2.5" />
		{[14, 22, 30, 38].map((x) => (
			<rect key={x} x={x} y="24" width="4" height="18" fill="#ba715b" />
		))}
		<rect x="18" y="12" width="22" height="14" rx="2" fill="#83adb4" stroke="#473b30" strokeWidth="2" />
		<circle cx="24" cy="19" r="2.5" fill="#ba715b" />
		<circle cx="32" cy="18" r="2.5" fill="#cfaa60" />
		<circle cx="29" cy="22" r="2" fill="#94aa7b" />
		<circle cx="20" cy="46" r="5" fill="#473b30" />
		<circle cx="42" cy="46" r="5" fill="#473b30" />
		<path d="M48 24 L56 14" stroke="#473b30" strokeWidth="2.5" />
	</svg>
);

const Castle = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="12" y="28" width="40" height="24" fill="#c9b8a0" stroke="#473b30" strokeWidth="2.5" />
		<rect x="8" y="18" width="12" height="34" fill="#b8a890" stroke="#473b30" strokeWidth="2" />
		<rect x="44" y="18" width="12" height="34" fill="#b8a890" stroke="#473b30" strokeWidth="2" />
		<rect x="26" y="14" width="12" height="38" fill="#d4c4a8" stroke="#473b30" strokeWidth="2" />
		<path d="M8 18 L14 8 L20 18 Z" fill="#ba715b" stroke="#473b30" strokeWidth="2" />
		<path d="M26 14 L32 4 L38 14 Z" fill="#ba715b" stroke="#473b30" strokeWidth="2" />
		<path d="M44 18 L50 8 L56 18 Z" fill="#ba715b" stroke="#473b30" strokeWidth="2" />
		<rect x="28" y="36" width="8" height="16" fill="#5a4a3a" stroke="#473b30" strokeWidth="1.5" />
	</svg>
);

const Carousel = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<path d="M8 28 L32 10 L56 28 Z" fill="#ba715b" stroke="#473b30" strokeWidth="2.5" />
		{[16, 24, 32, 40, 48].map((x, i) => (
			<path
				key={x}
				d={`M${x} 28 L${x + 3} 34`}
				stroke={i % 2 ? '#f5f0e8' : '#ba715b'}
				strokeWidth="3.5"
			/>
		))}
		<line x1="20" y1="28" x2="20" y2="44" stroke="#473b30" strokeWidth="2" />
		<line x1="32" y1="28" x2="32" y2="46" stroke="#473b30" strokeWidth="2" />
		<line x1="44" y1="28" x2="44" y2="44" stroke="#473b30" strokeWidth="2" />
		<ellipse cx="32" cy="48" rx="22" ry="6" fill="#ddb892" stroke="#473b30" strokeWidth="2.5" />
		<circle cx="20" cy="40" r="3" fill="#83adb4" stroke="#473b30" strokeWidth="1.5" />
		<circle cx="44" cy="40" r="3" fill="#cfaa60" stroke="#473b30" strokeWidth="1.5" />
	</svg>
);

const Coaster = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<path
			d="M6 44 Q18 12 32 28 Q46 44 58 16"
			fill="none"
			stroke="#473b30"
			strokeWidth="3"
			strokeLinecap="round"
		/>
		<path
			d="M6 48 Q18 16 32 32 Q46 48 58 20"
			fill="none"
			stroke="#8eb8c8"
			strokeWidth="2"
		/>
		<rect x="28" y="22" width="10" height="8" rx="2" fill="#ba715b" stroke="#473b30" strokeWidth="2" />
		<circle cx="30" cy="32" r="2.5" fill="#473b30" />
		<circle cx="36" cy="32" r="2.5" fill="#473b30" />
		<rect x="10" y="46" width="6" height="10" fill="#6a5a4a" stroke="#473b30" strokeWidth="1.5" />
		<rect x="48" y="40" width="6" height="16" fill="#6a5a4a" stroke="#473b30" strokeWidth="1.5" />
	</svg>
);

const Hedge = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<ellipse cx="32" cy="36" rx="22" ry="16" fill="#6b865e" stroke="#473b30" strokeWidth="2.5" />
		<ellipse cx="22" cy="30" rx="10" ry="8" fill="#94aa7b" stroke="#473b30" strokeWidth="2" />
		<ellipse cx="42" cy="30" rx="10" ry="8" fill="#94aa7b" stroke="#473b30" strokeWidth="2" />
	</svg>
);

const Fountain = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<ellipse cx="32" cy="48" rx="20" ry="8" fill="#8eb8c8" stroke="#473b30" strokeWidth="2.5" />
		<rect x="28" y="24" width="8" height="24" fill="#b0c8d4" stroke="#473b30" strokeWidth="2" />
		<path d="M32 14 c-8 6 -8 12 0 14 c8 -2 8 -8 0 -14z" fill="#83adb4" stroke="#473b30" strokeWidth="2" />
	</svg>
);

const Rocket = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<path d="M32 6 L42 36 L32 32 L22 36 Z" fill="#ba715b" stroke="#473b30" strokeWidth="2.5" />
		<circle cx="32" cy="22" r="4" fill="#83adb4" stroke="#473b30" strokeWidth="2" />
		<path d="M22 36 L18 48 L26 40 Z" fill="#cfaa60" stroke="#473b30" strokeWidth="2" />
		<path d="M42 36 L46 48 L38 40 Z" fill="#cfaa60" stroke="#473b30" strokeWidth="2" />
	</svg>
);

const Boat = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<path d="M10 34 L54 34 L46 48 L18 48 Z" fill="#c47a5a" stroke="#473b30" strokeWidth="2.5" />
		<path d="M32 12 L32 34" stroke="#473b30" strokeWidth="2.5" />
		<path d="M32 12 L48 32 L32 32 Z" fill="#e8eef4" stroke="#473b30" strokeWidth="2" />
	</svg>
);

const Bench = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="10" y="28" width="44" height="10" rx="2" fill="#c9a27a" stroke="#473b30" strokeWidth="2.5" />
		<rect x="12" y="18" width="40" height="10" rx="2" fill="#ddb892" stroke="#473b30" strokeWidth="2" />
		<rect x="14" y="38" width="4" height="12" fill="#473b30" />
		<rect x="46" y="38" width="4" height="12" fill="#473b30" />
	</svg>
);

const Tree = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="28" y="36" width="8" height="16" fill="#8b5a3c" stroke="#473b30" strokeWidth="2" />
		<circle cx="32" cy="26" r="16" fill="#6b865e" stroke="#473b30" strokeWidth="2.5" />
	</svg>
);

const Cup = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<path d="M18 20 h24 v22 a10 10 0 0 1 -24 0z" fill="#f2e6d8" stroke="#473b30" strokeWidth="2.5" />
		<path d="M42 26 h6 a6 6 0 0 1 0 12 h-6" fill="none" stroke="#473b30" strokeWidth="2.5" />
	</svg>
);

const Awning = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<path d="M8 28 L32 12 L56 28 Z" fill="#ba715b" stroke="#473b30" strokeWidth="2.5" />
		{[16, 24, 32, 40, 48].map((x, i) => (
			<path
				key={x}
				d={`M${x} 28 L${x + 4} 36`}
				stroke={i % 2 ? '#f5f0e8' : '#ba715b'}
				strokeWidth="4"
			/>
		))}
	</svg>
);

const ShoeRack = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="12" y="16" width="40" height="32" rx="2" fill="#c9b8a0" stroke="#473b30" strokeWidth="2.5" />
		{[24, 36].map((y) => (
			<rect key={y} x="16" y={y} width="32" height="6" rx="2" fill="#6a5a4a" stroke="#473b30" strokeWidth="1.5" />
		))}
	</svg>
);

const ChangingTable = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="10" y="20" width="44" height="24" rx="3" fill="#d2bba4" stroke="#473b30" strokeWidth="2.5" />
		<rect x="14" y="24" width="36" height="12" rx="2" fill="#efe5d2" />
		<rect x="14" y="44" width="5" height="10" fill="#473b30" />
		<rect x="45" y="44" width="5" height="10" fill="#473b30" />
	</svg>
);

const ClothesLine = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<line x1="8" y1="22" x2="56" y2="22" stroke="#473b30" strokeWidth="2.5" />
		<rect x="16" y="22" width="10" height="18" fill="#83adb4" stroke="#473b30" strokeWidth="2" />
		<rect x="30" y="22" width="10" height="20" fill="#e8c4c0" stroke="#473b30" strokeWidth="2" />
		<rect x="44" y="22" width="8" height="16" fill="#c9e8c4" stroke="#473b30" strokeWidth="2" />
	</svg>
);

const Tap = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="14" y="18" width="36" height="28" rx="3" fill="#b0b8c0" stroke="#473b30" strokeWidth="2.5" />
		{[22, 32, 42].map((x) => (
			<rect key={x} x={x} y="24" width="4" height="16" rx="1" fill="#dce4ec" stroke="#473b30" strokeWidth="1.5" />
		))}
	</svg>
);

const Rug = ({ title }: IconProps) => (
	<svg {...svgProps(title)}>
		<rect x="6" y="16" width="52" height="32" rx="2" fill="#9c3b3b" stroke="#473b30" strokeWidth="2.5" />
		<rect x="12" y="22" width="40" height="20" fill="#f3e6c8" stroke="#473b30" strokeWidth="1.5" />
		<rect x="18" y="27" width="28" height="10" fill="none" stroke="#9c3b3b" strokeWidth="1.5" />
		{[10, 18, 26, 34, 42, 50].map((x) => (
			<line key={x} x1={x} y1="48" x2={x} y2="54" stroke="#9c3b3b" strokeWidth="2" />
		))}
	</svg>
);

const Fallback = ({ title, label }: IconProps & { label: string }) => (
	<svg {...svgProps(title)}>
		<rect x="8" y="8" width="48" height="48" rx="6" fill="#d8d4c8" stroke="#473b30" strokeWidth="2.5" />
		<text
			x="32"
			y="36"
			textAnchor="middle"
			fontSize="10"
			fontWeight="700"
			fill="#473b30"
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
	banco: Bench,
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
	carrito: Cart,
	'carro de chuches': Cart,
	seto: Hedge,
	topiario: Hedge,
	castillo: Castle,
	carrusel: Carousel,
	'montaña rusa': Coaster,
	fuente: Fountain,
	cohete: Rocket,
	barco: Boat,
	tronco: Tree,
	árbol: Tree,
	taza: Cup,
	toldo: Awning,
	zapatero: ShoeRack,
	cambiador: ChangingTable,
	tendedero: ClothesLine,
	cañero: Tap,
	alfombra: Rug,
};

const ILLUSTRATIONS: Partial<Record<string, string>> = {
	banco: 'bench',
	sofá: 'sofa',
	sofa: 'sofa',
	estantería: 'shelf',
	taburete: 'stool',
	cuna: 'crib',
	carro: 'candy-cart',
	carrito: 'candy-cart',
	'carro de chuches': 'candy-cart',
	carrusel: 'carousel',
	silla: 'chair',
	cama: 'bed',
	hamaca: 'baby-rocker',
	planta: 'plant',
	maceta: 'plant',
	mesa: 'table',
	tele: 'tv',
	nevera: 'fridge',
	fregadera: 'sink',
	lavabo: 'sink',
	inodoro: 'toilet',
	perchero: 'coat-rack',
	piano: 'piano',
	escalera: 'stairs',
	alfombra: 'rug',
	zapatero: 'shoe-rack',
	cambiador: 'changing-table',
	tendedero: 'clothesline',
	cañero: 'beer-tap',
	castillo: 'castle',
	'montaña rusa': 'coaster',
	fuente: 'fountain',
	farola: 'lamp',
	barco: 'boat',
};

export const FurnitureIcon = ({
	kind,
	className,
}: {
	kind: string;
	className?: string;
}) => {
	const illustration = ILLUSTRATIONS[kind];
	const Icon =
		ICONS[kind] ?? ((props: IconProps) => <Fallback {...props} label={kind} />);
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
			{illustration ? (
				<img
					className="furniture-svg furniture-illustration"
					src={`${import.meta.env.BASE_URL}puzzles/furniture/${illustration}.png`}
					alt={kind}
					draggable={false}
				/>
			) : (
				<Icon title={kind} />
			)}
		</span>
	);
};
