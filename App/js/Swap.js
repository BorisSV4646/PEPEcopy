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
const provider = getDefaultProvider("https://1rpc.io/bnb");
const chainId = ChainId.BSC;

const swapEthToBnb = async () => {
  const wbnb = WBNB[chainId];
  const weth = WETH9[chainId];

  const pair = await Fetcher.fetchPairData(weth, wbnb, provider);

  const route = new Route([pair], weth, wbnb);
  const amountOut = 10;
  const amount = CurrencyAmount.fromRawAmount(weth, amountOut);
  const trade = new Trade(route, amount, TradeType.EXACT_INPUT);
  console.log(route.midPrice.toSignificant(6));
  console.log(route.midPrice.invert().toSignificant(6));
  console.log(trade.executionPrice.toSignificant(6));
  // console.log(trade.nextMidPrice.toSignificant(6));

  const slippageTolerance = new Percent("50", "10000");
  const amountIn = trade.maximumAmountIn(slippageTolerance);
  const amountOutMin = trade.minimumAmountOut(slippageTolerance);
  const path = [weth.address, wbnb.address];
  const to = "";
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const value = trade.inputAmount.raw;

  console.log(amountOutMin.toExact());
  console.log(amountIn.toExact());
};

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
