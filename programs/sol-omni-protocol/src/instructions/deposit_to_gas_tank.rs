use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct DepositToGasTank<'info> {
    #[account(
        mut,
        seeds = [b"company", admin.key().as_ref()],
        bump = company.bump,
        has_one = admin
    )]
    pub company: Account<'info, Company>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn exec_deposit_to_gas_tank(ctx: Context<DepositToGasTank>, amount: u64) -> Result<()> {
    let company = &mut ctx.accounts.company;

    // Transfer SOL from Admin to Company Account (PDA)
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        anchor_lang::system_program::Transfer {
            from: ctx.accounts.admin.to_account_info(),
            to: company.to_account_info(),
        },
    );
    anchor_lang::system_program::transfer(cpi_context, amount)?;

    // Update the on-chain balance tracker
    company.gas_tank_balance += amount;

    msg!("Gas Tank Refilled: {} lamports", amount);
    msg!("Current Gas Balance: {}", company.gas_tank_balance);

    Ok(())
}
