require('dotenv').config();
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5001';
const { pool } = require('../config/database');

async function getUserToken() {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'joshua@wyveninc.com', password: '2001' }),
  });
  const data = await response.json();
  return data.token;
}

async function getCategoryAndDepartment() {
  const categoryResult = await pool.query(
    "SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1"
  );
  const deptResult = await pool.query(
    "SELECT id FROM departments WHERE name = 'IT Department' LIMIT 1"
  );
  
  return {
    categoryId: categoryResult.rows[0]?.id,
    departmentId: deptResult.rows[0]?.id,
  };
}

async function testCreateAsset() {
  console.log('💼 Testing Create Asset...');
  
  try {
    const token = await getUserToken();
    const { categoryId, departmentId } = await getCategoryAndDepartment();
    
    if (!categoryId || !departmentId) {
      throw new Error('Category or Department not found. Run test-05 and test-06 first.');
    }
    
    const response = await fetch(`${BASE_URL}/api/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'MacBook Pro',
        categoryId: categoryId,
        departmentId: departmentId,
        datePurchased: '2024-01-15',
        cost: 2499.99,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || response.statusText);
    }
    
    const data = await response.json();
    console.log('✅ Asset created:', data.name);
    console.log('   Cost: $' + data.cost);
    console.log('   ID:', data.id);
    
    return data.id;
  } catch (error) {
    console.error('❌ Create asset failed:', error.message);
    return null;
  }
}

testCreateAsset().then(assetId => {
  if (assetId) {
    console.log('\n✅ Test passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Test failed!');
    process.exit(1);
  }
});

