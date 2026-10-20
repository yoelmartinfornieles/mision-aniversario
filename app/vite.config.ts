import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** Project Pages live at /<repo>/; local/dev and root hosts stay at /. */
const pagesBase =
	process.env.GITHUB_ACTIONS === 'true' && process.env.GITHUB_REPOSITORY
		? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
		: '/';

export default defineConfig({
	base: pagesBase,
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(rootDir, 'src'),
		},
	},
	test: {
		environment: 'node',
		include: ['src/**/*.{test,spec}.{ts,tsx}'],
	},
});
