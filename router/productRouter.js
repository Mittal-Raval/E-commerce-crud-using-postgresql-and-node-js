import express from "express";
import * as productController from "../controller/productController.js";
import { authMiddleware, authorizeRoles } from "../middleware/userAuth.js";
import { validate } from "../middleware/commonValidator.js";
import {
  createProductValidationRules,
  updateProductValidationRules,
  getProductByIdValidationRules,
  getAllProductsValidationRules,
  deleteProductValidationRules,
  addToCartValidationRules,
} from "../middleware/productValidator.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  authorizeRoles("admin"),
  createProductValidationRules(),
  validate,
  productController.createProductData
);

router.post(
  "/addToCart",
  authMiddleware,
  authorizeRoles("admin", "user"),
  addToCartValidationRules(),
  validate,
  productController.addToCart
);
router.get(
  "/get",
  authMiddleware,
  authorizeRoles("admin", "user"),
  getAllProductsValidationRules(),
  validate,
  productController.getAllProducts
);

router.get(
  "/get/:id",
  authMiddleware,
  authorizeRoles("admin"),
  getProductByIdValidationRules(),
  validate,
  productController.getProductById
);

router.put(
  "/update/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateProductValidationRules(),
  validate,
  productController.updateProduct
);

router.delete(
  "/delete/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteProductValidationRules(),
  validate,
  productController.deleteProduct
);

export default router;
