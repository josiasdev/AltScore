# AltScore

**Score de crédito alternativo para plataformas de aluguel. Alugue sem fiador.**

O AltScore é uma solução de score de crédito alternativo que conecta inquilinos a imóveis. Utiliza dados reais de pagamento para gerar um score (0-1000) registrado na blockchain Solana, aceito em plataformas como QuintoAndar, Zap Imóveis e VivaReal.

## O Problema

- **46,5 milhões** de brasileiros vivem de aluguel
- **1 em cada 4** jovens de 25-34 anos moram com os pais
- **Renda 3x** é exigida para alugar sem fiador
- Sistema tradicional de crédito exclui informais e jovens

## A Solução

O AltScore coleta dados reais de pagamento (Pix, assinaturas, open finance) e gera um score alternativo de 0 a 1000 que serve como garantia para aluguel. Tudo registrado na blockchain Solana para transparência e portabilidade.

**O AltScore não é uma plataforma de aluguel** — é uma solução de score que integra com plataformas existentes.

## Stack

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| **Frontend** | React + Vite + TypeScript + TailwindCSS | 19.2 / 8.2 / 6.0 / 4.3 |
| **Backend** | Python + FastAPI + SQLAlchemy + SQLite | 3.11+ / 0.115 / 2.0 |
| **Blockchain** | Solana Devnet + Anchor + Rust | 1.2 / 2021 |
| **Deploy** | Vercel (frontend) + Fly.io (backend) | - |

## Funcionalidades

### 7 Telas Principais

| Tela | Rota | Descrição |
|------|------|-----------|
| **Landing** | `/` | Hero, dados mercado, como funciona, parceiros |
| **Login** | `/login` | Email/senha + Phantom Wallet |
| **Cadastro** | `/cadastro` | CPF, seleção locatário/proprietário |
| **Dashboard** | `/dashboard` | Score, fontes conectadas, contratos |
| **Score** | `/score` | Breakdown detalhado, simulador, badges |
| **Imóveis** | `/imoveis` | Lista parceiros com filtros |
| **Contrato** | `/contratos/:id` | Status, pagamentos, score tempo real |

### Para Inquilinos

- Cadastro com CPF e wallet Phantom
- Score alternativo (0-1000) com 4 fatores:
  - **Pagamento** (40%): Histórico via Pix
  - **Renda** (25%): Estabilidade via open finance
  - **Financeiro** (20%): Comportamento financeiro
  - **Social** (15%): Referências, estabilidade, comunidade, presença digital
- Simulador: "Conecte mais fontes para aumentar seu score"
- Badges de conquista na blockchain
- Verificação de qualificação para imóveis

### Para Proprietários

- Dashboard com imóveis e contratos
- Aceitar ou recusar solicitações
- Acompanhamento de pagamentos

### Para Plataformas de Aluguel

- Integração via API
- Score verificável na blockchain
- Redução de inadimplência
- Acesso a público excluído

## Parceiros

Plataformas que aceitam AltScore:
- QuintoAndar
- Zap Imóveis
- VivaReal
- ImovelWeb
- OLX

## Estrutura do Projeto

```
altscore/
├── frontend/                  # React + Vite (7 telas)
├── backend/                   # FastAPI (API REST)
├── altscore-solana/           # Programa Anchor (blockchain)
├── vercel.json                # Deploy frontend
└── render.yaml                # Deploy backend
```

Documentação detalhada em cada pasta:
- [frontend/README.md](frontend/README.md)
- [backend/README.md](backend/README.md)
- [altscore-solana/README.md](altscore-solana/README.md)

## Setup Rápido

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py     # Popula banco
uvicorn app.main:app --reload  # http://localhost:8000
```

### Programa Solana

```bash
cd altscore-solana
anchor build
anchor test
```

## Credenciais de Teste

### Locatário
| Campo | Valor |
|-------|-------|
| Email | `ana@aluno.ufc.br` |
| Senha | `123456` |
| Score | 720 (Bom) |

### Proprietário
| Campo | Valor |
|-------|-------|
| Email | `proprietario@email.com` |
| Senha | `123456` |
| Imóveis | 6 em Quixadá, CE |

## Deploy

### Vercel (Frontend)

```bash
vercel --prod
```

### Fly.io (Backend)

```bash
fly deploy
```

## Participantes

Desenvolvido para o **Hackathon Universitário Superteam Brasil 2026**.

## Licença

MIT
