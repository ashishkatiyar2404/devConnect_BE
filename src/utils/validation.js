const validator = require("validator");

const validateData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!lastName || !firstName) {
    throw new Error("Please provide a proper name");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Provide a Strong Password");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email Id is invalid");
  }
};

const validateUpdateFields = (bodyData) => {
  const { skills, about, gender, photoUrl, age } = bodyData;

  if (age !== undefined) {
    if (typeof age !== "number" || age < 18 || age > 60) {
      throw new Error("Age must be a valid number between 18 and 60");
    }
  }

  if (photoUrl !== undefined) {
    if (!validator.isURL(photoUrl)) {
      throw new Error("Invalid Photo URL format");
    }
  }

  if (gender !== undefined) {
    const allowedGenders = ["male", "female", "others"];
    if (!allowedGenders.includes(gender.toLowerCase())) {
      throw new Error("Gender must be 'male', 'female', or 'others'");
    }
  }
  if (skills !== undefined) {
    if (!Array.isArray(skills)) {
      throw new Error("Skills must be provided as an array");
    }
    if (skills.length > 6) {
      throw new Error("You can specify a maximum of 6 skills");
    }

    const hasInvalidSkill = skills.some(
      (skill) => typeof skill !== "string" || skill.trim() === "",
    );

    if (hasInvalidSkill) {
      throw new Error("All skills must be valid strings");
    }
  }

  if (about !== undefined) {
    if (typeof about !== "string" || about.length > 250) {
      throw new Error("About section cannot exceed 250 characters");
    }
  }
};

const validatePassword = (currentPassword, newPassword, confirmNewPassword) => {
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    throw new Error("All password fields are required");
  }
  if (newPassword !== confirmNewPassword) {
    throw new Error("Password doesn't match");
  }
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Provide a Strong Password");
  }
};

module.exports = {
  validateData,
  validateUpdateFields,
  validatePassword,
};
