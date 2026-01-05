# 🚀 PLANO DE IMPLEMENTAÇÃO - FIT-TRACKER

## 📋 COMO USAR ESTE DOCUMENTO

Cada tarefa abaixo contém:
1. **Descrição** da correção/otimização
2. **Prioridade** (🔴 Crítica, 🟡 Alta, 🟢 Média, ⚪ Baixa)
3. **Esforço** estimado em horas
4. **Prompt pronto** para solicitar a implementação

### Como solicitar:
Copie o prompt da tarefa desejada e cole no chat. O prompt já contém todas as instruções necessárias.

---

## 🔥 FASE 1: CORREÇÕES CRÍTICAS (Semana 1-2)

### 1.1 Configurar CI/CD com GitHub Actions
**Prioridade:** 🔴 Crítica  
**Esforço:** 4 horas  
**Arquivos afetados:** `.github/workflows/`, `package.json`

**PROMPT:**
```
Configure um pipeline CI/CD completo para o projeto Fit-Tracker usando GitHub Actions:

1. Crie workflow de CI que execute em PRs e pushes para main:
   - Instalar dependências (npm ci)
   - Executar linter (npm run lint)
   - Executar testes (npm test) quando existirem
   - Build do projeto (npm run build)
   - Verificar se build foi bem-sucedido

2. Crie workflow de Deploy para Cloudflare Pages:
   - Trigger apenas em push para branch main
   - Build da aplicação
   - Deploy automático para Cloudflare Pages
   - Usar secrets do GitHub para credenciais

3. Adicione badges de status no README.md

4. Configure cache de node_modules para acelerar builds

Crie os arquivos necessários em .github/workflows/ e atualize o README.
```

---

### 1.2 Implementar Error Boundaries
**Prioridade:** 🔴 Crítica  
**Esforço:** 3 horas  
**Arquivos afetados:** `components/ErrorBoundary.tsx`, `App.tsx`

**PROMPT:**
```
Implemente Error Boundaries completos no projeto Fit-Tracker:

1. Crie componente ErrorBoundary em components/ErrorBoundary.tsx com:
   - Captura de erros de renderização
   - UI de fallback amigável com botão de reload
   - Log de erros no console (preparado para Sentry)
   - Suporte a dark mode

2. Envolva toda a aplicação no App.tsx com ErrorBoundary

3. Adicione ErrorBoundaries específicos em:
   - Rotas de páginas individuais
   - Componentes de gráficos (Charts)
   - Componentes de formulários complexos

4. Crie componente de fallback reutilizável com design consistente

Garanta que erros não quebrem toda a aplicação.
```

---

### 1.3 Adicionar Logging Estruturado
**Prioridade:** 🔴 Crítica  
**Esforço:** 3 horas  
**Arquivos afetados:** `lib/logger.ts`, todos os arquivos com console.log

**PROMPT:**
```
Substitua todos os console.log por sistema de logging estruturado:

1. Crie lib/logger.ts com:
   - Níveis de log (debug, info, warn, error)
   - Formatação estruturada (timestamp, level, message, context)
   - Suporte a diferentes ambientes (dev mostra tudo, prod apenas warn/error)
   - Preparado para integração com Sentry

2. Substitua todos os console.log/error/warn no projeto por:
   - logger.info() para informações
   - logger.error() para erros
   - logger.warn() para avisos
   - logger.debug() para debug

3. Adicione contexto relevante aos logs (userId, action, etc)

4. Remova console.log de produção mantendo apenas em desenvolvimento
```

---

### 1.4 Implementar Validação com Zod
**Prioridade:** 🔴 Crítica  
**Esforço:** 6 horas  
**Arquivos afetados:** `lib/schemas.ts`, formulários em `pages/`

**PROMPT:**
```
Implemente validação de dados com Zod no projeto:

1. Instale zod: npm install zod

2. Crie lib/schemas.ts com schemas para:
   - WorkoutSet (reps, weight, completed, notes)
   - WorkoutLog (exerciseId, sets, sessionId)
   - UserProfile (name, email, height, weight)
   - Goal (type, targetValue, deadline)

3. Integre validação nos formulários:
   - LogWorkout.tsx (validar séries antes de salvar)
   - Profile.tsx (validar dados de perfil)
   - Goals.tsx (validar criação de metas)
   - Login.tsx (validar email e senha)

4. Adicione mensagens de erro amigáveis em português

5. Valide dados antes de enviar ao banco de dados

Garanta type safety e dados consistentes.
```

---

