import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

import { viteSingleFile } from 'vite-plugin-singlefile';
// https://vitejs.dev/config/
export default defineConfig({
	server: {
		watch: {
		  usePolling: true,
		},
		host: true, // needed for the Docker Container port mapping to work
		strictPort: true,
		port: 3000, // you can replace this port with any port
	  },
	plugins: [
		preact(),
		viteSingleFile(),

	],
});

//<script type="module" crossorigin src="/assets/index-3f277a05.js"></script>
//<link rel="stylesheet" href="/assets/index-e7275a14.css">