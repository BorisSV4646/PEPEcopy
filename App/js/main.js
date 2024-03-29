// import { swapBnbToEth, swapEthToBnb } from "./Swap.js";
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
const { ethers } = require("ethers");
const { getDefaultProvider } = require("ethers");
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

  const slippageTolerance = new Percent("50", "10000");
  const amountIn = trade.maximumAmountIn(slippageTolerance);
  const amountOutMin = trade.minimumAmountOut(slippageTolerance);
  const path = [weth.address, wbnb.address];
  const to = "";
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  // const value = trade.inputAmount.raw;

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

// const swapBnbToEth = async (value) => {
//   const wbnb = WBNB[chainId];
//   const weth = WETH9[chainId];

//   const pair = await Fetcher.fetchPairData(wbnb, weth, provider);

//   const route = new Route([pair], wbnb, weth);
//   const amountOut = value * 10 ** 18;
//   const amount = CurrencyAmount.fromRawAmount(wbnb, amountOut);
//   const trade = new Trade(route, amount, TradeType.EXACT_INPUT);
//   const howMuchETH = route.midPrice.toSignificant(6);
//   console.log(howMuchETH);
//   console.log(route.midPrice.invert().toSignificant(6));
//   console.log(trade.executionPrice.toSignificant(6));
//   // console.log(trade.nextMidPrice.toSignificant(6));

//   const slippageTolerance = new Percent("50", "10000");
//   const amountIn = trade.maximumAmountIn(slippageTolerance);
//   const amountOutMin = trade.minimumAmountOut(slippageTolerance);
//   const path = [wbnb.address, weth.address];
//   const to = "";
//   const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
//   // const value = trade.inputAmount.raw;

//   console.log(amountOutMin.toExact());
//   console.log(amountIn.toExact());

//   return howMuchETH;
// };

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

  const value = parseFloat(inputSwap.value);
  const { howMuchBNB, path, deadline, amountIn, amountOutMin } =
    await swapEthToBnb(value);
  const deadlineSwap = deadline;
  const pathSwap = path;
  const amountOutMinSwap = amountOutMin;
  await tuniContract.methods
    .swapExactETHForTokens(
      amountOutMinSwap,
      pathSwap,
      walletAdress,
      deadlineSwap
    )
    .send({
      from: walletAdress,
      value: ethers.utils.parseEther(value.toString()),
    });
}

const swapButton = document.getElementById("swapButton");

const inputSwap = document.getElementById("inputSwap");
const outputSwap = document.getElementById("outputSwap");

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

