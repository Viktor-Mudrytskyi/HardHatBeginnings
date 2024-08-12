import { ethers, run, network } from "hardhat";
import { expect, assert } from "chai";
import { SimpleStorage } from "../../typechain-types";

// The same as test() in Flutter Tests
describe("Simple storage", () => {
    let simpleStorageFactory;
    let simpleStorageContract: SimpleStorage;

    // Hits before every it()
    beforeEach(async () => {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorageContract = await simpleStorageFactory.deploy();
    });

    it("Should start with a fav num of 0", async () => {
        const currentFavNum = await simpleStorageContract.retrieve();
        const expectedVal = 0n;
        // assert or expect
        assert.equal(currentFavNum, expectedVal);
        // or
        // expect(currentFavNum).to.equal(expectedVal);
    });

    it("Should update when we call store", async () => {
        const transactionResponse = await simpleStorageContract.store(7);
        await transactionResponse.wait(1);
        const currentFavNum = await simpleStorageContract.retrieve();
        const expectedVal = 7n;
        assert.equal(currentFavNum, expectedVal);
    });
});
