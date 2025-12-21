use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub mod errors;
pub mod constants;

use instructions::*;

declare_id!("tyWeb5FudPxigpWFYeCP9yKwYHBxsqB3jwJa6bjzTJn");

#[program]
pub mod sol_omni_protocol {
    use super::*;
}