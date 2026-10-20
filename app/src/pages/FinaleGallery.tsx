import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { SoundToggle } from '@/lib/audio';
import { PROOF_COUNT, proofSrc } from '@/pages/ProofRain';
import type { FinaleSuspect } from '@/pages/finaleSuspects';

export type FinaleView = 'card' | 'proofs' | 'suspects';

type GalleryItem = { key: string; src: string; label: string; alt: string };

const proofItems: GalleryItem[] = Array.from(
	{ length: PROOF_COUNT },
	(_, i) => {
		const label = `Prueba ${String(i + 1).padStart(2, '0')}`;
		return { key: label, src: proofSrc(i), label, alt: label };
	}
);

export const FinaleGallery = ({
	kind,
	suspects,
	onKind,
}: {
	kind: Exclude<FinaleView, 'card'>;
	suspects: FinaleSuspect[];
	onKind: (next: FinaleView) => void;
}) => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const items: GalleryItem[] =
		kind === 'proofs'
			? proofItems
			: suspects.map((suspect) => ({
					key: suspect.id,
					src: suspect.src,
					label: suspect.name,
					alt: suspect.alt ?? suspect.name,
				}));

	useEffect(() => {
		setOpenIndex(null);
		window.scrollTo(0, 0);
	}, [kind]);

	useEffect(() => {
		if (openIndex === null) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpenIndex(null);
			if (event.key === 'ArrowRight')
				setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
			if (event.key === 'ArrowLeft')
				setOpenIndex((i) =>
					i === null ? i : (i - 1 + items.length) % items.length
				);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [openIndex, items.length]);

	const current = openIndex === null ? null : items[openIndex];

	return (
		<div className="landing-shell finale-shell finale-gallery-shell">
			<div className="sound-dock">
				<SoundToggle />
			</div>
			<header className="finale-gallery-head">
				<p className="label">Archivo clasificado · Cierre</p>
				<h1>{kind === 'proofs' ? 'Las pruebas' : 'Los sospechosos'}</h1>
				<div className="finale-view-row">
					<button
						type="button"
						className="finale-view-button"
						onClick={() => onKind(kind === 'proofs' ? 'suspects' : 'proofs')}
					>
						{kind === 'proofs' ? 'Mostrar sospechosos' : 'Mostrar pruebas'}
					</button>
					<button
						type="button"
						className="finale-view-button"
						onClick={() => onKind('card')}
					>
						Volver a la ficha
					</button>
				</div>
			</header>
			<ul className="finale-gallery-grid">
				{items.map((item, index) => (
					<li key={item.key}>
						<button
							type="button"
							className="finale-gallery-item"
							onClick={() => setOpenIndex(index)}
							aria-label={`Ampliar ${item.label}`}
						>
							<img
								src={item.src}
								alt={item.alt}
								loading="lazy"
								decoding="async"
							/>
							<span>{item.label}</span>
						</button>
					</li>
				))}
			</ul>
			{current &&
				createPortal(
					<div
						className="finale-lightbox"
						role="dialog"
						aria-label={current.label}
						onClick={() => setOpenIndex(null)}
					>
						<figure onClick={(event) => event.stopPropagation()}>
							<img src={current.src} alt={current.alt} />
							<figcaption>{current.label}</figcaption>
						</figure>
						<button
							type="button"
							className="finale-view-button finale-lightbox-close"
							onClick={() => setOpenIndex(null)}
						>
							Cerrar
						</button>
					</div>,
					document.body
				)}
		</div>
	);
};
