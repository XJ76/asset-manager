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

async function update(id, categoryData) {
  const { name, description } = categoryData;
  const result = await pool.query(
    `UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
    [name, description, id]
  );
  return result.rows[0];
}

async function remove(id) {
  await pool.query('DELETE FROM categories WHERE id = $1', [id]);
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};

