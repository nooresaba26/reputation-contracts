import "dotenv/config";
import { ethers } from "ethers";
import artifact from "../artifacts/contracts/ReputationManager.sol/ReputationManager.json" with { type: "json" };

const rpcUrl = "http://127.0.0.1:8545";
const contractAddress = "0xf365110715CD4692b60580E9fa7eE4cA851E6E7f";

const provider = new ethers.JsonRpcProvider(rpcUrl);

const contract = new ethers.Contract(contractAddress, artifact.abi, provider);

const validators = [
  "0xee75e7826372e1edd7db15af807a9f02751756a4",
  "0x74c09ba8de97efd2f836cc73a1bacac9d1d88a63",
  "0xda5b0ef583641a69314b3d98b049f78bd24f0e14",
  "0xa3e5f6fdb94c11aaf9ce352aec48438d3f078919",
];

for (const validator of validators) {
  const stats = await contract.getValidatorStats(validator);

  console.log("\nValidator:", validator);
  console.log("observedBlocks:", stats[0].toString());
  console.log("onlineBlocks:", stats[1].toString());
  console.log("participatedRounds:", stats[2].toString());
  console.log("successfulVotes:", stats[3].toString());
  console.log("unsuccessfulVotes:", stats[4].toString());
  console.log("selectedRounds:", stats[5].toString());
  console.log("consecutiveParticipation:", stats[6].toString());
  console.log("lastParticipatedBlock:", stats[7].toString());
  console.log("active:", stats[8]);
}