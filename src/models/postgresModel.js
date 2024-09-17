const { postgresPool } = require('../config/database');

const getUserById = async (id) => {
  const result = await postgresPool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const getAllUsers = async () => {
  const result = await postgresPool.query('SELECT * FROM users');
  return result.rows;
};

const createUser = async (name, email) => {
  const result = await postgresPool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );
  return result.rows[0];
};

module.exports = {
  getUserById,
  getAllUsers,
  createUser,
};