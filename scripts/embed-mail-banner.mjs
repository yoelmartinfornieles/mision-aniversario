#!/usr/bin/env node
/**
 * Regenerate Apps Script banner embeds from JPEGs in app/public/mail/.
 *
 *   node scripts/embed-mail-banner.mjs invite
 *   node scripts/embed-mail-banner.mjs finale
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const VARIANTS = {
	invite: {
		jpg: 'app/public/mail/yoel-desk-invite-banner.jpg',
		out: 'scripts/google-apps-script/InviteBannerData.gs',
		varName: 'YOEL_BANNER_B64_',
		comment:
			'Yoel noir desk banner JPEG, base64 — used as cid:mailBanner for invite emails.\n * Do not edit by hand; regenerate from app/public/mail/yoel-desk-invite-banner.jpg if needed.',
	},
	finale: {
		jpg: 'app/public/mail/carla-detective-banner.jpg',
		out: 'scripts/google-apps-script/BannerData.gs',
		varName: 'CARLA_BANNER_B64_',
		comment:
			'Carla noir detective banner JPEG, base64 — used as cid:mailBanner for finale emails.\n * Do not edit by hand; regenerate from app/public/mail/carla-detective-banner.jpg if needed.',
	},
};

const variant = String(process.argv[2] || '')
	.trim()
	.toLowerCase();
const config = VARIANTS[variant];

if (!config) {
	console.error('Usage: node scripts/embed-mail-banner.mjs <invite|finale>');
	process.exit(1);
}

const jpgPath = join(root, config.jpg);
const outPath = join(root, config.out);
const b64 = readFileSync(jpgPath).toString('base64');
const chunk = 76;
const lines = [];
for (let i = 0; i < b64.length; i += chunk) {
	const slice = b64.slice(i, i + chunk);
	const more = i + chunk < b64.length;
	lines.push(`  '${slice}'${more ? ' +' : ''}`);
}

const body =
	`/**\n * ${config.comment}\n */\nvar ${config.varName} =\n` +
	lines.join('\n') +
	';\n';

writeFileSync(outPath, body);
console.log(`Wrote ${config.out} (${Math.round(b64.length / 1024)} KB base64)`);
