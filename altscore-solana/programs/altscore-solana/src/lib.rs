use anchor_lang::prelude::*;

declare_id!("9muywZZ7xaLb9cLVrWd9iLnUe6asSMndQ2Z4NhZwXuzg");

#[program]
pub mod altscore_solana {
    use super::*;

    pub fn register_score(
        ctx: Context<RegisterScore>,
        score: u16,
        level: String,
    ) -> Result<()> {
        let score_account = &mut ctx.accounts.score_account;
        score_account.owner = ctx.accounts.owner.key();
        score_account.score = score;
        score_account.level = level;
        score_account.updated_at = Clock::get()?.unix_timestamp;
        score_account.bump = ctx.bumps.score_account;

        msg!("Score registered: {} ({})", score, score_account.level);
        Ok(())
    }

    pub fn update_score(
        ctx: Context<UpdateScore>,
        score: u16,
        level: String,
    ) -> Result<()> {
        let score_account = &mut ctx.accounts.score_account;
        score_account.score = score;
        score_account.level = level;
        score_account.updated_at = Clock::get()?.unix_timestamp;

        msg!("Score updated: {} ({})", score, score_account.level);
        Ok(())
    }

    pub fn create_contract(
        ctx: Context<CreateContract>,
        contract_id: u64,
        rent_value: u64,
        landlord: Pubkey,
    ) -> Result<()> {
        let contract_account = &mut ctx.accounts.contract_account;
        contract_account.tenant = ctx.accounts.tenant.key();
        contract_account.landlord = landlord;
        contract_account.rent_value = rent_value;
        contract_account.contract_id = contract_id;
        contract_account.status = ContractStatus::Active;
        contract_account.created_at = Clock::get()?.unix_timestamp;
        contract_account.bump = ctx.bumps.contract_account;

        msg!("Contract {} created", contract_id);
        Ok(())
    }

    pub fn record_payment(
        ctx: Context<RecordPayment>,
        amount: u64,
        month: u8,
        year: u16,
    ) -> Result<()> {
        let payment_account = &mut ctx.accounts.payment_account;
        payment_account.contract = ctx.accounts.contract_account.key();
        payment_account.payer = ctx.accounts.payer.key();
        payment_account.amount = amount;
        payment_account.month = month;
        payment_account.year = year;
        payment_account.paid_at = Clock::get()?.unix_timestamp;
        payment_account.bump = ctx.bumps.payment_account;

        let contract_account = &mut ctx.accounts.contract_account;
        contract_account.total_paid += amount;

        msg!("Payment recorded: ${} for {}/{}", amount, month, year);
        Ok(())
    }

    // ==================== FUNDO GARANTIDOR ====================

    /// Inicializa o fundo garantidor global da AltScore
    /// Apenas o admin (programa) pode criar
    pub fn initialize_fund(
        ctx: Context<InitializeFund>,
        admin: Pubkey,
        coverage_limit: u64,      // Limite máximo de cobertura por contrato (em lamports)
        fee_percentage: u16,      // Taxa de administração (ex: 250 = 2.5%)
        min_score_required: u16,  // Score mínimo para acesso ao fundo
    ) -> Result<()> {
        let fund_account = &mut ctx.accounts.fund_account;
        fund_account.admin = admin;
        fund_account.total_deposits = 0;
        fund_account.total_coverage_used = 0;
        fund_account.coverage_limit = coverage_limit;
        fund_account.fee_percentage = fee_percentage;
        fund_account.min_score_required = min_score_required;
        fund_account.is_active = true;
        fund_account.created_at = Clock::get()?.unix_timestamp;
        fund_account.bump = ctx.bumps.fund_account;

        msg!("Fund initialized: coverage_limit={}, fee={}bps", coverage_limit, fee_percentage);
        Ok(())
    }

