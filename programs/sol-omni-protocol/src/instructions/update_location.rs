use crate::errors::OmniError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateLocation<'info> {
    #[account(mut)]
    pub shipment: Account<'info, Shipment>,

    #[account(
        seeds = [b"driver", driver_wallet.key().as_ref()],
        bump = driver_profile.bump,
        constraint = driver_profile.is_active @ OmniError::Unauthorized,
        constraint = driver_profile.is_sick == false @ OmniError::DriverIsSick,
    )]
    pub driver_profile: Account<'info, Driver>,

    #[account(mut)]
    pub driver_wallet: Signer<'info>,
}

pub fn exec_update_location(ctx: Context<UpdateLocation>, lat: f64, lng: f64) -> Result<()> {
    let shipment = &mut ctx.accounts.shipment;
    let driver_wallet = &ctx.accounts.driver_wallet;
    require!(
        shipment.current_driver == driver_wallet.key(),
        OmniError::Unauthorized
    );
    if shipment.status == ShipmentStatus::Created {
        shipment.status = ShipmentStatus::InTransit;
    }
    shipment.location_lat = lat;
    shipment.location_lng = lng;
    shipment.last_update_timestamp = Clock::get()?.unix_timestamp;

    msg!("Tracking Updated: Lat {}, Lng {}", lat, lng);
    Ok(())
}
