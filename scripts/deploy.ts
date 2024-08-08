import { ethers, run, network } from "hardhat";
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types";

async function main(): Promise<void> {
    const simpleStorageFactory: SimpleStorage__factory =
        await ethers.getContractFactory("SimpleStorage");

    console.log("Deploying Contract...");
    const simpleStorage: SimpleStorage = await simpleStorageFactory.deploy();
    const addressContract = await simpleStorage.getAddress();
    console.log("Contract deployed to:", addressContract);
    await simpleStorage.deploymentTransaction()?.wait(1);

    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deploymentTransaction()?.wait(6);
        await verify(addressContract);
    }

    const currentValue = await simpleStorage.retrieve();
    console.log(`Current value is: ${currentValue}`);

    const transactionResponse = await simpleStorage.store(72);
    await transactionResponse.wait(1);

    const updatedValue = await simpleStorage.retrieve();
    console.log(`Updated value is: ${updatedValue}`);
}

async function verify(contractAddress: string, args?: string[]): Promise<void> {
    console.log("Verifying contract...");
    try {
        const result = await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
        console.log(result);
    } catch (e) {
        console.log(e);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