    /// Usuário deposita SOL no fundo garantidor
    /// Recebe proporcional de tokens de governança (futuro)
    pub fn deposit_to_fund(
        ctx: Context<DepositToFund>,
        amount: u64,
    ) -> Result<()> {
        let fund_account = &mut ctx.accounts.fund_account;
        let depositor_account = &mut ctx.accounts.depositor_account;

        // Verificar se o fundo está ativo
        require!(fund_account.is_active, ErrorCode::FundNotActive);

        // Transferir SOL do depositante para o fundo
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.depositor.key(),
            &ctx.accounts.fund_vault.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.depositor.to_account_info(),
                ctx.accounts.fund_vault.to_account_info(),
            ],
        )?;

        // Atualizar contadores
        fund_account.total_deposits += amount;
        depositor_account.owner = ctx.accounts.depositor.key();
        depositor_account.total_deposited += amount;
        depositor_account.last_deposit_at = Clock::get()?.unix_timestamp;
        depositor_account.bump = ctx.bumps.depositor_account;

        msg!("Deposit recorded: {} lamports", amount);
        Ok(())
    }

    /// Reivindicação de cobertura do fundo
    /// Quando um inquilino não paga, o proprietário pode reivindicar
    pub fn claim_coverage(
        ctx: Context<ClaimCoverage>,
        claim_amount: u64,
        reason: String,
    ) -> Result<()> {
        let fund_account = &mut ctx.accounts.fund_account;
        let contract_account = &ctx.accounts.contract_account;
        let claim_account = &mut ctx.accounts.claim_account;

        // Verificar se o fundo está ativo
        require!(fund_account.is_active, ErrorCode::FundNotActive);

        // Verificar se o contrato está ativo
        require!(
            contract_account.status == ContractStatus::Active,
            ErrorCode::ContractNotActive
        );

        // Verificar se o claim é menor ou igual ao aluguel
        require!(
            claim_amount <= contract_account.rent_value,
            ErrorCode::ClaimExceedsRent
        );

        // Verificar se há saldo disponível no fundo
        let available_balance = fund_account.total_deposits
            .checked_sub(fund_account.total_coverage_used)
            .ok_or(ErrorCode::InsufficientFundBalance)?;

        require!(
            claim_amount <= available_balance,
            ErrorCode::InsufficientFundBalance
        );

        // Calcular taxa de administração
        let fee = (claim_amount as u128)
            .checked_mul(fund_account.fee_percentage as u128)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_div(10000)
            .ok_or(ErrorCode::MathOverflow)? as u64;

        let payout = claim_amount.checked_sub(fee).ok_or(ErrorCode::MathOverflow)?;

        // Transferir SOL do fundo para o proprietário (menos a taxa)
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.fund_vault.key(),
            &ctx.accounts.claimant.key(),
            payout,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.fund_vault.to_account_info(),
                ctx.accounts.claimant.to_account_info(),
            ],
        )?;

        // Registrar a claim
        claim_account.contract = contract_account.key();
        claim_account.claimant = ctx.accounts.claimant.key();
        claim_account.amount = claim_amount;
        claim_account.fee = fee;
        claim_account.payout = payout;
        claim_account.reason = reason;
        claim_account.status = ClaimStatus::Approved;
        claim_account.created_at = Clock::get()?.unix_timestamp;
        claim_account.bump = ctx.bumps.claim_account;

        // Atualizar fundo
        fund_account.total_coverage_used += claim_amount;

        msg!("Coverage claimed: {} lamports (fee: {}, payout: {})", claim_amount, fee, payout);
        Ok(())
    }

    /// Admin pausa/retoma o fundo
    pub fn toggle_fund_status(
        ctx: Context<ToggleFundStatus>,
    ) -> Result<()> {
        let fund_account = &mut ctx.accounts.fund_account;
        fund_account.is_active = !fund_account.is_active;

        msg!("Fund status toggled: {}", fund_account.is_active);
        Ok(())
    }

    /// Admin atualiza parâmetros do fundo
    pub fn update_fund_params(
        ctx: Context<UpdateFundParams>,
        coverage_limit: Option<u64>,
        fee_percentage: Option<u16>,
        min_score_required: Option<u16>,
    ) -> Result<()> {
        let fund_account = &mut ctx.accounts.fund_account;

        if let Some(limit) = coverage_limit {
            fund_account.coverage_limit = limit;
        }
        if let Some(fee) = fee_percentage {
            fund_account.fee_percentage = fee;
        }
        if let Some(min_score) = min_score_required {
            fund_account.min_score_required = min_score;
        }

        msg!("Fund params updated");
        Ok(())
    }
}

