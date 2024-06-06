import { body, param, query } from "express-validator";
import { BadRequestError } from "../error/error.js";

export const createProductValidationRules = () => {
  return [
    body("productName").notEmpty().withMessage("Product name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").notEmpty().isNumeric().withMessage("Price must be a number"),
    body("quantity")
      .notEmpty()
      .isNumeric()
      .withMessage("Quantity must be a number"),
    body("categoryId")
      .notEmpty()
      .isArray()
      .withMessage("Category ID is required and must be an array"),
    body("images").custom((value, { req }) => {
      if (!req.files || !req.files.images || req.files.images.length === 0) {
        throw new BadRequestError("At least one image is required");
      }
      return true;
    }),
  ];
};

export const updateProductValidationRules = () => {
  return [
    param("id").isInt().withMessage("Product ID must be an integer"),
    body("productName")
      .optional()
      .notEmpty()
      .withMessage("Product name is required"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Description is required"),
    body("price").optional().isNumeric().withMessage("Price must be a number"),
    body("quantity")
      .optional()
      .isNumeric()
      .withMessage("Quantity must be a number"),
    body("categoryId")
      .optional()
      .isArray()
      .withMessage("Category ID must be an array"),
    body("images")
      .optional()
      .custom((value, { req }) => {
        if (!req.files || !req.files.images || req.files.images.length === 0) {
          throw new BadRequestError("At least one image is required");
        }
        return true;
      }),
  ];
};

export const getProductByIdValidationRules = () => {
  return [param("id").isInt().withMessage("Product ID must be an integer")];
};

export const deleteProductValidationRules = () => {
  return [param("id").isInt().withMessage("Product ID must be an integer")];
};

export const getAllProductsValidationRules = () => {
  return [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Limit must be a positive integer"),
    query("sortField")
      .optional()
      .isString()
      .custom((value) => {
        if (/\d/.test(value)) {
          throw new Error("Sort field must be a string");
        }
        return true;
      })
      .withMessage("Sort field must be a string"),

    query("sortOrder")
      .optional()
      .isIn(["ASC", "DESC"])
      .withMessage("Sort order must be either ASC or DESC"),

    query("searchFilter")
      .optional()
      .isString()
      .custom((value) => {
        if (/^\d+$/.test(value)) {
          throw new Error("Search filter must be a string");
        }
        return true;
      })
      .withMessage("Search filter must be a string"),
  ];
};

export const addToCartValidationRules = () => {
  return [
    body("productId").notEmpty().isInt().withMessage("Product ID must be an integer"),
    body("quantity").notEmpty().isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
  ];
};