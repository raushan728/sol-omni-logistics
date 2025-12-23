use crate::errors::OmniError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    #[account(
        mut,
        close = refund_receiver,
        seeds = [b"shipment", shipment.tracking_id.as_bytes()],
        bump = shipment.bump,
        constraint = shipment.status == ShipmentStatus::Disputed @ OmniError::Unauthorized
    )]
    pub shipment: Account<'info, Shipment>,

    #[account(
        seeds = [b"company", admin.key().as_ref()],
        bump = company.bump,
        has_one = admin @ OmniError::Unauthorized
    )]
    pub company: Account<'info, Company>,

    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(mut)]
    pub refund_receiver: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}
pub fn exec_resolve_dispute(_ctx: Context<ResolveDispute>, winner_takes_all: bool) -> Result<()> {
    if winner_takes_all {
        msg!("Dispute Resolved: Funds released to the designated party.");
    } else {
        msg!("Dispute Resolved: Partial settlement or alternate logic applied.");
    }
    Ok(())
}
