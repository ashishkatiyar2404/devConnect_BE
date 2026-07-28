const express = require("express");
const connectDB = require("./config/database");
const { validateData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const UserModel = require("./models/user");

const app = express();
const saltRounds = 10;

app.use(express.json());

// PATCH API -  to update any user data
app.patch("/user/:userId", async (req, res) => {
  try {
    // Get all field names defined in your schema, excluding system fields like _id, __v, createdAt, updatedAt
    const allowedUpdates = Object.keys(UserModel.schema.paths).filter(
      (field) => !["emailId", "_id"].includes(field),
    );

    const isValidOperation = Object.keys(req.body).every((field) =>
      allowedUpdates.includes(field),
    );

    if (!isValidOperation) {
      res.status(400).send("Error - " + err.message);
    }

    const user = await UserModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
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
    res.status(400).send("Error - " + err.message);
  }
});

// delete API
app.delete("/user", async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.body.userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Error - " + err.message);
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
    res.status(400).send("Error - " + err.message);
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    //validate email first
    // check if the emailId is present in DataBase or not
    const user = await UserModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    //compare the current user password with DB user password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid Credentials");
    } else {
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
