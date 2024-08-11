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

    if (chainIdToSupportedNetworks[chainId] !== undefined) {
        return;
    }

    log("Deploying Mocks...");
    await deploy("MockV3Aggregator", {
        contract: "MockV3Aggregator",
        from: deployer,
        log: true,
        args: [8, 200000000000],
    });

    log("Mocks Deployed!");
    log("-----------------------------------");
};

module.exports.tags = ["all", "mocks"];
