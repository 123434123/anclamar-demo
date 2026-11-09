# Reusable Food Shop Sales Demo — Design Document

## 1. Intent & The Why
The goal is to create a high-converting, mobile-first, reusable web application demo to present directly to independent food shop and restaurant owners (e.g. in Cairo, Egypt).

Restaurant owners currently rely on aggregators (like elmenus and talabat) that charge high commissions (15%–25%+), or disorganized phone calls. This demo provides immediate visual and tactile proof that having their own branded website with instant, formatted WhatsApp ordering:
1. Gives them direct customer ownership with 0% commissions.
2. Lets customers browse an interactive menu with options/modifiers and calculate their totals accurately.
3. Automatically formats structured order details (items, modifiers, customer name, phone, delivery vs. pickup, address, delivery fee, and total) directly into their WhatsApp inbox.

The demo must be completely reusable across diverse food concepts (Bedouin/Oriental grill, Burgers & Fast Food, Pizza & Pasta, Café & Sweets) and allow live customization on the spot without rebuilding or redeploying code.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **Multi-Preset Engine**: Instant switching between 4 distinct food genres (Bedouin Grill, Burgers, Pizza/Pasta, Café) with themed color palettes, hero messaging, curated food photography, and realistic menu items.
- **Hidden Pitch Controls**: Discretely accessible via `&demo=true` query parameter or triple-tapping / long-pressing the brand logo. Includes live shop name override, target WhatsApp phone input, currency picker, delivery fee setting, and preset selector.
- **"Copy Client Link" Feature**: Single-click button in the pitch toolbar that copies a clean, customized URL encoded with query parameters (e.g. `?shop=burger&name=Smash+House&phone=2010...&fee=25`) without `&demo=true`, allowing instant sharing with prospect owners on WhatsApp.
- **Persistent State**: Save demo overrides to `localStorage` so refreshing during a live in-person presentation preserves all customized details.
- **Item Modifiers & Options Modal**: Support items with customizable options (e.g., sizes, add-ons, spice level) that update price dynamically and format into the WhatsApp receipt.
- **Delivery vs. Pickup / Dine-in Drawer**: Segmented toggle in checkout. If delivery is selected, dynamically include address fields and a configurable flat delivery fee.
- **Bulletproof Static Reliability**: Hosted on GitHub Pages as zero-dependency modular vanilla HTML/CSS/JS. Works offline/online with reliable curated Unsplash image CDNs.
- **Bilingual Interface**: Seamless Arabic (RTL) / English (LTR) language toggle preserved from initial design.

### Non-Goals
- Real payment gateway integration (Stripe, Fawry, Paymob) — orders are completed via direct WhatsApp checkout.
- Persistent backend database (Firebase/Supabase/SQL) — all state is client-side and URL/localStorage-driven.
- Kitchen Display System (KDS) or admin dashboard — WhatsApp acts as the restaurant's operational receipt system.

### Anti-Goals
- No placeholder brackets, missing images, or unfinished template text (`[MY NAME]`, `[REPLACE YOUR-DOMAIN]`) visible during presentations.
- No bulky build steps (webpack, vite, node_modules) that prevent instant static serving on GitHub Pages.
- No intrusive pitch controls visible to clients unless deliberately triggered by the presenter.

---

## 3. Constraints
- **Hosting**: GitHub Pages static hosting. All asset links and scripts must be relative or reliable HTTPS CDNs.
- **Network Resilience**: Must function smoothly over mobile data; images must be optimized and loaded lazily.
- **RTL & LTR Fidelity**: Full Arabic support (Cairo / Tajawal fonts) with RTL layout as primary, with clean English LTR toggle.
- **Device Support**: Optimized for iOS and Android mobile viewports (where restaurant owners view pitch links and test in meetings), while maintaining clean desktop layout.

---

## 4. Approaches & Selected Architectural Path

### Evaluated Approaches
1. **Approach 1 (Selected): Modular Vanilla Structure**
   - File separation: `index.html`, `css/styles.css`, `data/presets.js`, `js/app.js`, `js/pitch-controls.js`.
   - *Rationale*: Zero build tool dependencies, fast loading on GitHub Pages, clean isolation of preset data from UI logic.
2. **Approach 2: Single Monolithic File**
   - All JS/CSS inline in one file.
   - *Rejected*: Exceeds 1,500 lines, high risk of regression when updating presets or menu items.
3. **Approach 3: Client Framework via CDN (Preact/Alpine)**
   - *Rejected*: Adds runtime script dependencies that can fail on spotty mobile networks.

---

## 5. System Specifications & Component Architecture

### 5.1 Project File Tree
```
/
├── index.html                # Semantic HTML skeleton & mounting points
├── css/
│   └── styles.css            # Responsive layout, themes, modal, and drawer styles
├── data/
│   └── presets.js            # Preset definitions (Grill, Burger, Pizza, Cafe)
└── js/
    ├── app.js                # Core app, menu rendering, cart, modifiers, order logic
    └── pitch-controls.js     # Secret toolbar, URL params, link generator, localStorage
```

