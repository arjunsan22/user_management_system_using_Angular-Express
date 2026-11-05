
import pool from '../config/db.js';


export const getAllUsers = async () => {
  const [rows] = await pool.execute(
    `SELECT id, name, email, role, created_at, updated_at 
     FROM users 
     ORDER BY id DESC`
  );
  return rows;
};


export const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  return rows[0];
};


export const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
    [id]
  );
  return rows[0];
};


export const createUser = async ({ name, email, password, role = 'user' }) => {
  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    [name, email, password, role]
  );
  return result.insertId;
};


export const getDashboardStats = async () => {
  const [rows] = await pool.execute(`
    SELECT
      COUNT(*) AS totalUsers,
      COALESCE(SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END), 0) AS totalAdmins,
      COALESCE(SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END), 0) AS regularUsers
    FROM users
  `);
  return rows[0];
};


export const getRecentUsers = async () => {
  const [rows] = await pool.execute(`
    SELECT id, name, email, role, created_at 
    FROM users 
    ORDER BY created_at DESC 
    LIMIT 5
  `);
  return rows;
};




export const updateUser = async (id, { name, email, role }) => {
  const [result] = await pool.execute(
    `UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`,
    [name, email, role, id]
  );
  return result.affectedRows;
};


export const deleteUser = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM users WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
};



// Update user's refresh token on login or logout
export const updateRefreshToken = async (userId, refreshToken) => {
  await pool.execute(
    `UPDATE users SET refresh_token = ? WHERE id = ?`,
    [refreshToken, userId]
  );
};