"use client";

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, Idl, setProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
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

  return {
    program,
    checkUserRole,
    wallet,
  };
}
