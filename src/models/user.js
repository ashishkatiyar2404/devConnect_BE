const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 50,
      trim: true,
    },
    age: {
      type: Number,
      min: [18, "Must be atleast 18,got {VALUE}"],
    },
    emailId: {
      type: String,
      unique: true,
      required: [true, "Email is Required"],
      lowercase: true,
      trim: true,
      // immutable: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Enter Valid Email",
      },
    },
    gender: {
      type: String,
      trim: true,
      // validate: (value) => {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender can only be Male, female or others");
      //   }
      // },
      enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} is not supported",
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must be atleast 8 char long"],
      validate: {
        validator: (value) => validator.isStrongPassword(value),
        message:
          "Password is not strong enough! Include uppercase, lowercase, numbers, and symbols.",
      },
    },
    about: {
      type: String,
      default: "I am Frontend Developer",
      maxLength: [250, "About Section cannot exceed 250 Characters"],
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ0TldrpIvLvIaWj8KquIYIHf8axewRbGbVmDrhZNdNA&s=10",
      validate: {
        validator: (value) => validator.isURL(value),
        message: "Photo URl is not valid",
      },
    },
    skills: {
      type: [String],
      default: ["javaScript", "ReactJS", "NodeJS"],
      validate: [
        (value) => value.length <= 6,
        "Skills should not be more than 6",
      ],
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
