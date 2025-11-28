const { pool } = require('../config/database');

async function findAll(organizationId, userId = null) {
  let query = 'SELECT * FROM assets WHERE organization_id = $1';
  const params = [organizationId];
  
  if (userId) {
    query += ' AND created_by = $2';
    params.push(userId);
  }
  
  query += ' ORDER BY created_at DESC';
  const result = await pool.query(query, params);
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    'SELECT * FROM assets WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async function create(assetData) {
  const { name, categoryId, departmentId, datePurchased, 
          cost, createdBy, organizationId } = assetData;
  const result = await pool.query(
    `INSERT INTO assets (name, category_id, department_id, date_purchased,
     cost, created_by, organization_id) VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, categoryId, departmentId, datePurchased, cost, createdBy, organizationId]
  );
  return result.rows[0];
}

async function remove(id) {
  await pool.query('DELETE FROM assets WHERE id = $1', [id]);
}

module.exports = {
  findAll,
  findById,
  create,
  remove,
};

