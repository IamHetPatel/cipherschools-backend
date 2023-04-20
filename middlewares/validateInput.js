const { body, validationResult } = require("express-validator");

// Middleware for validating input using express-validator
const validateInput = {
  register: [
    body("firstName").notEmpty().withMessage("First Name is required"),
    body("lastName").notEmpty().withMessage("Last Name is required"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email"),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid Phone Number"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  login: [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  updateProfile: [
    body("firstName")
      .optional()
      .notEmpty()
      .withMessage("First Name is required"),
    body("lastName").optional().notEmpty().withMessage("Last Name is required"),
    body("email")
      .optional()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email"),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid Phone Number"),
  ],
  updatePassword: [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current Password is required"),
    body("newPassword")
      .notEmpty()
      .withMessage("New Password is required")
      .isLength({ min: 8 })
      .withMessage("New Password must be at least 8 characters long"),
  ],
  updateInterests: [
    body("interests").notEmpty().withMessage("Interests are required"),
  ],
};

module.exports = validateInput;
