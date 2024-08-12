import { deployments, ethers, getNamedAccounts } from "hardhat";

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMeDeployment = await deployments.get("FundMe");
    const fundMeAddress = await fundMeDeployment.address;
    const fundMe = await ethers.getContractAt("FundMe", fundMeAddress);
    console.log("Funding contract...");
    const transactionResponse = await fundMe.fund({
        value: ethers.parseEther("0.04"),
    });
    await transactionResponse.wait(1);
    console.log("Funded contract!");
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
