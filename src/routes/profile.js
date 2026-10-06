const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const {
  validateUpdateFields,
  validatePassword,
} = require("../utils/validation");

const { UserAuth } = require("../middleware/auth");

profileRouter.get("/profile/view", UserAuth, (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: req.user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

profileRouter.patch("/profile/edit", UserAuth, async (req, res) => {
  try {
    const allowedFieldForUpdate = [
      "about",
      "gender",
      "photoUrl",
      "age",
      "firstName",
      "lastName",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(req.body).every((field) =>
      allowedFieldForUpdate.includes(field),
    );
    if (!isUpdateAllowed || Object.keys(req.body).length === 0) {
      throw new Error("Invalid or Empty field provided for update");
    }

    validateUpdateFields(req.body);
    const loggedUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));

    await loggedUser.save();
    return res.status(200).json({
      success: true,
      message: `${loggedUser.firstName}, your profile was updated successfully!`,
      data: loggedUser,
    });
  } catch (err) {
    console.error("debug ERROR STACK:", err.stack);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

profileRouter.patch("/profile/password", UserAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    validatePassword(currentPassword, newPassword, confirmNewPassword);

    const loggedUser = req.user;
    const isSameAsOld = await loggedUser.comparePassword(currentPassword);
    if (!isSameAsOld) {
      throw new Error("Current password is incorrect");
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    loggedUser.password = newPasswordHash;
    await loggedUser.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = profileRouter;
