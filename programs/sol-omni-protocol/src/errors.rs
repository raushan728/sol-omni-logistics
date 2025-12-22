use anchor_lang::prelude::*;

#[error_code]
pub enum OmniError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("The company gas tank is empty.")]
    InsufficientGasTank,
    #[msg("Driver is currently on another delivery.")]
    DriverBusy,
    #[msg("Invalid location data provided.")]
    InvalidLocation,
    #[msg("Shipment is already delivered.")]
    AlreadyDelivered,
    #[msg("Emergency Swap requires admin approval.")]
    AdminApprovalRequired,
    #[msg("Driver is marked as sick and cannot take orders.")]
    DriverIsSick,
}
