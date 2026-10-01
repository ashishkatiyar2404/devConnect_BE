const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const UserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Please Login!" });
    }

    const { _id } = await jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY);
    const user = await UserModel.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  UserAuth,
};
