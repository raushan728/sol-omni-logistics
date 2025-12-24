# Sol-Omni Logistics

**Sol-Omni Logistics** is a decentralized supply chain management platform built on Solana using the Anchor Framework and Next.js. It enables transparent, trustless shipment tracking with real-time GPS updates, driver assignment, and automated escrow payments. The platform features an Admin Command Center, Driver HUD, and Public Tracking Portal.

---

## Table of Contents

- [Sol-Omni Logistics](#sol-omni-logistics)
  - [Introduction](#introduction)
  - [Key Features](#key-features)
- [System Architecture](#system-architecture)
  - [Account Structure & Relationships](#account-structure--relationships)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
  - [1. Get Your Program ID](#1-get-your-program-id)
  - [2. Update the Smart Contract](#2-update-the-smart-contract)
  - [3. Update Anchor.toml](#3-update-anchortoml)
  - [4. Re-build the Program](#4-re-build-the-program)
  - [5. Deploy the Program](#5-deploy-the-program)
  - [6. Update Frontend Constants](#6-update-frontend-constants)
- [Wallet Setup](#wallet-setup)
  - [1. Create Wallet](#1-create-wallet)
  - [2. Airdrop SOL](#2-airdrop-sol)
- [Usage Guide](#usage-guide)
  - [Admin Portal](#admin-portal)
  - [Driver HUD](#driver-hud)
  - [Customer Tracking Portal](#customer-tracking-portal)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Connect with Me](#connect-with-me)
- [License](#license)

---

## Introduction

Sol-Omni Logistics revolutionizes supply chain management by bringing transparency and trust to the logistics industry through blockchain technology. Built on Solana's high-performance network, the platform enables real-time shipment tracking, automated driver assignment, GPS-verified location updates, and trustless escrow payments—all secured by smart contracts.

---

## Key Features

- **Admin Command Center**: Comprehensive dashboard for logistics companies to manage fleets, create shipments, and assign drivers with atomic on-chain transactions.
- **Real-Time GPS Tracking**: Drivers can sync their location on-chain, providing verifiable proof of delivery progress.
- **Driver HUD**: Dedicated interface for drivers to view assigned shipments, update locations, and manage their active missions.
- **Public Tracking Portal**: Customers can track their shipments in real-time using unique tracking IDs without requiring a wallet.
- **Automated Escrow**: Shipment payments are locked in smart contract escrow and released upon confirmed delivery.
- **Multi-Tenant Architecture**: Strict data isolation ensures each logistics company only sees their own shipments and drivers.
- **Emergency Swap**: Admins can reassign shipments to different drivers instantly in case of emergencies.

---

## System Architecture

The platform follows a modern Web3 architecture on Solana:

1.  **Smart Contract (Program)**: Written in Rust using the Anchor Framework for type-safe, secure on-chain logic.
2.  **Frontend**: A Next.js 16 application with TypeScript, Tailwind CSS, and React-Leaflet for interactive maps.
3.  **Blockchain Interaction**: Real-time communication with Solana Devnet via `@solana/web3.js` and `@coral-xyz/anchor`.

### Account Structure & Relationships

We utilize **Program Derived Addresses (PDAs)** to ensure deterministic, secure state management.

- **Company Account (`Company`)**: Represents a logistics company registered on the platform.

  - _Seeds_: `[b"company", admin_pubkey]`
  - _Data_: Company name, registration ID, total drivers, total shipments, gas tank balance.

- **Driver Account (`Driver`)**: Stores driver profile information and status.

  - _Seeds_: `[b"driver", driver_wallet_pubkey]`
  - _Data_: Company association, name, license number, active status, rating.

- **Shipment Account (`Shipment`)**: Tracks individual shipment details and status.
  - _Seeds_: `[b"shipment", tracking_id]`
  - _Data_: Company, creator, current driver, receiver, price, GPS coordinates, status, timestamp.

> [!NOTE]
> Using PDAs ensures addresses cannot be manipulated by users, enforcing strict access control and preventing data tampering.

---

## Prerequisites

Ensure you have the following installed:

- **Node.js**: v20+ recommended ([Download](https://nodejs.org/))
- **Rust & Cargo**: Latest stable version ([Download](https://rustup.rs/))
- **Solana CLI**: v1.18+ ([Guide](https://docs.solanalabs.com/cli/install))
- **Anchor Framework**: v0.30+ ([Guide](https://www.anchor-lang.com/docs/installation))
- **Yarn**: (`corepack enable` or `npm i -g yarn`)

---

## Getting Started

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/raushan728/sol-omni-logistics.git
   cd sol-omni-logistics
   ```

2. **Install Backend Dependencies**

   ```bash
   yarn install
   ```

3. **Install Frontend Dependencies**

   ```bash
   cd app && yarn install
   ```

4. **Run Development Server**
   ```bash
   yarn dev
   ```
   _The application will be available at `http://localhost:3000`._

---

## Configuration

Proper configuration is essential for the program to interact correctly with the frontend.

### 1. Get Your Program ID

Run the following command to generate a new keypair if needed:

```bash
anchor keys sync
```

### 2. Update the Smart Contract

If not auto-updated, paste the new ID into `programs/sol-omni-protocol/src/lib.rs`:

```rust
declare_id!("YOUR_NEW_PROGRAM_ID");
```

### 3. Update Anchor.toml

Ensure the `[programs.devnet]` section in `Anchor.toml` matches your new ID:

```toml
[programs.devnet]
sol_omni_protocol = "YOUR_NEW_PROGRAM_ID"
```

### 4. Re-build the Program

```bash
anchor build
```

### 5. Deploy the Program

```bash
anchor deploy
```

### 6. Update Frontend Constants

1. Copy the updated IDL:
   ```bash
   cp target/idl/sol_omni_protocol.json app/idl/
   cp target/types/sol_omni_protocol.ts app/idl/
   ```
2. Update the `PROGRAM_ID` in `app/hooks/useOmniProgram.ts` with your new address.

---

## Wallet Setup

This project requires wallets funded with SOL for transaction fees.

### 1. Create Wallet

```bash
solana-keygen new --outfile ~/.config/solana/id.json
solana config set --keypair ~/.config/solana/id.json
```

### 2. Airdrop SOL

Switch to Devnet and request SOL:

```bash
solana config set --url devnet
solana airdrop 2
```

> [!TIP]
> Create multiple wallets for testing different roles (Admin, Driver, Receiver) to experience the full platform functionality.

---

## Usage Guide

### Admin Portal

**Access**: Navigate to `/admin/dashboard` after connecting your wallet.

**Features**:

1. **Company Registration**: First-time users must register their company at `/onboarding`.
2. **Fleet Management** (`/admin/fleet`): Register new drivers by providing their wallet address, name, and license number.
3. **Shipment Creation** (`/admin/shipments`): Create new shipments with atomic driver assignment:
   - Enter receiver wallet address
   - Set shipment price (in SOL)
   - Assign a driver from your registered fleet
   - Generate unique tracking ID
4. **Emergency Swap**: Reassign shipments to different drivers instantly using the "ASSIGN" button.
5. **Settings** (`/admin/settings`): Deposit SOL into your company's gas tank to subsidize driver transactions.

### Driver HUD

**Access**: Navigate to `/driver/dashboard` after connecting your driver wallet.

**Features**:

1. **Active Mission View**: See your currently assigned shipment with tracking ID, destination, and cargo value.
2. **GPS Sync**: Click "SYNC GPS" to update your current location on-chain (uses browser geolocation API).
3. **Status Toggle**: Switch between "Active" and "Sick" status to manage availability.
4. **Real-Time Map**: View your current position on an interactive Leaflet map.

> [!IMPORTANT]
> Drivers must be registered by an admin before they can see assigned shipments.

### Customer Tracking Portal

**Access**: Navigate to `/track` (no wallet required).

**Features**:

1. **Smart Search**: Enter tracking ID (e.g., "SHIP-5409" or just "5409").
2. **Real-Time Status**: View shipment status (Created, In Transit, Delivered).
3. **Live Map**: See the current GPS location of your shipment.
4. **Proof of Delivery**: Receivers can confirm delivery to release escrowed funds.

---

## Testing

Run the integration tests included in the repository:

```bash
anchor test
```

_This validates core mechanics including company initialization, driver registration, shipment creation, and emergency swap functionality._

---

## Troubleshooting

> [!WARNING] > **Common Error: "AccountNotInitialized (3012)"**
> This occurs when trying to assign a driver who hasn't been registered. Ensure all drivers are registered via the Admin Fleet page before assignment.

- **Transaction Simulation Failed**: Check if you have enough SOL for gas fees.
- **Wallet Connection Error**: Verify you are on **Solana Devnet**.
- **Map Not Loading**: Ensure you have a stable internet connection and that Leaflet CSS is properly imported.
- **Driver Can't See Shipment**: Confirm the driver's wallet address matches exactly what was used during registration and assignment.

---

## Contributing

Contributions are welcome!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## Connect with Me

If you have any questions or want to collaborate, feel free to reach out!

- **Email**: [raushankumarwork74@gmail.com](mailto:raushankumarwork74@gmail.com)
- **LinkedIn**: [Raushan Kumar](https://www.linkedin.com/in/raushan-kumar-807916390/)
- **Telegram**: [@raushan_singh_29](https://t.me/raushan_singh_29)

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## Acknowledgments

- Built with [Anchor Framework](https://www.anchor-lang.com/)
- Maps powered by [React-Leaflet](https://react-leaflet.js.org/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Solana Devnet](https://docs.solana.com/clusters#devnet)
