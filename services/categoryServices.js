import pool from "../config/dbConnection.js";

export const checkCategoryExists = async (categoryName) => {
  const query = "SELECT * FROM category WHERE categoryName = $1";
  const values = [categoryName];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const createCategory = async (categoryName) => {
  const query = "INSERT INTO category (categoryName) VALUES ($1)";
  const values = [categoryName];
  return await pool.query(query, values);
};

export const getAllCategories = async (Sorting, Searching) => {
  const { limit, offset, sortField, sortOrder } = Sorting;
  const { searchQuery, searchValues } = Searching;

  const query = `
      SELECT * FROM category
      WHERE categoryName ILIKE $1
      ORDER BY ${sortField} ${sortOrder}
      LIMIT $2 OFFSET $3
    `;
  const values = [`%${searchQuery}%`, limit, offset];

  const { rows } = await pool.query(query, values);
  return rows;
};

export const totalCategory = async (Searching) => {
  const { searchQuery, searchValues } = Searching;

  const query = `
      SELECT COUNT(*) FROM category
      WHERE categoryName ILIKE $1
    `;
  const values = [`%${searchQuery}%`];

  const { rows } = await pool.query(query, values);
  return parseInt(rows[0].count, 10);
};

export const getCategoryById = async (id) => {
  const query = "SELECT * FROM category WHERE id = $1";
  const values = [id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const updateCategory = async (id, categoryName) => {
  const query = "UPDATE category SET categoryName = $1 WHERE id = $2";
  const values = [categoryName, id];
  return await pool.query(query, values);
};

export const deleteCategory = async (id) => {
  const query = "DELETE FROM category WHERE id = $1";
  const values = [id];
  return await pool.query(query, values);
};
