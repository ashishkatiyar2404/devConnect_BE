const express = require("express");
const requestRouter = express.Router();

const { UserAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  UserAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;

      // Validate the input
      if (!["interested", "ignored"].includes(status)) {
        throw new Error(status + " request is Invalid");
      }

      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const toUser = await UserModel.findById(toUserId);
      if (!toUser) {
        throw new Error("Sending Request to Non exist user");
      }

      // checking if connection is already exist or not
      const existingConnection = await ConnectionRequestModel.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnection) {
        return req.status(400).json({
          success: false,
          message: "Connection request already Exist",
        });
      }

      // creating a new instance of the connectionRequest model
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      return res.status(200).json({
        success: true,
        message: "Connection Request send successfully",
        data,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },
);

module.exports = requestRouter;
