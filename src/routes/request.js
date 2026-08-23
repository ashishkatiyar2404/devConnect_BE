const express = require("express");
const requestRouter = express.Router();

const { UserAuth } = require("../middleware/auth");

requestRouter.post("/sendConnectionRequest", UserAuth, (req, res) => {
  res.send(req.user.firstName + " is send you a request");
});

module.exports = requestRouter;
