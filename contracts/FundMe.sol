// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {PriceConverter} from "contracts/PriceConverter.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

error NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant minUsd = 50 * 1e18;

    function fund() public payable {
        require(
            msg.value.convertEth(priceFeed) >= minUsd,
            "Value should be greater than 0.015 eth(50$)"
        );

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }
    // consts and immutables are cheaper to read
    address public immutable i_owner;

    AggregatorV3Interface public priceFeed;

    constructor(address _priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

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

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Only owner can call withdraw");
        // or
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }
}
