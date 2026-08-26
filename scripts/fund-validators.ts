import "dotenv/config";
import { ethers } from "ethers";

const rpcUrl = "http://127.0.0.1:8545";

const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  throw new Error("PRIVATE_KEY is missing from .env");
}

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(privateKey, provider);

const validators = [
  "0x2f53ca9e0c887f9c1b42c4486d50e0d8464bbecf",
  "0x39ad67cc8e22ebfb577bf6d856446c1f63c2b50d",
  "0x416f990fd2d76ee34516112fb37f7f73eae5a5d0",
  "0x4782cff471ddee18276682a992c6de624506f734",
  "0x47a62b31824b4203a0be8920c4cd5a403d02f477",
  "0x538cb748ff9f6770fe95b4c549adac91ab2dd72a",
  "0x7bf5502a5bf925ef02fa7884f4aa9d9036476ba9",
  "0xbd940de1255919734104edcba52d243e4a00be4f",
];

console.log("Funding account:", wallet.address);

const ownerBalance = await provider.getBalance(wallet.address);
console.log(
  "Funding account balance:",
  ethers.formatEther(ownerBalance),
  "ETH"
);

for (const validator of validators) {
  const currentBalance = await provider.getBalance(validator);

  console.log(
    `\nValidator ${validator}`,
    `\nCurrent balance: ${ethers.formatEther(currentBalance)} ETH`
  );

  if (currentBalance >= ethers.parseEther("10")) {
    console.log("Already sufficiently funded. Skipping.");
    continue;
  }

  const transaction = await wallet.sendTransaction({
    to: validator,
    value: ethers.parseEther("10"),
  });

  console.log("Funding transaction:", transaction.hash);

  const receipt = await transaction.wait();

  if (!receipt || receipt.status !== 1) {
    throw new Error(`Funding transaction failed for ${validator}`);
  }

  const newBalance = await provider.getBalance(validator);

  console.log(
    "New balance:",
    ethers.formatEther(newBalance),
    "ETH"
  );
}

console.log("\nAll validator accounts are funded.");