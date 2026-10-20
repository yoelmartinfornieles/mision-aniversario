import { useEffect, useId, useState } from 'react';
import { useModalA11y } from './useModalA11y';

type HintsPanelProps = {
	hints: string[];
	open: boolean;
	onClose: () => void;
};

export const HintsPanel = ({ hints, open, onClose }: HintsPanelProps) => {
	const [revealed, setRevealed] = useState(0);
	const titleId = useId();
	const { containerRef } = useModalA11y({ open, onClose });

	useEffect(() => {
		if (!open) setRevealed(0);
	}, [open]);

	if (!open) return null;

	const showNext = () => {
		setRevealed((count) => Math.min(count + 1, hints.length));
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
					Cada pista encadena con la anterior. Revela solo lo que necesites.
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
						<p className="hints-done">No hay más pistas — ya tienes el hilo.</p>
					)}
					<button type="button" className="text-link" onClick={onClose}>
						Cerrar
					</button>
				</div>
			</div>
		</div>
	);
};
