use anchor_lang::prelude::*;

#[constant]
pub const SEED_COMPANY: &[u8] = b"company";

#[constant]
pub const SEED_DRIVER: &[u8] = b"driver";

#[constant]
pub const SEED_SHIPMENT: &[u8] = b"shipment";

pub const PLATFORM_FEE_PERCENT: u64 = 5;
pub const DISCRIMINATOR_SIZE: usize = 8;
pub const PUBKEY_SIZE: usize = 32;
pub const U64_SIZE: usize = 8;
pub const U32_SIZE: usize = 4;
pub const U8_SIZE: usize = 1;
pub const STRING_LENGTH_PREFIX: usize = 4;