import { deployments, network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { chainIdToSupportedNetworks } from "../networks/supported_networks";

module.exports = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments: DeploymentsExtension } = hre; // gets deployments param into our deployments var
    const { deploy, log } = deployments;

    const { deployer } = await hre.getNamedAccounts();
    const chainId = network.config.chainId;
    if (!chainId) {
        throw new Error("chainId not found");
    }

    const ethPriceForChain = chainIdToSupportedNetworks[chainId].ethUsdFeed;

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [], // constructor params
        log: true,
    });
};
