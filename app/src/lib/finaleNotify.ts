const FINALE_EMAILED_KEY = 'disney-sorpresa-finale-emailed';
const TICKETS_FILENAME = 'entradas-disney-parques.jpg';

const EMAIL_SUBJECT = 'Misión: Aniversario — caso cerrado';

const ticketsImageUrl = (): string =>
	`${import.meta.env.BASE_URL}finale/entradas-disney.jpg`;

const buildEmailMessage = (airbnbUrl: string): string => {
	const airbnbBlock = airbnbUrl
		? `Noche en un Airbnb:\n${airbnbUrl}`
		: 'Noche en un Airbnb.';

	return `Detective,

El expediente está cerrado. Cinco dossiers. Cinco claves. Ninguna escapatoria.

El complot del regalo ya no es secreto: Kai eligió. El resto… todos pringados.
Hasta las cejas. Sin excepción.

La pieza que faltaba en el tablero: Disneyland Paris.
Fechas del operativo: 7 y 8 de febrero.

El plan es frío y preciso. Salimos el día antes, el 6 de febrero, en coche.
Dos etapas hasta París.
Parada para comer; el motor también necesita pan.
${airbnbBlock}
Primer día: Disneyland Studios.
Con base en el apartamento, al amanecer: Disneyland Paris.
Otra noche allí. El lunes día 9, la vuelta a casa.

Adjunto: la prueba del delito — las entradas a los parques.
El resto de la info del operativo la tiene Yoel. Solo hay que pedirla.

Espero que la sentencia te guste.

— Archivo clasificado · Confidencial`;
};

export const hasFinaleBeenNotified = (): boolean => {
	try {
		return localStorage.getItem(FINALE_EMAILED_KEY) === '1';
	} catch {
		return false;
	}
};

const alreadyEmailed = hasFinaleBeenNotified;

const markEmailed = (): void => {
	try {
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
	if (alreadyEmailed()) return true;

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
			disneyLogo: true,
		};
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
