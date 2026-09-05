# AltScore - Solana Program

**Programa Anchor para registro de scores e contratos na blockchain Solana.**

Contrato inteligente do AltScore que permite o registro de scores de crédito alternativo e contratos de aluguel na blockchain Solana.

## Stack

| Tecnologia | Versão |
|------------|--------|
| Rust | 2021 edition |
| Anchor | 1.2 |
| Solana | Devnet |

## Estrutura

```
altscore-solana/
├── programs/
│   └── altscore-solana/
│       └── src/
│           └── lib.rs        # Programa Anchor (4 instruções)
├── Anchor.toml               # Configuração Anchor
├── Cargo.toml                # Dependências Rust
├── Cargo.lock
└── rust-toolchain.toml       # Versão do Rust
```

## Instruções

### 1. register_score

Registra o score de um usuário na blockchain.

```rust
pub fn register_score(
    ctx: Context<RegisterScore>,
    score: u16,      // 0-1000
    level: String,   // "Excelente", "Bom", "Regular", "Iniciante"
) -> Result<()>
```

**Conta criada:** `ScoreAccount`
- `owner`: PublicKey do usuário
- `score`: Valor do score (0-1000)
- `level`: Nível do score
- `updated_at`: Timestamp da última atualização

### 2. update_score

Atualiza o score existente de um usuário.

```rust
pub fn update_score(
    ctx: Context<UpdateScore>,
    score: u16,
    level: String,
) -> Result<()>
```

### 3. create_contract

Cria um contrato de aluguel na blockchain.

```rust
pub fn create_contract(
    ctx: Context<CreateContract>,
    contract_id: u64,    // ID único do contrato
    rent_value: u64,     // Valor do aluguel em lamports
    landlord: Pubkey,    // PublicKey do proprietário
) -> Result<()>
```

**Conta criada:** `ContractAccount`
- `tenant`: PublicKey do inquilino
- `landlord`: PublicKey do proprietário
- `rent_value`: Valor do aluguel
- `contract_id`: ID do contrato
- `status`: Status (Active, Completed, Cancelled)
- `total_paid`: Total pago até o momento

### 4. record_payment

Registra um pagamento contra um contrato.

```rust
pub fn record_payment(
    ctx: Context<RecordPayment>,
    amount: u64,    // Valor pago em lamports
    month: u8,      // Mês (1-12)
    year: u16,      // Ano
) -> Result<()>
```

**Conta criada:** `PaymentAccount`
- `contract`: PublicKey do contrato
- `payer`: PublicKey de quem pagou
- `amount`: Valor pago
- `month`: Mês do pagamento
- `year`: Ano do pagamento
- `paid_at`: Timestamp do pagamento

## Contas (Accounts)

### ScoreAccount

| Campo | Tipo | Tamanho | Descrição |
|-------|------|---------|-----------|
| owner | Pubkey | 32 | Dono do score |
| score | u16 | 2 | Valor (0-1000) |
| level | String | 4+16 | Nível |
| updated_at | i64 | 8 | Timestamp |
| bump | u8 | 1 | PDA bump |

**Seeds:** `["score", owner.key()]`

### ContractAccount

| Campo | Tipo | Tamanho | Descrição |
|-------|------|---------|-----------|
| tenant | Pubkey | 32 | Inquilino |
| landlord | Pubkey | 32 | Proprietário |
| rent_value | u64 | 8 | Aluguel |
| contract_id | u64 | 8 | ID único |
| status | Enum | 1 | Active/Completed/Cancelled |
| total_paid | u64 | 8 | Total pago |
| created_at | i64 | 8 | Timestamp |
| bump | u8 | 1 | PDA bump |

**Seeds:** `["contract", contract_id.to_le_bytes()]`

### PaymentAccount

| Campo | Tipo | Tamanho | Descrição |
|-------|------|---------|-----------|
| contract | Pubkey | 32 | Contrato |
| payer | Pubkey | 32 | Quem pagou |
| amount | u64 | 8 | Valor |
| month | u8 | 1 | Mês |
| year | u16 | 2 | Ano |
| paid_at | i64 | 8 | Timestamp |
| bump | u8 | 1 | PDA bump |

**Seeds:** `["payment", contract.key(), month.to_le_bytes(), year.to_le_bytes()]`

## Setup

### Pré-requisitos

- [Rust](https://rustup.rs/) (stable)
- [Anchor CLI](https://www.anchor-lang.com/docs/installation)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)

### Instalação

```bash
# Instalar Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --force
avm install latest
avm use latest

# Instalar Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"
```

### Build

```bash
cd altscore-solana

# Compilar o programa
anchor build

# Verificar o programa
anchor verify
```

### Testes

```bash
# Rodar testes unitários
cargo test

# Rodar testes com Anchor
anchor test
```

### Deploy

```bash
# Conectar à devnet
solana config set --url devnet

# Airdrop SOL para deploy
solana airdrop 2

# Deploy do programa
anchor deploy
```

## Program ID

```
9muywZZ7xaLb9cLVrWd9iLnUe6asSMndQ2Z4NhZwXuzg
```

## Fluxo de Uso

### 1. Registro de Score

```
Usuário → register_score(score, level) → ScoreAccount criada
```

### 2. Atualização de Score

```
Backend → update_score(score, level) → ScoreAccount atualizada
```

### 3. Criação de Contrato

```
Inquilino → create_contract(contract_id, rent_value, landlord) → ContractAccount criada
```

### 4. Registro de Pagamento

```
Inquilino → record_payment(amount, month, year) → PaymentAccount criada + total_paid atualizado
```

## Segurança

- Todas as contas usam PDA (Program Derived Address)
- Apenas o owner pode atualizar seu score
- Apenas o tenant pode criar contratos
- Apenas o payer pode registrar pagamentos
- Validação de seeds e bumps

## Integração com Backend

O backend do AltScore integra com este programa via Solana CLI:

```python
# backend/app/services/solana.py
def register_score_on_chain(score: int, level: str) -> dict:
    # Chama a instrução register_score do programa
    ...

def create_contract_on_chain(contract_id: int, rent_value: int, landlord_pubkey: str) -> dict:
    # Chama a instrução create_contract do programa
    ...
```
