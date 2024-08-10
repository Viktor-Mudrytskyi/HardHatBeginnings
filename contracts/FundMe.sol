// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {PriceConverter} from "contracts/PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant minUsd = 50 * 1e18;

    function fund() public payable {
        require(
            msg.value.convertEth() >= minUsd,
            "Value should be greater than 0.015 eth(50$)"
        );

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    address public owner;

    constructor() {
        owner = msg.sender;
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

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call withdraw");
        _;
    }
}
