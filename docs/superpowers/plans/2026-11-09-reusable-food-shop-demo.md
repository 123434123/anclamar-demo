# Reusable Food Shop Sales Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-converting, mobile-first, reusable food shop sales demo with 4 complete cuisine presets, secret in-person pitch toolbar with a "Copy Client Link" generator, item modifiers modal, and structured WhatsApp delivery/takeaway ordering.

**Architecture:** A zero-build modular static architecture designed for GitHub Pages: `data/presets.js` provides domain data and themes, `css/styles.css` handles CSS variable theming and responsive UI, `js/pitch-controls.js` manages secret controls, URL parameters, and `localStorage` persistence, while `js/app.js` powers the cart, modifier calculations, and WhatsApp receipt formatting.

**Tech Stack:** Vanilla JavaScript (ES6+), HTML5, CSS3 with CSS Custom Properties, Unsplash Image CDN. Zero external npm dependencies.

**Spec:** `docs/superpowers/specs/2026-11-09-reusable-food-shop-demo-design.md`

## Global Constraints
- Pure static client files compatible with GitHub Pages hosting (no build tools, no webpack, no node server).
- Primary layout must be Arabic RTL (`dir="rtl"`) with seamless toggle to English LTR (`dir="ltr"`).
- All images must load from reliable HTTPS CDNs (Unsplash curated food photography) with responsive dimensions (`w=600&auto=format&fit=crop&q=80`).
- No visible placeholder text (e.g. `[MY NAME]`, `[CONFIRM ALL PRICES]`, `[REPLACE YOUR-DOMAIN]`) anywhere in the UI or generated messages.
- Secret pitch toolbar must never show to prospective clients unless explicitly triggered via `&demo=true` or triple-tap / long-press on the brand logo.

## Review Focus
1. **Modifier Pricing & Cart Signature**: Adding the same base item with different modifiers (e.g., Burger Double + Cheese vs. Burger Single regular) must create two distinct line items in the cart rather than overwriting each other.
2. **Delivery Fee Calculation & Takeaway Switch**: Switching from Delivery to Takeaway must immediately set the delivery fee to 0 in both the live cart UI and the final WhatsApp text receipt.
3. **URL Parameter Encoding**: "Copy Client Link" must encode special characters (Arabic restaurant names, spaces, plus signs in phone numbers) cleanly so when clicked from WhatsApp, parameters deserialize accurately.
4. **localStorage Collision**: Overriding a custom shop name on the "burger" preset must not corrupt or clobber default branding when switching to "grill" or resetting defaults.
5. **WhatsApp Message Formatting**: The encoded text must retain bold markdown asterisks, clean emojis, and line breaks without producing malformed URI errors on iOS and Android WhatsApp handlers.

---

### Task 1: Comprehensive Preset Data Schema (`data/presets.js`)

**Files:**
- Create: `data/presets.js`
- Test: `tests/verify-presets.js`

**Interfaces:**
- Produces: `window.SHOP_PRESETS = { grill: {...}, burger: {...}, pizza: {...}, cafe: {...} }`

- [ ] **Step 1: Write test to verify presets structure and required fields**

```javascript
// tests/verify-presets.js
const assert = require('assert');
// Load presets
global.window = {};
require('../data/presets.js');
const presets = window.SHOP_PRESETS;

assert.ok(presets, 'SHOP_PRESETS must exist');
['grill', 'burger', 'pizza', 'cafe'].forEach(key => {
  const p = presets[key];
  assert.ok(p, `Preset ${key} must exist`);
  assert.ok(p.brand && p.brand.nameAr && p.brand.nameEn, `Preset ${key} must have brand names`);
  assert.ok(p.theme && p.theme.primary && p.theme.accent && p.theme.bg, `Preset ${key} must have theme colors`);
  assert.ok(Array.isArray(p.categories) && p.categories.length > 0, `Preset ${key} must have categories`);
  
  // Verify at least one item has modifiers
  const hasModifier = p.categories.some(c => c.items.some(i => Array.isArray(i.modifiers) && i.modifiers.length > 0));
  assert.ok(hasModifier, `Preset ${key} must have at least one item with modifiers`);
});
console.log('All preset schemas validated successfully.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-presets.js`
Expected: FAIL with `Cannot find module '../data/presets.js'`

- [ ] **Step 3: Implement `data/presets.js`**

