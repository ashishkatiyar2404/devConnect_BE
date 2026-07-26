const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
      min: [18, "Must be atleast 18,got {VALUE}"],
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    gender: {
      type: String,
      // validate: (value) => {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender can only be Male, female or others");
      //   }
      // },
      enum: {
        values: ["male", "female"],
        message: "{VALUE} is not supported",
      },
    },
    password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      default: "I am Frontend Developer",
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ0TldrpIvLvIaWj8KquIYIHf8axewRbGbVmDrhZNdNA&s=10",
    },
    skills: {
      type: [String],
      default: ["javaScript", "ReactJS", "NodeJS"],
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
