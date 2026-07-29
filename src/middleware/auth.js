const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const UserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is Invalid");
    }

    const { _id } = await jwt.verify(token, "Dev@1234");
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new Error("User is not Found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error - " + err.message);
  }
};

module.exports = {
  UserAuth,
};
