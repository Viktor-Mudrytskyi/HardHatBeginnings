// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getEthUsd() internal view returns (uint256) {
        address ethUsdFeedAddress = 0x694AA1769357215DE4FAC081bf1f309aDC325306;
        AggregatorV3Interface feed = AggregatorV3Interface(ethUsdFeedAddress);
        // prettier-ignore
        ( ,
            int256 answer,
            ,
           ,
        ) =feed.latestRoundData();
        uint256 decimals = 18 - uint256(feed.decimals());
        // Get price to have the same number of decimals as wei
        return uint256(answer * int256((uint256(10) ** decimals)));
    }

    function convertEth(uint256 ethAmount) internal view returns (uint256) {
        uint256 ethPrice = getEthUsd();
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}
