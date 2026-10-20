const FINALE_EMAILED_KEY = 'disney-sorpresa-finale-emailed';
const TICKETS_IMAGE_URL = `${import.meta.env.BASE_URL}finale/entradas-disney.jpg`;

const EMAIL_SUBJECT = 'Misión: Aniversario — caso cerrado';

const EMAIL_MESSAGE = `Detective,

El expediente está cerrado. Cinco dossiers. Cinco claves. Ninguna escapatoria.

El complot del regalo ya no es secreto: Kai eligió. El resto… todos pringados.
Hasta las cejas. Sin excepción.

La pieza que faltaba en el tablero: Disneyland Paris.
Fechas del operativo: 7 y 8 de febrero.

El plan es frío y preciso. Salimos el día antes, el 6 de febrero, en coche.
Dos etapas hasta París.
Parada para comer; el motor también necesita pan.
Noche en un Airbnb. Primer día: Disneyland Studios.
Con base en el apartamento, al amanecer: Disneyland Paris.
Otra noche allí. El lunes día 9, la vuelta a casa.

Adjunto: la prueba del delito — las entradas a los parques.

Espero que la sentencia te guste.

— Archivo clasificado · Confidencial`;

const alreadyEmailed = (): boolean => {
	try {
		return localStorage.getItem(FINALE_EMAILED_KEY) === '1';
	} catch {
		return false;
	}
};

const markEmailed = (): void => {
	try {
		localStorage.setItem(FINALE_EMAILED_KEY, '1');
	} catch (error) {
		console.error('Could not persist finale email flag:', error);
	}
};

const loadTicketsAttachment = async (): Promise<Blob | null> => {
	try {
		const response = await fetch(TICKETS_IMAGE_URL);
		if (!response.ok) {
			console.error(
				'[finaleNotify] Could not load tickets image:',
				response.status
			);
			return null;
		}
		return await response.blob();
	} catch (error) {
		console.error('[finaleNotify] Tickets image fetch error:', error);
		return null;
	}
};

/**
 * Fire-and-forget Formspree notify when the last dossier is solved.
 * Dedupes via localStorage; never throws into the game flow.
 * Sends the Disney tickets screenshot as a Formspree email attachment.
 */
export const notifyFinaleComplete = async (): Promise<void> => {
	if (alreadyEmailed()) return;

	const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim();
	if (!endpoint) {
		console.warn(
			'[finaleNotify] VITE_FORMSPREE_ENDPOINT is not set; skipping email.'
		);
		return;
	}

	try {
		const tickets = await loadTicketsAttachment();
		if (!tickets) {
			console.error(
				'[finaleNotify] Skipping Formspree send: tickets attachment unavailable.'
			);
			return;
		}

		const body = new FormData();
		body.append('subject', EMAIL_SUBJECT);
		body.append('message', EMAIL_MESSAGE);
		body.append('puzzleId', 'puzzle05-gift-plot');
		body.append('completedAt', new Date().toISOString());
		body.append('attachment', tickets, 'entradas-disney-parques.jpg');

		const response = await fetch(endpoint, {
			method: 'POST',
			headers: { Accept: 'application/json' },
			body,
		});

		if (!response.ok) {
			console.error(
				'[finaleNotify] Formspree request failed:',
				response.status,
				await response.text().catch(() => '')
			);
			return;
		}

		markEmailed();
	} catch (error) {
		console.error('[finaleNotify] Formspree request error:', error);
	}
};
