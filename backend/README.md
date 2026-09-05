# AltScore - Backend

**API REST para o sistema de score de crédito alternativo.**

Backend do AltScore desenvolvido com Python, FastAPI e SQLAlchemy.

## Stack

| Tecnologia | Versão |
|------------|--------|
| Python | 3.11+ |
| FastAPI | 0.115 |
| SQLAlchemy | 2.0 |
| SQLite | - |
| Pydantic | 2.0 |
| python-jose | JWT |
| passlib | bcrypt |

## Estrutura

```
backend/
├── app/
│   ├── main.py            # Entrada da aplicação FastAPI
│   ├── config.py          # Variáveis de ambiente
│   ├── database.py        # Configuração SQLAlchemy
│   ├── models/
│   │   └── user.py        # Models: User, Property, Score, Contract
│   ├── schemas/
│   │   ├── user.py        # Schemas: UserCreate, UserLogin, UserResponse, WalletLogin
│   │   ├── score.py       # Schemas: ScoreResponse, ScoreBreakdown, ScoreSimulate
│   │   ├── property.py    # Schemas: PropertyResponse
│   │   └── contract.py    # Schemas: ContractCreate, ContractResponse
│   ├── routes/
│   │   ├── auth.py        # Autenticação (register, login, wallet)
│   │   ├── score.py       # Score (get, calculate, simulate)
│   │   ├── properties.py  # Imóveis (list, get)
│   │   ├── contracts.py   # Contratos locatário (list, create)
│   │   └── landlord.py    # Contratos proprietário (list, accept, reject)
│   ├── services/
│   │   ├── score_engine.py # Engine de cálculo do score
│   │   └── solana.py      # Integração com blockchain Solana
│   └── utils/
│       └── crypto.py      # JWT + bcrypt
├── seed.py                # Popula banco com dados de exemplo
├── requirements.txt       # Dependências
├── Dockerfile             # Container para deploy
├── fly.toml               # Configuração Fly.io
└── altscore.db            # Banco SQLite (desenvolvimento)
```

## Setup

```bash
# Criar ambiente virtual
python -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Popular banco com dados de exemplo
python seed.py

# Iniciar servidor de desenvolvimento
uvicorn app.main:app --reload
```

O servidor inicia em `http://localhost:8000`.

## Endpoints

### Auth

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/auth/register` | Cadastro com email/senha/CPF |
| `POST` | `/api/auth/register-wallet` | Cadastro com Phantom Wallet |
| `POST` | `/api/auth/login` | Login com email/senha |
| `POST` | `/api/auth/login-wallet` | Login com Phantom Wallet |
| `GET` | `/api/auth/me` | Dados do usuário logado |

### Score

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/score` | Buscar score do usuário |
| `POST` | `/api/score/calculate` | Calcular score com todas as fontes |
| `POST` | `/api/score/simulate` | Simular score com fontes selecionadas |

### Imóveis

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/properties` | Listar todos os imóveis |
| `GET` | `/api/properties/{id}` | Detalhe do imóvel |

### Contratos (Locatário)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/contracts` | Listar contratos do locatário |
| `POST` | `/api/contracts` | Solicitar contrato |

### Contratos (Proprietário)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/landlord/properties` | Imóveis do proprietário |
| `GET` | `/api/landlord/contracts` | Contratos dos imóveis |
| `PATCH` | `/api/landlord/contracts/{id}/accept` | Aceitar contrato |
| `PATCH` | `/api/landlord/contracts/{id}/reject` | Recusar contrato |

## Score Engine

O score é calculado com base em 4 fatores:

| Fator | Peso | Faixa | Fonte de Dados |
|-------|------|-------|----------------|
| Histórico de Pagamento | 40% | 0-400 | Pix, transações |
| Consistência de Renda | 25% | 0-250 | Open Finance |
| Dados Financeiros | 20% | 0-200 | Open Finance |
| Avaliação Social | 15% | 0-150 | Dados alternativos |

### Níveis

| Score | Nível |
|-------|-------|
| 800+ | Excelente |
| 600-799 | Bom |
| 400-599 | Regular |
| < 400 | Iniciante |

## Integração Solana

O backend integra com a blockchain Solana Devnet para:
- Registrar scores na chain
- Criar contratos na chain
- Registrar pagamentos

A integração está em modo simulado para fins de demonstração.

## Deploy

### Fly.io

```bash
fly auth login
fly launch
fly deploy
```

O `fly.toml` configura:
- Região: GRU (São Paulo)
- RAM: 256MB
- CPU: shared

### Docker

```bash
docker build -t altscore-backend .
docker run -p 8000:8000 altscore-backend
```

## Dados de Exemplo

O `seed.py` popula o banco com:

### Usuários

| Tipo | Email | Senha | Nome |
|------|-------|-------|------|
| Locatário | ana@aluno.ufc.br | 123456 | Ana Beatriz Silva |
| Proprietário | proprietario@email.com | 123456 | Maria Oliveira |

### Imóveis

| Imóvel | Bairro | Aluguel | AltScore |
|--------|--------|---------|----------|
| Apartamento 2 quartos | Centro | R$ 850 | Sim |
| Casa 3 quartos | Planalto Universitário | R$ 1.200 | Sim |
| Studio mobiliado | Centro | R$ 650 | Sim |
| Apartamento 3 quartos | Padre José Maria | R$ 1.100 | Não |
| Quarto em república | Centro | R$ 350 | Sim |
| Cobertura 2 quartos | Alto da Boa Vista | R$ 1.500 | Sim |
