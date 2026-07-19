const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Hello From Home page");
});

app.use("/test", (req, res) => {
  res.send("hello from test");
});

app.listen(8000);
