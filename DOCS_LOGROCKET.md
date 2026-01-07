# LogRocket Integration Guide

Este projeto utiliza o **LogRocket** para monitoramento de erros e reprodução de sessões de usuário. O LogRocket permite que vejamos exatamente o que o usuário fez antes de um erro ocorrer através de vídeos das sessões.

## Configuração

1. Crie uma conta no [LogRocket](https://logrocket.com/).
2. Crie um novo projeto.
3. Obtenha o seu **App ID** (ex: `seu-app-id/fit-tracker`).
4. Adicione ao seu arquivo `.env.local`:
   ```bash
   VITE_LOGROCKET_ID="seu-app-id/fit-tracker"
   ```

## Uso no Código

### Inicialização
O LogRocket é inicializado no `App.tsx` chamando `initLogRocket()`.

### Identificação de Usuário
O usuário é identificado automaticamente no `AppInitializer.tsx` através da função `setLogRocketUser(authUser)`.

### Captura de Erros
- **Global**: O `GlobalErrorBoundary.tsx` captura erros de renderização e envia para o LogRocket.
- **Manual**: Use `logDomainError(error, context)` do arquivo `lib/logrocket.ts`.

## Benefícios
- **Session Replay**: Assista a vídeos do que o usuário fez.
- **Network Logging**: Veja todas as requisições de rede feitas.
- **Console Logging**: Veja exatamente o que foi logado no console do navegador do usuário.
- **Performance**: Impacto mínimo no carregamento da página.
