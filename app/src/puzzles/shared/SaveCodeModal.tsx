import { useId, useState } from 'react';
import { useModalA11y } from './useModalA11y';

type SaveCodeModalProps = {
	code: string;
	title?: string;
	/** Extra line under the title (e.g. finale email notice). */
	subtitle?: string;
	continueLabel?: string;
	onContinueAtHome: () => void;
	onDismiss: () => void;
};

type CopyStatus = 'idle' | 'ok' | 'error';

export const SaveCodeModal = ({
	code,
	title = '¡Misión completada!',
	subtitle,
	continueLabel = 'Volver al archivo',
	onContinueAtHome,
	onDismiss,
}: SaveCodeModalProps) => {
	const titleId = useId();
	const { containerRef } = useModalA11y({ onClose: onDismiss });
	const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopyStatus('ok');
		} catch {
			setCopyStatus('error');
		}
	};

	return (
		<div className="modal-backdrop">
			<div
				ref={containerRef}
				className="instructions-modal save-code-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
			>
				<span className="victory-stamp" aria-hidden="true">
					Resuelto
				</span>
				<p className="label">Partida guardada</p>
				<h2 id={titleId}>{title}</h2>
				{subtitle ? <p>{subtitle}</p> : null}
				<p>
					Como en los videojuegos antiguos: anota este código. Si recargas el
					navegador o continúas más tarde, introdúcelo en el archivo principal y
					recuperarás el progreso.
				</p>
				<p className="continue-code" aria-label="Código de guardado">
					{code}
				</p>
				<button
					type="button"
					className="tool-button secondary save-code-copy"
					onClick={() => {
						void handleCopy();
					}}
				>
					Copiar código
				</button>
				{copyStatus === 'ok' && (
					<p className="continue-feedback" role="status">
						Código copiado.
					</p>
				)}
				{copyStatus === 'error' && (
					<p className="continue-feedback error" role="status">
						No se pudo copiar. Anótalo a mano.
					</p>
				)}
				<button
					type="button"
					className="primary-button"
					onClick={onContinueAtHome}
				>
					{continueLabel}
				</button>
				<button type="button" className="text-link" onClick={onDismiss}>
					Seguir aquí
				</button>
			</div>
		</div>
	);
};
