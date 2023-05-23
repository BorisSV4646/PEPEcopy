const {
  ChainId,
  Token,
  Route,
  Fetcher,
  WBNB,
  WETH9,
  Trade,
  TradeType,
  Percent,
  CurrencyAmount,
} = require("@pancakeswap/sdk");
const { getDefaultProvider } = require("ethers");
const { Web3 } = require("web3");
const provider = getDefaultProvider("https://1rpc.io/bnb");
const chainId = ChainId.BSC;

const swapEthToBnb = async (value) => {
  const wbnb = WBNB[chainId];
  const weth = WETH9[chainId];

  const pair = await Fetcher.fetchPairData(weth, wbnb, provider);

  const route = new Route([pair], weth, wbnb);
  const amountOut = value * 10 ** 18;
  const amount = CurrencyAmount.fromRawAmount(weth, amountOut);
  const trade = new Trade(route, amount, TradeType.EXACT_INPUT);
  const howMuchBNB = route.midPrice.toSignificant(6);
  console.log(howMuchBNB);
  console.log(route.midPrice.invert().toSignificant(6));
  console.log(trade.executionPrice.toSignificant(6));
  // console.log(trade.nextMidPrice.toSignificant(6));

  const slippageTolerance = new Percent("1", "100");
  const amountIn = trade.maximumAmountIn(slippageTolerance);
  const amountOutMin = trade.minimumAmountOut(slippageTolerance);
  const path = [weth.address, wbnb.address];
  const to = "";
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  // const value  = trade.inputAmount.raw;

  console.log(amountOutMin.toExact());
  console.log(amountIn.toExact());
  return {
    howMuchBNB: howMuchBNB,
    path: path,
    deadline: deadline,
    amountIn: amountIn.toExact(),
    amountOutMin: amountOutMin.toExact(),
  };
};

async function test() {
  const { howMuchBNB, path, deadline, amountIn, amountOutMin } =
    await swapEthToBnb(1);
  console.log(howMuchBNB, amountOutMin, amountIn);
}

test();

const swapBnbToEth = async () => {
  const wbnb = WBNB[chainId];
  const weth = WETH9[chainId];

  const pair = await Fetcher.fetchPairData(wbnb, weth, provider);

  const route = new Route([pair], wbnb, weth);
  const amountOut = 10;
  const amount = CurrencyAmount.fromRawAmount(wbnb, amountOut);
  const trade = new Trade(route, amount, TradeType.EXACT_INPUT);
  console.log(route.midPrice.toSignificant(6));
  console.log(route.midPrice.invert().toSignificant(6));
  console.log(trade.executionPrice.toSignificant(6));
  // console.log(trade.nextMidPrice.toSignificant(6));

  const slippageTolerance = new Percent("50", "10000");
  const amountIn = trade.maximumAmountIn(slippageTolerance);
  const amountOutMin = trade.minimumAmountOut(slippageTolerance);
  const path = [wbnb.address, weth.address];
  const to = "";
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const value = trade.inputAmount.raw;

  console.log(amountOutMin.toExact());
  console.log(amountIn.toExact());
};

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

async function swapEthToBnbTransaction() {
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

  const returnValue = swapEthToBnb(1);

  const value = 1;

  const deadline = returnValue.deadline;
  const path = returnValue.path;
  const amountOutMin = returnValue.amountOutMin;
  await tuniContract.methods
    .swapExactETHForTokens(amountOutMin, path, walletAdress, deadline)
    .send({
      from: walletAdress,
      value: ethers.utils.parseEther(value.toString()),
    });
}

async function swapBnbToEthTransaction() {
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
