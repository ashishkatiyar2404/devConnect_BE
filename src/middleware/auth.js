const adminAuthorized = (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyaz";

  if (!isAuthorized) {
    res.status(401).send("Unauthorized Admin");
  } else {
    next();
  }
};

const userAuthorized = (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz";

  if (!isAuthorized) {
    res.status(401).send("Unauthorized user");
  } else {
    next();
  }
};

module.exports = {
  adminAuthorized,
  userAuthorized,
};
