const express = require("express");

const app = express();

// how does this work /user?userID=101 if u hit this frm POSTMAN
app.get("/user", (req, res) => {
  console.log(req.query); // whats this ?
  res.send("Hello From Home page");
});

//dynamic routes  --
app.get("/user/:userID/:name/:password", (req, res) => {
  console.log(req.params); // whats this ?
  res.send("Hello From Home page");
});

app.get("/", (req, res) => {
  res.send("Hello From Home page");
});

app.get("/test", (req, res) => {
  res.send("hello from test");
});

app.listen(8000);
