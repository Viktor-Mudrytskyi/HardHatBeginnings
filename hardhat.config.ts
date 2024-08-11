import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-etherscan";
import * as dotenv from "dotenv";
import "solidity-coverage";
import "solhint";
import "hardhat-deploy";

import "./tasks/block-number";
import { NetworkInterface } from "./networks/network_interface";
import {
    ethSepoliaNetwork,
    polygonCardonaNetwork,
} from "./networks/supported_networks";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY || "";
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
const coinmarketCapApiKey = process.env.COIMARKETCAP_API_KEY;
const ethSepoliaGasPriceApi = process.env.SEPOLIA_ETH_GAS_PRICE_API;

const ethSepolia: NetworkInterface = ethSepoliaNetwork;
const polygonCardona: NetworkInterface = polygonCardonaNetwork;

const config: HardhatUserConfig = {
    // solidity: "0.8.24",
    solidity: {
        compilers: [
            {
                version: "0.8.24",
            },
            {
                version: "0.8.0",
            },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        // object naame corresponds to network parameter
        [ethSepolia.name]: {
            url: ethSepolia.rpcUrl,
            accounts: [privateKey],
            chainId: ethSepolia.chainId,
        },
        [polygonCardona.name]: {
            url: polygonCardona.rpcUrl,
            accounts: [privateKey],
            chainId: polygonCardona.chainId,
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
        gasPriceApi: ethSepoliaGasPriceApi, // ETH Sepolia gas price
    },
    namedAccounts: {
        deployer: {
            // 0 is the index of  accounts: [privateKey], int the neworks object
            default: 0, // here this will by default take the first account as deployer
            31337: 0,
        },
    },
};

export default config;
