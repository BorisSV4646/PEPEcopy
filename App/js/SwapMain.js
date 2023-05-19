async function getWallet() {
  if (typeof web3 !== "undefined") {
    web3 = new Web3(window.ethereum);
  } else {
    alert(
      "Metamask не доступен, установите необходимое расширение https://chrome.google.com/webstore"
    );
    return;
  }

  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      const connectedAccount = accounts[0];
      return connectedAccount;
    } else {
      console.log("Аккаунты не доступны.");
    }
  } catch (error) {
    console.error("Ошибка при получении аккаунтов:", error);
  }
}

const tokenAddressDai = "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3";
const tokenAddressBnb = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

const swapButton = document.getElementById("swapButton");
swapButton.addEventListener("click", swap);

async function swapEthToBnb() {
  const web3 = new Web3(window.ethereum);
  const walletAdress = await getWallet();

  const uniContractRouterAdress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
  const uniContractRouterABI = [
    {
      constant: false,
      inputs: [
        {
          name: "amountOutMin",
          type: "uint256",
        },
        {
          name: "path",
          type: "address[]",
        },
        {
          name: "to",
          type: "address",
        },
        {
          name: "deadline",
          type: "uint256",
        },
      ],
      name: "swapExactETHForTokens",
      outputs: [
        {
          name: "amounts",
          type: "uint256[]",
        },
      ],
      payable: true,
      stateMutability: "payable",
      type: "function",
    },
  ];

  const tuniContract = new web3.eth.Contract(
    uniContractRouterABI,
    uniContractRouterAdress
  );

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const path = [tokenAddressDai, tokenAddressBnb];
  const amountOutMin = "0";
  await tuniContract.methods
    .swapExactETHForTokens(amountOutMin, path, walletAdress, deadline)
    .send({ from: walletAdress });
}

async function swapBnbToEth() {
  const web3 = new Web3(window.ethereum);
  const walletAdress = await getWallet();

  const uniContractRouterAdress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
  const uniContractRouterABI = [
    {
      constant: false,
      inputs: [
        {
          name: "amountIn",
          type: "uint256",
        },
        {
          name: "amountOutMin",
          type: "uint256",
        },
        {
          name: "path",
          type: "address[]",
        },
        {
          name: "to",
          type: "address",
        },
        {
          name: "deadline",
          type: "uint256",
        },
      ],
      name: "swapExactTokensForETH",
      outputs: [
        {
          name: "amounts",
          type: "uint256[]",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const tuniContract = new web3.eth.Contract(
    uniContractRouterABI,
    uniContractRouterAdress
  );

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const path = [tokenAddressDai, tokenAddressBnb];
  const amountOutMin = "0";
  const amountIn = "5";
  await tuniContract.methods
    .swapExactTokensForETH(amountIn, amountOutMin, path, walletAdress, deadline)
    .send({ from: walletAdress });
}
