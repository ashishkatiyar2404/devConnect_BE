const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      /**In your signup route, you hash the password before saving:
       * Because user.save() triggers your Mongoose schema validations, your schema will run validator.isStrongPassword on the hashPassword string (e.g. $2b$10$e83H...).
       * A hashed password usually fails isStrongPassword()!
       *
       */
      // validate: {
      //   validator: (value) => validator.isStrongPassword(value),
      //   message:
      //     "Password is not strong enough! Include uppercase, lowercase, numbers, and symbols.",
      // },
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

userSchema.methods.getJWT = async function () {
  // const user = this;
  const token = await jwt.sign(
    { _id: this._id },
    process.env.JWT_TOKEN_SECRET_KEY,
    {
      expiresIn: "1d",
    },
  );

  return token;
};

userSchema.methods.comparePassword = async function (passwordByUserInput) {
  const hashPassword = this.password;
  const isPasswordMatch = await bcrypt.compare(
    passwordByUserInput,
    hashPassword,
  );
  return isPasswordMatch;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;

/**
 *   NOTE
 *
 * In Mongoose, anything added to userSchema.methods attaches ONLY to individual document instances (like the user variable returned by UserModel.findOne(...)).
 *
 */
