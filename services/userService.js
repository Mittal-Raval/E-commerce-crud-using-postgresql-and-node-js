import pool from "../config/dbConnection.js";

export const createUser = async (username, email, password, role_id) => {
  const query =
    "INSERT INTO users (username, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *";
  const { rows } = await pool.query(query, [
    username,
    email,
    password,
    role_id,
  ]);
  return rows[0];
};

// export const userFindOne = async (filter) => {
//   const keys = Object.keys(filter);
//   const values = Object.values(filter);
//   const condition = keys
//     .map((key, index) => `${key} = $${index + 1}`)
//     .join(" AND ");
//   const query = `SELECT * FROM users WHERE ${condition}`;
//   const { rows } = await pool.query(query, values);
//   return rows[0];
// };

export const userFindOne = async (filter) => {
  const keys = Object.keys(filter);
  const values = Object.values(filter);
  const condition = keys
    .map((key, index) => `users.${key} = $${index + 1}`)
    .join(" AND ");
  const query = `SELECT users.*, roles.rolename FROM users INNER JOIN roles ON users.role_id = roles.id WHERE ${condition}`;
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getAllUsers = async () => {
  const query = "SELECT * FROM users";
  const { rows } = await pool.query(query);
  return rows;
};

export const getUserById = async (id) => {
  const query =
    "SELECT users.*, roles.rolename FROM users INNER JOIN roles ON users.role_id = roles.id WHERE users.id = $1";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const updateUser = async (id, updateData) => {
  const keys = Object.keys(updateData);
  const values = Object.values(updateData);
  const setString = keys
    .map((key, index) => `${key} = $${index + 2}`)
    .join(", ");

  const query = `UPDATE users SET ${setString} WHERE id = $1 RETURNING *`;
  const { rows } = await pool.query(query, [id, ...values]);
  return rows[0];
};

export const deleteUser = async (id) => {
  const query = "DELETE FROM users WHERE id = $1";
  const value = [id];
  return await pool.query(query, value);
};
