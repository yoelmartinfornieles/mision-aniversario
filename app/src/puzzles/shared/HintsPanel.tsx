import { useEffect, useId, useState } from 'react';
import { audio } from '@/lib/audio';
import { useModalA11y } from './useModalA11y';

const HINTS_STORAGE_PREFIX = 'disney-sorpresa-hints:';

type HintsPanelProps = {
	hints: string[];
	open: boolean;
	onClose: () => void;
	/** Persist revealed count across close / leave / return (session). */
	persistKey: string;
};

const readRevealed = (persistKey: string): number => {
	try {
		const raw = sessionStorage.getItem(`${HINTS_STORAGE_PREFIX}${persistKey}`);
		if (!raw) return 0;
		const value = Number.parseInt(raw, 10);
		return Number.isFinite(value) && value > 0 ? value : 0;
	} catch {
		return 0;
	}
};

const writeRevealed = (persistKey: string, count: number): void => {
	try {
		const key = `${HINTS_STORAGE_PREFIX}${persistKey}`;
		if (count <= 0) sessionStorage.removeItem(key);
		else sessionStorage.setItem(key, String(count));
	} catch {
		// private mode / quota
	}
};

export const HintsPanel = ({
	hints,
	open,
	onClose,
	persistKey,
}: HintsPanelProps) => {
	const [revealed, setRevealed] = useState(() =>
		Math.min(readRevealed(persistKey), hints.length)
	);
	const titleId = useId();
	const { containerRef } = useModalA11y({ open, onClose });

	useEffect(() => {
		setRevealed(Math.min(readRevealed(persistKey), hints.length));
	}, [persistKey, hints.length]);

	if (!open) return null;

	const showNext = () => {
		audio.play('hint');
		setRevealed((count) => {
			const next = Math.min(count + 1, hints.length);
			writeRevealed(persistKey, next);
			return next;
		});
	};

	return (
		<div className="modal-backdrop">
			<div
				ref={containerRef}
				className="instructions-modal hints-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
			>
				<p className="label">Pistas del caso</p>
				<h2 id={titleId}>Cómo avanzar</h2>
				<p className="hints-copy">
					Las pistas van de menos a más. Revela solo lo que necesites.
				</p>
				<ol className="hints-list">
					{hints.slice(0, revealed).map((hint, index) => (
						<li key={index}>{hint}</li>
					))}
				</ol>
				{revealed === 0 && (
					<p className="hints-empty">Aún no has pedido ninguna pista.</p>
				)}
				<div className="hints-actions">
					{revealed < hints.length ? (
						<button type="button" className="primary-button" onClick={showNext}>
							{revealed === 0
								? 'Revelar primera pista'
								: `Siguiente pista (${revealed + 1}/${hints.length})`}
						</button>
					) : (
						<p className="hints-done">
							Has consultado todas las pistas. El resto queda en tus manos, detective.
						</p>
					)}
					<button type="button" className="text-link" onClick={onClose}>
						Cerrar
					</button>
				</div>
			</div>
		</div>
	);
};
