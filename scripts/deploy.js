const hre = require("hardhat");

async function main() {
  const initSuplay = 420690000000000;
  [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const ERC20 = await ethers.getContractFactory("WinXSnapshot", deployer);

  const TokenERC20 = await ERC20.deploy(initSuplay);

  await TokenERC20.deployed(initSuplay);

  console.log("Token ERC20 address:", TokenERC20.address);

  const Staking = await ethers.getContractFactory("StakingWinX", deployer);

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
