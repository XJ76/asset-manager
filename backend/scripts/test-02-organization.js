require('dotenv').config();
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5001';

async function testCreateOrganization() {
  console.log('🏢 Testing Create Organization...');
  try {
    const response = await fetch(`${BASE_URL}/api/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Wyven inc',
        email: 'info@wyveninc.com',
        userName: 'Organization Admin',
        userRole: 'admin',
        password: '2001',
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || response.statusText);
    }
    
    const data = await response.json();
    console.log('✅ Organization created:', data.organization.name);
    console.log('   ID:', data.organization.id);
    console.log('   Admin Token:', data.token.substring(0, 20) + '...');
    
    return { orgId: data.organization.id, token: data.token, adminId: data.user.id };
  } catch (error) {
    console.error('❌ Create organization failed:', error.message);
    return null;
  }
}

testCreateOrganization().then(result => {
  if (result) {
    console.log('\n✅ Test passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Test failed!');
    process.exit(1);
  }
});

