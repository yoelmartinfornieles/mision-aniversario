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
				<span aria-hidden="true">💡</span>
				<span className="hint-label">Pista</span>
			</button>
			{timer}
		</div>
	</div>
);
