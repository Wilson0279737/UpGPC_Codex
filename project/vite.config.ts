import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'cms-admin-index',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const url = new URL(request.url || '/', 'http://localhost');
        if (url.pathname === '/admin' || url.pathname === '/admin/') request.url = '/admin/index.html' + url.search;
        next();
      });
    },
  }],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
