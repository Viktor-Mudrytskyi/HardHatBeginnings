import { deployments, network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { chainIdToSupportedNetworks } from "../networks/supported_networks";
import { verify } from "../utils/verify";
import * as dotenv from "dotenv";
dotenv.config();

module.exports = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments: DeploymentsExtension } = hre; // gets deployments param into our deployments var
    const { deploy, log } = deployments;

    const { deployer } = await hre.getNamedAccounts();
    const chainId = network.config.chainId;
    if (!chainId) {
        throw new Error("chainId not found");
    }

    let ethPriceForChain: string;
    const isSupportedNetwork =
        chainIdToSupportedNetworks[chainId] !== undefined;

    if (isSupportedNetwork) {
        ethPriceForChain = chainIdToSupportedNetworks[chainId].ethUsdFeed;
    } else {
        const mockEthFeed = await deployments.get("MockV3Aggregator");
        ethPriceForChain = mockEthFeed.address;
    }

    const args = [ethPriceForChain];

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // constructor params
        log: true,
        waitConfirmations: 1,
    });

    log(`Contract deployed to ${fundMe.address}`);

    if (isSupportedNetwork && process.env.ETHERSCAN_API_KEY) {
        log("Verifying contract...");
        await verify(fundMe.address, args);
    }

    log("-----------------------------------");
};

module.exports.tags = ["all", "fundme"];
