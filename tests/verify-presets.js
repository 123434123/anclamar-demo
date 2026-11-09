const assert = require('assert');

// Mock browser window environment
global.window = {};
require('../data/presets.js');
const presets = window.SHOP_PRESETS;

assert.ok(presets, 'SHOP_PRESETS must exist on window');

const expectedKeys = ['grill', 'burger', 'pizza', 'cafe'];
expectedKeys.forEach(key => {
  const p = presets[key];
  assert.ok(p, `Preset ${key} must exist`);
  assert.strictEqual(p.id, key, `Preset id must match ${key}`);
  
  // Brand
  assert.ok(p.brand, `Preset ${key} must have brand`);
  assert.ok(p.brand.nameAr && p.brand.nameEn, `Preset ${key} brand must have nameAr and nameEn`);
  assert.ok(p.brand.taglineAr && p.brand.taglineEn, `Preset ${key} brand must have taglineAr and taglineEn`);
  
  // Theme
  assert.ok(p.theme, `Preset ${key} must have theme`);
  ['primary', 'secondary', 'accent', 'bg', 'cardBg', 'text'].forEach(colorKey => {
    assert.ok(p.theme[colorKey], `Preset ${key} theme must specify ${colorKey}`);
  });
  
  // Hero
  assert.ok(p.hero && p.hero.titleAr && p.hero.titleEn && p.hero.bgImage, `Preset ${key} must have valid hero`);
  
  // Contact
  assert.ok(p.contact && p.contact.defaultPhone, `Preset ${key} must have defaultPhone`);
  
  // Rating
  assert.ok(p.rating && p.rating.googleScore, `Preset ${key} must have rating score`);
  
  // Categories & Items
  assert.ok(Array.isArray(p.categories) && p.categories.length >= 2, `Preset ${key} must have at least 2 categories`);
  
  let totalItems = 0;
  let modifierItemCount = 0;
  p.categories.forEach(cat => {
    assert.ok(cat.nameAr && cat.nameEn, `Category in ${key} must have nameAr and nameEn`);
    assert.ok(Array.isArray(cat.items) && cat.items.length > 0, `Category in ${key} must have items`);
    cat.items.forEach(item => {
      totalItems++;
      assert.ok(item.id, `Item in ${key} must have id`);
      assert.ok(item.nameAr && item.nameEn, `Item in ${key} must have names`);
      assert.ok(typeof item.price === 'number', `Item ${item.id} price must be a number`);
      assert.ok(item.image && item.image.startsWith('https://'), `Item ${item.id} must have HTTPS image URL`);
      if (Array.isArray(item.modifiers) && item.modifiers.length > 0) {
        modifierItemCount++;
        item.modifiers.forEach(mod => {
          assert.ok(mod.id && mod.nameAr && mod.nameEn, `Modifier in ${item.id} must have metadata`);
          assert.ok(['single', 'multiple'].includes(mod.type), `Modifier ${mod.id} type must be single or multiple`);
          assert.ok(Array.isArray(mod.options) && mod.options.length > 0, `Modifier ${mod.id} must have options`);
          mod.options.forEach(opt => {
            assert.ok(opt.nameAr && opt.nameEn, `Option in ${mod.id} must have names`);
            assert.strictEqual(typeof opt.priceDelta, 'number', `Option priceDelta must be a number`);
          });
        });
      }
    });
  });
  assert.ok(totalItems >= 4, `Preset ${key} must have at least 4 items`);
  assert.ok(modifierItemCount >= 1, `Preset ${key} must have at least 1 item with modifiers`);
});

console.log('All preset schemas validated successfully.');
