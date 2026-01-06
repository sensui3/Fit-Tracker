# Guia de Testes - FIT-TRACKER

Este projeto utiliza **Vitest** + **React Testing Library** para garantir a qualidade e estabilidade do código. A meta de cobertura é de **70%**.

## Scripts Disponíveis

- `npm run test`: Executa todos os testes unitários uma única vez.
- `npm run test:watch`: Executa os testes em modo watch (ideal para desenvolvimento).
- `npm run test:coverage`: Gera o relatório de cobertura de código.

## Estrutura de Testes

Os arquivos de teste devem seguir a convenção `[nome-do-arquivo].test.ts` (ou `.tsx` para componentes React).

### 1. Testando Stores Zustand

Sempre use `getState()` para acessar e testar o estado e as ações da store. Lembre-se de resetar o estado no `beforeEach` para garantir isolamento entre os testes.

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useMinhaStore } from './useMinhaStore';

describe('useMinhaStore', () => {
    beforeEach(() => {
        // Se houver uma ação de reset, use-a
        useMinhaStore.getState().reset();
    });

    it('deve atualizar o estado corretamente', () => {
        useMinhaStore.getState().minhaAcao('novo valor');
        expect(useMinhaStore.getState().meuValor).toBe('novo valor');
    });
});
```

### 2. Testando Componentes React

Utilize o `render` do `@testing-library/react` e prefira buscar elementos por roles (`getByRole`) ou texto acessível (`getByText`).

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MeuComponente } from './MeuComponente';

it('deve chamar a função ao clicar no botão', () => {
    const callback = vi.fn();
    render(<MeuComponente onClick={callback} />);
    
    fireEvent.click(screen.getByRole('button', { name: /clique aqui/i }));
    expect(callback).toHaveBeenCalled();
});
```

### 3. Mocks de Dependências

Para mocks globais (ex: LogRocket, APIs de browser), utilize o arquivo `test-setup.ts`. Para mocks específicos de um arquivo de teste, utilize `vi.mock()`.

## Dicas para Aumentar Coverage

- Teste casos de sucesso, erro (throws) e valores limite (edge cases).
- Para componentes com lógica condicional, certifique-se de renderizar o componente em todos os estados possíveis.
- Teste hooks customizados usando `renderHook`.

## Requisitos de Qualidade

- Todo novo utilitário em `lib/` **deve** ter testes.
- Toda nova store em `stores/` **deve** ter seus métodos principais cobertos.
- Evite testar detalhes de implementação (CSS, nomes de variáveis internas); foque no comportamento e output.
