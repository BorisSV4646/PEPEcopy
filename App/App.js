const path = require("path");
const express = require("express");
const app = express();

const a = app.use(express.static(path.join(__dirname)));
console.log(path.join(__dirname));

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

app.listen(3333, () => {
  console.log("Application listening on port 3333");
});
