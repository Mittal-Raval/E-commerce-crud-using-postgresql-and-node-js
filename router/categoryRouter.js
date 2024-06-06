import express from "express";
import * as categoryController from "../controller/categoryController.js";
import { authMiddleware, authorizeRoles } from "../middleware/userAuth.js";
import { validate } from "../middleware/commonValidator.js";
import {
  createCategoryValidationRules,
  updateCategoryValidationRules,
  getCategoryByIdValidationRules,
  deleteCategoryValidationRules,
  getAllCategoriesValidationRules,
} from "../middleware/categoryValidator.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  authorizeRoles("admin"),
  createCategoryValidationRules(),
  validate,
  categoryController.createCategoryData
);
router.get(
  "/get",
  authMiddleware,
  authorizeRoles("admin", "user"),
  getAllCategoriesValidationRules(),
  validate,
  categoryController.getAllCategory
);
router.get(
  "/get/:id",
  authMiddleware,
  authorizeRoles("admin"),
  getCategoryByIdValidationRules(),
  validate,
  categoryController.getCategoryById
);
router.put(
  "/update/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateCategoryValidationRules(),
  validate,
  categoryController.updateCategory
);
router.delete(
  "/delete/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteCategoryValidationRules(),
  validate,
  categoryController.deleteCategory
);

export default router;
