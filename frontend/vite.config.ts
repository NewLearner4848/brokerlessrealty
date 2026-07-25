import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        proxy: {
          '/sitemap.xml': {
            target: env.VITE_API_BASE_URL || 'http://localhost:3001',
            changeOrigin: true,
          },
          '/api': {
            target: env.VITE_API_BASE_URL || 'http://localhost:3001',
            changeOrigin: true,
          }
        }
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
