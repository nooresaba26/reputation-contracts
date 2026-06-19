const hre = require("hardhat");

async function main() {
  const ReputationManager = await hre.ethers.getContractFactory("ReputationManager");
  const reputationManager = await ReputationManager.deploy();

  await reputationManager.waitForDeployment();

  console.log("ReputationManager deployed to:", await reputationManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});