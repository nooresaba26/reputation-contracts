import "dotenv/config";
import { ethers } from "ethers";
import artifact from "../artifacts/contracts/ReputationManager.sol/ReputationManager.json" with { type: "json" };

const rpcUrl = "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(rpcUrl);

const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  throw new Error("PRIVATE_KEY missing in .env");
}

const wallet = new ethers.Wallet(privateKey, provider);

console.log("Deploying from:", wallet.address);

const factory = new ethers.ContractFactory(
  artifact.abi,
  artifact.bytecode,
  wallet
);

const contract = await factory.deploy();
await contract.waitForDeployment();

console.log("ReputationManager deployed to:", await contract.getAddress());