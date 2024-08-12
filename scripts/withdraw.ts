import { deployments, ethers, getNamedAccounts } from "hardhat";

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMeDeployment = await deployments.get("FundMe");
    const fundMeAddress = await fundMeDeployment.address;
    const fundMe = await ethers.getContractAt("FundMe", fundMeAddress);
    console.log("Withdrawing from contract...");
    const transactionResponse = await fundMe.withdraw();
    await transactionResponse.wait(1);
    console.log("Withdrawn from contract!");
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
