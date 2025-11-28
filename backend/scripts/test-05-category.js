require('dotenv').config();
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5001';

async function getAdminToken() {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@wyveninc.com', password: '2001' }),
  });
  const data = await response.json();
  return data.token;
}

async function testCreateCategory() {
  console.log('📁 Testing Create Category...');
  
  try {
    const token = await getAdminToken();
    
    const response = await fetch(`${BASE_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Electronics',
        description: 'Electronic equipment and devices',
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || response.statusText);
    }
    
    const data = await response.json();
    console.log('✅ Category created:', data.name);
    console.log('   ID:', data.id);
    
    return data.id;
  } catch (error) {
    console.error('❌ Create category failed:', error.message);
    return null;
  }
}

testCreateCategory().then(categoryId => {
  if (categoryId) {
    console.log('\n✅ Test passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Test failed!');
    process.exit(1);
  }
});

