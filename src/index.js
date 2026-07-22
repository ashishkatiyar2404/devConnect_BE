const express = require("express");

const { adminAuthorized, userAuthorized } = require("./middleware/auth");

const app = express();

app.use("/admin", adminAuthorized);

app.get("/admin/allData", (req, res) => {
  res.send("Authorized Admin");
});

app.use("/user", userAuthorized);

app.get("/user/allData", (req, res) => {
  res.send("Authorized User");
});

app.all("/ashish", (req, res, next) => {
  res.send("/ashish");
});

app.get("/ashish/profile", (req, res, next) => {
  res.send("/ashish/Profile");
});

app.use((req, res, next) => {
  console.log("route 1");
  next();
});

app.get("/ashish", (req, res, next) => {
  console.log("route 2");
  res.send("hello");
  next();
});

app.get("/ashish/profile", (req, res, next) => {
  console.log("route 3");
  // res.send("hello");
  // next();
});

app.get(
  "/ashishNext",
  (req, res, next) => {
    // res.send("response 1");
    res.send("response 1");
    console.log("first11");
    // next();
  },
  [
    (req, res, next) => {
      res.send("response 2");
      console.log("response 2");
      next();
    },
    (req, res, next) => {
      next();
      res.send("response 2");
      console.log("111");
    },
  ],
  (req, res, next) => {
    res.send("response last");
    console.log("first");
    next();
  },
);

//use regex for pattern matching
app.use(/^\/ab?c$/, (req, res) => {
  res.send({ user: "Ashish" });
});

// how does this work /user?userID=101 if u hit this frm POSTMAN
app.get("/user", (req, res) => {
  res.send(req.query);
});

//dynamic routes  --
app.get("/user/:userID/:name/:password", (req, res) => {
  res.send(req.params);
});

app.get("/", (req, res) => {
  res.send("Hello From Home page");
});

app.get("/test", (req, res) => {
  res.send("hello from test");
});

app.listen(8000);
