# AltScore - Frontend

**Score de crédito alternativo para plataformas de aluguel.**

Frontend do AltScore desenvolvido com React, TypeScript e TailwindCSS.

## Stack

| Tecnologia | Versão |
|------------|--------|
| React | 19.2 |
| TypeScript | 6.0 |
| Vite | 8.2 |
| TailwindCSS | 4.3 |
| Zustand | 5.0 |
| React Router | 7.7 |

## Estrutura

```
frontend/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── ui/            # Avatar, Badge, Button, Card, Input, Spinner, ErrorBanner
│   │   ├── layout/        # Header (com menu mobile), Footer
│   │   ├── score/         # ScoreDisplay, ScoreBreakdown
│   │   ├── property/      # PropertyCard, PropertyList
│   │   └── contract/      # ContractCard
│   ├── pages/             # 7 páginas principais
│   │   ├── Landing.tsx    # Página inicial com dados mercado e parceiros
│   │   ├── Login.tsx      # Login com email/senha e Phantom Wallet
│   │   ├── Register.tsx   # Cadastro com CPF e seleção de perfil
│   │   ├── Dashboard.tsx  # Painel do locatário (score, fontes, contratos)
│   │   ├── Score.tsx      # Score detalhado, simulador e badges
│   │   ├── Properties.tsx # Lista de imóveis parceiros com filtros
│   │   ├── PropertyDetail.tsx  # Detalhe com verificação de score
│   │   ├── Contracts.tsx  # Lista de contratos
│   │   ├── ContractDetail.tsx  # Detalhe com histórico de pagamentos
│   │   └── LandlordDashboard.tsx  # Painel do proprietário
│   ├── stores/            # Zustand (authStore)
│   ├── lib/               # API client (api.ts)
│   ├── types/             # TypeScript types
│   └── App.tsx            # Rotas da aplicação
├── vite.config.ts         # Proxy /api → backend
├── tailwind.config.js     # Configuração TailwindCSS
└── package.json
```

## Rotas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Landing | Página inicial com CTA |
| `/login` | Login | Login com email ou Phantom Wallet |
| `/cadastro` | Register | Cadastro com CPF |
| `/dashboard` | Dashboard | Painel do locatário |
| `/score` | ScorePage | Score detalhado e simulador |
| `/imoveis` | Properties | Lista de imóveis parceiros |
| `/imoveis/:id` | PropertyDetail | Detalhe do imóvel |
| `/contratos` | Contracts | Lista de contratos |
| `/contratos/:id` | ContractDetail | Detalhe do contrato |
| `/proprietario` | LandlordDashboard | Painel do proprietário |

## Setup

```bash
# Instalar dependências
npm install

# Iniciar em modo de desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

O servidor de desenvolvimento inicia em `http://localhost:5173`.

## Proxy API

O `vite.config.ts` configura um proxy para redirecionar requisições `/api` para o backend:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

## Componentes Principais

### ScoreDisplay
Exibição circular do score (0-1000) com gauge SVG e nível.

### ScoreBreakdown
Barras de progresso mostrando a composição do score:
- Histórico de Pagamento (40%)
- Consistência de Renda (25%)
- Dados Open Finance (20%)
- Avaliação Social (15%)

### PropertyCard
Card de imóvel com foto, dados, badge "Alugue sem fiador" e preço.

### ContractCard
Card de contrato com status, valor e link para detalhes.

## Deploy

O frontend é deployado na **Vercel**.

```bash
vercel --prod
```

O `vercel.json` configura:
- SPA routing (todas as rotas → index.html)
- Proxy `/api` para o backend no Fly.io
