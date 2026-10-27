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
const chatRouter = require("./routes/chat");
const initializeSocket = require("./services/socket");

if (process.env.ENABLE_CRON !== "false") {
  require("./jobs/cronjob");
}

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
app.use("/", chatRouter);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const httpServer = createServer(app);
initializeSocket(httpServer);

const PORT = process.env.PORT || 8000;
connectDB()
  .then(() => {
    console.log("Connected to Database");

    httpServer.listen(PORT, () => {
      console.log(`Server started listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
