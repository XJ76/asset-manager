require('dotenv').config();
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5001';

async function testHealth() {
  console.log('🏥 Testing Health Check...');
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health check passed:', data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

testHealth().then(success => {
  process.exit(success ? 0 : 1);
});

