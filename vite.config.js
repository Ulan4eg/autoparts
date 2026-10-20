import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// API работает по http и без CORS-заголовков, поэтому в dev и preview
// запросы идут через прокси: /api/... -> http://api.favorit-parts.ru/...
const proxy = {
  '/api': {
    target: 'http://api.favorit-parts.ru',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
});
