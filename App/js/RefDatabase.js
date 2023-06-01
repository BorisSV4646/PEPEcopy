const { MongoClient } = require("mongodb");
const shortid = require("shortid");
require("dotenv").config();

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

async function createRefUrl() {
  const uri = `mongodb+srv://${process.env.USER_MONGODB}:${process.env.PASSWORD_MONGODB}@peppaai.jtic3gi.mongodb.net/?retryWrites=true&w=majority`;

  const client = new MongoClient(uri);

  const waleetAdress = "0x9e8f5c7c8b9a4d0d0e4d7d8e8c8d8e8d8e8d8e"; //await getWallet();

  const referralId = shortid.generate();

  try {
    await client.connect();

    await createListingReferal(client, {
      _id: referralId,
      referalurl: generateReferralLink(waleetAdress, referralId),
      address: `${waleetAdress}`,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function addRefUrl(referralId, waleetAdress) {
  const uri = `mongodb+srv://${process.env.USER_MONGODB}:${process.env.PASSWORD_MONGODB}@peppaai.jtic3gi.mongodb.net/?retryWrites=true&w=majority`;

  const client = new MongoClient(uri);

  const waleetAdressOwner = "0x9e8f5c7c8b9a4d0d0e4d7d8e8c8d8e8d8e8d8e"; //await getWallet();

  try {
    await client.connect();

    await createListingInvated(client, {
      _id: referralId,
      referalurl: `http://65.108.252.170/referral/${referralId}?userId=${waleetAdress}`,
      addressReferal: `${waleetAdress}`,
      addressOwner: `${waleetAdressOwner}`,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

async function createDatabase(client) {
  const admin = await client.db("Referals").command({ create: "Invated" });
}

async function createListingReferal(client, newListing) {
  const result = await client
    .db("Referals")
    .collection("Referal")
    .insertOne(newListing);

  console.log(
    `New listing created with the following id: ${result.insertedId}`
  );
}

async function createListingInvated(client, newListing) {
  const result = await client
    .db("Referals")
    .collection("Invated")
    .insertOne(newListing);

  console.log(
    `New listing created with the following id: ${result.insertedId}`
  );
}

function generateReferralLink(waleetAdress, referralId) {
  const referralLink = `http://65.108.252.170/referral/${referralId}?userId=${waleetAdress}`;
  return referralLink;
}

module.exports = {
  addRefUrl: addRefUrl,
};
