import { useId, useState } from 'react';
import { audio } from '@/lib/audio';
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
	title = 'Dossier cerrado',
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
			audio.play('copy');
			setCopyStatus('ok');
		} catch {
			audio.play('error');
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
					Cerrado
				</span>
				<p className="label">Clave de guardado</p>
				<h2 id={titleId}>{title}</h2>
				{subtitle ? <p>{subtitle}</p> : null}
				<p>
					Tu progreso queda guardado en este navegador. Anota también esta
					clave: te permitirá recuperarlo en otro dispositivo o si se borran
					los datos.
				</p>
				<p className="continue-code" aria-label="Clave de guardado">
					{code}
				</p>
				<button
					type="button"
					className="tool-button secondary save-code-copy"
					onClick={() => {
						void handleCopy();
					}}
				>
					Copiar clave
				</button>
				{copyStatus === 'ok' && (
					<p className="continue-feedback" role="status">
						Clave copiada.
					</p>
				)}
				{copyStatus === 'error' && (
					<p className="continue-feedback error" role="status">
						No se pudo copiar. Anótala a mano.
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
