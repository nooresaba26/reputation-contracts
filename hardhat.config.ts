import { defineConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";

export default defineConfig({
  solidity: {
    version: "0.8.20",
    settings: {
      evmVersion: "paris"
    }
  },

  networks: {
    besu: {
      type: "http",
      url: "http://127.0.0.1:8545",
    },
  },
});