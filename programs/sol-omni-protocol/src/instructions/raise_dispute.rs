use crate::errors::OmniError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct RaiseDispute<'info> {
    #[account(mut)]
    pub shipment: Account<'info, Shipment>,

    #[account(
        mut,
        address = shipment.receiver @ OmniError::Unauthorized
    )]
    pub receiver: Signer<'info>,
}

pub fn exec_raise_dispute(ctx: Context<RaiseDispute>, reason_hash: String) -> Result<()> {
    let shipment = &mut ctx.accounts.shipment;
    require!(
        shipment.status == ShipmentStatus::InTransit || shipment.status == ShipmentStatus::Created,
        OmniError::Unauthorized
    );

    shipment.status = ShipmentStatus::Disputed;

    msg!("DISPUTE RAISED for Shipment: {}", shipment.tracking_id);
    msg!("Reason Proof (IPFS): {}", reason_hash);

    Ok(())
}
