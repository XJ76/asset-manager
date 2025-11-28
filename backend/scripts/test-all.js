require('dotenv').config();
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5001';

let adminToken = '';
let userToken = '';
let orgId = '';
let adminId = '';
let userId = '';
let categoryId = '';
let departmentId = '';
let assetId = '';

async function apiCall(method, endpoint, token = null, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  
  if (response.status === 204) {
    return null;
  }
  
  const text = await response.text();
  if (!text) {
    return null;
  }
  
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }
  
  if (!response.ok) {
    throw new Error(`API Error: ${data.error || response.statusText}`);
  }
  
  return data;
}

async function testHealth() {
  console.log('\n🏥 Testing Health Check...');
  try {
    const result = await apiCall('GET', '/health');
    console.log('✅ Health check passed:', result);
    return true;
  } catch (error) {
    if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
      console.error('❌ Health check failed: Backend server not running on', BASE_URL);
      console.error('   Make sure the backend is running: npm run dev');
    } else {
      console.error('❌ Health check failed:', error.message);
    }
    return false;
  }
}

async function testCreateOrganization() {
  console.log('\n🏢 Testing Create Organization...');
  try {
    const { pool } = require('../config/database');
    const orgResult = await pool.query(
      "SELECT id FROM organizations WHERE name = 'Wyven inc' LIMIT 1"
    );
    
    if (orgResult.rows.length > 0) {
      orgId = orgResult.rows[0].id;
      console.log('✅ Organization already exists:', orgId);
      return true;
    }
    
    const result = await apiCall('POST', '/api/organizations', null, {
      name: 'Wyven inc',
      email: 'info@wyveninc.com',
      userName: 'Organization Admin',
      userRole: 'admin',
      password: '2001',
    });
    console.log('✅ Organization created:', result.organization.name);
    orgId = result.organization.id;
    return true;
  } catch (error) {
    if (error.message.includes('duplicate key')) {
      const { pool } = require('../config/database');
      const orgResult = await pool.query(
        "SELECT id FROM organizations WHERE name = 'Wyven inc' LIMIT 1"
      );
      if (orgResult.rows.length > 0) {
        orgId = orgResult.rows[0].id;
        console.log('✅ Organization already exists:', orgId);
        return true;
      }
    }
    console.error('❌ Create organization failed:', error.message);
    return false;
  }
}

async function testCreateUsers() {
  console.log('\n👤 Testing Create Users...');
  try {
    if (!orgId) {
      const { pool } = require('../config/database');
      const orgResult = await pool.query(
        "SELECT id FROM organizations WHERE name = 'Wyven inc' LIMIT 1"
      );
      if (orgResult.rows.length > 0) {
        orgId = orgResult.rows[0].id;
      } else {
        throw new Error('Organization not found. Run createOrg test first.');
      }
    }
    
    const { pool } = require('../config/database');
    const { hashPassword } = require('../utils/password');
    const userModel = require('../models/user');
    
    const hashedPassword = await hashPassword('2001');
    
    let adminExists = await userModel.findByEmail('admin@wyveninc.com');
    if (!adminExists) {
      const admin = await userModel.create({
        email: 'admin@wyveninc.com',
        name: 'Admin User',
        role: 'admin',
        organizationId: orgId,
        status: 'approved',
        password: hashedPassword,
      });
      adminId = admin.id;
      console.log('✅ Admin created:', admin.email);
    } else {
      adminId = adminExists.id;
      console.log('✅ Admin already exists:', adminExists.email);
    }
    
    let userExists = await userModel.findByEmail('joshua@wyveninc.com');
    if (!userExists) {
      const user = await userModel.create({
        email: 'joshua@wyveninc.com',
        name: 'Joshua J Smith',
        role: 'user',
        organizationId: orgId,
        status: 'approved',
        password: hashedPassword,
      });
      userId = user.id;
      console.log('✅ User created:', user.name);
    } else {
      userId = userExists.id;
      console.log('✅ User already exists:', userExists.name);
    }
    
    return true;
  } catch (error) {
    if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
      console.log('✅ Users already exist');
      return true;
    }
    console.error('❌ Create users failed:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\n🔐 Testing Login...');
  
  console.log('  Testing admin login...');
  try {
    const adminResult = await apiCall('POST', '/api/auth/login', null, {
      email: 'admin@wyveninc.com',
      password: '2001',
    });
    adminToken = adminResult.token;
    console.log('✅ Admin login successful:', adminResult.user.email);
  } catch (error) {
    console.error('❌ Admin login failed:', error.message);
    return false;
  }
  
  console.log('  Testing user login...');
  try {
    const userResult = await apiCall('POST', '/api/auth/login', null, {
      email: 'joshua@wyveninc.com',
      password: '2001',
    });
    userToken = userResult.token;
    console.log('✅ User login successful:', userResult.user.email);
    return true;
  } catch (error) {
    console.error('❌ User login failed:', error.message);
    return false;
  }
}

