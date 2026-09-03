const express = require("express");
const { UserAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "photoUrl",
  "age",
  "gender",
  "about",
  "skills",
];

userRouter.get("/user/request/received", UserAuth, async (req, res) => {
  // TODO: Handle Deleted Senders: If a user sends a request and deletes their account
  // TODO: Pagination Support, If a user receives dozens of requests, loading all documents at once impacts database performance. Support page and limit via query parameters.
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .sort({ createdAt: -1 }); // incoming notifications should show the freshest requests first

    return res.status(200).json({
      data: connectionRequest,
      success: true,
      message: "Data fetched Successfully",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

userRouter.get("/user/connections", UserAuth, async (req, res) => {
  try {
    const { user: loggedInUser } = req;

    // find all accepted connections where the user is either sender or receiver
    const allConnections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA)
      .sort({ updatedAt: -1 }); // show recently accepted connections first

    const connectionsData = allConnections
      .map((connection) => {
        const isSender =
          connection.fromUserId._id.toString() === loggedInUser._id.toString();

        return isSender ? connection.toUserId : connection.fromUserId;
      })
      .filter(Boolean); // filter out any null entries from deleted accounts

    return res.status(200).json({
      success: true,
      data: connectionsData,
      message: "Data Fetched Successfully",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = userRouter;
