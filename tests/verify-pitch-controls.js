// tests/verify-pitch-controls.js
const assert = require('assert');

// Mock browser environment
global.window = {
  location: {
    origin: 'https://example.com',
    pathname: '/anclamar-demo/',
    search: '?shop=burger&name=%3Cscript%3Ealert(1)%3C/script%3ESmash+Master&phone=201012345678&fee=30&curr=SAR&demo=true'
  },
  history: {
    replaceState() {}
  },
  localStorage: {
    store: {},
    getItem(k) { return this.store[k] || null; },
    setItem(k, v) { this.store[k] = String(v); },
    removeItem(k) { delete this.store[k]; },
    clear() { this.store = {}; }
  },
  document: {
    body: {
      appendChild() {},
      classList: { add() {}, remove() {}, contains() { return false; } }
    },
    createElement() {
      return {
        className: '',
        id: '',
        style: {},
        innerHTML: '',
        addEventListener() {},
        querySelector() { return null; },
        querySelectorAll() { return []; }
      };
    },
    getElementById() { return null; },
    addEventListener() {}
  }
};

global.SHOP_PRESETS = {
  grill: { id: 'grill', brand: { nameAr: 'مشويات جليسة', nameEn: 'Legleisah Grill' }, contact: { defaultPhone: '201225334412' } },
  burger: { id: 'burger', brand: { nameAr: 'سماش برجر', nameEn: 'Smash Burger' }, contact: { defaultPhone: '201000000000' } }
};

require('../js/pitch-controls.js');
const pc = window.PitchControls;

assert.ok(pc, 'PitchControls must be exposed on window');

// Test 1: URL Query parameters parsing
const cfg = pc.getEffectiveConfig();
assert.strictEqual(cfg.shopId, 'burger', 'shopId should resolve to burger from URL');
assert.strictEqual(cfg.phone, '201012345678', 'phone should resolve from URL');
assert.strictEqual(cfg.deliveryFee, 30, 'delivery fee should resolve to 30 from URL');
assert.strictEqual(cfg.currency, 'SAR', 'currency should resolve to SAR from URL');
assert.strictEqual(cfg.isDemoMode, true, 'isDemoMode should be true when demo=true');

// Test 2: HTML escaping utility (Issue #1 XSS fix)
const rawXss = '<script>alert("xss")</script>';
const escaped = pc.escapeHtml(rawXss);
assert.ok(!escaped.includes('<script>'), 'escapeHtml must neutralize script tags');
assert.ok(escaped.includes('&lt;script&gt;'), 'escapeHtml must encode tags');

// Test 3: Generate clean client link (without demo=true)
const cleanLink = pc.generateClientLink({
  shopId: 'burger',
  shopName: 'Smash Master',
  phone: '201012345678',
  deliveryFee: 30,
  currency: 'SAR'
});
assert.ok(!cleanLink.includes('demo=true'), 'Generated client link must NEVER contain demo=true');
assert.ok(cleanLink.includes('shop=burger'), 'Link must contain shop=burger');
assert.ok(cleanLink.includes('curr=SAR'), 'Link must contain currency');

// Test 4: Per-Preset LocalStorage scoping (Issue #3 fix)
global.window.location.search = ''; // simulate clean URL visit
pc.saveOverrides({
  shopId: 'burger',
  shopName: 'سماش كينج',
  phone: '201099998888',
  deliveryFee: 35,
  currency: 'EGP'
});

const burgerCfg = pc.getEffectiveConfig();
assert.strictEqual(burgerCfg.shopId, 'burger');
assert.strictEqual(burgerCfg.shopName, 'سماش كينج');

// Now switch to grill preset: custom burger name must NOT leak to grill
pc.saveOverrides({
  shopId: 'grill'
});
const grillCfg = pc.getEffectiveConfig();
assert.strictEqual(grillCfg.shopId, 'grill');
assert.strictEqual(grillCfg.shopName, null, 'Grill preset shopName must be null and not leak burger name');

// Test 5: Reset defaults
pc.resetDefaults();
const resetCfg = pc.getEffectiveConfig();
assert.strictEqual(resetCfg.shopId, 'grill', 'Default shopId should fallback to grill');
assert.strictEqual(resetCfg.shopName, null, 'Custom shopName should be null after reset');

console.log('Pitch controls tests passed successfully with XSS and preset-isolation checks.');
