import { body, param } from "express-validator";

export const updateCartItemValidationRules = () => {
    return [
      param("cartItemId").isInt().withMessage("Cart Item ID must be an integer"),
      body("quantity").notEmpty().isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
    ];
  };
  
  export const removeCartItemValidationRules = () => {
    return [
      param("cartItemId").isInt().withMessage("Cart Item ID must be an integer"),
    ];
  };