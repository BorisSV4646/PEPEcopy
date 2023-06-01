const path = require("path");
const express = require("express");
const mime = require("mime");
const app = express();
const functions = require("./js/RefDatabase");

const a = app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index2.html`);
});

app.get("/staking", (req, res) => {
  res.sendFile(`${__dirname}/staking.html`);
});

app.get("/community", (req, res) => {
  res.sendFile(`${__dirname}/community.html`);
});

app.get("/swap", (req, res) => {
  res.sendFile(`${__dirname}/swap.html`);
});

app.get("/referral/:referralId", async (req, res) => {
  const referralId = req.params.referralId;
  const waleetAdress = req.query.userId;

  await functions.addRefUrl(referralId, waleetAdress);

  res.sendFile(`${__dirname}/index2.html`);
});

app.listen(3333, () => {
  console.log("Application listening on port 3333");
});
