const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");

const app = express();

app.use(express.json());

// PATCH API -  to update any user data
app.patch("/user", async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.body.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User Finally Update");
  } catch (err) {
    res
      .status(400)
      .send("Something went Wrong while fetching user " + err.message);
  }
});

// get user -- findOne
app.get("/user", async (req, res) => {
  try {
    // findOne()/findOne({}) - will give me first user
    const user = await UserModel.findOne({ emailId: req.body.emailId });
    if (user.length === 0) {
      res.status(400).send("No User Found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went Wrong while fetching user");
  }
});

// delete API
app.delete("/user", async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.body.userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went Wrong while fetching user");
  }
});

// GET /feed API - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const user = await UserModel.find({});
    if (!user) {
      res.status(400).send("No User Found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went Wrong while fetching user");
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const user = await UserModel.find(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(400).send({ error: "Invalid User ID format or Database Error" });
  }
});

app.post("/signup", async (req, res) => {
  // creating a new instance of the user model
  const user = new UserModel(req.body);
  try {
    await user.save();
    res.send("User Data Added Successfully");
  } catch (err) {
    res
      .status(400)
      .send(
        "Something went Wrong while adding the user to database " + err.message,
      );
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
