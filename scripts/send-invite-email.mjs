#!/usr/bin/env node
/**
 * Sends the launch invitation via Google Apps Script mailer.
 * Used by the scheduled GitHub Action (13 Nov) and for manual dry runs.
 *
 * Required env:
 *   GAS_WEBAPP_URL   — Apps Script web app URL (…/exec)
 *   GAS_MAIL_SECRET  — same as Script property MAIL_SECRET
 *   SITE_URL         — public game URL
 *
 * Idempotency (yearly cron):
 *   INVITE_TARGET_YEAR  — default 2026; skip (exit 0) if UTC year differs
 *   FORCE_INVITE=1      — bypass the year gate (manual re-test)
 *
 * Optional:
 *   EMAIL_TO  — override recipient (else Script property RECIPIENT_EMAIL)
 */

import { postMail } from './lib/postMail.mjs';

const endpoint = process.env.GAS_WEBAPP_URL?.trim();
const secret = process.env.GAS_MAIL_SECRET?.trim();
const siteUrl = process.env.SITE_URL?.trim()?.replace(/\/$/, '');
const emailTo = process.env.EMAIL_TO?.trim();
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

const subject = 'Clasificado · Hay un expediente con tu nombre';

const message = `Detective,

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

try {
	await postMail({
		endpoint,
		secret,
		subject,
		message,
		to: emailTo,
		variant: 'invite',
		ctaUrl: siteUrl,
		ctaLabel: 'Abrir el expediente',
		preheader: 'Hay un expediente con tu nombre en la portada.',
	});
	console.log('Invite email sent OK →', siteUrl, emailTo ? `(to ${emailTo})` : '(default recipient)');
} catch (error) {
	console.error('Mailer request failed:', error.message || error);
	process.exit(1);
}
