import { Suspense, useEffect, useState } from 'react';
import { goToPuzzle, readRouteFromHash, type AppRoute } from '@/lib/navigation';
import { PUZZLE_SCREENS } from '@/puzzles/registry';
import { isPuzzleId } from '@/puzzles/types';
import { FinalePage } from './FinalePage';
import { HomePage } from './HomePage';

export const PuzzleRouter = () => {
	const [route, setRoute] = useState<AppRoute>({ kind: 'home' });

	useEffect(() => {
		const syncFromHash = () => {
			setRoute(readRouteFromHash(window.location.hash, isPuzzleId));
		};
		syncFromHash();
		window.addEventListener('hashchange', syncFromHash);
		return () => window.removeEventListener('hashchange', syncFromHash);
	}, []);

	if (route.kind === 'home') {
		return <HomePage onNavigateToPuzzle={goToPuzzle} />;
	}

	if (route.kind === 'finale') {
		return <FinalePage />;
	}

	const Screen = PUZZLE_SCREENS[route.puzzleId];
	return (
		<Suspense
			fallback={
				<div className="landing-shell" role="status" aria-live="polite">
					<div className="landing-card">
						<p className="label">Archivo clasificado</p>
						<p className="landing-kicker">Abriendo el dossier…</p>
					</div>
				</div>
			}
		>
			<Screen />
		</Suspense>
	);
};
