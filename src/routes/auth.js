const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

const { validateData } = require("../utils/validation");
const UserModel = require("../models/user");

/** LOGIN */
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // validate email first
    // check if the emailId is present in DataBase or not
    const user = await UserModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    //compare the current user password with DB user password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid Credentials");
    } else {
      // create a JWT token
      const token = await user.getJWT();

      // Add the token to cookie and send the response to user
      res.cookie("token", token, {
        httpOnly: true, // <-- CRUCIAL: Blocks client-side JS (document.cookie) from reading this
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      });
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          emailId: user.emailId,
          photoUrl: user.photoUrl,
          age: user.age,
          gender: user.gender,
          about: user.about,
        },
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

/** LOGOUT */
authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

/** SIGNUP */
authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, age, gender, photoUrl } =
    req.body;

  try {
    // validation of Data(req.body)
    validateData(req);

    // bcrypt the password
    const hashPassword = await bcrypt.hash(password, 10);

    // creating a new instance of the user model
    const user = new UserModel({
      firstName,
      lastName,
      emailId,
      age,
      gender,
      photoUrl,
      password: hashPassword,
    });
    await user.save();
    res.status(200).send("User Data Added Successfully");
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = authRouter;
