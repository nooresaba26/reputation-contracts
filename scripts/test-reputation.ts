import "dotenv/config";
import { ethers } from "ethers";
import artifact from "../artifacts/contracts/ReputationManager.sol/ReputationManager.json" with { type: "json" };

const rpcUrl = "http://127.0.0.1:8545";
const contractAddress = "0x44264bfA3Dcd7F139398087C4Cb0E2330EB381Ef";

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const contract = new ethers.Contract(contractAddress, artifact.abi, wallet);

const validator1 = "0x74c09ba8de97efd2f836cc73a1bacac9d1d88a63";

console.log("Registering validator...");
await (await contract.registerValidator(validator1)).wait();

console.log("Active validators:");
console.log(await contract.getActiveValidators());

console.log("Done.");