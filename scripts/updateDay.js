const Web3 = require("web3");
const contractABI = require("./AbiStaking.json");
const contractAddress = "...";

const web3 = new Web3(process.env.BSC_RPC_URL);

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function callChangeDay() {
  try {
    const myAddress = web3.eth.accounts.privateKeyToAccount(
      process.env.PRIVATE_KEY
    );

    await contract.methods.changeDay().send({ from: myAddress });

    console.log("Функция changeDay() успешно вызвана на контракте.");
  } catch (error) {
    console.error("Ошибка при вызове функции changeDay():", error);
  }
}

setInterval(callChangeDay, 24 * 60 * 60 * 1000);
