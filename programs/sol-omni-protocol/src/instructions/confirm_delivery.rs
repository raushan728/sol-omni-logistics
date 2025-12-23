use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::OmniError;

#[derive(Accounts)]
pub struct ConfirmDelivery<'info> {
    // Close the shipment account and transfer the balance to admin
    #[account(
        mut,
        close = admin, 
        seeds = [b"shipment", shipment.tracking_id.as_bytes()],
        bump = shipment.bump,
        constraint = shipment.status != ShipmentStatus::Delivered @ OmniError::AlreadyDelivered
    )]
    pub shipment: Account<'info, Shipment>,

    #[account(
        mut,
        seeds = [b"company", admin.key().as_ref()],
        bump = company.bump
    )]
    pub company: Account<'info, Company>,

    /// CHECK: Receiver of the shipment
    #[account(
        mut,
        address = shipment.receiver @ OmniError::Unauthorized
    )]
    pub receiver: Signer<'info>,

    #[account(mut)]
    pub admin: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn exec_confirm_delivery(ctx: Context<ConfirmDelivery>) -> Result<()> {
    let shipment = &mut ctx.accounts.shipment;
    shipment.status = ShipmentStatus::Delivered;
    msg!("DELIVERY CONFIRMED!");
    msg!("Tracking ID: {}", shipment.tracking_id);
    msg!("Payment Released to Admin: {} lamports", shipment.price);
    Ok(())
}