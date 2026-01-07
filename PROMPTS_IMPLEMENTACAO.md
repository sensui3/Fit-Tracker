# 🤖 PROMPTS PARA IMPLEMENTAÇÃO - FIT-TRACKER

**Domínio de Produção:** https://fit-tracker-btx.pages.dev  
**Hospedagem:** Cloudflare Pages

Este documento contém prompts prontos para uso, organizados por prioridade e fase de implementação. Copie e cole cada prompt conforme necessário.

---

## 🔴 FASE 1: FUNDAÇÃO (CRÍTICO - SEMANAS 1-4)

### 1.1 Configurar CI/CD com GitHub Actions

```
Preciso configurar um pipeline completo de CI/CD para o projeto FIT-TRACKER usando GitHub Actions. O projeto é uma aplicação React + TypeScript com Vite, usando Neon PostgreSQL e deploy em Cloudflare Pages.

Requisitos:
1. Pipeline deve rodar em push para branches main e develop
2. Pipeline deve rodar em pull requests
3. Etapas necessárias:
   - Lint (ESLint)
   - Type check (TypeScript)
   - Testes unitários (Vitest)
   - Testes de integração
   - Build da aplicação
   - Upload de coverage para Codecov
   - Deploy automático para staging (branch develop)
   - Deploy automático para produção (branch main)

4. Configurar ambientes separados:
   - staging: https://staging.fit-tracker-btx.pages.dev
   - production: https://fit-tracker-btx.pages.dev

5. Adicionar proteções:
   - Não permitir merge sem testes passando
   - Não permitir deploy sem build bem-sucedido
   - Rollback automático em caso de falha

Stack atual:
- React 19.2.3
- TypeScript 5.8.2
- Vite 6.2.0
- Vitest (a ser instalado)
- Cloudflare Pages (projeto: fit-tracker-btx)

Domínios:
- Produção: https://fit-tracker-btx.pages.dev
- Staging: https://staging.fit-tracker-btx.pages.dev (criar branch preview)

Crie:
1. Arquivo .github/workflows/ci-cd.yml completo
2. Scripts necessários no package.json
3. Documentação de como configurar secrets no GitHub
4. Configuração de branch previews na Cloudflare
5. Checklist de validação do pipeline
```

---

### 1.2 Implementar Testes Unitários (70% Coverage)

```
Preciso implementar uma suite completa de testes unitários para o projeto FIT-TRACKER com meta de 70% de coverage. O projeto usa React 19 + TypeScript + Zustand.

Contexto do projeto:
- Stores Zustand: useWorkoutStore, useAuthStore, useTimerStore, useUIStore, useSettingsStore
- Componentes principais: LogWorkout, Dashboard, ExerciseLibrary, WorkoutHistory
- Serviços: databaseService, storageService
- Utilitários: lib/security.ts (sanitização, validação Zod), lib/logrocket.ts

Requisitos:
1. Configurar Vitest + Testing Library
2. Criar testes para TODOS os Zustand stores
3. Criar testes para componentes críticos (LogWorkout, Dashboard)
4. Criar testes para serviços (databaseService)
5. Criar testes para utilitários de segurança (sanitização, validação)
6. Configurar coverage reports
7. Adicionar scripts no package.json

Prioridade de testes:
1. CRÍTICO: useWorkoutStore (addSet, updateSet, resetLog)
2. CRÍTICO: lib/security.ts (sanitizeInput, validação Zod)
3. ALTO: databaseService (query, findOne)
4. ALTO: useAuthStore (setUser, logout)
5. MÉDIO: Componentes UI

Para cada teste, inclua:
- Testes de casos de sucesso
- Testes de casos de erro
- Testes de edge cases
- Mocks apropriados para dependências externas

Crie:
1. Configuração completa do Vitest (vitest.config.ts)
2. Setup de testes (test-setup.ts)
3. Pelo menos 15 arquivos de teste cobrindo as áreas críticas
4. Script para rodar testes com coverage
5. Documentação de como escrever novos testes
```

---

### 1.3 Mover Credenciais para Server-Side (Cloudflare Workers)

