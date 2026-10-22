import type { ReactNode } from 'react';
import { SoundToggle } from '@/lib/audio';
import { goHome } from '@/lib/navigation';

type GameTopbarProps = {
	/** Outer class: murdoku-topbar | hex-topbar | mahjong-topbar */
	className: string;
	brand: string;
	caseName: string;
	/** Prefer <PuzzleClock /> so ticks stay out of the puzzle tree. */
	timer: ReactNode;
	onHints: () => void;
	hintsDisabled?: boolean;
};

export const GameTopbar = ({
	className,
	brand,
	caseName,
	timer,
	onHints,
	hintsDisabled = false,
}: GameTopbarProps) => (
	<div className={className}>
		<div className="topbar-left">
			<button
				className="arrow-button"
				type="button"
				aria-label="Volver"
				onClick={goHome}
			>
				←
			</button>
			<div className="brand-block">
				<div className="brand">{brand}</div>
			</div>
		</div>
		<div className="topbar-middle">
			<div className="case-name">{caseName}</div>
		</div>
		<div className="topbar-actions">
			<SoundToggle />
			<button
				type="button"
				className="tool-button secondary hint-button"
				onClick={onHints}
				disabled={hintsDisabled}
				aria-label="Pista"
			>
				<svg
					className="hint-icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
					focusable="false"
				>
					<path d="M9 16v-1c0-1.5-3-2.5-3-6a6 6 0 0 1 12 0c0 3.5-3 4.5-3 6v1Z" />
					<path d="M9 19h6M10 22h4M12 1v1M2 8H1M23 8h-1M4 3l1 1M20 3l-1 1" />
				</svg>
				<span className="hint-label">Pista</span>
			</button>
			{timer}
		</div>
	</div>
);
