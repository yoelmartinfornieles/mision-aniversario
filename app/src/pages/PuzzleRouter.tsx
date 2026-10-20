import { Suspense, useEffect, useRef, useState } from 'react';
import { audio } from '@/lib/audio';
import { goToPuzzle, readRouteFromHash, type AppRoute } from '@/lib/navigation';
import { PUZZLE_SCREENS } from '@/puzzles/registry';
import { isPuzzleId } from '@/puzzles/types';
import { FinalePage } from './FinalePage';
import { HomePage } from './HomePage';

export const PuzzleRouter = () => {
	const [route, setRoute] = useState<AppRoute>({ kind: 'home' });
	const prevKind = useRef<AppRoute['kind'] | null>(null);

	useEffect(() => {
		const syncFromHash = () => {
			setRoute(readRouteFromHash(window.location.hash, isPuzzleId));
		};
		syncFromHash();
		window.addEventListener('hashchange', syncFromHash);
		return () => window.removeEventListener('hashchange', syncFromHash);
	}, []);

	useEffect(() => audio.bindGestureUnlock(), []);

	useEffect(() => {
		const kind = route.kind;
		// Hub stays put from main → dossier intro; puzzles/finale own their bed.
		if (kind === 'home') {
			audio.setAmbientBed('hub');
		}
		audio.setAmbientEnabled(true);
		if (
			kind === 'puzzle' &&
			prevKind.current !== null &&
			prevKind.current !== 'puzzle'
		) {
			audio.play('dossier');
		}
		if (
			kind === 'finale' &&
			prevKind.current !== null &&
			prevKind.current !== 'finale'
		) {
			audio.play('dossier');
		}
		prevKind.current = kind;
	}, [route]);

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