### 1.5 Configurar Variáveis de Ambiente Seguras
**Prioridade:** 🔴 Crítica  
**Esforço:** 2 horas  
**Arquivos afetados:** `vite.config.ts`, `.env.example`, documentação

**PROMPT:**
```
Corrija exposição de secrets no frontend:

1. Revise todas as variáveis VITE_ em .env.example:
   - Identifique quais são realmente públicas (URLs públicas)
   - Identifique quais são sensíveis (secrets, tokens)

2. Para variáveis sensíveis:
   - Remova prefixo VITE_
   - Documente que devem ser usadas apenas em backend/edge functions
   - Adicione comentários explicativos no .env.example

3. Atualize databaseService.ts para:
   - Usar apenas variáveis públicas no cliente
   - Documentar que operações sensíveis devem ir para backend

4. Crie documentação em docs/SECURITY.md explicando:
   - Quais variáveis são públicas vs privadas
   - Como configurar corretamente
   - Riscos de exposição

Garanta que nenhum secret seja exposto no bundle do cliente.
```

---

## ⚡ FASE 2: OTIMIZAÇÕES DE PERFORMANCE (Semana 3-4)

### 2.1 Otimizar Re-renderizações com Memoização
**Prioridade:** 🟡 Alta  
**Esforço:** 6 horas  
**Arquivos afetados:** `pages/LogWorkout.tsx`, `pages/ExerciseLibrary.tsx`, `pages/Reports.tsx`

**PROMPT:**
```
Otimize performance eliminando re-renderizações desnecessárias:

1. Em LogWorkout.tsx:
   - Isole o RestTimer em componente separado usando React.memo
   - Use useCallback para handlers passados a componentes filhos
   - Use useMemo para cálculos de volume total

2. Em ExerciseLibrary.tsx:
   - Use useMemo para filteredExercises
   - Use useCallback para handleSearch e handleFilter
   - Memoize componentes de card de exercício

3. Em Reports.tsx:
   - Use useMemo para dados processados de gráficos
   - Memoize componentes de gráfico pesados

4. Adicione React DevTools Profiler para medir melhorias

Garanta que componentes só re-renderizem quando necessário.
```

---

### 2.2 Implementar Virtualização de Listas
**Prioridade:** 🟡 Alta  
**Esforço:** 4 horas  
**Arquivos afetados:** `pages/ExerciseLibrary.tsx`, `pages/WorkoutHistory.tsx`

**PROMPT:**
```
Implemente virtualização de listas longas para melhor performance:

1. Instale react-window: npm install react-window @types/react-window

2. Em ExerciseLibrary.tsx:
   - Substitua map() por FixedSizeList do react-window
   - Configure altura de item (120px) e altura da lista
   - Mantenha funcionalidade de filtros
   - Garanta responsividade

3. Em WorkoutHistory.tsx:
   - Implemente VariableSizeList para itens de altura variável
   - Configure estimativa de altura por item

4. Adicione loading skeleton durante scroll

5. Teste com 1000+ itens para validar performance

Garanta scroll suave mesmo com milhares de itens.
```

---

### 2.3 Implementar TanStack Query para Caching
**Prioridade:** 🟡 Alta  
**Esforço:** 8 horas  
**Arquivos afetados:** `App.tsx`, `hooks/`, `pages/`

**PROMPT:**
```
Implemente TanStack Query (React Query) para gerenciamento de cache e estado servidor:

1. Instale dependências: npm install @tanstack/react-query @tanstack/react-query-devtools

2. Configure QueryClient em App.tsx com:
   - staleTime: 5 minutos
   - cacheTime: 10 minutos
   - retry: 3 tentativas
   - refetchOnWindowFocus: false

3. Crie custom hooks em hooks/:
   - useExercises() para biblioteca de exercícios
   - useWorkoutHistory() para histórico
   - useGoals() para metas
   - useUserProfile() para perfil

4. Implemente mutations para:
   - addWorkout()
   - updateGoal()
   - updateProfile()

5. Configure invalidação automática de cache após mutations

6. Adicione React Query Devtools em desenvolvimento

Elimine fetches duplicados e melhore UX com cache inteligente.
```

---

### 2.4 Implementar Zustand para Estado Global
**Prioridade:** 🟡 Alta  
**Esforço:** 6 horas  
**Arquivos afetados:** `store/`, `context/`, componentes

