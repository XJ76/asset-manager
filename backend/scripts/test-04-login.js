require('dotenv').config();
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5001';

async function testLogin(email, password, userType) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || response.statusText);
    }
    
    const data = await response.json();
    console.log(`✅ ${userType} login successful:`, data.user.email);
    console.log('   Token:', data.token.substring(0, 20) + '...');
    return data.token;
  } catch (error) {
    console.error(`❌ ${userType} login failed:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🔐 Testing Login...\n');
  
  const adminToken = await testLogin('admin@wyveninc.com', '2001', 'Admin');
  console.log('');
  const userToken = await testLogin('joshua@wyveninc.com', '2001', 'User');
  
  if (adminToken && userToken) {
    console.log('\n✅ All login tests passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Some login tests failed!');
    process.exit(1);
  }
}

runTests();

