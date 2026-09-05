# AltScore

**Alugue sem fiador. Seu histórico é sua garantia.**

O AltScore é uma plataforma que permite jovens brasileiros alugarem imóveis sem a necessidade de fiador, utilizando um score de crédito alternativo registrado na blockchain Solana.

## O Problema

- 46,5 milhões de brasileiros vivem de aluguel
- 1 em cada 4 jovens de 25-34 anos moram com os pais
- Renda 3x é exigida para alugar sem fiador

## A Solução

O AltScore coleta dados reais de pagamento (Pix, assinaturas, open finance) e gera um score alternativo de 0 a 1000 que serve como garantia para aluguel. Tudo registrado na blockchain Solana para transparência e portabilidade.

## Stack

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React 19 + Vite 8 + TypeScript + TailwindCSS 4 |
| **Backend** | Python 3 + FastAPI + SQLAlchemy + SQLite |
| **Blockchain** | Solana Devnet (Anchor 1.2 + Rust) |
| **Estado** | Zustand |
| **Deploy** | Vercel (frontend) + Render (backend) |

## Funcionalidades

### Locatário (Inquilino)
- Cadastro e login com email/senha
- Cálculo de score alternativo (0-1000) com 4 fatores:
  - **Pagamento** (40%): Histórico de pagamentos via Pix
  - **Renda** (25%): Estabilidade de renda via open finance
  - **Financeiro** (20%): Comportamento financeiro
  - **Social** (15%): Dados alternativos
- Visualização de imóveis em Quixadá, CE
- Solicitação de contrato de aluguel
- Acompanhamento de contratos

### Proprietário (Landlord)
- Dashboard com seus imóveis
- Visualização de contratos pendentes
- Aceitar ou recusar solicitações de contrato

### Blockchain (Solana)
- Programa Anchor com instruções:
  - `register_score` — Registra score do usuário na blockchain
  - `update_score` — Atualiza score existente
  - `create_contract` — Cria contrato na blockchain
  - `record_payment` — Registra pagamento contra contrato

## Estrutura do Projeto

```
altscore/
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── ui/            # Avatar, Badge, Button, Card, Input, Spinner, etc.
│   │   │   ├── layout/        # Header (com menu mobile), Footer
│   │   │   ├── score/         # ScoreGauge, ScoreDisplay, ScoreBreakdown
│   │   │   ├── property/      # PropertyCard, PropertyList
│   │   │   └── contract/      # ContractCard
│   │   ├── pages/             # Páginas
│   │   │   ├── Landing.tsx    # Página inicial
│   │   │   ├── Auth.tsx       # Login/Cadastro
│   │   │   ├── Dashboard.tsx  # Painel do locatário
│   │   │   ├── LandlordDashboard.tsx  # Painel do proprietário
│   │   │   ├── Score.tsx      # Cálculo de score
│   │   │   ├── Properties.tsx # Lista de imóveis
│   │   │   ├── PropertyDetail.tsx  # Detalhe do imóvel
│   │   │   └── Contracts.tsx  # Contratos do locatário
│   │   ├── stores/            # Zustand (authStore)
│   │   ├── lib/               # API client
│   │   └── types/             # TypeScript types
│   └── vite.config.ts         # Proxy /api → backend
├── backend/                   # FastAPI
│   ├── app/
│   │   ├── routes/            # auth, score, properties, contracts, landlord
│   │   ├── models/            # SQLAlchemy (User, Property, Score, Contract)
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # score_engine, solana
│   │   └── utils/             # crypto (JWT + bcrypt)
│   ├── seed.py                # Dados de exemplo
│   └── requirements.txt
├── altscore-solana/           # Programa Anchor
│   └── programs/altscore-solana/src/lib.rs
├── vercel.json                # Deploy frontend
└── render.yaml                # Deploy backend
```

## Setup

### Pré-requisitos

- Node.js 18+
- Python 3.11+
- Rust + Anchor CLI (para o programa Solana)
- Solana CLI (para interação com devnet)

### Frontend

```bash
cd frontend
npm install
npm run dev        # Inicia em http://localhost:5173
npm run build      # Build de produção
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py     # Popula banco com dados de exemplo
uvicorn app.main:app --reload  # Inicia em http://localhost:8000
```

### Programa Solana

```bash
cd altscore-solana
anchor build       # Compila o programa
anchor test        # Roda testes
```

## Credenciais de Teste

### Locatário (Inquilino)
| Campo | Valor |
|-------|-------|
| **Email** | `ana@aluno.ufc.br` |
| **Senha** | `123456` |
| **Nome** | Ana Beatriz Silva |
| **Score** | 720 (Bom) |

### Proprietário (Landlord)
| Campo | Valor |
|-------|-------|
| **Email** | `proprietario@email.com` |
| **Senha** | `123456` |
| **Nome** | Maria Oliveira |
| **Imóveis** | 6 imóveis em Quixadá, CE |

### Imóveis de Exemplo

| Imóvel | Bairro | Aluguel | Aceita AltScore |
|--------|--------|---------|-----------------|
| Apartamento 2 quartos | Centro | R$ 850 | Sim |
| Casa 3 quartos | Planalto Universitário | R$ 1.200 | Sim |
| Studio mobiliado | Centro | R$ 650 | Sim |
| Apartamento 3 quartos | Padre José Maria | R$ 1.100 | Não |
| Quarto em república | Centro | R$ 350 | Sim |
| Cobertura 2 quartos | Alto da Boa Vista | R$ 1.500 | Sim |

## API Endpoints

### Auth
- `POST /api/auth/register` — Cadastro
- `POST /api/auth/login` — Login (retorna JWT)
- `GET /api/auth/me` — Dados do usuário logado

### Score
- `GET /api/score` — Buscar score
- `POST /api/score/calculate` — Calcular score

### Imóveis
- `GET /api/properties` — Listar imóveis
- `GET /api/properties/{id}` — Detalhe do imóvel

### Contratos (Locatário)
- `GET /api/contracts` — Listar contratos do locatário
- `POST /api/contracts` — Solicitar contrato

### Contratos (Proprietário)
- `GET /api/landlord/properties` — Imóveis do proprietário
- `GET /api/landlord/contracts` — Contratos dos imóveis
- `PATCH /api/landlord/contracts/{id}/accept` — Aceitar contrato
- `PATCH /api/landlord/contracts/{id}/reject` — Recusar contrato

## Deploy

### Vercel (Frontend)

```bash
vercel --prod
```

O `vercel.json` configura:
- SPA routing (todas as rotas → index.html)
- Proxy `/api` para o backend no Render

### Render (Backend)

O `render.yaml` configura automaticamente o serviço backend.

## Participantes

Desenvolvido para o **Hackathon Universitário Superteam Brasil 2026**.

## Licença

MIT
