const { pool } = require('../config/database');

async function findByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

async function findById(id) {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async function create(userData) {
  const { email, name, role, organizationId, status = 'pending' } = userData;
  const result = await pool.query(
    `INSERT INTO users (email, name, role, organization_id, status)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [email, name, role, organizationId, status]
  );
  return result.rows[0];
}

async function updateStatus(id, status) {
  const result = await pool.query(
    'UPDATE users SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
}

async function findAll(organizationId) {
  const result = await pool.query(
    'SELECT * FROM users WHERE organization_id = $1 ORDER BY created_at DESC',
    [organizationId]
  );
  return result.rows;
}

module.exports = {
  findByEmail,
  findById,
  create,
  updateStatus,
  findAll,
};

