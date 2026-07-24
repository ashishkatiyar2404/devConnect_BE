const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "sachin",
    lastName: "tendulkar",
    emailId: "sachinTendulkar@gmail.com",
    password: "sachin@123",
    age: 50,
    gender: "male",
  };

  const user = new UserModel(userObj);

  try {
    await user.save();
    res.send("User Data Added Successfully");
  } catch (err) {
    res
      .status(400)
      .send("Something went Wrong while adding the user to database");
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
