# CONTEXT_IA.md - AltScore

> **Arquivo de contexto para IAs assistentes.**
> Última atualização: Setembro 2026

---

## Visão Geral do Projeto

**AltScore** é uma solução de **score de crédito alternativo** para plataformas de aluguel imobiliário. O projeto resolve o problema de 46,5 milhões de brasileiros que alugam imóveis e dependem de fiadores.

**O AltScore NÃO é uma plataforma de aluguel** — é uma solução de score que integra com plataformas existentes (QuintoAndar, Zap Imóveis, VivaReal, etc).

---

## Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| **Frontend** | React + Vite + TypeScript + TailwindCSS + Zustand | 19.2 / 8.2 / 6.0 / 4.3 / 5.0 |
| **Backend** | Python + FastAPI + SQLAlchemy + SQLite | 3.11+ / 0.115 / 2.0 |
| **Blockchain** | Solana Devnet + Anchor + Rust | 1.2 / 2021 |
| **Deploy** | Vercel (frontend) + Fly.io (backend) | - |

---

## Estrutura do Projeto

```
altscore/
├── frontend/                  # React + Vite (7 telas)
│   ├── src/
│   │   ├── pages/             # 11 páginas
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── stores/            # Zustand (authStore)
│   │   ├── lib/               # API client (api.ts)
│   │   └── types/             # TypeScript types
│   └── vite.config.ts         # Proxy /api → backend
├── backend/                   # FastAPI (API REST)
│   ├── app/
│   │   ├── routes/            # 6 módulos de rotas
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Score engine, Solana, Fundo
│   │   └── utils/             # Crypto (JWT + bcrypt)
│   ├── seed.py                # Dados de exemplo
│   └── altscore.db            # Banco SQLite
├── altscore-solana/           # Programa Anchor (blockchain)
│   └── programs/altscore-solana/src/lib.rs
├── README.md                  # Documentação principal
└── CONTEXT_IA.md              # Este arquivo
```

---

## Funcionalidades Implementadas

### 1. Autenticação
- Cadastro com email/senha + CPF
- Login com email/senha
- **Login com Phantom Wallet** (blockchain)
- JWT tokens (24h expiração)
- Duas roles: `tenant` (locatário) e `landlord` (proprietário)

### 2. Score de Crédito Alternativo (0-1000)
Composto por 4 fatores:

| Fator | Peso | Faixa | Fonte |
|-------|------|-------|-------|
| Histórico de Pagamento | 40% | 0-400 | Pix, transações |
| Consistência de Renda | 25% | 0-250 | Open Finance |
| Dados Financeiros | 20% | 0-200 | Open Finance |
| **Avaliação Social** | 15% | 0-150 | Referências, estabilidade, comunidade, presença digital |

**Níveis:** Excelente (800+), Bom (600+), Regular (400+), Iniciante (<400)

### 3. Sistema de Contratos
- Solicitação de contrato por inquilinos
- Aceite/rejeição por proprietários
- Status: pending → active → completed/cancelled
- **Registro na blockchain Solana** (hash/NFT do contrato)

### 4. Fundo Garantidor (Smart Contract Solana)
- **initialize_fund**: Configuração do fundo
- **deposit_to_fund**: Depósitos de SOL
- **claim_coverage**: Reivindicação com taxa 2.5%
- **toggle_fund_status**: Pausar/retomar fundo
- **update_fund_params**: Atualizar parâmetros

Parâmetros:
- Limite por contrato: 5 SOL
- Taxa de administração: 2.5%
- Score mínimo: 600

### 5. Blockchain Solana
**Instruções do programa Anchor:**

| Instrução | Descrição |
|-----------|-----------|
| `register_score` | Registra score do usuário |
| `update_score` | Atualiza score existente |
| `create_contract` | Cria contrato na chain |
| `record_payment` | Registra pagamento |
| `initialize_fund` | Inicializa fundo garantidor |
| `deposit_to_fund` | Depósito no fundo |
| `claim_coverage` | Reivindicação de cobertura |

**Contas PDA:**
- `ScoreAccount`: Score do usuário
- `ContractAccount`: Contrato de aluguel
- `PaymentAccount`: Pagamento
- `FundAccount`: Estado do fundo
- `DepositorAccount`: Depósitos
- `ClaimAccount`: Claims do fundo

---

## 7 Telas Principais

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Landing | Hero, dados mercado, parceiros, como funciona |
| `/login` | Login | Email/senha + Phantom Wallet |
| `/cadastro` | Register | CPF, seleção locatário/proprietário |
| `/dashboard` | Dashboard | Score, fontes conectadas, contratos |
| `/score` | ScorePage | Breakdown, simulador, badges blockchain |
| `/imoveis` | Properties | Lista parceiros com filtros |
| `/imoveis/:id` | PropertyDetail | Verificação score, qualificação |
| `/contratos` | Contracts | Lista de contratos |
| `/contratos/:id` | ContractDetail | Status, pagamentos, score tempo real |
| `/proprietario` | LandlordDashboard | Imóveis, contratos pendentes |
| `/fundo` | GuaranteeFund | Fundo garantidor (apenas logados) |

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Cadastro com CPF
- `POST /api/auth/register-wallet` — Cadastro com Phantom
- `POST /api/auth/login` — Login email/senha
- `POST /api/auth/login-wallet` — Login com Phantom
- `GET /api/auth/me` — Dados do usuário

