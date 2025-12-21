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
    use crate::instructions::*;

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
}
