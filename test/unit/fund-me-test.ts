import { deployments, ethers, getNamedAccounts } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { log } from "console";
import "chai";
import "@nomicfoundation/hardhat-chai-matchers";
import { assert, expect } from "chai";
import { ContractTransactionReceipt } from "ethers";

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
            const reponse: string = await fundMe.getPriceFeed();

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
            const reponse = await fundMe.getAddressToAmountFunded(deployer);
            assert.equal(reponse.toString(), sendVal.toString());
        });

        it("Adds funder to array of funders", async () => {
            await fundMe.fund({ value: sendVal });
            const funder = await fundMe.getFunder(0);
            assert.equal(funder, deployer);
        });
    });

    describe("cheaperWithdraw", () => {
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
            const trxResponse = await fundMe.cheaperWithdraw();
            const trxReceipt: ContractTransactionReceipt | null =
                await trxResponse.wait(1);
            if (trxReceipt === null) {
                throw new Error("trxReceipt is null");
            }
            const { gasUsed, gasPrice } = trxReceipt;
            const fee = trxReceipt?.fee;
            // OR
            // const computedFee = gasUsed * gasPrice;

            const endingFundMeBalance =
                await ethers.provider.getBalance(fundMeAddress);

            const endingDeployerBalance =
                await ethers.provider.getBalance(deployer);
            // Asserts
            assert.equal(endingFundMeBalance, 0n);
            assert.equal(
                startingFundMeBalance + startingDeployerBalance,
                endingDeployerBalance + fee,
            );
        });

        it("allows us to withdraw with multiple funders", async () => {
            // Arrange
            const accounts = await ethers.getSigners();
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i],
                );
                await fundMeConnectedContract.fund({ value: sendVal });
            }
            const fundMeAddress = await fundMe.getAddress();
            const startingFundMeBalance =
                await ethers.provider.getBalance(fundMeAddress);
            const startingDeployerBalance =
                await ethers.provider.getBalance(deployer);

            const trxResponse = await fundMe.cheaperWithdraw();
            const trxReceipt: ContractTransactionReceipt | null =
                await trxResponse.wait(1);
            if (trxReceipt === null) {
                throw new Error("trxReceipt is null");
            }
            const { gasUsed, gasPrice } = trxReceipt;
            const fee = trxReceipt?.fee;

            const endingFundMeBalance =
                await ethers.provider.getBalance(fundMeAddress);

            const endingDeployerBalance =
                await ethers.provider.getBalance(deployer);
            // Asserts
            assert.equal(endingFundMeBalance, 0n);
            assert.equal(
                startingFundMeBalance + startingDeployerBalance,
                endingDeployerBalance + fee,
            );

            await expect(fundMe.getFunder(0)).to.be.reverted;

            for (let i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.getAddressToAmountFunded(accounts[i].address),
                    0n,
                );
            }
        });

        it("only allows the owner to withdraw", async () => {
            const accounts = await ethers.getSigners();
            const attacker = accounts[1];
            const attackerConnectedContract = await fundMe.connect(attacker);
            await expect(
                attackerConnectedContract.withdraw(),
            ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner");
        });
    });
});
