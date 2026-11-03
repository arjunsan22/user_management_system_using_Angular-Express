import pool from '../config/db.js';

// Get all users (excluding passwords for safety)
export const getAllUsers = async () => {
  const [rows] = await pool.execute(
    `SELECT id, name, email, role, created_at, updated_at 
     FROM users 
     ORDER BY id DESC`
  );
  return rows;
};

// Find user by email (Login check cheyyan)
export const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  return rows[0];
};

// Find user by ID
export const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
    [id]
  );
  return rows[0];
};

// Create a new user
export const createUser = async ({ name, email, password, role = 'user' }) => {
  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    [name, email, password, role]
  );
  return result.insertId;
};

// Update user's refresh token on login or logout
export const updateRefreshToken = async (userId, refreshToken) => {
  await pool.execute(
    `UPDATE users SET refresh_token = ? WHERE id = ?`,
    [refreshToken, userId]
  );
};