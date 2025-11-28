const { pool } = require('../config/database');

async function findAll(organizationId) {
  const result = await pool.query(
    'SELECT * FROM categories WHERE organization_id = $1 ORDER BY name',
    [organizationId]
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    'SELECT * FROM categories WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async function create(categoryData) {
  const { name, description, organizationId } = categoryData;
  const result = await pool.query(
    `INSERT INTO categories (name, description, organization_id)
     VALUES ($1, $2, $3) RETURNING *`,
    [name, description, organizationId]
  );
  return result.rows[0];
}

module.exports = {
  findAll,
  findById,
  create,
};

