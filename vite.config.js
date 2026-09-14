import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    port: 5190,
    strictPort: false,
    host: '127.0.0.1',
    allowedHosts: ['localhost', '127.0.0.1'],
    proxy: { '/api/media': { target: 'http://127.0.0.1:8788', changeOrigin: false, timeout: 240000 } },
  },
});