```
URGENTE - SEGURANÇA CRÍTICA: Preciso mover todas as credenciais sensíveis do cliente para server-side usando Cloudflare Workers/Functions.

Problema atual:
- Variáveis VITE_DATABASE_URL, VITE_BETTER_AUTH_SECRET, VITE_R2_ACCESS_KEY_ID estão expostas no bundle do cliente
- Qualquer usuário pode ver as credenciais via DevTools
- Risco crítico de segurança e violação LGPD/GDPR

Solução necessária:
1. Criar Cloudflare Functions para proxy de todas as chamadas sensíveis
2. Mover credenciais para variáveis de ambiente do Cloudflare (server-side only)
3. Atualizar frontend para chamar as Functions ao invés de acessar diretamente

Arquitetura desejada:
```
Frontend → /api/auth/* → Cloudflare Function → Neon Auth
Frontend → /api/db/* → Cloudflare Function → Neon Database
Frontend → /api/storage/* → Cloudflare Function → Cloudflare R2
```

Requisitos:
1. Criar functions/api/auth/[[path]].ts para proxy de autenticação
2. Criar functions/api/db/[[path]].ts para proxy de database queries
3. Criar functions/api/storage/[[path]].ts para upload de imagens
4. Implementar validação e sanitização em todas as Functions
5. Adicionar rate limiting nas Functions
6. Atualizar serviços do frontend (databaseService.ts, storageService.ts)
7. Remover TODAS as variáveis VITE_* sensíveis do .env.example
8. Documentar como configurar variáveis no Cloudflare Pages

Stack:
- Cloudflare Pages Functions (runtime Workers)
- Neon PostgreSQL Serverless
- Better Auth / Neon Auth
- Cloudflare R2

Crie:
1. Estrutura completa de Functions
2. Código de proxy com validação
3. Atualização dos serviços frontend
4. Novo .env.example seguro
5. Documentação de migração
6. Checklist de segurança
```

---

### 1.4 Implementar Paginação em Todas as Queries

```
Preciso implementar paginação cursor-based em todas as queries do banco de dados para evitar timeout e crash com grandes volumes de dados.

Problema atual:
- Queries retornam TODOS os registros de uma vez (ex: SELECT * FROM workout_sessions)
- Com 1000+ treinos, a aplicação trava ou dá timeout
- Consumo excessivo de memória e dados móveis

Queries que precisam de paginação:
1. Histórico de treinos (workout_sessions)
2. Biblioteca de exercícios (exercises)
3. Histórico de metas (user_goals)
4. Métricas corporais (user_metrics)
5. Notificações (notifications)

Requisitos:
1. Implementar cursor-based pagination (não offset/limit)
2. Criar interface PaginatedResponse<T> genérica
3. Atualizar databaseService com métodos paginados
4. Integrar TanStack Query (React Query) para infinite scroll
5. Atualizar componentes para usar paginação
6. Adicionar índices de banco necessários

Exemplo de uso desejado:
```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteWorkouts(userId);
```

Componentes a atualizar:
- WorkoutHistory.tsx
- ExerciseLibrary.tsx (já tem virtualização, adicionar paginação)
- Goals.tsx
- Notifications.tsx

Crie:
1. Interface PaginatedResponse e tipos relacionados
2. Métodos paginados no databaseService
3. Custom hooks com TanStack Query (useInfiniteWorkouts, useInfiniteExercises, etc)
4. Atualização dos componentes
5. Índices SQL necessários
6. Testes para paginação
7. Documentação de uso
```

---

### 1.5 Otimizar Performance Crítica

```
Preciso otimizar a performance do FIT-TRACKER que está com problemas críticos de re-renderização e lentidão.

Problemas identificados:
1. Timer causa re-render de página inteira a cada segundo em LogWorkout.tsx
2. ExerciseLibrary e WorkoutHistory renderizam todos os itens sem virtualização
3. Filtros e computações pesadas sem memoização
4. Bundle size muito grande (Recharts, jsPDF sem code splitting)

Requisitos de otimização:

1. TIMER (CRÍTICO):
   - Isolar timer em componente separado
   - Usar Zustand store (useTimerStore já existe)
   - Evitar re-render da página LogWorkout
   - Manter timer visível globalmente no Layout

2. VIRTUALIZAÇÃO (CRÍTICO):
   - Implementar react-window em ExerciseLibrary
   - Implementar react-window em WorkoutHistory
   - Usar AutoSizer para responsividade
   - Manter performance com 1000+ itens

3. MEMOIZAÇÃO:
   - Memoizar filtros de exercícios
   - Memoizar cálculos de volume total
   - Memoizar componentes pesados (charts)
   - Usar React.memo em componentes de lista

4. CODE SPLITTING:
   - Dynamic import para Recharts
   - Dynamic import para jsPDF
   - Lazy load de páginas (já implementado, verificar)
   - Analisar bundle com vite-bundle-visualizer

Componentes a otimizar:
- pages/LogWorkout.tsx (timer)
- pages/ExerciseLibrary.tsx (virtualização)
- pages/WorkoutHistory.tsx (virtualização)
- pages/Reports.tsx (charts lazy)
- components/dashboard/WorkoutVolumeChart.tsx

Dependências necessárias:
- react-window (já instalado)
- react-virtualized-auto-sizer (já instalado)
- vite-bundle-visualizer (instalar)

Métricas de sucesso:
- FPS estável em 60 durante timer
- Scroll suave com 1000+ exercícios
- Bundle size < 500KB gzipped
- Lighthouse Performance > 90

Crie:
1. Componente RestTimer isolado
2. ExerciseLibrary com virtualização
3. WorkoutHistory com virtualização
4. Hooks memoizados (useFilteredExercises, useWorkoutStats)
5. Configuração de code splitting
6. Análise de bundle
7. Testes de performance
```

---

## 🟡 FASE 2: SEGURANÇA & QUALIDADE (SEMANAS 5-8)

### 2.1 Implementar Sanitização Completa de Inputs

```
Preciso implementar sanitização robusta em TODOS os inputs do usuário para prevenir XSS e SQL Injection.

Contexto:
- lib/security.ts já tem função sanitize() usando DOMPurify
- Schemas Zod já implementados (loginSchema, workoutSchema, etc)
- Mas não estão sendo usados consistentemente em todos os formulários

Requisitos:
1. Auditar TODOS os formulários e inputs da aplicação
2. Aplicar sanitização em todos os campos de texto
3. Aplicar validação Zod antes de enviar ao backend
4. Adicionar sanitização server-side nas Cloudflare Functions
5. Implementar Content Security Policy (CSP) restritivo
6. Adicionar testes de segurança

Formulários a proteger:
- Login/Registro (pages/Login.tsx)
- Perfil (pages/Profile.tsx)
- Criação de plano (pages/CreatePlan.tsx)
- Log de treino (pages/LogWorkout.tsx) - CRÍTICO (notas das séries)
- Metas (pages/Goals.tsx)
- Configurações (pages/Settings.tsx)

Áreas críticas:
- Notas de séries (campo livre de texto)
- Nome de exercícios customizados
- Descrições de planos
- Comentários em treinos

Crie:
1. Hook useValidatedForm<T>(schema: ZodSchema<T>) para formulários
2. Componente ValidatedInput que sanitiza automaticamente
3. Atualização de todos os formulários
4. Sanitização server-side nas Functions
5. Configuração CSP no vite.config.ts
6. Testes de segurança (tentativas de XSS)
7. Documentação de boas práticas
```

---

### 2.2 Adicionar Rate Limiting

```
Preciso implementar rate limiting para proteger contra ataques DDoS e spam.

Requisitos:
1. Rate limiting server-side nas Cloudflare Functions
2. Rate limiting client-side para prevenir spam de cliques
3. Diferentes limites para diferentes endpoints

Limites sugeridos:
- Login: 5 tentativas por 15 minutos
- Registro: 3 tentativas por hora
- API queries: 100 requests por minuto
- Upload de imagens: 10 por hora
- Criação de treino: 50 por dia

Implementação:
1. Usar Cloudflare Rate Limiting Rules (server-side)
2. Criar utilitário client-side (lib/rateLimiter.ts)
3. Integrar com formulários críticos
4. Adicionar feedback visual ao usuário
5. Logging de tentativas bloqueadas

Stack:
- Cloudflare Workers KV para armazenar contadores
- Map local para rate limiting client-side

Crie:
1. Configuração Cloudflare Rate Limiting
2. Utilitário client-side de rate limiting
3. Integração em formulários
4. Componente de feedback "Too Many Requests"
5. Testes de rate limiting
6. Documentação
```

---

### 2.3 Implementar Testes E2E com Playwright

```
Preciso implementar testes End-to-End completos usando Playwright para garantir que os fluxos críticos funcionem corretamente.

Fluxos críticos a testar:
1. Autenticação (login, logout, registro)
2. Registro de treino completo
3. Criação de plano de treino
4. Criação e acompanhamento de meta
5. Visualização de relatórios
6. Edição de perfil
7. Navegação entre páginas

Requisitos:
1. Configurar Playwright
2. Criar fixtures para dados de teste
3. Implementar Page Object Model
4. Testes em múltiplos navegadores (Chrome, Firefox, Safari)
5. Testes mobile viewport
6. Screenshots em caso de falha
7. Vídeos de execução
8. Integração com CI/CD

Cenários de teste:
- Usuário novo se registra e faz primeiro treino
- Usuário existente loga e visualiza histórico
- Criação de plano com múltiplos exercícios
- Completar série e verificar timer de descanso
- Filtrar exercícios por grupo muscular
- Gerar relatório PDF
- Modo escuro/claro

Crie:
1. Configuração Playwright (playwright.config.ts)
2. Fixtures e helpers de teste
3. Page Objects para páginas principais
4. Pelo menos 20 testes E2E
5. Scripts no package.json
6. Integração com GitHub Actions
7. Documentação de como escrever testes E2E
```

---

### 2.4 Melhorar Acessibilidade (WCAG 2.1 AA)

```
Preciso tornar o FIT-TRACKER totalmente acessível conforme WCAG 2.1 nível AA.

Problemas identificados:
- Falta de atributos ARIA
- Navegação por teclado incompleta
- Contraste insuficiente em alguns elementos
- Modais sem trap focus
- Sem skip links
- Imagens sem alt text apropriado

Requisitos:
1. Adicionar atributos ARIA em todos os elementos interativos
2. Implementar navegação completa por teclado
3. Garantir contraste mínimo 4.5:1
4. Implementar trap focus em modais
5. Adicionar skip links
6. Melhorar labels de formulários
7. Anúncios para screen readers

Componentes a melhorar:
- Modal (trap focus)
- Sidebar (navegação por teclado)
- Formulários (labels, aria-describedby)
- Botões (aria-label descritivo)
- Cards de exercício (aria-label)
- Timer (anúncio de tempo restante)

Ferramentas:
- axe DevTools para auditoria
- NVDA/JAWS para testes com screen reader
- Lighthouse Accessibility

Crie:
1. Hook useFocusTrap para modais
2. Hook useKeyboardNavigation
3. Componente SkipLink
4. Atualização de todos os componentes UI
5. Documentação de acessibilidade
6. Testes automatizados de a11y
7. Checklist WCAG 2.1 AA
```

---

## 🟢 FASE 3: EXPERIÊNCIA DO USUÁRIO (SEMANAS 9-12)

### 3.1 Implementar PWA Completo

```
Preciso transformar o FIT-TRACKER em um Progressive Web App completo, instalável e funcional offline.

Requisitos:
1. Criar manifest.json com todos os metadados
2. Implementar service worker com Workbox
3. Estratégias de cache:
   - Cache First: Fontes, imagens, assets estáticos
   - Network First: API calls
   - Stale While Revalidate: Dados de exercícios
4. Suporte offline básico
5. Ícones em todos os tamanhos
6. Screenshots para app stores
7. Shortcuts para ações rápidas

Funcionalidades offline:
- Visualizar exercícios (cache)
- Visualizar histórico recente (cache)
- Registrar treino (sync quando online)
- Timer de descanso

Ícones necessários:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- Maskable icons
- Favicon

Crie:
1. manifest.json completo
2. Configuração Workbox (vite-plugin-pwa)
3. Service worker customizado
4. Ícones em todos os tamanhos
5. Screenshots
6. Componente de "Instalar App"
7. Sincronização background
8. Testes PWA (Lighthouse)
9. Documentação de instalação
```

---

### 3.2 Adicionar Skeleton Screens

```
Preciso adicionar skeleton screens em todas as páginas para melhorar a percepção de performance durante carregamentos.

Páginas que precisam de skeleton:
1. Dashboard (cards de estatísticas, gráfico)
2. ExerciseLibrary (grid de cards)
3. WorkoutHistory (lista de treinos)
4. Reports (gráficos e tabelas)
5. Goals (lista de metas)
6. Profile (formulário e avatar)

Requisitos:
1. Criar componentes Skeleton reutilizáveis
2. Skeletons devem ter mesmas dimensões dos componentes reais
3. Animação de pulse suave
4. Suporte a dark mode
5. Usar durante fetch de dados

Componentes Skeleton a criar:
- SkeletonCard (para cards genéricos)
- SkeletonExerciseCard (específico para exercícios)
- SkeletonChart (para gráficos)
- SkeletonTable (para tabelas)
- SkeletonAvatar (para imagens de perfil)
- SkeletonText (para linhas de texto)

Crie:
1. Componentes Skeleton base
2. Skeleton específicos para cada página
3. Hook useSkeletonDelay (evitar flash)
4. Integração com Suspense
5. Storybook para visualizar skeletons
6. Documentação de uso
```

---

### 3.3 Implementar Micro-animações

```
Preciso adicionar micro-animações para tornar a experiência mais engajadora e dar feedback visual de ações.

Animações necessárias:
1. Completar série (confetti, checkmark animado)
2. Alcançar meta (celebração)
3. Adicionar exercício ao plano (slide in)
4. Deletar item (slide out + fade)
5. Hover em cards (lift + shadow)
6. Transições de página (fade)
7. Loading states (spinner, pulse)
8. Notificações (slide in from top)

Biblioteca recomendada: Framer Motion

Requisitos:
1. Animações sutis (não exageradas)
2. Performance (60fps)
3. Respeitar prefers-reduced-motion
4. Canceláveis
5. Configuráveis (duração, easing)

Componentes a animar:
- WorkoutSetItem (completar série)
- ExerciseCard (hover, click)
- GoalCard (progresso, conclusão)
- Toast notifications
- Modal (entrada/saída)
- Sidebar (abertura/fechamento)

Crie:
1. Configuração Framer Motion
2. Variantes de animação reutilizáveis
3. Hook useReducedMotion
4. Componentes animados
5. Storybook com exemplos
6. Documentação de animações
```

---

### 3.4 Melhorar Sistema de Monitoramento

```
Preciso expandir o sistema de monitoramento com LogRocket para capturar mais eventos e métricas.

Status atual:
- LogRocket instalado ✅
- Identificação de usuários ✅
- Captura de erros ✅
- Falta tracking de eventos customizados ❌
- Falta métricas de performance ❌

Eventos a trackear:
1. Workout Started
2. Workout Completed
3. Set Completed
4. Exercise Added to Plan
5. Goal Created
6. Goal Completed
7. Report Generated
8. Subscription Upgraded
9. Filter Applied
10. Search Performed

Métricas de performance:
- Tempo médio de treino
- Exercícios mais usados
- Taxa de conclusão de metas
- Tempo de carregamento de páginas
- Erros mais frequentes

Requisitos:
1. Criar lib/analytics.ts com funções de tracking
2. Substituir console.log por sistema estruturado (lib/logger.ts)
3. Adicionar tracking em componentes críticos
4. Dashboard de métricas (opcional)
5. Alertas para erros críticos

Crie:
1. Sistema de analytics completo
2. Sistema de logging estruturado
3. Integração em componentes
4. Substituição de ~50 console.log
5. Documentação de eventos
6. Dashboard de métricas (Grafana/LogRocket)
```

---

## 📚 FASE 4: DOCUMENTAÇÃO & LANÇAMENTO (SEMANAS 13-16)

### 4.1 Criar Documentação Completa

```
Preciso criar documentação técnica completa para o projeto FIT-TRACKER.

Documentos necessários:

1. README.md (atualizar)
   - Descrição do projeto
   - Features
   - Screenshots
   - Quick start
   - Variáveis de ambiente
   - Scripts disponíveis
   - Estrutura do projeto
   - Como contribuir

2. CONTRIBUTING.md
   - Guia de contribuição
   - Code style
   - Commit conventions
   - Pull request process
   - Code review guidelines

3. API.md
   - Documentação de todos os endpoints
   - Request/Response examples
   - Códigos de erro
   - Rate limits
   - Autenticação

4. ARCHITECTURE.md
   - Diagrama de arquitetura
   - Fluxo de dados
   - Decisões técnicas
   - Padrões utilizados

5. DEPLOYMENT.md
   - Guia de deploy
   - Configuração Cloudflare
   - Variáveis de ambiente
   - Troubleshooting

6. TESTING.md
   - Como rodar testes
   - Como escrever testes
   - Coverage requirements
   - CI/CD

7. SECURITY.md
   - Política de segurança
   - Como reportar vulnerabilidades
   - Boas práticas

8. CHANGELOG.md
   - Histórico de versões
   - Breaking changes
   - Migrações

Crie todos os documentos acima com conteúdo detalhado e exemplos práticos.
```

---

### 4.2 Implementar Backup Automático

```
Preciso implementar sistema de backup automático para o banco de dados Neon.

Requisitos:
1. Backup diário automático
2. Retenção de 30 dias
3. Backup antes de migrações
4. Restore fácil e documentado
5. Testes de restore periódicos
6. Notificação em caso de falha

Estratégia:
1. Usar Neon Branching para backups
2. Cloudflare Workers Cron para agendamento
3. Armazenar dumps em Cloudflare R2
4. Script de restore

Crie:
1. Cloudflare Worker para backup (functions/backup.ts)
2. Script de restore (scripts/restore-backup.ts)
3. Configuração de cron
4. Testes de backup/restore
5. Documentação de disaster recovery
6. Runbook de incidentes
```

---

### 4.3 Testes de Carga e Stress

```
Preciso realizar testes de carga e stress para garantir que a aplicação aguenta tráfego de produção.

Cenários de teste:
1. 100 usuários simultâneos registrando treinos
2. 1000 usuários visualizando dashboard
3. 50 uploads de imagem simultâneos
4. 500 queries de histórico simultâneas
5. Pico de 5000 requests/minuto

Ferramentas:
- k6 para testes de carga
- Artillery para testes de stress
- Lighthouse CI para performance

Métricas a medir:
- Response time p50, p95, p99
- Throughput (requests/segundo)
- Error rate
- Database connection pool
- Memory usage
- CPU usage

Requisitos:
1. Scripts de teste k6
2. Configuração Artillery
3. Análise de resultados
4. Identificação de gargalos
5. Otimizações necessárias
6. Documentação de capacidade

Crie:
1. Scripts de teste de carga
2. Configuração de monitoramento
3. Relatório de performance
4. Plano de otimização
5. Documentação de limites
```

---

### 4.4 Beta Testing com Usuários

```
Preciso organizar um programa de beta testing com usuários reais antes do lançamento.

Objetivos:
1. Validar usabilidade
2. Identificar bugs não detectados
3. Coletar feedback de features
4. Testar em dispositivos reais
5. Validar fluxos de onboarding

Plano de beta:
1. Recrutar 20-30 beta testers
2. Período de 2 semanas
3. Formulário de feedback estruturado
4. Sessões de observação (opcional)
5. Análise de métricas LogRocket

Perfis de testers:
- 40% iniciantes em academia
- 40% intermediários
- 20% avançados
- Mix de iOS/Android/Desktop

Crie:
1. Formulário de inscrição para beta
2. Guia de onboarding para testers
3. Formulário de feedback
4. Roteiro de testes sugeridos
5. Análise de feedback
6. Priorização de ajustes
7. Relatório de beta testing
```

---

## 🎯 PROMPTS AUXILIARES

### Prompt: Análise de Bundle Size

```
Preciso analisar o bundle size do FIT-TRACKER e identificar oportunidades de otimização.

Instale e configure vite-bundle-visualizer, depois:
1. Gere relatório visual do bundle
2. Identifique as 10 maiores dependências
3. Sugira alternativas mais leves
4. Implemente code splitting onde necessário
5. Configure tree shaking
6. Analise impacto de cada otimização

Meta: Bundle gzipped < 500KB

Crie relatório com:
- Tamanho atual vs. meta
- Maiores dependências
- Sugestões de otimização
- Plano de implementação
```

---

### Prompt: Auditoria de Segurança

```
Preciso realizar auditoria completa de segurança no FIT-TRACKER.

Verifique:
1. npm audit (vulnerabilidades)
2. Análise de dependências desatualizadas
3. Exposição de credenciais
4. Validação de inputs
5. Proteção contra XSS
6. Proteção contra CSRF
7. Headers de segurança
8. Rate limiting
9. Logs de segurança

Ferramentas:
- npm audit
- Snyk
- OWASP ZAP
- Lighthouse Security

Crie:
1. Relatório de vulnerabilidades
2. Plano de correção priorizado
3. Implementação de correções
4. Testes de segurança
5. Documentação de boas práticas
```

---

### Prompt: Otimização de Database

```
Preciso otimizar as queries e índices do banco de dados Neon PostgreSQL.

Análise necessária:
1. Queries mais lentas (EXPLAIN ANALYZE)
2. Índices faltantes
3. Índices não utilizados
4. N+1 queries
5. Queries sem WHERE clause
6. Joins desnecessários

Otimizações:
1. Adicionar índices compostos
2. Implementar caching
3. Otimizar queries complexas
4. Adicionar paginação
5. Implementar connection pooling

Crie:
1. Análise de performance atual
2. Script de índices otimizados
3. Queries otimizadas
4. Configuração de caching
5. Testes de performance
6. Documentação de otimizações
```

---

## 📝 COMO USAR ESTES PROMPTS

### Instruções:

1. **Copie o prompt completo** da seção desejada
2. **Cole no chat** com o assistente de IA
3. **Aguarde a implementação** completa
4. **Revise o código** gerado
5. **Teste** a implementação
6. **Faça ajustes** se necessário
7. **Commit** com mensagem descritiva

### Ordem Recomendada:

**Semana 1-2:**
- 1.1 CI/CD
- 1.2 Testes Unitários (início)

**Semana 3-4:**
- 1.3 Mover Credenciais
- 1.4 Paginação
- 1.5 Performance

**Semana 5-6:**
- 2.1 Sanitização
- 2.2 Rate Limiting
- 2.3 Testes E2E

**Semana 7-8:**
- 2.4 Acessibilidade

**Semana 9-10:**
- 3.1 PWA
- 3.2 Skeleton Screens

**Semana 11-12:**
- 3.3 Micro-animações
- 3.4 Monitoramento

**Semana 13-14:**
- 4.1 Documentação
- 4.2 Backup

**Semana 15-16:**
- 4.3 Testes de Carga
- 4.4 Beta Testing

---

## ✅ CHECKLIST DE VALIDAÇÃO

Após cada implementação, verifique:

- [ ] Código compila sem erros TypeScript
- [ ] Testes passam (npm run test)
- [ ] Lint passa (npm run lint)
- [ ] Build funciona (npm run build)
- [ ] Funcionalidade testada manualmente
- [ ] Documentação atualizada
- [ ] PR criado e revisado
- [ ] CI/CD passa
- [ ] Deploy em staging bem-sucedido

---

**Criado por:** Antigravity AI  
**Data:** 06 de Janeiro de 2026  
**Versão:** 1.0