Implement complete presets for `grill`, `burger`, `pizza`, and `cafe`:
- High-res curated Unsplash food URLs for hero and menu items.
- Full Arabic & English strings.
- Items with realistic price points (EGP).
- Modifiers for burger sizes (Single, Double), pizza crust/toppings, steak/grill doneness/sides, and coffee milk/syrup options.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-presets.js`
Expected: PASS with "All preset schemas validated successfully."

- [ ] **Step 5: Commit**

```bash
git add data/presets.js tests/verify-presets.js
git commit -m "feat(data): add comprehensive food shop presets with modifiers and theme tokens"
```

---

### Task 2: Secret Pitch Controls, URL Parameters & Link Generator (`js/pitch-controls.js`)

**Files:**
- Create: `js/pitch-controls.js`
- Test: `tests/verify-pitch-controls.js`

**Interfaces:**
- Consumes: `window.SHOP_PRESETS`
- Produces: `window.PitchControls = { getEffectiveConfig(), init(), copyClientLink(), resetDefaults() }`

- [ ] **Step 1: Write test for URL query parsing, override resolution, and client link generation**

```javascript
// tests/verify-pitch-controls.js
const assert = require('assert');
global.window = {
  location: { search: '?shop=burger&name=Smash+Master&phone=201012345678&fee=30&demo=true' },
  localStorage: {
    store: {},
    getItem(k) { return this.store[k] || null; },
    setItem(k, v) { this.store[k] = String(v); },
    removeItem(k) { delete this.store[k]; }
  }
};
global.SHOP_PRESETS = {
  grill: { id: 'grill', brand: { nameAr: 'مشويات' }, contact: { defaultPhone: '201225334412' } },
  burger: { id: 'burger', brand: { nameAr: 'برجر' }, contact: { defaultPhone: '201000000000' } }
};

require('../js/pitch-controls.js');
const pc = window.PitchControls;

const cfg = pc.getEffectiveConfig();
assert.strictEqual(cfg.shopId, 'burger', 'shopId should resolve from URL');
assert.strictEqual(cfg.shopName, 'Smash Master', 'shopName should resolve from URL');
assert.strictEqual(cfg.phone, '201012345678', 'phone should resolve from URL');
assert.strictEqual(cfg.deliveryFee, 30, 'delivery fee should resolve from URL');
assert.strictEqual(cfg.isDemoMode, true, 'isDemoMode should be true when demo=true');

