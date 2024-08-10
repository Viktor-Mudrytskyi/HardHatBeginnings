import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-etherscan";
import * as dotenv from "dotenv";
import "solidity-coverage";
import "solhint";

import "./tasks/block-number";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY || "";
const ethSepoliaRpc = process.env.ETH_SEPOLIA_RPC_URL;
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
const coinmarketCapApiKey = process.env.COIMARKETCAP_API_KEY;

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    defaultNetwork: "hardhat",
    networks: {
        // object naame corresponds to network parameter
        eth_sepolia: {
            url: ethSepoliaRpc,
            accounts: [privateKey],
            chainId: 11155111,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337, // Hardhat uses chainId 31337 by default
            // Accounts for local host are placed by default
        },
    },
    etherscan: {
        apiKey: etherscanApiKey,
    },
    gasReporter: {
        // enabled: true,
        enabled: false,
        currency: "USD",
        coinmarketcap: coinmarketCapApiKey,
        gasPriceApi:
            "https://api-sepolia.etherscan.io/api?module=proxy&action=eth_gasPrice", // ETH Sepolia gas price
    },
};

export default config;
