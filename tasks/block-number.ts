import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("block-number", "Prints the current block number").setAction(
    async (_, hre:HardhatRuntimeEnvironment) => {
        const blockNumber = await hre.ethers.provider.getBlockNumber();
        console.log( blockNumber );
    }
)

module.exports = {};