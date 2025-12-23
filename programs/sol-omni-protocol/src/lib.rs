use anchor_lang::prelude::*;
pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;
use crate::instructions::*;

declare_id!("tyWeb5FudPxigpWFYeCP9yKwYHBxsqB3jwJa6bjzTJn");

#[program]
pub mod sol_omni_protocol {
    use super::*;

    pub fn initialize_company(
        ctx: Context<InitializeCompany>,
        name: String,
        reg_id: String,
    ) -> Result<()> {
        instructions::init_company::exec_init_company(ctx, name, reg_id)
    }

    pub fn register_driver(
        ctx: Context<RegisterDriver>,
        name: String,
        license_no: String,
    ) -> Result<()> {
        instructions::register_driver::exec_register_driver(ctx, name, license_no)
    }

    pub fn create_shipment(
        ctx: Context<CreateShipment>,
        tracking_id: String,
        price: u64,
    ) -> Result<()> {
        instructions::create_shipment::exec_create_shipment(ctx, tracking_id, price)
    }
    pub fn update_location(ctx: Context<UpdateLocation>, lat: f64, lng: f64) -> Result<()> {
        instructions::update_location::exec_update_location(ctx, lat, lng)
    }

    pub fn emergency_swap(ctx: Context<EmergencySwap>) -> Result<()> {
        instructions::emergency_swap::exec_emergency_swap(ctx)
    }
     pub fn confirm_delivery(ctx: Context<ConfirmDelivery>) -> Result<()> {
        instructions::confirm_delivery::exec_confirm_delivery(ctx)
    }

    pub fn deposit_gas(ctx: Context<DepositToGasTank>, amount: u64) -> Result<()> {
        instructions::deposit_to_gas_tank::exec_deposit_to_gas_tank(ctx, amount)
    }
}