// ==================== CONTEXTS ====================

#[derive(Accounts)]
pub struct RegisterScore<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = 8 + ScoreAccount::INIT_SPACE,
        seeds = [b"score", owner.key().as_ref()],
        bump
    )]
    pub score_account: Account<'info, ScoreAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateScore<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [b"score", owner.key().as_ref()],
        bump = score_account.bump,
        has_one = owner,
    )]
    pub score_account: Account<'info, ScoreAccount>,
}

#[derive(Accounts)]
#[instruction(contract_id: u64)]
pub struct CreateContract<'info> {
    #[account(mut)]
    pub tenant: Signer<'info>,

    #[account(
        init,
        payer = tenant,
        space = 8 + ContractAccount::INIT_SPACE,
        seeds = [b"contract", &contract_id.to_le_bytes()],
        bump
    )]
    pub contract_account: Account<'info, ContractAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(amount: u64, month: u8, year: u16)]
pub struct RecordPayment<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"contract", &contract_account.contract_id.to_le_bytes()],
        bump = contract_account.bump,
    )]
    pub contract_account: Account<'info, ContractAccount>,

    #[account(
        init,
        payer = payer,
        space = 8 + PaymentAccount::INIT_SPACE,
        seeds = [
            b"payment",
            contract_account.key().as_ref(),
            &month.to_le_bytes(),
            &year.to_le_bytes(),
        ],
        bump
    )]
    pub payment_account: Account<'info, PaymentAccount>,

    pub system_program: Program<'info, System>,
}

// ==================== FUNDO GARANTIDOR CONTEXTS ====================

#[derive(Accounts)]
pub struct InitializeFund<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        space = 8 + FundAccount::INIT_SPACE,
        seeds = [b"fund"],
        bump
    )]
    pub fund_account: Account<'info, FundAccount>,

    /// CHECK: Vault PDA que segura os SOL do fundo
    #[account(
        mut,
        seeds = [b"fund_vault"],
        bump
    )]
    pub fund_vault: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositToFund<'info> {
    #[account(mut)]
    pub depositor: Signer<'info>,

    #[account(
        mut,
        seeds = [b"fund"],
        bump = fund_account.bump,
    )]
    pub fund_account: Account<'info, FundAccount>,

    #[account(
        init_if_needed,
        payer = depositor,
        space = 8 + DepositorAccount::INIT_SPACE,
        seeds = [b"depositor", depositor.key().as_ref()],
        bump
    )]
    pub depositor_account: Account<'info, DepositorAccount>,

    /// CHECK: Vault PDA que segura os SOL do fundo
    #[account(
        mut,
        seeds = [b"fund_vault"],
        bump
    )]
    pub fund_vault: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(claim_amount: u64, reason: String)]
pub struct ClaimCoverage<'info> {
    #[account(mut)]
    pub claimant: Signer<'info>,

    #[account(
        mut,
        seeds = [b"fund"],
        bump = fund_account.bump,
    )]
    pub fund_account: Account<'info, FundAccount>,

    #[account(
        seeds = [b"contract", &contract_account.contract_id.to_le_bytes()],
        bump = contract_account.bump,
    )]
    pub contract_account: Account<'info, ContractAccount>,

    #[account(
        init,
        payer = claimant,
        space = 8 + ClaimAccount::INIT_SPACE,
        seeds = [
            b"claim",
            contract_account.key().as_ref(),
            &Clock::get()?.unix_timestamp.to_le_bytes(),
        ],
        bump
    )]
    pub claim_account: Account<'info, ClaimAccount>,

    /// CHECK: Vault PDA que segura os SOL do fundo
    #[account(
        mut,
        seeds = [b"fund_vault"],
        bump
    )]
    pub fund_vault: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ToggleFundStatus<'info> {
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [b"fund"],
        bump = fund_account.bump,
        has_one = admin,
    )]
    pub fund_account: Account<'info, FundAccount>,
}

