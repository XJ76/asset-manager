require('dotenv').config();
const { readFileSync } = require('fs');
const { join } = require('path');
const { pool } = require('../config/database');

async function migrate() {
  try {
    const initSql = readFileSync(
      join(__dirname, '../migrations/init.sql'),
      'utf8'
    );
    
    const passwordSql = readFileSync(
      join(__dirname, '../migrations/add_password.sql'),
      'utf8'
    );
    
    await pool.query(initSql);
    console.log('✅ Initial schema created');
    
    await pool.query(passwordSql);
    console.log('✅ Password column added');
    
    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('⚠️  Tables already exist, skipping...');
      try {
        const passwordSql = readFileSync(
          join(__dirname, '../migrations/add_password.sql'),
          'utf8'
        );
        await pool.query(passwordSql);
        console.log('✅ Password column added');
        process.exit(0);
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('✅ Password column already exists');
          process.exit(0);
        }
        throw err;
      }
    }
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();

