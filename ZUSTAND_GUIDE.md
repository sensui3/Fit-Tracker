# Documentação do Estado Global (Zustand) - FIT-TRACKER

Este projeto utiliza **Zustand** para o gerenciamento de estado global, oferecendo uma solução performática, modular e tipada.

## Estrutura de Stores

Os stores estão localizados em `src/stores/` e são divididos por domínios de responsabilidade:

| Store | Responsabilidade | Persistência |
|-------|-----------------|--------------|
| `useAuthStore` | Autenticação, dados do usuário e sessão | Sim |
| `useUIStore` | Tema, Sidebar, Toasts e estados de UI | Parcial (Tema) |
| `useWorkoutStore` | Registro de treino atual (draft), exercícios e sets | Sim |
| `useTimerStore` | Cronômetro de descanso global | Sim |
| `useSettingsStore` | Preferências do usuário (idioma, sons) | Sim |

## Padrões de Uso

### 1. Acessando Estado
Use seletores para otimizar a performance e evitar re-renderizações desnecessárias.

```tsx
const user = useAuthStore((state) => state.user);
const setTheme = useUIStore((state) => state.setTheme);
```

### 2. Modificando Estado
As ações estão incluídas dentro dos próprios stores.

```tsx
const { addSet, updateSet } = useWorkoutStore();
```

### 3. Persistência
A maioria dos stores utiliza o middleware `persist`, salvando o estado no `localStorage`. Isso garante que o progresso do treino ou o cronômetro não sejam perdidos ao recarregar a página.

### 4. Integração com Middleware Immer
O `useWorkoutStore` utiliza `immer` para permitir mutações seguras e legíveis em estados complexos (como arrays de séries).

---

## Guia de Migração (Context -> Zustand)

Para manter a compatibilidade com componentes antigos, foram criados "Shims" nos arquivos de contexto originais.

### Como atualizar um componente legado:

**Antigo (Context):**
```tsx
import { useAuth } from '../context/AuthContext';
const { user } = useAuth();
```

**Novo (Zustand Direto):**
```tsx
import { useAuthStore } from '../stores/useAuthStore';
const user = useAuthStore(state => state.user);
```

### Principais Mudanças:
1.  **Toasts:** Não é mais necessário o `ToastProvider` em volta do componente. O `GlobalToast` (no Layout) renderiza automaticamente qualquer toast adicionado via `useUIStore`.
2.  **RestTimer:** O cronômetro agora é global. Ao marcar uma série como concluída no `useWorkoutStore`, o timer inicia automaticamente e persiste mesmo se você trocar de página.
3.  **AppInitializer:** Centraliza a sincronização entre fontes externas (Better Auth) e o estado global do Zustand.

---

## Dicas de Performance
*   Sempre use seletores específicos: `useAuthStore(s => s.user)` em vez de `useAuthStore()`.
*   Para estados que mudam frequentemente (como o Timer), o Zustand minimiza o impacto no restante da árvore de componentes.
