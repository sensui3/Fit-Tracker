# Integração Sentry - FIT-TRACKER

Este documento detalha a configuração e o uso do Sentry para monitoramento de erros e performance no sistema FIT-TRACKER.

## Configuração de Ambiente

Para habilitar o Sentry, adicione a seguinte variável ao seu arquivo `.env.local`:

```bash
VITE_SENTRY_DSN="seu_dsn_do_sentry"
```

O sistema está configurado para:
- **Development**: 100% de sampling para performance e erros.
- **Production**: 10% de sampling para performance (tracing) e 100% para erros críticos.

## Funcionalidades Implementadas

1. **Captura Automática**: Erros de JavaScript e exceções não tratadas são capturados globalmente.
2. **React Error Boundary**: Integrado ao `GlobalErrorBoundary.tsx` para capturar erros de renderização e oferecer o diálogo de feedback do usuário.
3. **Performance Tracing**: Monitoramento de transições de rotas e operações pesadas.
4. **Data Scrubbing**: Limpeza automática de PII (Senhas, Emails, Tokens) via `lib/security.ts`.
5. **Contexto de Usuário**: Sincronização automática com `useAuthStore` para identificar o usuário afetado (respeitando privacidade).
6. **Log de Domínio**: Captura de erros específicos de banco de dados no `databaseService.ts`.

## Como Usar

### Logando Erros Manuais
Use o utilitário em `lib/sentry.ts`:

```typescript
import { logDomainError } from './lib/sentry';

try {
  // operacao
} catch (error) {
  logDomainError(error, 'contexto_ex_treino', { extraInfo: 'dados' });
}
```

### Testando a Integração
Vá em **Configurações > Monitoramento** para disparar erros sintéticos e validar a captura no painel do Sentry.

## Limpeza de Dados (Privacy)
A função `scrubData` em `lib/security.ts` garante que nenhum dado sensível seja enviado para os servidores do Sentry.
- Suporta strings (regex)
- Suporta objetos (limpeza recursiva de chaves sensíveis)
