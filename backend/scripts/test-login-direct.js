require('dotenv').config();
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5001';

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    console.log('URL:', `${BASE_URL}/api/auth/login`);
    
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@wyveninc.com',
        password: '2001',
      }),
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response:', text.substring(0, 200));
    
    if (response.ok) {
      const data = JSON.parse(text);
      console.log('✅ Login successful:', data);
    } else {
      console.log('❌ Login failed');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();

