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
    uint256 public constant MIN_USD = 50 * 1e18;
    // consts and immutables are cheaper to read because they are not stored in Storage but are pert of a contracts byte code
    address private immutable I_OWNER;
    // arrays and mappings are stored in Storage as length num and blank respectively
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;

    AggregatorV3Interface private s_priceFeed;

    // Modifiers
    modifier onlyOwner() {
        // require(msg.sender == I_OWNER, "Only owner can call withdraw");
        // or
        if (msg.sender != I_OWNER) {
            revert FundMe__NotOwner();
        }
        _;
    }

    // Events

    // Functions
    // constructor
    constructor(address _priceFeedAddress) {
        I_OWNER = msg.sender;
        s_priceFeed = AggregatorV3Interface(_priceFeedAddress);
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
            msg.value.convertEth(s_priceFeed) >= MIN_USD,
            "Value should be greater than 0.015 eth(50$)"
        );

        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public payable onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);
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

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        // mappings cannot be in memory

        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);
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
    function getOwner() public view returns (address) {
        return I_OWNER;
    }

    function getFunder(uint256 _index) public view returns (address) {
        return s_funders[_index];
    }

    function getAddressToAmountFunded(
        address _address
    ) public view returns (uint256) {
        return s_addressToAmountFunded[_address];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
