const express = require("express");
const connectDB = require("./config/database");
const { validateData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const UserModel = require("./models/user");
const cookie = require("cookie-parser");
const { UserAuth } = require("./middleware/auth");
const jwtToken = require("jsonwebtoken");

const app = express();
const saltRounds = 10;

app.use(express.json());
app.use(cookie());

app.post("/sendConnectionRequest", UserAuth, (req, res) => {
  res.send(req.user.firstName + " is send you a request");
});

app.get("/profile", UserAuth, (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error - " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //validate email first
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
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      });
      res.send("Login Successfully");
    }
  } catch (err) {
    res.status(400).send("Error - " + err.message);
  }
});

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, age, gender, photoUrl } =
    req.body;
  try {
    // validation of Data(req.body)
    validateData(req);

    // bcrypt the password
    const hashPassword = await bcrypt.hash(password, saltRounds);

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
    res.send("User Data Added Successfully");
  } catch (err) {
    res.status(400).send("Error - " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to DataBase");
    app.listen(8000, () => {
      console.log("Server started to listing on 8000");
    });
  })
  .catch(() => {
    console.log("Something went Wrong");
  });
