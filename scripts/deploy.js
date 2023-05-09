const hre = require("hardhat");

async function main() {
  [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const ERC20 = await ethers.getContractFactory("PepeAI", deployer);

  const TokenERC20 = await ERC20.deploy();

  await TokenERC20.deployed();

  console.log("Token ERC20 address:", TokenERC20.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
