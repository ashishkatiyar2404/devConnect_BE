const validator = require("validator");

const validateData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!lastName || !firstName) {
    console.log(firstName, lastName);
    throw new Error("Please provide a proper name");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Provide a Strong Password");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email Id is invalid");
  }
};

module.exports = {
  validateData,
};
