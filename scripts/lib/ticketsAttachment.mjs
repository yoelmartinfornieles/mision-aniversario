import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ticketsPath = join(root, 'app/public/finale/entradas-disney.jpg');

/**
 * @returns {{ filename: string; contentBase64: string; mimeType: string }}
 */
export function loadTicketsAttachment() {
	const contentBase64 = readFileSync(ticketsPath).toString('base64');
	return {
		filename: 'entradas-disney-parques.jpg',
		contentBase64,
		mimeType: 'image/jpeg',
	};
}