async function getTokenBalanceETH() {
  const web3 = new Web3("https://bsc-dataseed1.binance.org");
  const tokenContractAddress = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8";
  const wallets = await web3.eth.getAccounts();
  const waleetAdress = await getWallet();

  const tokenContractABI = [
    {
      constant: true,
      inputs: [
        {
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ];

  const tokenContract = new web3.eth.Contract(
    tokenContractABI,
    tokenContractAddress
  );

  try {
    const balance = await tokenContract.methods.balanceOf(waleetAdress).call();

    const tokenElement = document.getElementById("tokenBalanceChange");
    tokenElement.innerHTML = `${balance} ETH`;
  } catch (error) {
    console.error("Ошибка при получении баланса токенов:", error);
  }
}

async function getTokenBalanceBNB() {
  const web3 = new Web3("https://bsc-dataseed1.binance.org");
  const tokenContractAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
  const wallets = await web3.eth.getAccounts();
  const waleetAdress = await getWallet();

  const tokenContractABI = [
    {
      constant: true,
      inputs: [
        {
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ];

  const tokenContract = new web3.eth.Contract(
    tokenContractABI,
    tokenContractAddress
  );

  try {
    const balance = await tokenContract.methods.balanceOf(waleetAdress).call();

    const tokenElement = document.getElementById("tokenBalanceChange");
    tokenElement.innerHTML = `${balance} BNB`;
  } catch (error) {
    console.error("Ошибка при получении баланса токенов:", error);
  }
}

async function getPriceEth(element) {
  fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  )
    .then((response) => response.json())
    .then((data) => {
      const ethPrice = data.ethereum.usd;
      const priceElement = document.getElementById(element);
      priceElement.innerHTML = `${ethPrice} $`;
    })
    .catch((error) => {
      console.error("Ошибка при получении цены ETH:", error);
    });
}

async function getPriceBnb(element) {
  fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
  )
    .then((response) => response.json())
    .then((data) => {
      const bnbPrice = data.binancecoin.usd;
      const priceElement = document.getElementById(element);
      priceElement.innerHTML = `${bnbPrice} $`;
    })
    .catch((error) => {
      console.error("Ошибка при получении цены BNB:", error);
    });
}

$(document).ready(function () {
  $(".header-menu-close").click(function () {
    $(".header-menu").removeClass("active");
  });

  $(".header-burger").click(function () {
    if ($(".header-menu").hasClass("active")) {
      $(".header-menu").removeClass("active");
      $(".header-burger").removeClass("close");
      setTimeout(function () {
        $(".header-burger").removeClass("active");
      }, 300);
    } else {
      $(".header-menu").addClass("active");
      $(".header-burger").addClass("active");
      setTimeout(function () {
        $(".header-burger").addClass("close");
      }, 300);
    }
  });

  const roadmapSlider = new Swiper(".roadmap-slider", {
    spaceBetween: 20,
    navigation: {
      nextEl: ".roadmap-slider-next",
      prevEl: ".roadmap-slider-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      751: {
        slidesPerView: 2,
      },
      1051: {
        slidesPerView: 3,
      },
    },
  });

  let swapSelector;

  $(".swap-tokens-bg, .swap-tokens-block-close").click(function () {
    swapSelector = "";
    $(".swap-tokens-bg").removeClass("active");
    $(".swap-tokens-block").removeClass("active");
    setTimeout(function () {
      $(".swap-tokens-wrapper").removeClass("active");
    }, 300);
  });

  $(".swap-block-item-selector").click(function () {
    swapSelector = $(this);
    $(".swap-tokens-wrapper").addClass("active");
    setTimeout(function () {
      $(".swap-tokens-bg").addClass("active");
      $(".swap-tokens-block").addClass("active");
    }, 1);
  });

  $(".swap-tokens-block-item").click(function () {
    swapSelector.find(".swap-block-item-selector-text").text("");
    swapSelector
      .find(".swap-block-item-selector-text")
      .prepend(
        `<span>${$(this).find(".swap-tokens-block-item-text").text()}</span>`
      );
    swapSelector
      .find(".swap-block-item-selector-text")
      .prepend(
        `<img src="${$(this)
          .find(".swap-tokens-block-item-icon img")
          .attr("src")}" alt="">`
      );
    swapSelector = "";
    if (`${$(this).find(".swap-tokens-block-item-text").text()}` == "ETH") {
      $(".swap-block-item-selector").find("#toText").text("");
      $(".swap-block-item-selector")
        .find("#toText")
        .prepend(`<span>BNB</span>`);
      $(".swap-block-item-selector")
        .find("#toText")
        .prepend(`<img src="img/swap-block-item-1.png" alt="">`);
      getPriceEth("changePrice");
      swapButton.addEventListener("click", swapEthToBnbTransaction);
      getTokenBalanceETH();
      inputElement.addEventListener("input", async function (event) {
        const value = parseFloat(inputSwap.value);
        const { howMuchBNB, path, deadline, amountIn, amountOutMin } =
          await swapEthToBnb(value);
        const finalValue = value * howMuchBNB;
        outputSwap.value = finalValue.toFixed(2);
      });
    } else {
      $(".swap-block-item-selector").find("#toText").text("");
      $(".swap-block-item-selector")
        .find("#toText")
        .prepend(`<span>ETH</span>`);
      $(".swap-block-item-selector")
        .find("#toText")
        .prepend(`<img src="img/swap-block-item-0.png" alt="">`);
      getPriceBnb("changePrice");
      getTokenBalanceBNB();
      inputElement.addEventListener("input", async function (event) {
        const value = parseFloat(inputSwap.value);
        const { howMuchBNB, path, deadline, amountIn, amountOutMin } =
          await swapEthToBnb(value);
        console.log(howMuchBNB);
        const finalValue = value * howMuchBNB;
        console.log(finalValue);
        outputSwap.value = finalValue.toFixed(2);
      });
    }
    $(".swap-tokens-bg").removeClass("active");
    $(".swap-tokens-block").removeClass("active");
    setTimeout(function () {
      $(".swap-tokens-wrapper").removeClass("active");
    }, 300);
  });

  $(".staking-questions-block-item-top").click(function () {
    if ($(this).parents(".staking-questions-block-item").hasClass("active")) {
      $(this)
        .parents(".staking-questions-block-item")
        .find(".staking-questions-block-item-bottom")
        .slideUp(300);
      $(this).parents(".staking-questions-block-item").removeClass("active");
    } else {
      $(this)
        .parents(".staking-questions-block-item")
        .find(".staking-questions-block-item-bottom")
        .slideToggle(300);
      $(this).parents(".staking-questions-block-item").addClass("active");
    }
  });

  if ($(".staking-pool-range").length) {
    let slider1 = document.getElementById("slider1");
    let selector1 = document.getElementById("selector1");
    //let result1 = document.getElementById('result1');
    let rangeLine1 = document.getElementById("range-line1");

    //result1.innerHTML = slider1.value;
    selector1.style.left = slider1.value + "%";
    rangeLine1.style.width = slider1.value + "%";
    slider1.oninput = function () {
      selector1.style.left = this.value + "%";
      //result1.innerHTML = this.value;
      rangeLine1.style.width = this.value + "%";
    };

    let slider2 = document.getElementById("slider2");
    let selector2 = document.getElementById("selector2");
    //let result1 = document.getElementById('result1');
    let rangeLine2 = document.getElementById("range-line2");

    //result1.innerHTML = slider1.value;
    selector2.style.left = slider2.value + "%";
    rangeLine2.style.width = slider2.value + "%";
    slider2.oninput = function () {
      selector2.style.left = this.value + "%";
      //result1.innerHTML = this.value;
      rangeLine2.style.width = this.value + "%";
    };

    $(".staking-pool-tab").click(function () {
      $(".staking-pool-tab").removeClass("active");
      $(".staking-pool-content").removeClass("active");
      $(this).addClass("active");
      $(
        `.staking-pool-content[data-tab="${$(this).attr("data-tab")}"]`
      ).addClass("active");
    });

    $(".staking-item-btn-stake").click(function () {
      $(".staking-pool-wrapper").addClass("active");
      setTimeout(function () {
        $(".staking-pool-bg").addClass("active");
        $(".staking-pool-block").addClass("active");
      }, 1);
    });

    $("#unstakeButton").click(function () {
      $(".staking-pool-wrapper").addClass("active");
      setTimeout(function () {
        $(".staking-pool-bg").addClass("active");
        $(".staking-pool-block").addClass("active");
      }, 1);
    });

    $(".staking-pool-bg, .staking-pool-close").click(function () {
      selector1.style.left = 0 + "%";
      rangeLine1.style.width = 0 + "%";
      selector2.style.left = 0 + "%";
      rangeLine2.style.width = 0 + "%";
      $(".staking-pool-bg").removeClass("active");
      $(".staking-pool-block").removeClass("active");
      setTimeout(function () {
        $(".staking-pool-wrapper").removeClass("active");
      }, 1);
    });

    $("#cancelButton").click(function () {
      selector1.style.left = 0 + "%";
      rangeLine1.style.width = 0 + "%";
      selector2.style.left = 0 + "%";
      rangeLine2.style.width = 0 + "%";
      $(".staking-pool-bg").removeClass("active");
      $(".staking-pool-block").removeClass("active");
      setTimeout(function () {
        $(".staking-pool-wrapper").removeClass("active");
      }, 1);
    });
  }
});

const inputElement = document.getElementById("inputSwap");
