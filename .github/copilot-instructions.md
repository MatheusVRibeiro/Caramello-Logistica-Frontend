# Copilot Instructions - RN Logística Fretes Inteligentes

## Visão Geral do Projeto
Sistema de gestão de logística e fretes para TCC, desenvolvido com React + TypeScript + Vite. Foco em gerenciamento de fretes, caminhões, motoristas, mercadorias, custos e indicadores operacionais.

## Stack Tecnológica
- **Framework**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui (Radix UI) + Tailwind CSS
- **Roteamento**: React Router v6
- **Formulários**: React Hook Form + Zod
- **Charts**: Recharts
- **State**: React Query (TanStack Query)
- **Testes**: Vitest + Testing Library
- **Build Tool**: Vite (dev server na porta 8080)

## Estrutura da Aplicação

### Arquitetura de Rotas
Todas as rotas (exceto `/login`) são protegidas por `ProtectedRoute`. Ver `src/App.tsx` para configuração centralizada de rotas.

### Sistema de Autenticação
- Contexto: `src/auth/AuthContext.tsx`
- Demo users hardcoded (admin@rnlogistica.com / operador@rnlogistica.com)
- Sessão persistida via `localStorage` com chave `rn_logistica_user`
- Roles definidas: `admin`, `operador`, `motorista`
- **Permissões**: Foco atual apenas em `admin` (gestor) - outras roles reservadas para expansão futura

### Layout Padrão
Todas as páginas autenticadas usam `MainLayout` (`src/components/layout/MainLayout.tsx`):
- Sidebar fixa com navegação (`AppSidebar`)
- Header com título e subtítulo
- Área de conteúdo com scroll

### Padrões de Componentes

#### Páginas CRUD
Estrutura padrão vista em `src/pages/Fretes.tsx`, `src/pages/Caminhoes.tsx`:
- `MainLayout` com título/subtítulo
- `PageHeader` com botão de ação primária
- `FilterBar` para busca e filtros
- `DataTable` para listagem com renderização customizada de células
- `Dialog` para detalhes e formulários

#### DataTable Genérico
`src/components/shared/DataTable.tsx` - componente reutilizável com:
- Props: `columns`, `data`, `onRowClick`, `highlightNegative`
- Suporta renderização customizada por coluna via `render()`
- Destaque automático de linhas negativas (ex: prejuízos)

#### Badge de Status
Padrão consistente para status de fretes:
```tsx
const statusConfig = {
  em_transito: { label: "Em Trânsito", variant: "inTransit" },
  concluido: { label: "Concluído", variant: "completed" },
  pendente: { label: "Pendente", variant: "pending" },
  cancelado: { label: "Cancelado", variant: "cancelled" },
};
```

### Dados Demo
**IMPORTANTE**: Atualmente não há backend. Todos os dados são hardcoded em arrays dentro das páginas:
- `fretesData` em `src/pages/Fretes.tsx`
- `caminhoes` em `src/pages/Caminhoes.tsx`
- Etc.

Ao criar funcionalidades, mantenha esse padrão até integração com API real.

### Backend Futuro
**Planejamento de implementação**:
- **Stack Backend**: Node.js + Express
- **Arquitetura**: API RESTful para gerenciar rotas e lógica de negócio
- **Objetivo**: Lidar eficientemente com múltiplas requisições do sistema de fretes
- **Status**: A ser implementado futuramente

Ao preparar componentes, considere que eventualmente consumirão endpoints REST.

## Convenções de Código

### Imports
Sempre use alias `@/` para imports internos:
```tsx
import { MainLayout } from "@/components/layout/MainLayout";
import { cn } from "@/lib/utils";
```

### Estilização
- Use `cn()` de `src/lib/utils.ts` para composição de classes Tailwind
- Cores customizadas via CSS variables (theme HSL): `profit`, `loss`, `inTransit`, etc.
- Classes de animação: `animate-fade-in`, `scrollbar-thin`

### Nomenclatura
- Componentes: PascalCase
- Arquivos: PascalCase para componentes, camelCase para utils
- Variáveis de estado: `selected[Entity]`, `is[State]`, `has[Feature]`

### Toasts
Use `sonner` para notificações:
```tsx
import { toast } from "sonner";
toast.success("Operação concluída");
toast.error("Erro ao processar");
```

## Comandos Essenciais

```bash
npm run dev          # Dev server (localhost:8080)
npm run build        # Production build
npm run build:dev    # Development build
npm test             # Run tests once
npm run test:watch   # Watch mode
npm run lint         # ESLint
```

## Testes
Configuração em `vitest.config.ts`:
- Setup global em `src/test/setup.ts`
- Padrão: `*.test.ts` ou `*.spec.ts` em qualquer lugar de `src/`

## Extensibilidade

### Adicionando Nova Página
1. Criar componente em `src/pages/NomeDaPagina.tsx`
2. Adicionar rota em `src/App.tsx` dentro de `ProtectedRoute`
3. Adicionar item no menu em `src/components/layout/AppSidebar.tsx`
4. Seguir padrão: `MainLayout` → `PageHeader` → `FilterBar` → `DataTable`

### Adicionando Novo Componente shadcn
```bash
npx shadcn@latest add [component-name]
```
Configuração em `components.json`.

## Observações Importantes
- Não há validação real de permissões por role (apenas autenticação sim/não)
- Dashboard com dados estáticos de demonstração
- Mobile-first com hooks: `use-mobile.tsx`

## Roadmap Técnico

### Deploy
Estratégia de deploy ainda em análise. Considere ao desenvolver:
- Build otimizado via `npm run build`
- Compatibilidade com plataformas de hospedagem estática (Vercel, Netlify, etc.)
- Configurações de ambiente para futuro backend Node.js + Express

### Próximos Passos
1. ✅ Dashboard com KPIs específicos de amendoim implementado
2. Gestão de Custos Avançada (histórico de preços, análise por rota, previsões)
3. Rastreamento em Tempo Real (timeline visual, status geográfico, alertas)
4. Relatórios e Análises (rentabilidade, exportação PDF/Excel)
5. Gestão de Documentação (CNH, CRLV, notas fiscais)
6. Melhorias UX/UI (modo escuro, filtros avançados, busca global)
7. Análise de Dados (tendências, previsão de demanda por safra)
8. Integração com backend Node.js + Express (API REST)
9. Implementação de persistência de dados via banco de dados
10. Autenticação real com JWT ou sessões
11. Sistema de permissões granular (admin prioritário)

### KPIs Implementados no Dashboard
- **Sacas Transportadas**: Total mensal com conversão automática para toneladas
- **Taxa de Ocupação**: Porcentagem de caminhões em uso vs. disponíveis
- **Custo por Saca**: Média de custo operacional por unidade transportada
- **Resultado do Mês**: Lucro líquido com tendências vs. mês anterior
- **Alertas Inteligentes**: Monitoramento de safra, eficiência, custos e performance
- **Comparativo Mensal**: Janeiro 2025 vs. Dezembro 2024 com cálculos dinâmicos
