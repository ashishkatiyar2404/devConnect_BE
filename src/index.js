const express = require("express");
const connectDB = require("./config/database");
const cookie = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();
app.use(express.json());
app.use(cookie());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Connected to DataBase");
    app.listen(8000, () => {
      console.log("Server started to listing on 8000");
    });
  })
  .catch(() => {
    console.log("Something went Wrong");
  });
