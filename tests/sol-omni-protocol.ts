import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolOmniProtocol } from "../target/types/sol_omni_protocol";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

describe("sol-omni-protocol", () => {
  const provider = anchor.AnchorProvider.env();
  provider.opts.commitment = "confirmed";
  anchor.setProvider(provider);

  const program = anchor.workspace.SolOmniProtocol as Program<SolOmniProtocol>;
  const admin = provider.wallet as anchor.Wallet;

  const companyName = "BlueDart";
  const regId = "REG123";
  const driverName = "Rajesh";
  const licenseNo = "LIC007";
  const trackingId = "TRK" + Math.floor(Math.random() * 100000); 
  const price = new anchor.BN(0.01 * LAMPORTS_PER_SOL);
  const driverWallet = Keypair.generate();
  const receiverWallet = Keypair.generate();
  const [companyPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("company"), admin.publicKey.toBuffer()],
    program.programId
  );

  const [driverPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("driver"), driverWallet.publicKey.toBuffer()],
    program.programId
  );

  const [shipmentPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("shipment"), Buffer.from(trackingId)],
    program.programId
  );
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  it("Step 1: Init Company", async () => {
    await program.methods
      .initializeCompany(companyName, regId)
      .accounts({
        company: companyPda,
        admin: admin.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .rpc();
    console.log("✅ Company Created");
    await sleep(2000); 
  });

  it("Step 2: Register Driver", async () => {
    await program.methods
      .registerDriver(driverName, licenseNo)
      .accounts({
        driverProfile: driverPda,
        company: companyPda,
        driverWallet: driverWallet.publicKey,
        admin: admin.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .rpc();
    console.log("✅ Driver Registered");
    await sleep(2000);
  });

  it("Step 3: Create Shipment", async () => {
    await program.methods
      .createShipment(trackingId, price)
      .accounts({
        shipment: shipmentPda,
        company: companyPda,
        sender: admin.publicKey,
        receiver: receiverWallet.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .rpc();
    console.log("✅ Shipment Created & Funds Locked");
    await sleep(2000);
  });

  it("Step 4: Update Location", async () => {
    await program.methods
      .updateLocation(28.61, 77.20)
      .accounts({
        shipment: shipmentPda,
        driverProfile: driverPda,
        driverWallet: admin.publicKey,
      } as any)
      .rpc();
    console.log("✅ Location Updated");
  });

  it("Step 5: Confirm Delivery", async () => {
    await program.methods
      .confirmDelivery()
      .accounts({
        shipment: shipmentPda,
        company: companyPda,
        receiver: receiverWallet.publicKey,
        admin: admin.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([receiverWallet])
      .rpc();
    console.log("✅ Delivered & Funds Released");
  });
});