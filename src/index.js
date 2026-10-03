require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookie = require("cookie-parser");
const cors = require("cors");
const { createServer } = require("http");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");
require("./utils/cronjob");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // we need to set to true if sending cookies, auth tokens, or sessions
  }),
);
app.use(express.json());
app.use(cookie());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

const httpServer = createServer(app);
initializeSocket(httpServer);

connectDB()
  .then(() => {
    console.log("Connected to DataBase");
    httpServer.listen(process.env.PORT, () => {
      console.log("Server started to listing on 8000");
    });
  })
  .catch(() => {
    console.log("Something went Wrong");
  });
