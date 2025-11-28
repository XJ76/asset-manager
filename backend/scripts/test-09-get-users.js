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

async function testGetUsers() {
  console.log('👥 Testing Get Users (Admin only)...');
  
  try {
    const token = await getAdminToken();
    
    const response = await fetch(`${BASE_URL}/api/users`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || response.statusText);
    }
    
    const data = await response.json();
    console.log('✅ Retrieved', data.length, 'users');
    data.forEach(user => {
      console.log(`   - ${user.name} (${user.email}): ${user.role} - ${user.status}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Get users failed:', error.message);
    return false;
  }
}

testGetUsers().then(success => {
  if (success) {
    console.log('\n✅ Test passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Test failed!');
    process.exit(1);
  }
});

