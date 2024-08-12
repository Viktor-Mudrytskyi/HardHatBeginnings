# HardHatBeginnings

# Run

yarn hardhat run scripts/deploy.ts
yarn hardhat run scripts/deploy.ts --network localhost

# Create localhost blockchain

yarn hardhat node

# Testing

yarn hardhat test
yarn hardhat test --grep store // grep grabs tests which contain provided string

Unit testing:

-   local hardhat
-   forked hardhat

Staging testing:

-   on a testnet

# Hardhat deploy

yarn hardhat deploy
yarn hardhat deploy --tags [tag-name]

# Solidity coverage

yarn hardhat coverage

# Typechain

yarn hardhat typechain // generates types for contarcts
