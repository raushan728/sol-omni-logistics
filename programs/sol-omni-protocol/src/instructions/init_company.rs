use crate::errors::OmniError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitializeCompany<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 4 + name.len() + 4 + 50 + 8 + 4 + 8 + 1,
        seeds = [b"company", admin.key().as_ref()], 
        bump
    )]
    pub company: Account<'info, Company>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn exec_init_company(
    ctx: Context<InitializeCompany>,
    name: String,
    reg_id: String,
) -> Result<()> {
    let company = &mut ctx.accounts.company;

    require!(name.len() > 0, OmniError::InvalidLocation);

    company.admin = ctx.accounts.admin.key();
    company.name = name;
    company.registration_id = reg_id;
    company.gas_tank_balance = 0;
    company.total_drivers = 0;
    company.total_shipments = 0;
    company.bump = ctx.bumps.company;

    msg!("Company Registered: {}", company.name);
    Ok(())
}