**PROMPT:**
```
Substitua Context API por Zustand para estado global performático:

1. Instale zustand: npm install zustand

2. Crie store/appStore.ts com slices para:
   - user (dados do usuário logado)
   - workoutSession (treino em andamento)
   - preferences (tema, configurações)

3. Adicione persistência com middleware:
   - Persist workoutSession no localStorage
   - Persist preferences no localStorage

4. Migre AuthContext para Zustand:
   - Manter mesma API pública
   - Melhorar performance

5. Crie hooks seletores para evitar re-renders:
   - useUser()
   - useWorkoutSession()
   - usePreferences()

6. Remova Context API desnecessários

Melhore performance e simplifique gerenciamento de estado.
```

---

## 🧪 FASE 3: TESTES (Semana 5-6)

### 3.1 Configurar Vitest e Testes Unitários
**Prioridade:** 🟡 Alta  
**Esforço:** 8 horas  
**Arquivos afetados:** `vitest.config.ts`, `tests/`, componentes

**PROMPT:**
```
Configure ambiente de testes e implemente testes unitários:

1. Instale dependências:
   npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

2. Crie vitest.config.ts com:
   - Ambiente jsdom
   - Coverage com v8
   - Setup files
   - Globals habilitado

3. Crie tests/setup.ts com configuração do Testing Library

4. Implemente testes para:
   - Componentes UI (Button, Card, Input)
   - Custom hooks (useWorkoutLogger, useGoalFilters)
   - Utilitários (cálculos, formatações)

5. Configure script no package.json:
   - "test": "vitest"
   - "test:ui": "vitest --ui"
   - "test:coverage": "vitest --coverage"

6. Adicione coverage mínimo de 60%

Meta: 60% de cobertura de código.
```

---

### 3.2 Implementar Testes E2E com Playwright
**Prioridade:** 🟢 Média  
**Esforço:** 8 horas  
**Arquivos afetados:** `playwright.config.ts`, `tests/e2e/`

**PROMPT:**
```
Configure Playwright e implemente testes E2E para fluxos críticos:

1. Instale Playwright: npm install -D @playwright/test

2. Configure playwright.config.ts com:
   - Múltiplos navegadores (chromium, firefox, webkit)
   - Base URL local e staging
   - Screenshots em falhas
   - Vídeos de testes

3. Implemente testes E2E para:
   - Fluxo de login/cadastro
   - Fluxo completo de registro de treino
   - Criação de meta
   - Visualização de relatórios
   - Edição de perfil

4. Configure CI para rodar testes E2E

5. Adicione script: "test:e2e": "playwright test"

Garanta que fluxos críticos funcionem end-to-end.
```

---

## 🔒 FASE 4: SEGURANÇA (Semana 7)

### 4.1 Implementar Sanitização de Inputs
**Prioridade:** 🔴 Crítica  
**Esforço:** 4 horas  
**Arquivos afetados:** `lib/sanitize.ts`, formulários

**PROMPT:**
```
Implemente sanitização de inputs para prevenir XSS e injection:

1. Instale DOMPurify: npm install dompurify @types/dompurify

2. Crie lib/sanitize.ts com funções:
   - sanitizeText() para textos simples
   - sanitizeHTML() para conteúdo HTML (notas)
   - sanitizeNumber() para valores numéricos

3. Aplique sanitização em:
   - Notas de treino (LogWorkout.tsx)
   - Descrições de metas (Goals.tsx)
   - Dados de perfil (Profile.tsx)
   - Qualquer input de usuário antes de salvar no DB

4. Adicione validação no backend (databaseService.ts)

5. Configure CSP headers no index.html

Previna ataques XSS e SQL injection.
```

---

### 4.2 Adicionar Rate Limiting
**Prioridade:** 🟡 Alta  
**Esforço:** 3 horas  
**Arquivos afetados:** `lib/rateLimiter.ts`, API calls

**PROMPT:**
```
Implemente rate limiting no frontend para prevenir spam:

1. Crie lib/rateLimiter.ts com:
   - Throttle para buscas (max 1 req/segundo)
   - Debounce para autocomplete (300ms)
   - Limite de requisições por minuto

2. Aplique throttling em:
   - Busca de exercícios
   - Filtros de relatórios
   - Salvamento de dados

3. Adicione feedback visual quando rate limit é atingido

4. Configure rate limiting no Cloudflare (documentar em docs/)

Previna sobrecarga de servidor e abuse.
```

---

## 📱 FASE 5: PWA E OFFLINE (Semana 8)

### 5.1 Implementar PWA Completo
**Prioridade:** 🟢 Média  
**Esforço:** 8 horas  
**Arquivos afetados:** `manifest.json`, `service-worker.ts`, `vite.config.ts`

