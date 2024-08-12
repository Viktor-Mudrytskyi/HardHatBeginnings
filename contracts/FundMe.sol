// SPDX-License-Identifier: MIT
// Pragma first
pragma solidity ^0.8.24;

// Imports after pragma
import {PriceConverter} from "contracts/PriceConverter.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// Error codes naming convention below
error FundMe__NotOwner();

// Interfaces

// Libraries

// Contracts
/// @title A contact for crowd funding
/// @author Viktor M
/// @notice Demo sample
/// @dev The contract is used for getting price from oracle
contract FundMe {
    // Type declarations and usings
    using PriceConverter for uint256;

    // State variables
    uint256 public constant minUsd = 50 * 1e18;
    // consts and immutables are cheaper to read
    address public immutable i_owner;
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;
    AggregatorV3Interface public priceFeed;

    // Modifiers
    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Only owner can call withdraw");
        // or
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }
    // Events

    // Functions
    // constructor
    constructor(address _priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }
    // receive and fallback
    // is triggered when obtaining eth
    receive() external payable {
        fund();
    }

    // is triggered when unknown function is called
    fallback() external payable {
        fund();
    }

    // externals

    // public

    function fund() public payable {
        require(
            msg.value.convertEth(priceFeed) >= minUsd,
            "Value should be greater than 0.015 eth(50$)"
        );

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        funders = new address[](0);
        //transfer
        // payable(msg.sender).transfer(address(this).balance);
        // //send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        //call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess);
    }

    // internal

    // private

    // view and pure
}
