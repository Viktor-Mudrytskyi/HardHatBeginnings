// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getEthUsd(
        AggregatorV3Interface _priceFeed
    ) internal view returns (uint256) {
        (, int256 answer, , , ) = _priceFeed.latestRoundData();
        uint256 decimals = 18 - uint256(_priceFeed.decimals());
        // Get price to have the same number of decimals as wei
        return uint256(answer * int256((uint256(10) ** decimals)));
    }

    function convertEth(
        uint256 ethAmount,
        AggregatorV3Interface _priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getEthUsd(_priceFeed);
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}
