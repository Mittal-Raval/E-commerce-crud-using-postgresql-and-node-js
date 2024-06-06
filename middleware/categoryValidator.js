import { body, param, query } from "express-validator";
import { BadRequestError } from "../error/error.js";

export const createCategoryValidationRules = () => {
  return [
    body("categoryName").notEmpty().withMessage("Category name is required"),
  ];
};

export const updateCategoryValidationRules = () => {
  return [
    param("id").isInt().withMessage("Category ID must be an integer"),
    body("categoryName")
      .optional()
      .notEmpty()
      .withMessage("Category name is required"),
  ];
};

export const getCategoryByIdValidationRules = () => {
  return [param("id").isInt().withMessage("Category ID must be an integer")];
};

export const deleteCategoryValidationRules = () => {
  return [param("id").isInt().withMessage("Category ID must be an integer")];
};

export const getAllCategoriesValidationRules = () => {
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
      .withMessage("Sort field must be a string")
      .custom((value) => {
        if (/\d/.test(value)) {
          throw new BadRequestError("Sort field must be a string");
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
      .withMessage("Search filter must be a string")
      .custom((value) => {
        if (/^\d+$/.test(value)) {
          throw new BadRequestError("Search filter must be a string");
        }
        return true;
      })
      .withMessage("Search filter must be a string"),
  ];
};
