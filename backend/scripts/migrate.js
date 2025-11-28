require('dotenv').config();
const { readFileSync } = require('fs');
const { join } = require('path');
const pool = require('../config/database');

async function migrate() {
  try {
    const sql = readFileSync(
      join(__dirname, '../migrations/init.sql'),
      'utf8'
    );
    
    await pool.query(sql);
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();

