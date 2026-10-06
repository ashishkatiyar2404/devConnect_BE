const express = require("express");
const { UserAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
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
      success: true,
      message: "Connection requests fetched successfully",
      data: connectionRequest,
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
      message: "Connections fetched successfully",
      data: connectionsData,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

userRouter.get("/user/feed", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    // .populate("fromUserId", "firstName")
    // .populate("toUserId", "firstName");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const feedUsers = await UserModel.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUsersFromFeed) },
        },
        {
          _id: { $ne: loggedInUser._id }, // WHY ? - check NOTE at the end
        },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Feed fetched successfully",
      data: feedUsers,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = userRouter;

/**NOTE
 *
 * The $ne check acts as a safety net. If for any reason the database query above it returns an empty array (meaning the user has absolutely zero connection requests yet), the hideUsersFromFeed Set will only contain the user's own ID (if manually added, though in your current loop it wouldn't even have that).By explicitly adding { _id: { $ne: loggedInUser._id } }, you guarantee 100% certainty that a user will never see themselves on their own feed, even if the connection logic or the loop changes in the future.
 *
 */