### Score
- `GET /api/score` — Buscar score
- `POST /api/score/calculate` — Calcular score
- `POST /api/score/simulate` — Simular com fontes selecionadas

### Imóveis
- `GET /api/properties` — Listar imóveis
- `GET /api/properties/{id}` — Detalhe do imóvel

### Contratos
- `GET /api/contracts` — Listar contratos (locatário)
- `POST /api/contracts` — Solicitar contrato
- `GET /api/landlord/properties` — Imóveis do proprietário
- `GET /api/landlord/contracts` — Contratos do proprietário
- `PATCH /api/landlord/contracts/{id}/accept` — Aceitar
- `PATCH /api/landlord/contracts/{id}/reject` — Recusar

### Fundo Garantidor
- `GET /api/fund/status` — Status do fundo
- `GET /api/fund/history` — Histórico de transações
- `POST /api/fund/deposit` — Depósito
- `POST /api/fund/claim` — Reivindicação
- `GET /api/fund/rules` — Regras do fundo

---

## Credenciais de Teste

### Locatário
| Campo | Valor |
|-------|-------|
| Email | `ana@aluno.ufc.br` |
| Senha | `123456` |
| Nome | Ana Beatriz Silva |
| Score | 720 (Bom) |

### Proprietário
| Campo | Valor |
|-------|-------|
| Email | `proprietario@email.com` |
| Senha | `123456` |
| Nome | Maria Oliveira |
| Imóveis | 6 em Quixadá, CE |

### Imóveis de Exemplo
| Imóvel | Bairro | Aluguel | AltScore |
|--------|--------|---------|----------|
| Apartamento 2 quartos | Centro | R$ 850 | Sim |
| Casa 3 quartos | Planalto Universitário | R$ 1.200 | Sim |
| Studio mobiliado | Centro | R$ 650 | Sim |
| Apartamento 3 quartos | Padre José Maria | R$ 1.100 | Não |
| Quarto em república | Centro | R$ 350 | Sim |
| Cobertura 2 quartos | Alto da Boa Vista | R$ 1.500 | Sim |

---

## Configuração de Ambiente

### Frontend (Vite)
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

### Backend (FastAPI)
```python
# app/config.py
SECRET_KEY = "altscore-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440
DATABASE_URL = "sqlite:///./altscore.db"
```

### Solana
```python
# app/services/solana.py
SOLANA_RPC = "https://api.devnet.solana.com"
PROGRAM_ID = "9muywZZ7xaLb9cLVrWd9iLnUe6asSMndQ2Z4NhZwXuzg"
```

---

## Comandos Úteis

### Frontend
```bash
cd frontend
npm install
npm run dev        # localhost:5173
npm run build      # Build produção
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py     # Popula banco
uvicorn app.main:app --reload  # localhost:8000
```

### Solana
```bash
cd altscore-solana
anchor build       # Compilar programa
anchor test        # Rodar testes
```

---

## Padrões de Código

### Frontend
- Componentes em `tsx` com TypeScript
- Estilização com TailwindCSS (cores: `petrol`, `mint`)
- Estado global com Zustand (`authStore`)
- Navegação com React Router v7
- Requisições via `api.ts` (wrapper do fetch)

### Backend
- Rotas com FastAPI (`APIRouter`)
- Models com SQLAlchemy (SQLite)
- Schemas com Pydantic
- Services para lógica de negócio
- JWT para autenticação

### Solana
- Programa Anchor em Rust
- Contas PDA para dados on-chain
- Instruções com validação
- Erros customizados

---

## Fluxo Principal

```
1. Usuário cria conta (email + CPF) ou conecta Phantom Wallet
2. Conecta fontes de dados (Pix, Assinaturas, Open Finance)
3. Score é calculado (0-1000) e registrado na Solana
4. Busca imóveis parceiros que aceitam AltScore
5. Verifica qualificação (score mínimo 500)
6. Solicita contrato de aluguel
7. Proprietário aceita/rejeita
8. Contrato é registrado na blockchain
9. Pagamentos são registrados on-chain
10. Fundo Garantidor cobre inadimplência (taxa 2.5%)
```

---

## Observações Importantes

1. **Modo Simulado**: Integrações com Solana estão em modo simulado para demo
2. **Score Social**: Valores simulados (em produção: APIs de verificação)
3. **Fundo Garantidor**: Smart contract implementado, dados simulados
4. **Banco SQLite**: Para desenvolvimento. Em produção, usar PostgreSQL
5. **Deploy**: Frontend na Vercel, Backend no Fly.io

---

## Contato

Projeto desenvolvido para o **Hackathon Universitário Superteam Brasil 2026**.

Repositório: `github.com/josiasdev/AltScore`
