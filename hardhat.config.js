require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    BSC_main: {
      url: process.env.BSC_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    BSC_test: {
      url: process.env.BSC_Testnet_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    goerly: {
      url: process.env.INFURA_URL_GOERLY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.17",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
