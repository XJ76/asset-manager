const { spawn } = require('child_process');
const path = require('path');

const tests = [
  'test-01-health.js',
  'test-02-organization.js',
  'test-03-user.js',
  'test-04-login.js',
  'test-05-category.js',
  'test-06-department.js',
  'test-07-asset.js',
  'test-08-get-assets.js',
  'test-09-get-users.js',
];

async function runTest(testFile) {
  return new Promise((resolve) => {
    const testPath = path.join(__dirname, testFile);
    const proc = spawn('node', [testPath], {
      stdio: 'inherit',
      shell: true,
    });
    
    proc.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

async function runAll() {
  console.log('🧪 Running all test scripts...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    console.log(`\n${'='.repeat(50)}`);
    const success = await runTest(test);
    if (success) {
      passed++;
    } else {
      failed++;
      console.log(`\n⚠️  ${test} failed - continuing with next test...`);
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 Test Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   Total: ${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed');
    process.exit(1);
  }
}

runAll();

