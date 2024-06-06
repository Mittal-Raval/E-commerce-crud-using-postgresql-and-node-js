import { body, param } from "express-validator";

export const signUpValidationRules = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isString()
      .withMessage("Username must be a string"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role_id")
      .notEmpty()
      .isInt()
      .withMessage("role_id must be an integer"),
  ];
};

export const loginValidationRules = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isString()
      .withMessage("Password must be a string"),
  ];
};

export const getUserByIdValidationRules = () => {
  return [param("id").isInt().withMessage("User ID must be an integer")];
};

export const updateUserValidationRules = () => {
  return [
    param("id").isInt().withMessage("User ID must be an integer"),
    body("username")
      .optional()
      .notEmpty()
      .withMessage("Username must not be empty")
      .isString()
      .withMessage("Username must be a string"),
    body("email")
      .optional()
      .notEmpty()
      .withMessage("Email must not be empty")
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .optional()
      .notEmpty()
      .withMessage("Password must not be empty")
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

export const deleteUserValidationRules = () => {
  return [param("id").isInt().withMessage("User ID must be an integer")];
};
