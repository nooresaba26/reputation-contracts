import "dotenv/config";
import { ethers } from "ethers";
import artifact from "../artifacts/contracts/ReputationManager.sol/ReputationManager.json" with { type: "json" };

const rpcUrl = "http://127.0.0.1:8545";
const contractAddress = "0xeB4D259426e570aAEeC7CD305f593e3fE70e311D";

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const contract = new ethers.Contract(contractAddress, artifact.abi, wallet);

const validators = [
  "0xee75e7826372e1edd7db15af807a9f02751756a4",
  "0x74c09ba8de97efd2f836cc73a1bacac9d1d88a63",
  "0xda5b0ef583641a69314b3d98b049f78bd24f0e14",
  "0xa3e5f6fdb94c11aaf9ce352aec48438d3f078919",
];

for (const validator of validators) {
  console.log("Registering:", validator);

  const tx = await contract.registerValidator(validator);
  console.log("Tx:", tx.hash);

  await tx.wait();
  console.log("Registered:", validator);
}

console.log("Active validators:");
console.log(await contract.getActiveValidators());