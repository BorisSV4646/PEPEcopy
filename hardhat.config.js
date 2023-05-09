require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    goerly: {
      url: process.env.INFURA_URL_GOERLY,
      accounts: [process.env.PRIVATE_KEY],
    },
    sepolia: {
      url: process.env.INFURA_URL_SEPOLYA,
      accounts: [process.env.PRIVATE_KEY],
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    polygon: {
      url: process.env.POLYGON_RPC_MAINET,
      accounts: [process.env.PRIVATE_KEY],
    },
    BSC_main: {
      url: process.env.BSC_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    BSC_test: {
      url: process.env.BSC_Testnet_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.17",
  },
  etherscan: {
    apiKey: process.env.BSC_API_KEY,
  },
};
