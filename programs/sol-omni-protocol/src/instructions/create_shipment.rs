use crate::errors::OmniError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(tracking_id: String, price: u64)]
pub struct CreateShipment<'info> {
    #[account(
        init,
        payer = sender,
        space = 8 + 32 + 32 + 32 + 32 + (4 + tracking_id.len()) + 1 + 8 + 8 + 8 + 1,
        seeds = [b"shipment", tracking_id.as_bytes()],
        bump
    )]
    pub shipment: Account<'info, Shipment>,

    #[account(
        mut,
        seeds = [b"company", sender.key().as_ref()],
        bump = company.bump
    )]
    pub company: Account<'info, Company>,

    #[account(mut)]
    pub sender: Signer<'info>,

    pub receiver: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn exec_create_shipment(
    ctx: Context<CreateShipment>,
    tracking_id: String,
    price: u64,
) -> Result<()> {
    let shipment = &mut ctx.accounts.shipment;
    let company = &mut ctx.accounts.company;

    require!(tracking_id.len() > 0, OmniError::InvalidLocation);
    require!(price > 0, OmniError::Unauthorized);
    shipment.company = company.key();
    shipment.creator = ctx.accounts.sender.key();
    shipment.receiver = ctx.accounts.receiver.key();
    shipment.tracking_id = tracking_id;
    shipment.status = ShipmentStatus::Created;
    shipment.price = price;
    shipment.location_lat = 0.0;
    shipment.location_lng = 0.0;
    shipment.last_update_timestamp = Clock::get()?.unix_timestamp;
    shipment.bump = ctx.bumps.shipment;
    company.total_shipments += 1;
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        anchor_lang::system_program::Transfer {
            from: ctx.accounts.sender.to_account_info(),
            to: shipment.to_account_info(),
        },
    );
    anchor_lang::system_program::transfer(cpi_context, price)?;

    msg!("Shipment Created: {}", shipment.tracking_id);
    msg!("Funds Locked in Escrow: {} lamports", price);

    Ok(())
}
