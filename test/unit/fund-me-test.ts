import { deployments, ethers, getNamedAccounts } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { log } from "console";
import "chai";
import "@nomicfoundation/hardhat-chai-matchers";
import { assert, expect } from "chai";

describe("FundMe", () => {
    let fundMe: FundMe;
    let deployer: string;
    let mockV3Aggregator: MockV3Aggregator;
    const sendVal = ethers.parseEther("1");
    beforeEach(async () => {
        // Deploys all that export tags
        const accounts = await getNamedAccounts();
        deployer = accounts.deployer;
        await deployments.fixture(["all"]);
        const fundMeAddress: string = (await deployments.get("FundMe")).address;
        fundMe = await ethers.getContractAt("FundMe", fundMeAddress);
        const mockV3AggregatorAddress: string = (
            await deployments.get("MockV3Aggregator")
        ).address;
        mockV3Aggregator = await ethers.getContractAt(
            "MockV3Aggregator",
            mockV3AggregatorAddress,
        );
    });

    describe("constructor", () => {
        it("sets the Aggregator address correctly", async () => {
            const reponse: string = await fundMe.priceFeed();

            const expectedFeed = await mockV3Aggregator.getAddress();
            assert.equal(reponse, expectedFeed);
        });
    });

    describe("fund", () => {
        it("Failure: not enough ETH", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "Value should be greater than 0.015 eth(50$)",
            );
        });

        it("Updates the amount funded data structure", async () => {
            await fundMe.fund({ value: sendVal });
            const reponse = await fundMe.addressToAmountFunded(deployer);
            assert.equal(reponse.toString(), sendVal.toString());
        });

        it("Adds funder to array of funders", async () => {
            await fundMe.fund({ value: sendVal });
            const funder = await fundMe.funders(0);
            assert.equal(funder, deployer);
        });
    });

    describe("withdraw", () => {
        beforeEach(async () => {
            await fundMe.fund({ value: sendVal });
        });

        it("withdraw ETH from a single funder", async () => {
            // Arrange
            const fundMeAddress = await fundMe.getAddress();
            const startingFundMeBalance =
                await ethers.provider.getBalance(fundMeAddress);
            const startingDeployerBalance =
                await ethers.provider.getBalance(deployer);
            // Act
            const trxResponse = await fundMe.withdraw();
            const trxReceipt = await trxResponse.wait(1);

            const endingFundMeBalance =
                await ethers.provider.getBalance(fundMeAddress);

            const endingDeployerBalance =
                await ethers.provider.getBalance(deployer);
            // Asserts
            assert.equal(endingFundMeBalance, 0n);
            assert.equal(
                startingFundMeBalance + startingDeployerBalance,
                endingDeployerBalance + gasPrice,
            );
        });
    });
});
