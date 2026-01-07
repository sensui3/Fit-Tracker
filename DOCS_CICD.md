# Guia de Configuração CI/CD - FIT-TRACKER

Este documento descreve como configurar e manter o pipeline de CI/CD para o projeto FIT-TRACKER.

## 1. GitHub Secrets

Para que o pipeline funcione, você deve configurar as seguintes Secrets no seu repositório GitHub (**Settings > Secrets and variables > Actions**):

### Cloudflare
| Secret | Descrição | Valor |
|--------|-----------|-------|
| `CLOUDFLARE_API_TOKEN` | Token da API da Cloudflare | `kf76aEdYKEbnZdlauuqvK93hkHrJJKBeiAzMLu_G` |
| `CLOUDFLARE_ACCOUNT_ID` | ID da conta Cloudflare | `eb0adc0c4f559ab12aa711c3c6a04ca8` |

### Database & Auth
| Secret | Descrição |
|--------|-----------|
| `VITE_DATABASE_URL` | URL de conexão do Neon PostgreSQL |
| `VITE_BETTER_AUTH_SECRET` | Secret para o Better Auth (Base64) |
| `VITE_BETTER_AUTH_URL` | URL base do Auth |

### Storage (R2)
| Secret | Descrição |
|--------|-----------|
| `VITE_R2_ACCESS_KEY_ID` | Access Key do Cloudflare R2 |
| `VITE_R2_SECRET_ACCESS_KEY` | Secret Key do Cloudflare R2 |
| `VITE_R2_ENDPOINT` | Endpoint S3 do R2 |
| `VITE_R2_BUCKET_NAME` | Nome do bucket (`fit-tracker-assets`) |
| `VITE_R2_PUBLIC_URL` | URL pública do bucket |

### Monitoramento & Testes
| Secret | Descrição |
|--------|-----------|
| `VITE_LOGROCKET_ID` | ID do projeto no LogRocket |
| `CODECOV_TOKEN` | Token de upload para o [Codecov](https://about.codecov.io/) |

---

## 2. Configuração na Cloudflare Pages

Para garantir que os domínios staging e produção funcionem corretamente:

1. Acesse o **Dashboard da Cloudflare > Workers & Pages > fit-tracker-btx**.
2. Vá em **Settings > Builds & deployments**.
3. Em **Configure Production branch**, defina como `main`.
4. Em **Preview deployments**, certifique-se de que "All branches" ou "Custom branches" (incluindo `develop`) está habilitado.
5. Em **Custom Domains**:
   - Adicione `fit-tracker-btx.pages.dev` (Produção).
   - Adicione `staging.fit-tracker-btx.pages.dev` e aponte para a branch `develop`.

---

## 3. Scripts Adicionados

Os seguintes scripts foram adicionados ao `package.json`:
- `npm run lint`: Executa o ESLint para verificar o estilo e erros de código.
- `npm run type-check`: Executa o TypeScript Compiler sem gerar arquivos, apenas para validação de tipos.
- `npm run test:coverage`: Executa os testes e gera o relatório `lcov.info` para o Codecov.

---

## 4. Proteção de Branch (GitHub)

Recomendamos configurar as seguintes regras em **Settings > Branches > Add rule**:

- **Branch name pattern**: `main` e `develop`
- **Require a pull request before merging**: Sim
- **Require status checks to pass before merging**: Sim
  - Procure por: `Continuous Integration`
- **Require branches to be up to date before merging**: Sim

---

## 5. Checklist de Validação do Pipeline

- [ ] Pipeline dispara ao abrir um Pull Request para `main` ou `develop`.
- [ ] Etapa de `Lint` passa com sucesso.
- [ ] Etapa de `Type Check` valida todos os tipos do projeto.
- [ ] Testes unitários executam e atingem o coverage mínimo (70%).
- [ ] Build da aplicação termina sem erros (Vite).
- [ ] Coverage é enviado para o Codecov.
- [ ] Merge em `develop` dispara deploy para `https://staging.fit-tracker-btx.pages.dev`.
- [ ] Merge em `main` dispara deploy para `https://fit-tracker-btx.pages.dev`.
- [ ] Falha em qualquer etapa impede o deploy automático.