#[derive(Accounts)]
pub struct UpdateFundParams<'info> {
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [b"fund"],
        bump = fund_account.bump,
        has_one = admin,
    )]
    pub fund_account: Account<'info, FundAccount>,
}

// ==================== ACCOUNTS ====================

#[account]
#[derive(InitSpace)]
pub struct ScoreAccount {
    pub owner: Pubkey,        // 32
    pub score: u16,           // 2
    #[max_len(16)]
    pub level: String,        // 4 + 16
    pub updated_at: i64,      // 8
    pub bump: u8,             // 1
}

#[account]
#[derive(InitSpace)]
pub struct ContractAccount {
    pub tenant: Pubkey,       // 32
    pub landlord: Pubkey,     // 32
    pub rent_value: u64,      // 8
    pub contract_id: u64,     // 8
    pub status: ContractStatus, // 1
    pub total_paid: u64,      // 8
    pub created_at: i64,      // 8
    pub bump: u8,             // 1
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum ContractStatus {
    Active,
    Completed,
    Cancelled,
}

#[account]
#[derive(InitSpace)]
pub struct PaymentAccount {
    pub contract: Pubkey,     // 32
    pub payer: Pubkey,        // 32
    pub amount: u64,          // 8
    pub month: u8,            // 1
    pub year: u16,            // 2
    pub paid_at: i64,         // 8
    pub bump: u8,             // 1
}

// ==================== FUNDO GARANTIDOR ACCOUNTS ====================

#[account]
#[derive(InitSpace)]
pub struct FundAccount {
    pub admin: Pubkey,                    // 32 - Admin do fundo
    pub total_deposits: u64,              // 8 - Total depositado
    pub total_coverage_used: u64,         // 8 - Total de cobertura utilizada
    pub coverage_limit: u64,              // 8 - Limite máximo por contrato
    pub fee_percentage: u16,              // 2 - Taxa em basis points (250 = 2.5%)
    pub min_score_required: u16,          // 2 - Score mínimo para acesso
    pub is_active: bool,                  // 1 - Fundo ativo/inativo
    pub created_at: i64,                  // 8 - Data de criação
    pub bump: u8,                         // 1
}

#[account]
#[derive(InitSpace)]
pub struct DepositorAccount {
    pub owner: Pubkey,                    // 32 - Dono da conta
    pub total_deposited: u64,             // 8 - Total depositado
    pub last_deposit_at: i64,             // 8 - Último depósito
    pub bump: u8,                         // 1
}

#[account]
#[derive(InitSpace)]
pub struct ClaimAccount {
    pub contract: Pubkey,                 // 32 - Contrato relacionado
    pub claimant: Pubkey,                 // 32 - Quem reivindicou
    pub amount: u64,                      // 8 - Valor reivindicado
    pub fee: u64,                         // 8 - Taxa cobrada
    pub payout: u64,                      // 8 - Valor pago
    #[max_len(128)]
    pub reason: String,                   // 4 + 128 - Motivo da claim
    pub status: ClaimStatus,              // 1 - Status da claim
    pub created_at: i64,                  // 8 - Data da claim
    pub bump: u8,                         // 1
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum ClaimStatus {
    Pending,
    Approved,
    Rejected,
    Paid,
}

// ==================== ERRORS ====================

#[error_code]
pub enum ErrorCode {
    #[msg("Fundo não está ativo")]
    FundNotActive,

    #[msg("Contrato não está ativo")]
    ContractNotActive,

    #[msg("Valor excede o aluguel")]
    ClaimExceedsRent,

    #[msg("Saldo insuficiente no fundo")]
    InsufficientFundBalance,

    #[msg("Erro de overflow matemático")]
    MathOverflow,

    #[msg("Score mínimo não atingido")]
    ScoreNotMinimum,

    #[msg("Não autorizado")]
    Unauthorized,
}
