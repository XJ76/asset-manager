require('dotenv').config();
const { pool } = require('../config/database');
const { hashPassword } = require('../utils/password');
const userModel = require('../models/user');

async function testCreateUsers() {
  console.log('👤 Testing Create Users...');
  
  try {
    const orgResult = await pool.query(
      "SELECT id FROM organizations WHERE name = 'Wyven inc' LIMIT 1"
    );
    
    if (orgResult.rows.length === 0) {
      throw new Error('Organization "Wyven inc" not found. Run test-02-organization.js first.');
    }
    
    const orgId = orgResult.rows[0].id;
    const hashedPassword = await hashPassword('2001');
    
    console.log('  Creating admin user...');
    const admin = await userModel.create({
      email: 'admin@wyveninc.com',
      name: 'Admin User',
      role: 'admin',
      organizationId: orgId,
      status: 'approved',
      password: hashedPassword,
    });
    console.log('✅ Admin created:', admin.email);
    
    console.log('  Creating regular user...');
    const user = await userModel.create({
      email: 'joshua@wyveninc.com',
      name: 'Joshua J Smith',
      role: 'user',
      organizationId: orgId,
      status: 'approved',
      password: hashedPassword,
    });
    console.log('✅ User created:', user.name);
    
    return { adminId: admin.id, userId: user.id };
  } catch (error) {
    console.error('❌ Create users failed:', error.message);
    return null;
  }
}

testCreateUsers().then(result => {
  if (result) {
    console.log('\n✅ Test passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Test failed!');
    process.exit(1);
  }
});

