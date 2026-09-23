import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    // The live catalog authorizes http://127.0.0.1:5191 for local development.
    port: 5191,
    strictPort: true,
    host: '127.0.0.1',
    allowedHosts: ['localhost', '127.0.0.1'],
  },
});
