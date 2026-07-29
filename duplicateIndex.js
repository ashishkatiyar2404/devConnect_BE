const { adminAuthorized, userAuthorized } = require("./middleware/auth");

app.get("/getUserData", (req, res) => {
  console.log("first");
  throw new Error("new error");
  console.log("first11");
  res.send("User Data Sent");
});

// error-handling middleware
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went Wrong");
  }
});

app.use("/admin", adminAuthorized);

app.get("/admin/allData", (req, res) => {
  res.send("Authorized Admin");
});

app.use("/user", userAuthorized);

app.get("/user/allData", (req, res) => {
  res.send("Authorized User");
});

app.all("/ashish", (req, res, next) => {
  res.send("/ashish");
});

app.get("/ashish/profile", (req, res, next) => {
  res.send("/ashish/Profile");
});

app.use((req, res, next) => {
  console.log("route 1");
  next();
});

app.get("/ashish", (req, res, next) => {
  console.log("route 2");
  res.send("hello");
  next();
});

app.get("/ashish/profile", (req, res, next) => {
  console.log("route 3");
  // res.send("hello");
  // next();
});

app.get(
  "/ashishNext",
  (req, res, next) => {
    // res.send("response 1");
    res.send("response 1");
    console.log("first11");
    // next();
  },
  [
    (req, res, next) => {
      res.send("response 2");
      console.log("response 2");
      next();
    },
    (req, res, next) => {
      next();
      res.send("response 2");
      console.log("111");
    },
  ],
  (req, res, next) => {
    res.send("response last");
    console.log("first");
    next();
  },
);

//use regex for pattern matching
app.use(/^\/ab?c$/, (req, res) => {
  res.send({ user: "Ashish" });
});

// how does this work /user?userID=101 if u hit this frm POSTMAN
app.get("/user", (req, res) => {
  res.send(req.query);
});

//dynamic routes  --
app.get("/user/:userID/:name/:password", (req, res) => {
  res.send(req.params);
});

app.get("/", (req, res) => {
  res.send("Hello From Home page");
});

app.get("/test", (req, res) => {
  res.send("hello from test");
});

/** MOVING CODE OF INDEX.JS FILE */
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
