require('dotenv').config();
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5001';

async function getUserToken() {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'joshua@wyveninc.com', password: '2001' }),
  });
  const data = await response.json();
  return data.token;
}

async function testGetAssets() {
  console.log('📋 Testing Get Assets...');
  
  try {
    const token = await getUserToken();
    
    const response = await fetch(`${BASE_URL}/api/assets`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || response.statusText);
    }
    
    const data = await response.json();
    console.log('✅ Retrieved', data.length, 'assets');
    data.forEach(asset => {
      console.log(`   - ${asset.name}: $${asset.cost}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Get assets failed:', error.message);
    return false;
  }
}

testGetAssets().then(success => {
  if (success) {
    console.log('\n✅ Test passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Test failed!');
    process.exit(1);
  }
});

