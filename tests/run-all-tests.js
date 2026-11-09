// tests/run-all-tests.js - Master Test Runner for Food Shop Sales Demo
const { execSync } = require('child_process');
const path = require('path');

const tests = [
  'tests/verify-presets.js',
  'tests/verify-pitch-controls.js',
  'tests/verify-app-logic.js',
  'tests/verify-e2e-markup.js'
];

console.log('==================================================');
console.log('Running Complete Reusable Food Shop Demo Test Suite');
console.log('==================================================\n');

let failedCount = 0;

tests.forEach((testFile, idx) => {
  const fullPath = path.join(__dirname, '..', testFile);
  process.stdout.write(`[${idx + 1}/${tests.length}] Testing ${testFile}... `);
  try {
    const output = execSync(`node "${fullPath}"`, { encoding: 'utf8' });
    console.log('✓ PASS');
    if (output.trim()) {
      console.log(`    ${output.trim()}`);
    }
  } catch (err) {
    console.log('✗ FAIL');
    console.error(err.stderr || err.stdout || err.message);
    failedCount++;
  }
});

console.log('\n==================================================');
if (failedCount === 0) {
  console.log('🎉 ALL TESTS PASSED! (100% Success)');
  console.log('==================================================');
  process.exit(0);
} else {
  console.error(`💥 ${failedCount} test(s) failed.`);
  console.log('==================================================');
  process.exit(1);
}
