const connectButton = document.getElementById("connectButton");

if (connectButton) {
  connectButton.addEventListener("click", myFunction);
}

const connectButton2 = document.getElementById("connect_button");
connectButton2.addEventListener("click", myFunction);

async function myFunction() {
  let isAccountConnected = false;

  if (typeof web3 !== "undefined") {
    web3 = new Web3(window.ethereum);
  } else {
    alert(
      "Metamask не доступен, установите необходимое расширение https://chrome.google.com/webstore"
    );
  }

  await web3.eth
    .requestAccounts()
    .then((accounts) => {
      const userAccount = accounts[0];
      isAccountConnected = true;
    })
    .catch((error) => {
      console.error("Ошибка при запросе аккаунтов:", error);
    });

  if (!isAccountConnected) {
    // Возвращаем кнопку в исходное состояние
    if (connectButton) {
      connectButton.disabled = false;
      connectButton.textContent = "Connect Wallet";
    }
    connectButton2.disabled = false;
    connectButton2.textContent = "Connect Wallet";
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }], // 0x38
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

  await web3.eth
    .getAccounts()
    .then((accounts) => {
      // Проверяем, есть ли доступные аккаунты
      if (accounts.length > 0) {
        const connectedAccount = accounts[0];
        const buttonTextSmal = `${connectedAccount.substring(
          0,
          4
        )}...${connectedAccount.slice(-4)}`;
        const buttonTextBig = `${connectedAccount.substring(
          0,
          8
        )}...${connectedAccount.slice(-8)}`;
        if (connectButton) {
          connectButton.disabled = true;
          connectButton.textContent = buttonTextBig;
          connectButton.title = connectedAccount;
        }
        connectButton2.disabled = true;
        connectButton2.textContent = buttonTextSmal;
        connectButton2.title = connectedAccount;

        localStorage.setItem("connectedAccount", connectedAccount);
      } else {
        console.log("Аккаунты не доступны.");
      }
    })
    .catch((error) => {
      console.error("Ошибка при получении аккаунтов:", error);
    });

  return isAccountConnected;
}

if (myFunction()) {
  const savedAccount = localStorage.getItem("connectedAccount");
  if (savedAccount) {
    const buttonTextSmal = `${savedAccount.substring(
      0,
      4
    )}...${savedAccount.slice(-4)}`;
    const buttonTextBig = `${savedAccount.substring(
      0,
      8
    )}...${savedAccount.slice(-8)}`;
    if (connectButton) {
      connectButton.disabled = true;
      connectButton.textContent = buttonTextBig;
    }
    connectButton2.disabled = true;
    connectButton2.textContent = buttonTextSmal;
  }
}
