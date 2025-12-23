use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateSettings<'info> {
    #[account(
        mut,
        seeds = [b"company", admin.key().as_ref()],
        bump = company.bump,
        has_one = admin
    )]
    pub company: Account<'info, Company>,

    pub admin: Signer<'info>,
}

pub fn exec_update_settings(ctx: Context<UpdateSettings>, new_name: Option<String>) -> Result<()> {
    let company = &mut ctx.accounts.company;

    if let Some(name) = new_name {
        company.name = name;
    }

    msg!("Company Settings Updated for: {}", company.name);
    Ok(())
}
