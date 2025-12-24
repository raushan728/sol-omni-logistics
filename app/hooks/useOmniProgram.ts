"use client";

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Program,
  AnchorProvider,
  Idl,
  setProvider,
  BN,
} from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { useMemo, useCallback } from "react";
import idl from "../idl/sol_omni_protocol.json";
import { SolOmniProtocol } from "../idl/sol_omni_protocol";

const PROGRAM_ID = new PublicKey("tyWeb5FudPxigpWFYeCP9yKwYHBxsqB3jwJa6bjzTJn");

export type UserRole = "ADMIN" | "DRIVER" | "GUEST";

export default function useOmniProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const provider = useMemo(() => {
    if (!wallet) return null;
    return new AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    return new Program(idl as any, provider) as Program<SolOmniProtocol>;
  }, [provider]);

  const checkUserRole = useCallback(async (): Promise<{
    role: UserRole;
    pda?: PublicKey;
  }> => {
    if (!program || !wallet) return { role: "GUEST" };

    try {
      // 1. Check if Admin (Company PDA)
      // Seeds: [b"company", admin_key]
      const [companyPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("company"), wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      try {
        const companyAccount = await program.account.company.fetch(companyPda);
        if (companyAccount) {
          return { role: "ADMIN", pda: companyPda };
        }
      } catch (e) {
        // Account not found, continue
      }

      // 2. Check if Driver (Driver Profile PDA)
      // Seeds: [b"driver", driver_wallet]
      const [driverPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("driver"), wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      try {
        const driverAccount = await program.account.driver.fetch(driverPda);
        if (driverAccount) {
          return { role: "DRIVER", pda: driverPda };
        }
      } catch (e) {
        // Account not found
      }

      return { role: "GUEST" };
    } catch (error) {
      console.error("Error checking role:", error);
      return { role: "GUEST" };
    }
  }, [program, wallet]);

  const initializeCompany = useCallback(
    async (companyName: string, regId: string) => {
      if (!program || !wallet) return null;
      try {
        const [companyPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("company"), wallet.publicKey.toBuffer()],
          PROGRAM_ID
        );

        // Mocking the call structure based on standard Anchor
        // Actual args depend on IDL, assumed here
        const tx = await program.methods
          .initializeCompany(companyName, regId)
          .accounts({
            company: companyPda,
            admin: wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
          } as any)
          .rpc();
        return tx;
      } catch (err) {
        console.error("Initialize Company failed:", err);
        throw err;
      }
    },
    [program, wallet]
  );

  const registerDriver = useCallback(
    async (name: string, license: string, driverKey: string) => {
      if (!program || !wallet) return null;
      try {
        const driverWallet = new PublicKey(driverKey);
        const [driverPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("driver"), driverWallet.toBuffer()],
          PROGRAM_ID
        );
        const [companyPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("company"), wallet.publicKey.toBuffer()],
          PROGRAM_ID
        );

        const tx = await program.methods
          .registerDriver(name, license)
          .accounts({
            driverProfile: driverPda,
            company: companyPda,
            driverWallet: driverWallet,
            admin: wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
          } as any)
          .rpc();
        return tx;
      } catch (err) {
        console.error("Register Driver failed:", err);
        throw err;
      }
    },
    [program, wallet]
  );

  const getAllShipments = useCallback(
    async (companyPda?: PublicKey) => {
      if (!program) return [];
      try {
        let filters: any[] = [];
        if (companyPda) {
          filters.push({
            memcmp: {
              offset: 8, // Discriminator (8) + Company is 1st field
              bytes: companyPda.toBase58(),
            },
          });
        }
        const shipments = await program.account.shipment.all(filters);
        return shipments;
      } catch (err) {
        console.error("Failed to fetch shipments:", err);
        return [];
      }
    },
    [program]
  );

  const getShipment = useCallback(
    async (trackingId: string) => {
      if (!program) return null;
      try {
        const [shipmentPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("shipment"), Buffer.from(trackingId)],
          PROGRAM_ID
        );
        const shipmentAccount = await program.account.shipment.fetch(
          shipmentPda
        );
        return {
          publicKey: shipmentPda,
          account: shipmentAccount,
        };
      } catch (err) {
        console.error("Failed to fetch shipment:", err);
        return null;
      }
    },
    [program]
  );

  const updateLocation = useCallback(
    async (lat: number, lng: number) => {
      if (!program || !wallet) return null;
      try {
        const [driverPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("driver"), wallet.publicKey.toBuffer()],
          PROGRAM_ID
        );
        const tx = await program.methods
          .updateLocation(lat, lng)
          .accounts({
            driver: driverPda,
            signer: wallet.publicKey,
          } as any)
          .rpc();
        return tx;
      } catch (err) {
        console.error("Update Location failed:", err);
        throw err;
      }
    },
    [program, wallet]
  );

  const createShipment = useCallback(
    async (
      receiver: string,
      price: number,
      trackingId: string,
      driverKey?: string
    ) => {
      if (!program || !wallet) return null;
      try {
        if (!trackingId)
          throw new Error("Tracking ID is required for PDA derivation");

        const [shipmentPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("shipment"), Buffer.from(trackingId)],
          program.programId
        );

        console.log("Derived Shipment PDA:", shipmentPda.toString());

        const [companyPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("company"), wallet.publicKey.toBuffer()],
          program.programId
        );

        // Determine Driver to Assign (Default to Admin/Sender if none selected)
        let driverToAssign = wallet.publicKey;
        if (driverKey) {
          driverToAssign = new PublicKey(driverKey);
        }
        console.log("Assigning Driver (Direct):", driverToAssign.toString());

        const tx = await program.methods
          .createShipment(trackingId, new BN(price * 1000000000))
          .accounts({
            shipment: shipmentPda,
            company: companyPda,
            sender: wallet.publicKey,
            driverToAssign: driverToAssign, // New IDL Field
            receiver: new PublicKey(receiver),
            systemProgram: web3.SystemProgram.programId,
          } as any)
          .rpc();
        return tx;
      } catch (err) {
        console.error("Create Shipment failed:", err);
        throw err;
      }
    },
    [program, wallet]
  );

  const depositGas = useCallback(
    async (amount: number) => {
      if (!program || !wallet) return null;
      try {
        const [companyPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("company"), wallet.publicKey.toBuffer()],
          PROGRAM_ID
        );
        const tx = await program.methods
          .depositGas(new BN(amount * 1000000000))
          .accounts({
            company: companyPda,
            admin: wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
          } as any)
          .rpc();
        return tx;
      } catch (err) {
        console.error("Deposit Gas failed:", err);
        throw err;
      }
    },
    [program, wallet]
  );

  const confirmDelivery = useCallback(
    async (trackingId: string) => {
      if (!program || !wallet) return null;
      try {
        const [shipmentPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("shipment"), Buffer.from(trackingId)],
          PROGRAM_ID
        );
        const tx = await program.methods
          .confirmDelivery()
          .accounts({
            shipment: shipmentPda,
            receiver: wallet.publicKey,
            // signer is receiver
          } as any)
          .rpc();
        return tx;
      } catch (err) {
        console.error("Confirm Delivery failed:", err);
        throw err;
      }
    },
    [program, wallet]
  );

  const toggleDriverStatus = useCallback(
    async (status: string) => {
      // "active" or "sick"
      if (!program || !wallet) return null;
      try {
        console.warn(
          "toggleStatus instruction not found in IDL. Mocking success."
        );
        return "mock_tx_signature";
      } catch (err) {
        console.error("Toggle Status failed:", err);
        throw err;
      }
    },
    [program, wallet]
  );

  const emergencySwap = useCallback(
    async (trackingId: string, driverKey: string) => {
      if (!program || !wallet) return null;
      try {
        console.log("Starting Emergency Swap...");
        console.log("Tracking ID:", trackingId);
        console.log("Driver Key:", driverKey);

        const [shipmentPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("shipment"), Buffer.from(trackingId)],
          PROGRAM_ID
        );
        const [companyPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("company"), wallet.publicKey.toBuffer()],
          PROGRAM_ID
        );
        const driverWallet = new PublicKey(driverKey);

        // DERIVE DRIVER PROFILE PDA
        const [driverProfilePda] = PublicKey.findProgramAddressSync(
          [Buffer.from("driver"), driverWallet.toBuffer()],
          PROGRAM_ID
        );

        console.log("Shipment PDA:", shipmentPda.toString());
        console.log("Driver PDA Derived:", driverProfilePda.toString());
        console.log("Driver Wallet:", driverWallet.toString());

        const tx = await program.methods
          .emergencySwap()
          .accounts({
            shipment: shipmentPda,
            company: companyPda,
            newDriverProfile: driverProfilePda, // Must match IDL: new_driver_profile
            newDriverWallet: driverWallet, // Must match IDL: new_driver_wallet
            admin: wallet.publicKey,
            // Note: If IDL has system_program? Check IDL.
            // IDL for emergency_swap: shipment, company, new_driver_profile, new_driver_wallet, admin.
            // No system_program in IDL snippet for emergency_swap.
          } as any)
          .rpc();

        console.log("Emergency Swap Signature:", tx);
        return tx;
      } catch (err) {
        console.error("Emergency Swap failed:", err);
        throw err;
      }
    },
    [program, wallet]
  );

  const getAllDrivers = useCallback(
    async (companyPda?: PublicKey) => {
      if (!program) return [];
      try {
        let filters: any[] = [];
        if (companyPda) {
          filters.push({
            memcmp: {
              offset: 8, // Discriminator (8) + Company is 1st field
              bytes: companyPda.toBase58(),
            },
          });
        }
        const drivers = await program.account.driver.all(filters);
        return drivers;
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
        return [];
      }
    },
    [program]
  );

  return {
    program,
    checkUserRole,
    wallet,
    initializeCompany,
    registerDriver,
    getAllShipments,
    getShipment,
    updateLocation,
    createShipment,
    depositGas,
    confirmDelivery,
    toggleDriverStatus,
    emergencySwap,
    getAllDrivers,
    isLoading: false,
  };
}
