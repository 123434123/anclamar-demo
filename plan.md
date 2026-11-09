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
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `data/presets.js`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 2: Secret Pitch Controls, URL Parameters & Link Generator (`js/pitch-controls.js`)

**Files:**
- Create: `js/pitch-controls.js`
- Test: `tests/verify-pitch-controls.js`

**Interfaces:**
- Consumes: `window.SHOP_PRESETS`
- Produces: `window.PitchControls = { getEffectiveConfig(), init(), copyClientLink(), resetDefaults() }`

- [ ] **Step 1: Write test for URL query parsing, override resolution, and client link generation**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `js/pitch-controls.js`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 3: Modifiers Modal, Cart Logic & WhatsApp Order Formatter (`js/app.js`)

**Files:**
- Create: `js/app.js`
- Test: `tests/verify-app-logic.js`

**Interfaces:**
- Consumes: `window.SHOP_PRESETS`, `window.PitchControls`
- Produces: `window.App = { cart, addToCart(), removeFromCart(), setOrderType(), buildWhatsAppMessage() }`

- [ ] **Step 1: Write test for cart item modifier hashing and WhatsApp message builder**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `js/app.js`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 4: Responsive CSS Theming, Modals & Cart Drawer (`css/styles.css`)

**Files:**
- Create: `css/styles.css`
- Modify: `index.html` (link styles)

**Interfaces:**
- Consumes: CSS variables set by `js/app.js` (`--primary`, `--secondary`, `--accent`, `--bg`, `--card-bg`, `--text`, `--font-main`, `--font-heading`)
- Produces: Responsive styling for mobile & desktop, RTL/LTR support, modal animations, cart drawer, pitch overlay.

- [ ] **Step 1: Write CSS styles in `css/styles.css`**
- [ ] **Step 2: Verify CSS syntax and rules**
- [ ] **Step 3: Commit**

---

### Task 5: Master Semantic `index.html` Skeleton & End-to-End Integration

**Files:**
- Modify: `index.html`
- Test: `tests/verify-e2e-markup.js`

**Interfaces:**
- Connects: `css/styles.css`, `data/presets.js`, `js/pitch-controls.js`, `js/app.js`
- Mount points: `#hero`, `#tabs`, `#menuGrid`, `#cartDrawer`, `#modifierModal`, `#pitchToolbar`, `#toast`

- [ ] **Step 1: Write integration test to verify complete HTML markup mounts and zero placeholders**
- [ ] **Step 2: Run test to verify initial failure**
- [ ] **Step 3: Update `index.html` with clean semantic skeleton**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 6: Full Verification & Browser Sanity Check

**Files:**
- Create: `tests/run-all-tests.js`
- Test: All suites

- [ ] **Step 1: Write test runner `tests/run-all-tests.js`**
- [ ] **Step 2: Execute all tests**
- [ ] **Step 3: Start a local HTTP server and perform browser curl / header inspection**
- [ ] **Step 4: Commit final verification**
