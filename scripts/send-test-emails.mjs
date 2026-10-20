#!/usr/bin/env node

import { postMail } from './lib/postMail.mjs';
import { loadTicketsAttachment } from './lib/ticketsAttachment.mjs';

const endpoint = process.env.GAS_WEBAPP_URL?.trim();
const secret = process.env.GAS_MAIL_SECRET?.trim();
const siteUrl = process.env.SITE_URL?.trim()?.replace(/\/$/, '');
const testTo =
	process.env.TEST_EMAIL_TO?.trim() || 'fan_cassidy@hotmail.com';
const airbnbUrl = process.env.AIRBNB_URL?.trim() || '';

if (!endpoint) {
	console.error('Missing GAS_WEBAPP_URL');
	process.exit(1);
}

if (!secret) {
	console.error('Missing GAS_MAIL_SECRET');
	process.exit(1);
}

if (!siteUrl) {
	console.error('Missing SITE_URL');
	process.exit(1);
}

const inviteMessage = `Detective,

[PRUEBA — no es el envío real del 13 de noviembre]

Hay un expediente nuevo sobre tu mesa.
Clasificado. Confidencial. Con tu nombre en la portada.

El expediente lleva nueve años abierto. Hoy toca cerrarlo.

Abre el archivo. Baja a la sala de pruebas.
Resuelve cuatro escenas de vuestro pasado.
El regalo —el de verdad— solo llega si cierras el caso.

Enlace al archivo:
${siteUrl}

El reloj no espera.

— Archivo clasificado · Confidencial`;

const airbnbBlock = airbnbUrl
	? `Base de operaciones: Airbnb cerca del parque.\n${airbnbUrl}`
	: 'Base de operaciones: un Airbnb cerca del parque.';

const finaleMessage = `Detective,

[PRUEBA — no es el cierre real del caso]

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

const send = async (label, subject, message, extras = {}) => {
	try {
		await postMail({
			endpoint,
			secret,
			subject,
			message,
			to: testTo,
			...extras,
		});
		console.log(`[${label}] OK → ${testTo}`);
	} catch (error) {
		console.error(`[${label}] Mailer failed:`, error.message || error);
		process.exit(1);
	}
};

console.log(`Test emails → ${testTo} (site ${siteUrl})`);

await send(
	'invite',
	'[PRUEBA] Clasificado · Hay un expediente con tu nombre',
	inviteMessage,
	{
		variant: 'invite',
		ctaUrl: siteUrl,
		ctaLabel: 'Abrir el expediente',
		preheader: '[PRUEBA] Hay un expediente con tu nombre en la portada.',
	},
);

let tickets;
try {
	tickets = loadTicketsAttachment();
} catch (error) {
	console.error('Could not read tickets image:', error.message || error);
	process.exit(1);
}

await send(
	'finale',
	'[PRUEBA] Sentencia · El caso del aniversario: cerrado',
	finaleMessage,
	{
		variant: 'finale',
		disneyLogo: true,
		attachment: tickets,
		preheader:
			'[PRUEBA] Expediente cerrado. La pieza que faltaba: Disneyland Paris.',
		...(airbnbUrl
			? {
					ctaUrl: airbnbUrl,
					ctaLabel: 'Ver la base de operaciones',
				}
			: {}),
	},
);

console.log('Both test emails sent.');
