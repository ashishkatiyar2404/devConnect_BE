const express = require("express");
const mongoose = require("mongoose");
const { UserAuth } = require("../middleware/auth");
const chatModel = require("../models/Chat");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", UserAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid target user ID",
      });
    }

    let fetchChat = await chatModel
      .findOne({
        participants: { $all: [userId, targetUserId] },
      })
      .populate({
        path: "messages.senderId",
        select: "firstName lastName",
      });

    if (!fetchChat) {
      fetchChat = new chatModel({
        participants: [userId, targetUserId],
        messages: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat fetched successfully",
      data: fetchChat,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = chatRouter;
