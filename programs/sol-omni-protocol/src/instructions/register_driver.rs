use crate::errors::OmniError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(name: String, license_no: String)]
pub struct RegisterDriver<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 32 + (4 + name.len()) + (4 + license_no.len()) + 1 + 1 + 1 + 1,
        seeds = [b"driver", driver_wallet.key().as_ref()],
        bump
    )]
    pub driver_profile: Account<'info, Driver>,

    #[account(
        mut,
        has_one = admin @ OmniError::Unauthorized,
        seeds = [b"company", admin.key().as_ref()],
        bump = company.bump
    )]
    pub company: Account<'info, Company>,

    pub driver_wallet: SystemAccount<'info>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn exec_register_driver(
    ctx: Context<RegisterDriver>,
    name: String,
    license_no: String,
) -> Result<()> {
    let driver = &mut ctx.accounts.driver_profile;
    let company = &mut ctx.accounts.company;

    require!(
        name.len() > 0 && license_no.len() > 0,
        OmniError::InvalidLocation
    );

    driver.company = company.key();
    driver.wallet = ctx.accounts.driver_wallet.key();
    driver.name = name;
    driver.license_no = license_no;
    driver.is_active = true;
    driver.is_sick = false;
    driver.rating = 5;
    driver.bump = ctx.bumps.driver_profile;
    company.total_drivers += 1;

    msg!(
        "Driver Registered: {} for Company: {}",
        driver.name,
        company.name
    );
    msg!("Total Drivers in Fleet: {}", company.total_drivers);

    Ok(())
}
