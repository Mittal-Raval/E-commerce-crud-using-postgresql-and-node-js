import express from "express";
import * as userController from "../controller/userController.js";
import { authMiddleware, authorizeRoles } from "../middleware/userAuth.js";
import { validate } from "../middleware/commonValidator.js";
import {
  signUpValidationRules,
  loginValidationRules,
  getUserByIdValidationRules,
  updateUserValidationRules,
  deleteUserValidationRules,
} from "../middleware/userValidator.js";

const router = express.Router();

router.post(
  "/create",
  signUpValidationRules(),
  validate,
  userController.signUp
);
router.post("/login", loginValidationRules(), validate, userController.login);
router.get(
  "/get",
  authMiddleware,
  authorizeRoles("admin"),
  userController.getAllUsers
);
router.get(
  "/get/:id",
  authMiddleware,
  authorizeRoles("admin"),
  getUserByIdValidationRules(),
  validate,
  userController.getUserById
);
router.put(
  "/update/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateUserValidationRules(),
  validate,
  userController.updateUser
);
router.delete(
  "/delete/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteUserValidationRules(),
  validate,
  userController.deleteUser
);

export default router;
