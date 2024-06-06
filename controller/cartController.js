import * as cartService from "../services/cartServices.js";
import { handleResponse } from "../utils/service.js";

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartItems = await cartService.getCartItemsByUserId(userId);
    return handleResponse(res, 200, "Cart items retrieved successfully", cartItems);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const updatedCartItem = await cartService.updateCartItemQuantity(cartItemId, quantity);
    return handleResponse(res, 200, "Cart item updated successfully", updatedCartItem);
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    await cartService.removeCartItem(cartItemId);
    return handleResponse(res, 200, "Cart item removed successfully");
  } catch (error) {
    next(error);
  }
};