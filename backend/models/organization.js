const pool = require('../config/database');

async function findById(id) {
  const result = await pool.query(
    'SELECT * FROM organizations WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async function findBySlug(slug) {
  const result = await pool.query(
    'SELECT * FROM organizations WHERE slug = $1',
    [slug]
  );
  return result.rows[0];
}

async function create(orgData) {
  const { name, slug, createdBy } = orgData;
  const result = await pool.query(
    `INSERT INTO organizations (name, slug, created_by)
     VALUES ($1, $2, $3) RETURNING *`,
    [name, slug, createdBy]
  );
  return result.rows[0];
}

module.exports = {
  findById,
  findBySlug,
  create,
};

