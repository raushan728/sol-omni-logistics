use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum UserRole {
    Admin,
    Driver,
    Receiver,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ShipmentStatus {
    Created,
    InTransit,
    HandoverProcess,
    Delivered,
    Cancelled,
    Disputed,
}

#[account]
pub struct GlobalState {
    pub super_admin: Pubkey,
    pub total_companies: u64,
    pub platform_fee: u64,
}

#[account]
pub struct Company {
    pub admin: Pubkey,
    pub name: String,
    pub registration_id: String,
    pub gas_tank_balance: u64,
    pub total_drivers: u32,
    pub total_shipments: u64,
    pub bump: u8,
}

#[account]
pub struct Driver {
    pub company: Pubkey,
    pub wallet: Pubkey,
    pub name: String,
    pub license_no: String,
    pub is_active: bool,
    pub is_sick: bool,
    pub rating: u8,
    pub bump: u8,
}

#[account]
pub struct Shipment {
    pub company: Pubkey,
    pub creator: Pubkey,
    pub current_driver: Pubkey,
    pub receiver: Pubkey,
    pub tracking_id: String,
    pub status: ShipmentStatus,
    pub location_lat: f64,
    pub location_lng: f64,
    pub last_update_timestamp: i64,
    pub price: u64,
    pub bump: u8,
}