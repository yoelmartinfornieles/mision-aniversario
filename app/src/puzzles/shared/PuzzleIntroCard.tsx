import type { ReactNode } from 'react';
import { goHome } from '@/lib/navigation';

type PuzzleIntroCardProps = {
	label: string;
	title: string;
	kicker: string;
	children: ReactNode;
	alreadyDone: boolean;
	saveCode: string;
	startLabel: string;
	replayLabel?: string;
	onStart: () => void;
};

export const PuzzleIntroCard = ({
	label,
	title,
	kicker,
	children,
	alreadyDone,
	saveCode,
	startLabel,
	replayLabel = 'Reabrir el dossier',
	onStart,
}: PuzzleIntroCardProps) => (
	<div className="landing-shell">
		<div className="landing-card">
			<p className="label">{label}</p>
			<h1>{title}</h1>
			<p className="landing-kicker">{kicker}</p>
			<p className="landing-copy">{children}</p>
			{alreadyDone && (
				<p className="landing-copy code-hint">
					Dossier resuelto. Clave:{' '}
					<strong>{saveCode}</strong>
				</p>
			)}
			<button type="button" className="primary-button" onClick={onStart}>
				{alreadyDone ? replayLabel : startLabel}
			</button>
			<button type="button" className="text-link" onClick={goHome}>
				← Volver al archivo
			</button>
		</div>
	</div>
);
