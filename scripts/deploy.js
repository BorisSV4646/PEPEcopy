const hre = require("hardhat");

async function main() {
  [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const ERC20 = await ethers.getContractFactory("WinX", deployer);

  const TokenERC20 = await ERC20.deploy();

  await TokenERC20.deployed();

  console.log("Token ERC20 address:", TokenERC20.address);

  const Staking = await ethers.getContractFactory("ERC20Stakeable", deployer);

  const StakingContract = await Staking.deploy(
    TokenERC20.address,
    deployer.address
  );

  await StakingContract.deployed(TokenERC20.address, deployer.address);

  console.log("Staking Contract address:", StakingContract.address);

  await TokenERC20.transfer(
    StakingContract.address,
    "29448300000000000000000000000000"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
