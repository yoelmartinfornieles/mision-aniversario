const FINALE_SOLVED_KEY = 'disney-sorpresa-finale-solved';
const FINALE_EMAILED_KEY = 'disney-sorpresa-finale-emailed';
const TICKETS_FILENAME = 'entradas-disney-parques.jpg';

const EMAIL_SUBJECT = 'Sentencia · El caso del aniversario: cerrado';

const ticketsImageUrl = (): string =>
	`${import.meta.env.BASE_URL}finale/entradas-disney.jpg`;

const buildEmailMessage = (airbnbUrl: string): string => {
	const airbnbBlock = airbnbUrl
		? `Base de operaciones: Airbnb cerca del parque.\n${airbnbUrl}`
		: 'Base de operaciones: un Airbnb cerca del parque.';

	return `Detective,

Expediente cerrado. Cinco dossiers. Cinco claves. Ninguna escapatoria.

El complot del regalo ya no es secreto: Yoel eligió. El resto… todos metidos hasta las cejas. Sin excepción.

No vamos solos; los García se suman al viaje.

El siguiente caso, el que faltaba en el tablero: Disneyland Paris.

Operativo: del 6 al 9 de febrero.
Salida el 6 en coche · dos etapas hasta París.
Parada para comer; el motor también necesita pan.
${airbnbBlock}
Sábado 7: Walt Disney Studios Park.
Domingo 8: Disneyland Park.
Lunes 9: vuelta a casa.

Sentencia: tres días, dos parques y ninguna coartada.

Te quiero, siempre te quise y siempre te querré.

— Archivo clasificado · Confidencial`;
};

/** Case closed in this browser (answer solved) — independent of mail delivery. */
export const hasFinaleBeenSolved = (): boolean => {
	try {
		return (
			localStorage.getItem(FINALE_SOLVED_KEY) === '1' ||
			localStorage.getItem(FINALE_EMAILED_KEY) === '1'
		);
	} catch {
		return false;
	}
};

export const markFinaleSolved = (): void => {
	try {
		localStorage.setItem(FINALE_SOLVED_KEY, '1');
	} catch (error) {
		console.error('Could not persist finale solved flag:', error);
	}
};

export const hasFinaleBeenNotified = (): boolean => {
	try {
		return localStorage.getItem(FINALE_EMAILED_KEY) === '1';
	} catch {
		return false;
	}
};

const markEmailed = (): void => {
	try {
		localStorage.setItem(FINALE_SOLVED_KEY, '1');
		localStorage.setItem(FINALE_EMAILED_KEY, '1');
	} catch (error) {
		console.error('Could not persist finale email flag:', error);
	}
};

const blobToBase64 = async (blob: Blob): Promise<string> => {
	const buffer = await blob.arrayBuffer();
	const bytes = new Uint8Array(buffer);
	const chunk = 0x8000;
	let binary = '';
	for (let i = 0; i < bytes.length; i += chunk) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	}
	return btoa(binary);
};

const loadTicketsAttachment = async (): Promise<{
	filename: string;
	contentBase64: string;
	mimeType: string;
} | null> => {
	try {
		const response = await fetch(ticketsImageUrl());
		if (!response.ok) {
			console.error(
				'[finaleNotify] Could not load tickets image:',
				response.status
			);
			return null;
		}
		const blob = await response.blob();
		const contentBase64 = await blobToBase64(blob);
		return {
			filename: TICKETS_FILENAME,
			contentBase64,
			mimeType: blob.type || 'image/jpeg',
		};
	} catch (error) {
		console.error('[finaleNotify] Tickets image fetch error:', error);
		return null;
	}
};

export const notifyFinaleComplete = async (): Promise<boolean> => {
	if (hasFinaleBeenNotified()) return true;

	const endpoint = import.meta.env.VITE_GAS_WEBAPP_URL?.trim();
	const secret = import.meta.env.VITE_GAS_MAIL_SECRET?.trim();
	if (!endpoint || !secret) {
		console.warn(
			'[finaleNotify] VITE_GAS_WEBAPP_URL / VITE_GAS_MAIL_SECRET not set; skipping email.'
		);
		return false;
	}

	try {
		const airbnbUrl = import.meta.env.VITE_AIRBNB_URL?.trim() ?? '';
		const attachment = await loadTicketsAttachment();
		const payload: Record<string, unknown> = {
			secret,
			subject: EMAIL_SUBJECT,
			message: buildEmailMessage(airbnbUrl),
			variant: 'finale',
			disneyLogo: true,
			preheader:
				'Expediente cerrado. La pieza que faltaba: Disneyland Paris.',
		};
		if (airbnbUrl) {
			payload.ctaUrl = airbnbUrl;
			payload.ctaLabel = 'Ver la base de operaciones';
		}
		if (attachment) {
			payload.attachment = attachment;
		}

		const response = await fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain;charset=utf-8' },
			body: JSON.stringify(payload),
			redirect: 'follow',
		});

		const text = await response.text().catch(() => '');
		let data: { ok?: boolean; error?: string } | null = null;
		try {
			data = text ? JSON.parse(text) : null;
		} catch {
			data = null;
		}

		if (!response.ok || !data?.ok) {
			console.error(
				'[finaleNotify] Mailer request failed:',
				data?.error || text || response.status
			);
			return false;
		}

		markEmailed();
		return true;
	} catch (error) {
		console.error('[finaleNotify] Mailer request error:', error);
		return false;
	}
};
