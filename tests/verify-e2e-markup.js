// tests/verify-e2e-markup.js
const fs = require('fs');
const assert = require('assert');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// 1. Verify scripts and stylesheet links
assert.ok(html.includes('href="css/styles.css"'), 'Must link css/styles.css');
assert.ok(html.includes('src="data/presets.js"'), 'Must include data/presets.js');
assert.ok(html.includes('src="js/pitch-controls.js"'), 'Must include js/pitch-controls.js');
assert.ok(html.includes('src="js/app.js"'), 'Must include js/app.js');

// 2. Verify scripts ordering: presets -> pitch-controls -> app
const idxPresets = html.indexOf('data/presets.js');
const idxPitch = html.indexOf('js/pitch-controls.js');
const idxApp = html.indexOf('js/app.js');
assert.ok(idxPresets < idxPitch && idxPitch < idxApp, 'Scripts must load in order: presets -> pitch -> app');

// 3. Verify zero unfinished placeholders
const bannedPlaceholders = [
  '[MY NAME]',
  '[REPLACE YOUR-DOMAIN]',
  '[CONFIRM ALL PRICES',
  '[Sample text]',
  '[HOURS'
];
bannedPlaceholders.forEach(bp => {
  assert.ok(!html.includes(bp), `Must NOT contain placeholder: ${bp}`);
});

// 4. Verify critical mounting points
const requiredMounts = [
  'id="headerMount"',
  'id="heroMount"',
  'id="categoryTabs"',
  'id="menuContainer"',
  'id="reviewsMount"',
  'id="contactMount"',
  'id="footerMount"',
  'id="modifierModal"',
  'id="cartPillBar"',
  'id="cartDrawer"',
  'id="pitchToolbar"'
];

requiredMounts.forEach(mountId => {
  assert.ok(html.includes(mountId), `Must contain mount point: ${mountId}`);
});

console.log('E2E markup structure validated successfully with zero placeholders.');
