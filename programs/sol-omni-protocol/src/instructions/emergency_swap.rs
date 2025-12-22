use crate::errors::OmniError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct EmergencySwap<'info> {
    #[account(mut)]
    pub shipment: Account<'info, Shipment>,

    #[account(
        seeds = [b"company", admin.key().as_ref()],
        bump = company.bump,
        has_one = admin @ OmniError::Unauthorized
    )]
    pub company: Account<'info, Company>,

    #[account(
        seeds = [b"driver", new_driver_wallet.key().as_ref()],
        bump = new_driver_profile.bump,
        constraint = new_driver_profile.company == company.key() @ OmniError::Unauthorized
    )]
    pub new_driver_profile: Account<'info, Driver>,

    /// CHECK: Wallet of new driver
    pub new_driver_wallet: AccountInfo<'info>,

    #[account(mut)]
    pub admin: Signer<'info>,
}

pub fn exec_emergency_swap(ctx: Context<EmergencySwap>) -> Result<()> {
    let shipment = &mut ctx.accounts.shipment;
    let new_driver = &ctx.accounts.new_driver_wallet;
    let company = &ctx.accounts.company;
    require!(shipment.company == company.key(), OmniError::Unauthorized);
    shipment.status = ShipmentStatus::HandoverProcess;
    let old_driver = shipment.current_driver;
    shipment.current_driver = new_driver.key();
    shipment.status = ShipmentStatus::InTransit;
    shipment.last_update_timestamp = Clock::get()?.unix_timestamp;

    msg!("EMERGENCY SWAP SUCCESSFUL");
    msg!("Old Driver: {}", old_driver);
    msg!("New Driver: {}", shipment.current_driver);

    Ok(())
}