const cleanLink = pc.generateClientLink({ shopId: 'burger', shopName: 'Smash Master', phone: '201012345678', fee: 30 });
assert.ok(!cleanLink.includes('demo=true'), 'Client link must NOT contain demo=true');
assert.ok(cleanLink.includes('shop=burger'), 'Client link must contain shop=burger');
assert.ok(cleanLink.includes('name=Smash+Master') || cleanLink.includes('name=Smash%20Master'), 'Client link must contain encoded name');
console.log('Pitch controls logic verified successfully.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-pitch-controls.js`
Expected: FAIL with `Cannot find module '../js/pitch-controls.js'`

- [ ] **Step 3: Implement `js/pitch-controls.js`**

Implement:
- URL search param parsing (`shop`, `demo`, `name`, `phone`, `fee`, `curr`).
- `localStorage` read/write helper (`shop_demo_overrides`).
- DOM event bindings: triple-tap detector on `.logo` (records click timestamps), and 800ms long-press detector via `touchstart`/`touchend` or `mousedown`/`mouseup`.
- Secret toolbar DOM rendering (floating bottom-sheet or discreet modal overlay).
- "Copy Client Link" button using `navigator.clipboard.writeText` with fallback, copying a clean URL without `demo=true`.
- Toast notification trigger ("تم نسخ الرابط للعميل / Client link copied!").

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-pitch-controls.js`
Expected: PASS with "Pitch controls logic verified successfully."

- [ ] **Step 5: Commit**

```bash
git add js/pitch-controls.js tests/verify-pitch-controls.js
git commit -m "feat(pitch): implement secret pitch toolbar, URL query parser, and link generator"
```

---

### Task 3: Modifiers Modal, Cart Logic & WhatsApp Order Formatter (`js/app.js`)

**Files:**
- Create: `js/app.js`
- Test: `tests/verify-app-logic.js`

**Interfaces:**
- Consumes: `window.SHOP_PRESETS`, `window.PitchControls`
- Produces: `window.App = { cart, addToCart(), removeFromCart(), setOrderType(), buildWhatsAppMessage() }`

- [ ] **Step 1: Write test for cart item modifier hashing and WhatsApp message builder**

```javascript
// tests/verify-app-logic.js
const assert = require('assert');
global.window = {};
require('../data/presets.js');
require('../js/app.js');

const app = window.App;

// Test cart item with modifiers
const item = {
  id: 'b1',
  nameAr: 'كلاسيك برجر',
  nameEn: 'Classic Burger',
  price: 150
};
const selectedModifiers = [
  { group: 'size', nameAr: 'دبل', nameEn: 'Double', priceDelta: 40 },
  { group: 'addon', nameAr: 'جبنة إضافية', nameEn: 'Extra Cheese', priceDelta: 15 }
];

const cartKey1 = app.generateCartKey(item.id, selectedModifiers);
const cartKey2 = app.generateCartKey(item.id, []);
assert.notStrictEqual(cartKey1, cartKey2, 'Items with different modifiers must have unique cart keys');

// Test total calculation with delivery fee
const cartState = [
  { item, modifiers: selectedModifiers, qty: 2, unitPrice: 205 }, // 150 + 40 + 15 = 205 * 2 = 410
  { item: { id: 'f1', nameAr: 'بطاطس', nameEn: 'Fries', price: 40 }, modifiers: [], qty: 1, unitPrice: 40 }
];
const subtotal = app.calculateSubtotal(cartState);
assert.strictEqual(subtotal, 450, 'Subtotal calculation must be 450');

// Test WhatsApp receipt formatting for Delivery
const orderInfo = {
  orderType: 'delivery',
  customerName: 'أحمد محمود',
  customerPhone: '01012345678',
  address: '15 شارع النزهة',
  notes: 'بدون شطة',
  deliveryFee: 25,
  currency: 'جنيه',
  shopName: 'برجر ماستر'
};
const message = app.formatWhatsAppReceipt(cartState, orderInfo);
assert.ok(message.includes('طلب جديد من الموقع - برجر ماستر'), 'Message must contain shop name');
assert.ok(message.includes('نوع الطلب:* توصيل'), 'Message must specify delivery');
assert.ok(message.includes('دبل، جبنة إضافية'), 'Message must list selected modifiers');
assert.ok(message.includes('رسوم التوصيل:* 25 جنيه'), 'Message must include delivery fee');
assert.ok(message.includes('الإجمالي:* 475 جنيه'), 'Message total must be 450 + 25 = 475');

// Test Takeaway formatting (0 delivery fee)
const takeawayOrder = { ...orderInfo, orderType: 'takeaway', deliveryFee: 0 };
const takeawayMsg = app.formatWhatsAppReceipt(cartState, takeawayOrder);
assert.ok(takeawayMsg.includes('نوع الطلب:* استلام / تيك أواي'), 'Message must specify takeaway');
assert.ok(!takeawayMsg.includes('رسوم التوصيل'), 'Takeaway message must not mention delivery fee');
assert.ok(takeawayMsg.includes('الإجمالي:* 450 جنيه'), 'Takeaway total must equal subtotal');

console.log('App cart & WhatsApp formatting verified successfully.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-app-logic.js`
Expected: FAIL with `Cannot find module '../js/app.js'`

- [ ] **Step 3: Implement `js/app.js`**

Implement:
- Hydration logic: inject active preset theme colors into `:root` CSS variables.
- Dynamic rendering: Header, Hero, Category Tabs, Menu Cards with "Customize / تخصيص" modifier triggers.
- Modifiers Modal: renders modifier groups (radio for required single choice, checkboxes for add-ons), updates live action button price, adds distinct items to cart.
- Cart Drawer: quantity updates, remove item, subtotal calculation.
- Order Type segmented switch: Delivery vs. Takeaway. If delivery, show address inputs and delivery fee row.
- WhatsApp Order button: validates required inputs, generates formatted message, opens `wa.me/[Phone]?text=...`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-app-logic.js`
Expected: PASS with "App cart & WhatsApp formatting verified successfully."

- [ ] **Step 5: Commit**

```bash
git add js/app.js tests/verify-app-logic.js
git commit -m "feat(app): add modifier modal logic, cart management, and formatted WhatsApp checkout"
```

---

### Task 4: Responsive CSS Theming, Modals & Cart Drawer (`css/styles.css`)

**Files:**
- Create: `css/styles.css`
- Modify: `index.html` (link styles)

**Interfaces:**
- Consumes: CSS variables set by `js/app.js` (`--primary`, `--secondary`, `--accent`, `--bg`, `--card-bg`, `--text`, `--font-main`, `--font-heading`)
- Produces: Responsive styling for mobile & desktop, RTL/LTR support, modal animations, cart drawer, pitch overlay.

- [ ] **Step 1: Write CSS styles in `css/styles.css`**
- Base design system: Cairo/Tajawal font imports, reset, CSS custom properties.
- Header with sticky positioning, brand logo, language toggle, and " اطلب الآن / Order Now" CTA.
- Hero section with responsive backdrop, dark gradient overlay for text readability, and trust badges.
- Category horizontal scrolling pill tabs (sticky below header).
- Menu grid with card hover animations, badge overlays, item photos with 4:3 aspect ratio, title, description, and price tags.
- Modifier Bottom-Sheet / Modal with smooth slide-up animation on mobile, backdrop blur, option selection chips, and sticky footer action button.
- Floating Cart Pill Bar (showing item count and running total).
- Slide-up Cart & Checkout Drawer with segmented control (`Delivery` / `Takeaway`), inputs with clear touch targets (min 48px), and primary green WhatsApp button.
- Secret Pitch Toolbar: discrete dark floating dock with easy-to-use inputs, styled preset select dropdown, and "Copy Client Link" button with copy feedback toast.

- [ ] **Step 2: Verify CSS syntax and rules**

Run: `powershell -Command "Get-Content css/styles.css | Measure-Object -Line"`
Expected: Clean stylesheet with complete responsive media queries.

- [ ] **Step 3: Commit**

```bash
git add css/styles.css
git commit -m "feat(css): build responsive CSS variable theming, modifier modal, and checkout drawer styles"
```

---

### Task 5: Master Semantic `index.html` Skeleton & End-to-End Integration

**Files:**
- Modify: `index.html`
- Test: `tests/verify-e2e-markup.js`

**Interfaces:**
- Connects: `css/styles.css`, `data/presets.js`, `js/pitch-controls.js`, `js/app.js`
- Mount points: `#hero`, `#tabs`, `#menuGrid`, `#cartDrawer`, `#modifierModal`, `#pitchToolbar`, `#toast`

- [ ] **Step 1: Write integration test to verify complete HTML markup mounts and zero placeholders**

```javascript
// tests/verify-e2e-markup.js
const fs = require('fs');
const assert = require('assert');
const html = fs.readFileSync('index.html', 'utf8');

// Verify scripts and stylesheet links
assert.ok(html.includes('css/styles.css'), 'Must link css/styles.css');
assert.ok(html.includes('data/presets.js'), 'Must script data/presets.js');
assert.ok(html.includes('js/pitch-controls.js'), 'Must script js/pitch-controls.js');
assert.ok(html.includes('js/app.js'), 'Must script js/app.js');

// Verify zero unfinished placeholders
const bannedPlaceholders = ['[MY NAME]', '[REPLACE YOUR-DOMAIN]', '[CONFIRM ALL PRICES]', '[Sample text]', '[HOURS'];
bannedPlaceholders.forEach(bp => {
  assert.ok(!html.includes(bp), `Must NOT contain placeholder: ${bp}`);
});

// Verify critical mount points
assert.ok(html.includes('id="modifierModal"'), 'Must contain modifierModal shell');
assert.ok(html.includes('id="cartDrawer"'), 'Must contain cartDrawer shell');
assert.ok(html.includes('id="pitchToolbar"'), 'Must contain pitchToolbar shell');

console.log('E2E markup structure validated successfully with zero placeholders.');
```

- [ ] **Step 2: Run test to verify initial failure**

Run: `node tests/verify-e2e-markup.js`
Expected: FAIL due to existing placeholders in legacy `index.html`.

- [ ] **Step 3: Update `index.html` with clean semantic skeleton**

Clean up legacy template and construct clean semantic markup:
- Dynamic meta tags and SEO schema.
- Header with `.logo`, `#langToggle`, and direct order link.
- Hero container `#heroMount`.
- Sticky category tabs container `#categoryTabs`.
- Menu items container `#menuContainer`.
- Modifiers modal `#modifierModal`.
- Cart checkout drawer `#cartDrawer`.
- Secret pitch toolbar `#pitchToolbar`.
- Toast container `#toastContainer`.
- Script loading order: `data/presets.js` -> `js/pitch-controls.js` -> `js/app.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-e2e-markup.js`
Expected: PASS with "E2E markup structure validated successfully with zero placeholders."

- [ ] **Step 5: Commit**

```bash
git add index.html tests/verify-e2e-markup.js
git commit -m "feat(html): integrate semantic skeleton with modular scripts, drawer shells, and zero placeholders"
```

---

### Task 6: Full Verification & Browser Sanity Check

**Files:**
- Create: `tests/run-all-tests.js`
- Test: All suites

- [ ] **Step 1: Write test runner `tests/run-all-tests.js`**

Run all 4 unit and integration test scripts in sequence and verify exit code 0.

- [ ] **Step 2: Execute all tests**

Run: `node tests/run-all-tests.js`
Expected: PASS with 100% test success.

- [ ] **Step 3: Start a local HTTP server and perform browser curl / header inspection**

Run: `powershell -Command "Start-Process python -ArgumentList '-m http.server 8080' -PassThru"` followed by curl verification of `http://localhost:8080/index.html?shop=burger&demo=true`.

- [ ] **Step 4: Commit final verification**

```bash
git add tests/run-all-tests.js
git commit -m "test: add master test runner and complete automated verification suite"
```