**PROMPT:**
```
Transforme a aplicação em PWA completo com suporte offline:

1. Instale vite-plugin-pwa: npm install -D vite-plugin-pwa

2. Crie public/manifest.json com:
   - Nome, descrição, ícones
   - Theme color (#16a34a)
   - Display standalone
   - Ícones em múltiplos tamanhos (192, 512)

3. Configure service worker com Workbox:
   - Precache de assets estáticos
   - Cache-first para imagens
   - Network-first para API
   - Offline fallback

4. Adicione suporte a instalação:
   - Botão "Instalar App" quando disponível
   - Prompt de instalação customizado

5. Implemente persistência offline:
   - Salvar treinos em IndexedDB quando offline
   - Sincronizar quando voltar online

6. Teste em Chrome, Safari, Firefox

Permita uso completo offline da aplicação.
```

---

## 📊 FASE 6: MONITORAMENTO (Semana 9)

### 6.1 Integrar Sentry para Error Tracking
**Prioridade:** 🔴 Crítica  
**Esforço:** 3 horas  
**Arquivos afetados:** `App.tsx`, `vite.config.ts`

**PROMPT:**
```
Integre Sentry para rastreamento de erros em produção:

1. Crie conta no Sentry.io (plano gratuito)

2. Instale SDK: npm install @sentry/react

3. Configure Sentry em App.tsx:
   - DSN do projeto
   - Environment (dev/staging/prod)
   - Release version
   - User context (userId, email)
   - Breadcrumbs habilitados

4. Configure source maps para produção:
   - Adicionar plugin Sentry no vite.config.ts
   - Upload automático de source maps

5. Integre com ErrorBoundary existente

6. Configure alertas para erros críticos

7. Adicione tags customizadas (page, action)

Capture e monitore todos os erros em produção.
```

---

### 6.2 Adicionar Analytics
**Prioridade:** 🟢 Média  
**Esforço:** 4 horas  
**Arquivos afetados:** `lib/analytics.ts`, `App.tsx`

**PROMPT:**
```
Implemente analytics para rastrear uso e comportamento:

1. Escolha solução (Plausible, PostHog ou Google Analytics)

2. Crie lib/analytics.ts com funções:
   - trackPageView()
   - trackEvent()
   - trackUser()

3. Implemente tracking de:
   - Pageviews automáticos
   - Eventos customizados (workout_completed, goal_created)
   - User properties (plan, signup_date)

4. Adicione tracking em ações importantes:
   - Conclusão de treino
   - Criação de meta
   - Upgrade de plano

5. Configure dashboard de métricas

6. Garanta conformidade com LGPD (cookie consent)

Meça sucesso e comportamento dos usuários.
```

---

## 📚 FASE 7: DOCUMENTAÇÃO (Semana 10)

### 7.1 Criar Documentação Completa
**Prioridade:** 🟢 Média  
**Esforço:** 6 horas  
**Arquivos afetados:** `README.md`, `docs/`

**PROMPT:**
```
Crie documentação técnica completa do projeto:

1. Atualize README.md com:
   - Descrição do projeto
   - Screenshots
   - Quick start guide
   - Stack tecnológico
   - Badges de CI/CD, coverage, etc

2. Crie docs/ com:
   - ARCHITECTURE.md (diagrama e explicação)
   - CONTRIBUTING.md (guia para contribuidores)
   - DEPLOYMENT.md (processo de deploy)
   - SECURITY.md (práticas de segurança)
   - API.md (documentação de endpoints)

3. Adicione JSDoc em funções principais:
   - Descrição
   - Parâmetros
   - Retorno
   - Exemplos

4. Crie CHANGELOG.md para versões

5. Configure Storybook para componentes UI (opcional)

Facilite onboarding e manutenção do projeto.
```

---

## 🎨 FASE 8: UX E ACESSIBILIDADE (Semana 11-12)

### 8.1 Implementar Skeleton Screens
**Prioridade:** 🟢 Média  
**Esforço:** 4 horas  
**Arquivos afetados:** `components/ui/Skeleton.tsx`, páginas

**PROMPT:**
```
Substitua loaders genéricos por skeleton screens:

1. Crie components/ui/Skeleton.tsx com:
   - SkeletonCard
   - SkeletonList
   - SkeletonText
   - SkeletonChart

2. Implemente skeletons específicos para:
   - Dashboard (cards de métricas)
   - ExerciseLibrary (grid de cards)
   - WorkoutHistory (lista)
   - Reports (gráficos)

3. Use Suspense boundaries para mostrar skeletons

4. Adicione animação de shimmer

5. Garanta consistência com design system

Melhore percepção de velocidade da aplicação.
```

