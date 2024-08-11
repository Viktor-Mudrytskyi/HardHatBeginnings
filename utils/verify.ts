import { run } from "hardhat";
async function verify(contractAddress: string, args?: string[]): Promise<void> {
    console.log("Verifying contract...");
    try {
        const result = await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
        // console.log(result);
    } catch (e) {
        console.log(e);
    }
}

export { verify };
