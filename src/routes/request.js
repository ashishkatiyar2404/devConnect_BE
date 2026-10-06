const express = require("express");
const requestRouter = express.Router();

const { UserAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const mongoose = require("mongoose");

const sendEmail = require("../services/sendEmail");

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

      // Cannot send request to oneself
      if (fromUserId.toString() === toUserId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Cannot send connection request to yourself",
        });
      }

      const toUser = await UserModel.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
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
          message: "Connection request already exists",
        });
      }

      // creating a new instance of the connectionRequest model
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      try {
        await sendEmail.run(
          toUser.emailId,
          "You have a new connection request on DevConnect",
          `Hi ${toUser.firstName},

           You have received a new connection request from ${req.user.firstName} on DevConnect.

           Please log in to your DevConnect account to review the request and accept or reject it.

           Thank you,
           DevConnect Team`,
        );
      } catch (emailErr) {
        console.error("Failed to send notification email:", emailErr.message);
      }

      return res.status(201).json({
        success: true,
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
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
          success: false,
          message: "Invalid request ID",
        });
      }

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

      return res.status(200).json({
        success: true,
        message: `Connection request ${status} successfully`,
        data: connectionRequest,
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