### 5.2 Presets Schema (`data/presets.js`)
Each preset contains:
- `id`: e.g. `'grill'`, `'burger'`, `'pizza'`, `'cafe'`
- `brand`: `{ nameAr, nameEn, taglineAr, taglineEn, logoSymbol }`
- `theme`: `{ primary, secondary, accent, bg, cardBg, text }` (applied as CSS variables)
- `hero`: `{ titleAr, titleEn, descAr, descEn, bgImage }`
- `rating`: `{ googleScore, reviewCount, platformNoteAr, platformNoteEn }`
- `contact`: `{ defaultPhone, addressAr, addressEn, hoursAr, hoursEn }`
- `categories`: Array of category objects, each containing:
  - `nameAr`, `nameEn`
  - `items`: Array of item objects:
    - `id`, `nameAr`, `nameEn`, `descAr`, `descEn`, `price`, `image`
    - `modifiers` (optional):
      - e.g. `type: 'single' | 'multiple'`
      - `nameAr`, `nameEn`
      - `options`: `[{ nameAr, nameEn, priceDelta }]`

### 5.3 Pitch Controls & URL Parameter Contract (`js/pitch-controls.js`)
- **Query Parameters**:
  - `shop`: ID of preset (`grill` | `burger` | `pizza` | `cafe`). Default: `grill`.
  - `demo`: `'true'` or `'1'` reveals pitch toolbar.
  - `name`: Overrides brand name across header, hero, and footer.
  - `phone`: Overrides WhatsApp target recipient number.
  - `fee`: Overrides flat delivery fee (numeric).
  - `curr`: Overrides currency string (default: `EGP` / `جنيه`).
- **Secret Toolbar Trigger**:
  - Appears if `demo=true` is in URL.
  - OR if user triple-taps or long-presses (800ms) on `.logo` in header.
- **Toolbar Capabilities**:
  - Preset picker dropdown.
  - Live input for Shop Name, WhatsApp Phone, Delivery Fee, Currency.
  - "Apply & Save" button (updates view and syncs to `localStorage`).
  - "Copy Client Link" button: generates clean URL formatted with current overrides (`?shop=...&name=...&phone=...&fee=...`), copies to clipboard, and displays a temporary "Link Copied!" toast.
  - "Reset Defaults" button: clears `localStorage` overrides.

### 5.4 Item Modifiers Modal (`js/app.js`)
- Items with a `modifiers` property show an "Options / تخصيص" button or badge.
- Clicking opens a bottom-sheet (mobile) / modal (desktop):
  - Displays item name, photo, and base price.
  - Radio buttons for required single-select options (e.g. Size: Single, Double, Triple).
  - Checkboxes for optional multi-select add-ons (e.g. Extra Cheese, Bacon, Jalapeño).
  - Live calculated price button: "Add to Order • [Total] EGP".
  - Adds item with unique hash/signature to cart (so two burgers with different toppings exist as separate cart entries).

### 5.5 Cart Drawer & Order Type Toggle
- Sticky bottom cart bar shows active count & subtotal.
- Clicking opens the Cart & Checkout modal:
  - List of selected items with modifiers listed beneath, quantity increment/decrement/remove buttons.
  - **Order Type Toggle**: Segmented pill switch: `🛵 Delivery / توصيل` vs `🛍️ Takeaway / استلام`.
  - When **Delivery** is active:
    - Displays Delivery Fee row added to subtotal.
    - Fields: Customer Name (required), Mobile Number (required), Delivery Address & Apt/Floor (required), Notes.
  - When **Takeaway** is active:
    - Delivery fee is set to 0.
    - Fields: Customer Name (required), Mobile Number (required), Pickup Notes.
  - **WhatsApp Order Submission**:
    - Validates inputs.
    - Encodes a formatted, professional WhatsApp text receipt:
      ```
      🔔 *طلب جديد من الموقع* - [Shop Name]
      -------------------------
      *نوع الطلب:* توصيل 🛵
      *العميل:* أحمد محمود
      *الهاتف:* 01012345678
      *العنوان:* 15 شارع النزهة، الدور 3 شقة 6
      -------------------------
      *تفاصيل الطلب:*
      - 2x كلاسيك برجر (دبل، جبنة إضافية) - 280 جنيه
      - 1x بطاطس بالجبنة - 65 جنيه
      -------------------------
      *المجموع الفرعي:* 345 جنيه
      *رسوم التوصيل:* 25 جنيه
      *الإجمالي:* 370 جنيه
      -------------------------
      *ملاحظات:* يرجى إحضار صوص باربكيو إضافي.
      ```
    - Opens `https://wa.me/[TargetPhone]?text=[EncodedMessage]`.

---

## 6. What's Left to the Builder
- Selection of curated Unsplash image URLs matching each of the 4 food presets with fast CDN params (`w=600&auto=format&fit=crop&q=80`).
- Exact CSS theme color codes for the 4 presets (e.g., Warm Sand/Terracotta for Bedouin, Rich Black/Amber for Burgers, Italian Red/Olive for Pizza, Pastel Espresso/Cream for Café).
- Micro-interactions (toast notifications for "Link Copied", smooth modal transitions, tap feedback).
- Icon set using lightweight inline SVGs or clean Unicode symbols to eliminate external icon font bloat.
