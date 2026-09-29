const express = require("express");
const requestRouter = express.Router();

const { UserAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const mongoose = require("mongoose");

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
        return res.status(400).json({
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
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
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

requestRouter.post(
  "/request/review/:status/:requestId",
  UserAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //validate the input status
      const acceptedStatus = ["accepted", "rejected"];
      if (!acceptedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status: '${status}'. Allowed values are 'accepted' or 'rejected'.`,
        });
      }

      // validate the request ID , (object type or not)
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({
          message: "Invalid request ID",
          success: false,
        });
      }

      // check perticular connection is found in DB or not
      // const connectionRequest = await ConnectionRequestModel.findOne({
      //   _id: requestId,
      //   status: "interested",
      //   toUserId: loggedInUser._id,
      // });

      // NOTE: If a user double-clicks "Accept", two near-instant requests hit your server. If both pass the findOne query at the same time, both will write to the database.

      // Atomic State Transition (Prevents Race Conditions)
      const connectionRequest = await ConnectionRequestModel.findOneAndUpdate(
        {
          _id: requestId,
          status: "interested",
          toUserId: loggedInUser._id,
        },
        {
          status: status,
        },
        { returnDocument: "after", runValidators: true },
      );
      if (!connectionRequest) {
        return res.status(404).json({
          success: false,
          message: "Connection request not found or already reviewed",
        });
      }
      // connectionRequest.status = status;
      // const data = await connectionRequest.save();

      return res.status(200).json({
        message: `Connection request ${status} successfully`,
        success: true,
        data: connectionRequest,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error: " + err.message,
      });
    }
  },
);

module.exports = requestRouter;
