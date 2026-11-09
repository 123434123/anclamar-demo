// tests/verify-pitch-controls.js
const assert = require('assert');

// Mock browser environment
global.window = {
  location: {
    origin: 'https://example.com',
    pathname: '/anclamar-demo/',
    search: '?shop=burger&name=Smash+Master&phone=201012345678&fee=30&curr=EGP&demo=true'
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
    getElementById() { return null; }
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
assert.strictEqual(cfg.shopName, 'Smash Master', 'shopName should resolve to Smash Master from URL');
assert.strictEqual(cfg.phone, '201012345678', 'phone should resolve from URL');
assert.strictEqual(cfg.deliveryFee, 30, 'delivery fee should resolve to 30 from URL');
assert.strictEqual(cfg.currency, 'EGP', 'currency should resolve from URL');
assert.strictEqual(cfg.isDemoMode, true, 'isDemoMode should be true when demo=true');

// Test 2: Generate clean client link (without demo=true)
const cleanLink = pc.generateClientLink({
  shopId: 'burger',
  shopName: 'Smash Master',
  phone: '201012345678',
  deliveryFee: 30,
  currency: 'EGP'
});
assert.ok(!cleanLink.includes('demo=true'), 'Generated client link must NEVER contain demo=true');
assert.ok(cleanLink.includes('shop=burger'), 'Link must contain shop=burger');
assert.ok(cleanLink.includes('phone=201012345678'), 'Link must contain phone');
assert.ok(cleanLink.includes('fee=30'), 'Link must contain fee=30');

// Test 3: LocalStorage persistence override test
global.window.location.search = ''; // simulate clean URL visit
pc.saveOverrides({
  shopId: 'grill',
  shopName: 'مشويات البركة',
  phone: '201199998888',
  deliveryFee: 25,
  currency: 'جنيه'
});

const storedCfg = pc.getEffectiveConfig();
assert.strictEqual(storedCfg.shopId, 'grill', 'Should resolve saved shopId');
assert.strictEqual(storedCfg.shopName, 'مشويات البركة', 'Should resolve saved shopName');
assert.strictEqual(storedCfg.phone, '201199998888', 'Should resolve saved phone');
assert.strictEqual(storedCfg.deliveryFee, 25, 'Should resolve saved deliveryFee');

// Test 4: Reset defaults
pc.resetDefaults();
const resetCfg = pc.getEffectiveConfig();
assert.strictEqual(resetCfg.shopId, 'grill', 'Default shopId should fallback to grill');
assert.strictEqual(resetCfg.shopName, null, 'Custom shopName should be null after reset');

console.log('Pitch controls tests passed successfully.');