---

### 8.2 Garantir Acessibilidade WCAG 2.1 AA
**Prioridade:** 🟡 Alta  
**Esforço:** 8 horas  
**Arquivos afetados:** Todos os componentes

**PROMPT:**
```
Implemente acessibilidade completa seguindo WCAG 2.1 AA:

1. Adicione atributos ARIA em todos os elementos interativos:
   - aria-label para botões sem texto
   - aria-describedby para campos de formulário
   - aria-live para notificações
   - role apropriado para elementos customizados

2. Garanta navegação por teclado:
   - Tab order lógico
   - Focus visible em todos os elementos
   - Atalhos de teclado para ações principais
   - Trap focus em modais

3. Corrija contraste de cores:
   - Mínimo 4.5:1 para texto normal
   - Mínimo 3:1 para texto grande
   - Teste com ferramentas (axe DevTools)

4. Adicione suporte a leitores de tela:
   - Textos alternativos em imagens
   - Labels em campos de formulário
   - Anúncios de mudanças de estado

5. Teste com:
   - NVDA (Windows)
   - VoiceOver (Mac)
   - Lighthouse Accessibility

Torne a aplicação acessível para todos os usuários.
```

---

### 8.3 Adicionar Micro-animações
**Prioridade:** ⚪ Baixa  
**Esforço:** 6 horas  
**Arquivos afetados:** Componentes interativos

**PROMPT:**
```
Adicione micro-animações para melhorar engajamento:

1. Instale Framer Motion: npm install framer-motion

2. Adicione animações em:
   - Conclusão de série (checkmark animado)
   - Criação de meta (confetti)
   - Botões (hover, tap)
   - Transições de página
   - Modais (fade + scale)

3. Configure AnimatePresence para:
   - Listas (stagger animation)
   - Remoção de itens
   - Troca de rotas

4. Mantenha animações sutis (200-300ms)

5. Adicione preferência de movimento reduzido:
   - Respeitar prefers-reduced-motion
   - Opção em Settings

Torne a experiência mais agradável e responsiva.
```

---

## 📦 RESUMO DE COMANDOS RÁPIDOS

### Instalar todas as dependências necessárias:
```bash
# Performance
npm install zustand @tanstack/react-query @tanstack/react-query-devtools react-window @types/react-window

# Validação e Segurança
npm install zod dompurify @types/dompurify

# Testes
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test

# Monitoramento
npm install @sentry/react

# PWA
npm install -D vite-plugin-pwa

# Animações
npm install framer-motion
```

---

## 🎯 ORDEM RECOMENDADA DE EXECUÇÃO

**Semana 1-2 (Crítico):**
1. ✅ Configurar CI/CD (1.1)
2. ✅ Implementar Error Boundaries (1.2)
3. ✅ Adicionar Logging (1.3)
4. ✅ Implementar Validação Zod (1.4)
5. ✅ Corrigir Variáveis de Ambiente (1.5)

**Semana 3-4 (Performance):**
6. ✅ Otimizar Re-renderizações (2.1)
7. ✅ Virtualização de Listas (2.2)
8. ✅ TanStack Query (2.3)
9. ✅ Zustand (2.4)

**Semana 5-6 (Qualidade):**
10. ✅ Testes Unitários (3.1)
11. ✅ Testes E2E (3.2)

**Semana 7 (Segurança):**
12. ✅ Sanitização (4.1)
13. ✅ Rate Limiting (4.2)

**Semana 8 (Mobile):**
14. ✅ PWA (5.1)

**Semana 9 (Observabilidade):**
15. ✅ Sentry (6.1)
16. ✅ Analytics (6.2)

**Semana 10 (Docs):**
17. ✅ Documentação (7.1)

**Semana 11-12 (UX):**
18. ✅ Skeleton Screens (8.1)
19. ✅ Acessibilidade (8.2)
20. ✅ Micro-animações (8.3)

---

## 💡 DICAS IMPORTANTES

1. **Execute uma tarefa por vez** - Não tente fazer tudo de uma vez
2. **Teste após cada implementação** - Garanta que nada quebrou
3. **Commit frequentemente** - Facilita rollback se necessário
4. **Documente mudanças** - Atualize CHANGELOG.md
5. **Peça revisão** - Solicite code review quando possível

---

**Criado em:** 05 de Janeiro de 2026  
**Versão:** 1.0.0