async function testCreateCategory() {
  console.log('\n📁 Testing Create Category...');
  try {
    const result = await apiCall('POST', '/api/categories', adminToken, {
      name: 'Electronics',
      description: 'Electronic equipment and devices',
    });
    categoryId = result.id;
    console.log('✅ Category created:', result.name);
    return true;
  } catch (error) {
    console.error('❌ Create category failed:', error.message);
    return false;
  }
}

async function testCreateDepartment() {
  console.log('\n🏛️ Testing Create Department...');
  try {
    const result = await apiCall('POST', '/api/departments', adminToken, {
      name: 'IT Department',
      description: 'Information Technology',
    });
    departmentId = result.id;
    console.log('✅ Department created:', result.name);
    return true;
  } catch (error) {
    console.error('❌ Create department failed:', error.message);
    return false;
  }
}

async function testCreateAsset() {
  console.log('\n💼 Testing Create Asset...');
  try {
    const result = await apiCall('POST', '/api/assets', userToken, {
      name: 'MacBook Pro',
      categoryId: categoryId,
      departmentId: departmentId,
      datePurchased: '2024-01-15',
      cost: 2499.99,
    });
    assetId = result.id;
    console.log('✅ Asset created:', result.name, '- $' + result.cost);
    return true;
  } catch (error) {
    console.error('❌ Create asset failed:', error.message);
    return false;
  }
}

async function testGetAssets() {
  console.log('\n📋 Testing Get Assets...');
  try {
    const result = await apiCall('GET', '/api/assets', userToken);
    console.log('✅ Retrieved', result.length, 'assets');
    return true;
  } catch (error) {
    console.error('❌ Get assets failed:', error.message);
    return false;
  }
}

async function testGetUsers() {
  console.log('\n👥 Testing Get Users (Admin)...');
  try {
    const result = await apiCall('GET', '/api/users', adminToken);
    console.log('✅ Retrieved', result.length, 'users');
    return true;
  } catch (error) {
    console.error('❌ Get users failed:', error.message);
    return false;
  }
}

async function testDeleteAsset() {
  console.log('\n🗑️ Testing Delete Asset...');
  try {
    await apiCall('DELETE', `/api/assets/${assetId}`, userToken);
    console.log('✅ Asset deleted');
    return true;
  } catch (error) {
    console.error('❌ Delete asset failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 Starting API Tests...');
  console.log(`📍 Base URL: ${BASE_URL}\n`);
  
  const results = {
    health: await testHealth(),
    createOrg: await testCreateOrganization(),
    createUsers: await testCreateUsers(),
    login: await testLogin(),
    createCategory: await testCreateCategory(),
    createDepartment: await testCreateDepartment(),
    createAsset: await testCreateAsset(),
    getAssets: await testGetAssets(),
    getUsers: await testGetUsers(),
    deleteAsset: await testDeleteAsset(),
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}`);
  });
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log(`\n${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed');
    process.exit(1);
  }
}

runAllTests().catch(console.error);

