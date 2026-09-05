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
}

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
