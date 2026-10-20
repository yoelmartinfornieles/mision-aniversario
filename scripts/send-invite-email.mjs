#!/usr/bin/env node
/**
 * Sends the launch invitation via Formspree.
 * Used by the scheduled GitHub Action (13 Nov) and for manual dry runs.
 *
 * Required env:
 *   FORMSPREE_ENDPOINT  — https://formspree.io/f/xxxx
 *   SITE_URL            — public game URL (e.g. https://….vercel.app)
 *
 * Idempotency (yearly cron):
 *   INVITE_TARGET_YEAR  — default 2026; skip (exit 0) if UTC year differs
 *   FORCE_INVITE=1      — bypass the year gate (manual re-test)
 */

const endpoint = process.env.FORMSPREE_ENDPOINT?.trim();
const siteUrl = process.env.SITE_URL?.trim()?.replace(/\/$/, '');
const targetYear = Number(process.env.INVITE_TARGET_YEAR ?? '2026');
const forceInvite = process.env.FORCE_INVITE === '1';
const utcYear = new Date().getUTCFullYear();

if (!forceInvite && utcYear !== targetYear) {
	console.log(
		`Invite skipped: UTC year is ${utcYear}, target is ${targetYear}. Set FORCE_INVITE=1 to override.`,
	);
	process.exit(0);
}

if (!endpoint) {
	console.error('Missing FORMSPREE_ENDPOINT');
	process.exit(1);
}

if (!siteUrl) {
	console.error('Missing SITE_URL');
	process.exit(1);
}

const subject = 'Misión: Aniversario — dossier abierto';

const message = `Detective,

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

const body = new FormData();
body.append('subject', subject);
body.append('message', message);
body.append('kind', 'launch-invite');
body.append('siteUrl', siteUrl);
body.append('scheduledFor', '2026-11-13');
body.append('sentAt', new Date().toISOString());

const response = await fetch(endpoint, {
	method: 'POST',
	headers: { Accept: 'application/json' },
	body,
});

if (!response.ok) {
	const text = await response.text().catch(() => '');
	console.error('Formspree request failed:', response.status, text);
	process.exit(1);
}

console.log('Invite email sent OK →', siteUrl);
