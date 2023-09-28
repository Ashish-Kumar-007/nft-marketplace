const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // const NFTContract = await ethers.deployContract('NFT');
  // await NFTContract.waitForDeployment();
  // console.log('Contract address:', NFTContract.target);

  const MarketplaceContract = await ethers.deployContract("NFTMarketplace", ["0xfc23e593845E717c52983CEFf5E24CED7e2964b8"]);
  await MarketplaceContract.waitForDeployment();

  console.log("Contract address:", MarketplaceContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
