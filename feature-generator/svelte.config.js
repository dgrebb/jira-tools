import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

function createAlias(paths) {
	const aliases = {};

	Object.entries(paths).forEach(([key, value]) => {
		const keys = key.split(',').map((k) => k.trim());
		keys.forEach((alias) => {
			aliases[alias] = value;
		});
	});

	return aliases;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: createAlias({
			'$lib, @lib': resolve('src/lib'),
			'@components, @c': resolve('src/lib/components'),
			'@mocks': resolve('src/tests/__fixtures__'),
			'@types': resolve('src/lib/types'),
			'@utils': resolve('src/lib/utils'),
			'@config': resolve('src/config'),
			'@state': resolve('src/lib/state')
		})
	}
};

export default config;
