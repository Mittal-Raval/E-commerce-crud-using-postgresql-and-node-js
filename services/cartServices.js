import pool from "../config/dbConnection.js";

export const getCartItemsByUserId = async (userId) => {
  const query = `
    SELECT c.id, c.quantity, p.productName, p.price
    FROM carts c
    JOIN product p ON c.product_id = p.id
    WHERE c.user_id = $1
  `;
  const values = [userId];
  const { rows } = await pool.query(query, values);
  return rows;
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  const query = `
    UPDATE carts
    SET quantity = $1
    WHERE id = $2
    RETURNING *
  `;
  const values = [quantity, cartItemId];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const removeCartItem = async (cartItemId) => {
  const query = `
    DELETE FROM carts
    WHERE id = $1
  `;
  const values = [cartItemId];
  await pool.query(query, values);
};