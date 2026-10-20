/**
 * Recapture README shots at 1200×900 (deviceScaleFactor 1, no tiling).
 *
 * Prerequisites:
 *   - Vite dev server on http://127.0.0.1:5173
 *   - Google Chrome installed
 *   - npm i playwright-core  (or run from a temp dir that has it)
 *
 *   node scripts/capture-readme-screenshots.mjs
 */
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../docs/screenshots');
const base = process.env.SHOT_BASE ?? 'http://127.0.0.1:5173/';
const chrome =
	process.env.CHROME_PATH ??
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const shots = [
	{
		file: '01-landing.png',
		hash: '',
		ready: 'text=Archivo clasificado',
	},
	{
		file: '02-murdoku.png',
		hash: 'puzzle01-started-todo',
		start: 'Abrir el caso',
		ready: 'text=Personajes',
	},
	{
		file: '03-hexagon.png',
		hash: 'puzzle02-first-house',
		start: 'Abrir el plano',
		ready: 'text=Estancias',
	},
	{
		file: '04-mahjong.png',
		hash: 'puzzle04-arroa-move',
		start: 'Abrir el tablero',
		ready: 'text=Expediente',
	},
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
	executablePath: chrome,
	headless: true,
});

const context = await browser.newContext({
	viewport: { width: 1200, height: 900 },
	deviceScaleFactor: 1,
	reducedMotion: 'reduce',
});

const page = await context.newPage();

for (const shot of shots) {
	const url = shot.hash ? `${base}#${shot.hash}` : base;
	await page.goto(url, { waitUntil: 'networkidle' });
	await page.waitForTimeout(400);

	if (shot.start) {
		await page.getByRole('button', { name: shot.start }).click();
		await page.waitForTimeout(500);
	}

	await page
		.locator(shot.ready)
		.first()
		.waitFor({ state: 'visible', timeout: 15000 });
	await page.waitForTimeout(700);

	const dest = path.join(outDir, shot.file);
	await page.screenshot({
		path: dest,
		type: 'png',
		animations: 'disabled',
	});
	console.log('wrote', dest);
}

await browser.close();
console.log('done');
