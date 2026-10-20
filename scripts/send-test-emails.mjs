#!/usr/bin/env node
/**
 * One-shot: envía ambos mails de prueba (invitación + caso cerrado) vía Formspree.
 *
 * Required env:
 *   FORMSPREE_ENDPOINT  — https://formspree.io/f/xxxx
 *   SITE_URL            — URL pública del juego
 *
 * Optional:
 *   TEST_EMAIL_TO       — destinatario de prueba (default: fan_cassidy@hotmail.com)
 *
 * Importante: Formspree entrega al email configurado en el dashboard del formulario.
 * Para que SOLO llegue a TEST_EMAIL_TO, ese debe ser el destino del form (y sin
 * notificaciones extra / BCC a otras cuentas) mientras corra esta prueba.
 * El campo `_cc` refuerza la copia a esa dirección.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const endpoint = process.env.FORMSPREE_ENDPOINT?.trim();
const siteUrl = process.env.SITE_URL?.trim()?.replace(/\/$/, '');
const testTo =
	process.env.TEST_EMAIL_TO?.trim() || 'fan_cassidy@hotmail.com';

if (!endpoint) {
	console.error('Missing FORMSPREE_ENDPOINT');
	process.exit(1);
}

if (!siteUrl) {
	console.error('Missing SITE_URL');
	process.exit(1);
}

// Formspree ignora un "to" dinámico: el mail va al destino del dashboard.
// Obliga a confirmar que el form apunta solo al buzón de prueba (sin BCC extra).
if (process.env.I_SET_FORMSPREE_TO_TEST !== '1') {
	console.error(
		'Refusing to send: set I_SET_FORMSPREE_TO_TEST=1 only after the Formspree form destination is exclusively',
		testTo,
		'(no other notification / BCC).'
	);
	process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ticketsPath = join(
	root,
	'app/public/finale/entradas-disney.jpg'
);

const sentAt = new Date().toISOString();

const postFormspree = async (label, fields, files = []) => {
	const body = new FormData();
	for (const [key, value] of Object.entries(fields)) {
		body.append(key, value);
	}
	// Copia explícita al buzón de prueba (el destino principal sigue siendo el del form).
	body.append('_cc', testTo);
	body.append('testRecipient', testTo);
	body.append('deliveryMode', 'test');
	body.append('sentAt', sentAt);

	for (const file of files) {
		body.append(file.field, file.blob, file.filename);
	}

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: { Accept: 'application/json' },
		body,
	});

	if (!response.ok) {
		const text = await response.text().catch(() => '');
		console.error(`[${label}] Formspree failed:`, response.status, text);
		process.exit(1);
	}

	console.log(`[${label}] OK → ${testTo}`);
};

const inviteMessage = `Detective,

[PRUEBA — no es el envío real del 13 de noviembre]

Hay un expediente nuevo sobre tu mesa.
Clasificado. Confidencial. Con tu nombre en la portada.

Nueve años de pistas. Miles de recuerdos archivados.
Una aventura acaba… pero otra empieza.

Tu misión, si decides aceptarla:
abrir el archivo, bajar a la sala de pruebas
y resolver cuatro escenas de vuestro pasado.
El regalo —el de verdad— solo llega si cierras el caso.

Enlace al archivo:
${siteUrl}

El reloj no espera.

— Archivo clasificado · Confidencial`;

const finaleMessage = `Detective,

[PRUEBA — no es el cierre real del caso]

El expediente está cerrado. Cinco dossiers. Cinco claves. Ninguna escapatoria.

El complot del regalo ya no es secreto: Kai eligió. El resto… todos pringados.
Hasta las cejas. Sin excepción.

La pieza que faltaba en el tablero: Disneyland Paris.
Fechas del operativo: 7 y 8 de febrero.

El plan es frío y preciso. Salimos el día antes, el 6 de Febrero, en coche.
Dos etapas hasta París.
Parada para comer; el motor también necesita pan.
Noche en un Airbnb. Primer día: Disneyland Studios.
Con base en el apartamento, al amanecer: Disneyland Paris.
Otra noche allí. El lunes día 9, la vuelta a casa.

Adjunto: la prueba del delito — las entradas a los parques.

Espero que la sentencia te guste.

— Archivo clasificado · Confidencial`;

console.log(`Test emails → ${testTo} (site ${siteUrl})`);

await postFormspree('invite', {
	subject: '[PRUEBA] Misión: Aniversario — dossier abierto',
	message: inviteMessage,
	kind: 'launch-invite-test',
	siteUrl,
	scheduledFor: 'test-2026-10-19-05:00-CEST',
});

let ticketsBlob;
try {
	ticketsBlob = new Blob([readFileSync(ticketsPath)], {
		type: 'image/jpeg',
	});
} catch (error) {
	console.error('Could not read tickets image:', ticketsPath, error);
	process.exit(1);
}

await postFormspree(
	'finale',
	{
		subject: '[PRUEBA] Misión: Aniversario — caso cerrado',
		message: finaleMessage,
		kind: 'finale-complete-test',
		puzzleId: 'puzzle05-gift-plot',
	},
	[
		{
			field: 'attachment',
			blob: ticketsBlob,
			filename: 'entradas-disney-parques.jpg',
		},
	]
);

console.log('Both test emails sent.');
