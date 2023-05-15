const connectButton = document.getElementById("connectButton");

if (connectButton) {
  connectButton.addEventListener("click", myFunction);
}

// function myFunctionMain() {
//   console.log("Кнопка 1 была нажата!");
//   if (typeof web3 !== "undefined") {
//     web3 = new Web3(web3.currentProvider);
//   } else {
//     alert(
//       "Metamask не доступен, установите необходимое расширение https://chrome.google.com/webstore"
//     );
//   }

//   web3.eth
//     .requestAccounts()
//     .then((accounts) => {
//       const userAccount = accounts[0];
//       console.log("Аккаунт пользователя:", userAccount);
//     })
//     .catch((error) => {
//       console.error("Ошибка при запросе аккаунтов:", error);
//     });
// }

document.getElementById("connect_button").addEventListener("click", myFunction);

async function myFunction() {
  console.log("Кнопка 2 была нажата!");
  if (typeof web3 !== "undefined") {
    web3 = new Web3(window.ethereum);
  } else {
    alert(
      "Metamask не доступен, установите необходимое расширение https://chrome.google.com/webstore"
    );
  }

  web3.eth
    .requestAccounts()
    .then((accounts) => {
      const userAccount = accounts[0];
    })
    .catch((error) => {
      console.error("Ошибка при запросе аккаунтов:", error);
    });

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }],
    });
    console.log("Вы переключились на нужную сеть");
  } catch (switchError) {
    // Сеть не была добавлена в MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x38",
              chainName: "Binance Smart Chain",
              rpcUrls: ["https://bsc-dataseed.binance.org/"],
              blockExplorerUrls: ["https://bscscan.com/"],
              nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
              },
            },
          ],
        });
      } catch (err) {
        console.log(err);
      }
    }
    console.log("Не удается подключиться к сети");
  }
}
