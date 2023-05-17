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

async function getTokenContract() {}

async function getTokenBalance() {
  const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
  const tokenContractAddress = "0x45D283fD00C0cBEcE8D44a273410891492de3F88";
  const wallets = await web3.eth.getAccounts();
  const waleetAdress = await getWallet();

  const tokenContractABI = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "addedValue", type: "uint256" },
      ],
      name: "increaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "sender", type: "address" },
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const tokenContract = new web3.eth.Contract(
    tokenContractABI,
    tokenContractAddress
  );

  let balance;
  try {
    let balance = await tokenContract.methods.balanceOf(waleetAdress).call();

    const tokenElement = document.getElementById("balanceUser");
    tokenElement.innerHTML = `${balance / 10 ** 18}`;
  } catch (error) {
    console.error("Ошибка при получении баланса токенов:", error);
  }

  return balance;
}

getTokenBalance();

async function getContract() {
  const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
  const stakeContractAddress = "0xDF7C013E57A2577b2027e285aB1B4615946A7Ba0";

  const stakeContractABI = [
    {
      inputs: [
        { internalType: "address", name: "_token", type: "address" },
        { internalType: "address", name: "_burnable", type: "address" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "staker",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "Stake",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "staker",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_deposit",
          type: "uint256",
        },
      ],
      name: "Withdraw",
      type: "event",
    },
    {
      inputs: [{ internalType: "address", name: "to", type: "address" }],
      name: "WithdrawFromContract",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "changeDay",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_newreward", type: "uint256" },
      ],
      name: "changeMaxRewardDay",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_newreward", type: "uint256" },
      ],
      name: "changeRewardPerHour",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "claimRewards",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
      name: "deposit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_user", type: "address" }],
      name: "getDepositInfo",
      outputs: [
        { internalType: "uint256", name: "_stake", type: "uint256" },
        { internalType: "uint256", name: "_rewards", type: "uint256" },
        { internalType: "uint256", name: "_startStaking", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "minStake",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "rewardsPerHour",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "rewardsToken",
      outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalStaked",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "withdrawAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const stakeContract = new web3.eth.Contract(
    stakeContractABI,
    stakeContractAddress
  );

  return stakeContract;
}

async function getStaking() {
  const stakeContract = await getContract();
  const waleetAdress = await getWallet();
  try {
    const balanceAll = await stakeContract.methods.totalStaked().call();
    const balanceStakingUser = await stakeContract.methods
      .getDepositInfo(waleetAdress)
      .call();

    const allStaking = document.getElementById("totalStake");
    allStaking.innerHTML = `${balanceAll / 10 ** 18}`;

    const singleStake = document.getElementById("peppaStaked");
    singleStake.innerHTML = `${balanceStakingUser["_stake"] / 10 ** 18}`;

    const eranedFinal = balanceStakingUser["_rewards"] / 10 ** 18;
    const earnedPeppa = document.getElementById("earnedPeppa");
    earnedPeppa.innerHTML = `${eranedFinal.toFixed(5)}`;

    const unstakeBalance = document.getElementById("unstakeBalance");
    unstakeBalance.innerHTML = `${balanceStakingUser["_stake"] / 10 ** 18}`;
  } catch (error) {
    console.error("Ошибка при получении баланса токенов:", error);
  }
}

getStaking();

const myInputStake = document.getElementById("myInputStake");
const myInputUnstake = document.getElementById("myInputUnstake");
const confirmButton = document.getElementById("confirmButton");

let stakingPoolContent = document.querySelector(".staking-pool-content");

if (stakingPoolContent.getAttribute("data-tab") === "1") {
  confirmButton.addEventListener("click", stakingFunction);
} else {
  confirmButton.addEventListener("click", unstakingFunction);
}

async function stakingFunction() {
  const stakeContract = await getContract();
  const waleetAdress = await getWallet();
  const userBalance = await getTokenBalance();
  const value = parseFloat(myInputStake.value);

  if (value > 0 && value <= userBalance) {
    try {
      const balanceAll = await stakeContract.methods.totalStaked().call();
    } catch (error) {
      console.error("Ошибка:", error);
    }
  } else {
    alert("Введите значение больше 0 и не больше вашего баланса");
  }
}

async function unstakingFunction() {
  const balance = getTokenBalance();

  const valueStake = myInputStake.value;
  const valueUnstake = myInputUnstake.value;
}

async function claimReward() {
  const balance = getTokenBalance();

  const valueStake = myInputStake.value;
  const valueUnstake = myInputUnstake.value;
}
