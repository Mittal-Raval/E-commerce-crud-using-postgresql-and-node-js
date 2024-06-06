import express from "express";
import * as cartController from "../controller/cartController.js";
import { authMiddleware, authorizeRoles } from "../middleware/userAuth.js";
import { validate } from "../middleware/commonValidator.js";
import {
  updateCartItemValidationRules,
  removeCartItemValidationRules,
} from "../middleware/cartValidator.js";

const router = express.Router();

router.get(
  "/get",
  authMiddleware,
  authorizeRoles("admin", "user"),
  cartController.getCart
);
router.put(
  "/update/:id",
  authMiddleware,
  authorizeRoles("admin", "user"),
  updateCartItemValidationRules(),
  validate,
  cartController.updateCartItem
);
router.delete(
  "/delete/:id",
  authMiddleware,
  authorizeRoles("admin", "user"),
  removeCartItemValidationRules(),
  validate,
  cartController.removeCartItem
);

export default router;
