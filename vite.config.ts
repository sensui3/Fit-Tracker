import path from 'path';
import * as dotenv from 'dotenv';

// 1. CARREGA O ENV ANTES DE QUALQUER OUTRO IMPORT QUE USE O DB
const result = dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (result.error || !process.env.DATABASE_URL) {
  console.error('❌ ERRO CRÍTICO: Não foi possível carregar o arquivo .env.local ou a DATABASE_URL está ausente.');
  console.log('Certifique-se de que o arquivo existe na raiz e contém as variáveis necessárias.');
} else {
  console.log('✅ Ambiente carregado com sucesso!');
}

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        // Proxy Neon Auth requests to avoid CORS issues in development
        '/api/auth': {
          target: 'https://ep-young-waterfall-adzgojue.neonauth.c-2.us-east-1.aws.neon.tech',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/auth/, '/neondb/auth'),
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        }
      }
    },
    plugins: [
      react()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
