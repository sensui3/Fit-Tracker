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
      headers: {
        'Content-Security-Policy': "default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'self' 'unsafe-inline' 'unsafe-eval' blob:; worker-src * 'self' blob:; connect-src * 'self' data: blob: ws: wss:; style-src * 'self' 'unsafe-inline'; img-src * 'self' data: https:;",
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
      },
      proxy: {
        '/api/auth': {
          target: process.env.VITE_BETTER_AUTH_URL || 'http://localhost:8788',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/auth/, '')
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
