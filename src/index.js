const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello From Home page");
});

app.get("/test", (req, res) => {
  res.send("hello from test");
});

app.listen(8000);
