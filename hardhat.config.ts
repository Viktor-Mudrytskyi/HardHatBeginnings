import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import "./tasks/block_number";

dotenv.config();

if (!process.env.ETHERSCAN_API_KEY) {
    throw new Error("Please set ETHERSCAN_API_KEY in a .env file");
}

if (!process.env.ETH_SEPOLIA_RPC_URL) {
    throw new Error("Please set ETH_SEPOLIA_RPC_URL in a .env file");
}

if (!process.env.PRIVATE_KEY) {
    throw new Error("Please set ETH_SEPOLIA_RPC_URL in a .env file");
}

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    defaultNetwork: "hardhat",
    networks: {
        // object naame corresponds to network parameter
        eth_sepolia: {
            url: process.env.ETH_SEPOLIA_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 11155111,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337, // Hardhat uses chainId 31337 by default
            // Accounts for local host are placed by default
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
};

export default config;
