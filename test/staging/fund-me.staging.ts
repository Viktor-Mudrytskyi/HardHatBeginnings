import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { chainIdToSupportedNetworks } from "../../networks/supported_networks";
import assert from "assert";

chainIdToSupportedNetworks[network.config.chainId ?? -1] === undefined
    ? describe.skip
    : describe("Fund Me", async function () {
          let fundMe: FundMe;
          let fundMeAddress: string;
          let deployer: string;

          const sendVal = ethers.parseEther("0.02");

          beforeEach(async () => {
              const accounts = await getNamedAccounts();
              deployer = accounts.deployer;
              fundMeAddress = (await deployments.get("FundMe")).address;
              fundMe = await ethers.getContractAt("FundMe", fundMeAddress);
          });

          it("allows people to fund", async () => {
              await fundMe.fund({ value: sendVal });
              await fundMe.withdraw();
              const endingBalance =
                  await ethers.provider.getBalance(fundMeAddress);
              assert.equal(endingBalance.toString(), "0");
          });
      });
