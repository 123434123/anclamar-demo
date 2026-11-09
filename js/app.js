// js/app.js - Core Application, Modifiers Modal, Cart State & WhatsApp Receipt Engine
(function () {
  const App = {
    lang: 'ar',
    orderType: 'delivery',
    cart: [],
    activePreset: null,
    effectiveConfig: null,

    // Helper: generate unique cart key based on item id and selected modifiers
    generateCartKey: function (itemId, modifiers) {
      if (!modifiers || modifiers.length === 0) return String(itemId);
      const modSig = modifiers
        .map(m => `${m.group || ''}:${m.nameAr || m.nameEn}:${m.priceDelta || 0}`)
        .sort()
        .join('|');
      return `${itemId}__${modSig}`;
    },

    // Helper: calculate cart subtotal
    calculateSubtotal: function (cartState) {
      const list = cartState || this.cart;
      return list.reduce(function (sum, entry) {
        return sum + (entry.unitPrice * entry.qty);
      }, 0);
    },

    // Helper: format complete structured WhatsApp receipt
    formatWhatsAppReceipt: function (cartState, orderInfo, lang) {
      const isAr = (lang || this.lang) === 'ar';
      const items = cartState || this.cart;
      const subtotal = this.calculateSubtotal(items);
      const fee = orderInfo.orderType === 'delivery' ? (orderInfo.deliveryFee || 0) : 0;
      const total = subtotal + fee;
      const curr = orderInfo.currency || (isAr ? 'جنيه' : 'EGP');

      const lines = [];
      lines.push(`🔔 *${isAr ? 'طلب جديد من الموقع' : 'New Website Order'}* - ${orderInfo.shopName || ''}`);
      lines.push('────────────────────────');
      lines.push(`*${isAr ? 'نوع الطلب:' : 'Order Type:'}* ${orderInfo.orderType === 'delivery' ? (isAr ? 'توصيل 🛵' : 'Delivery 🛵') : (isAr ? 'استلام من الفرع / تيك أواي 🛍️' : 'Takeaway / Pickup 🛍️')}`);
      lines.push(`*${isAr ? 'العميل:' : 'Customer:'}* ${orderInfo.customerName || ''}`);
      lines.push(`*${isAr ? 'الهاتف:' : 'Phone:'}* ${orderInfo.customerPhone || ''}`);

      if (orderInfo.orderType === 'delivery' && orderInfo.address) {
        lines.push(`*${isAr ? 'العنوان:' : 'Address:'}* ${orderInfo.address}`);
      }
      lines.push('────────────────────────');
      lines.push(`*${isAr ? 'تفاصيل الطلب:' : 'Order Items:'}*`);

      items.forEach(function (entry) {
        const itemName = isAr ? entry.item.nameAr : (entry.item.nameEn || entry.item.nameAr);
        let line = `• ${entry.qty}x ${itemName}`;
        if (entry.modifiers && entry.modifiers.length > 0) {
          const modStr = entry.modifiers.map(m => isAr ? m.nameAr : (m.nameEn || m.nameAr)).join('، ');
          line += ` (${modStr})`;
        }
        line += ` - ${entry.unitPrice * entry.qty} ${curr}`;
        lines.push(line);
      });

      lines.push('────────────────────────');
      lines.push(`*${isAr ? 'المجموع الفرعي:' : 'Subtotal:'}* ${subtotal} ${curr}`);
      if (orderInfo.orderType === 'delivery' && fee > 0) {
        lines.push(`*${isAr ? 'رسوم التوصيل:' : 'Delivery Fee:'}* ${fee} ${curr}`);
      }
      lines.push(`*${isAr ? 'الإجمالي النهائي:' : 'Grand Total:'}* ${total} ${curr}`);

      if (orderInfo.notes && orderInfo.notes.trim()) {
        lines.push('────────────────────────');
        lines.push(`*${isAr ? 'ملاحظات:' : 'Notes:'}* ${orderInfo.notes.trim()}`);
      }

      return lines.join('\n');
    },

    init: function () {
      if (typeof document === 'undefined') return;

      const presets = window.SHOP_PRESETS || {};
      const pc = window.PitchControls;
      this.effectiveConfig = pc ? pc.getEffectiveConfig() : { shopId: 'grill', deliveryFee: 25 };

      const presetId = this.effectiveConfig.shopId;
      this.activePreset = presets[presetId] || presets.grill;

      this.applyTheme(this.activePreset);
      this.renderAll();
      this.bindGlobalEvents();

      if (pc && pc.init) {
        pc.init();
      }
    },

    reload: function () {
      this.init();
    },

    applyTheme: function (preset) {
      if (!preset || !preset.theme) return;
      const root = document.documentElement;
      const t = preset.theme;
      root.style.setProperty('--primary', t.primary);
      root.style.setProperty('--secondary', t.secondary);
      root.style.setProperty('--accent', t.accent);
      root.style.setProperty('--bg', t.bg);
      root.style.setProperty('--card-bg', t.cardBg);
      root.style.setProperty('--text', t.text);
      root.style.setProperty('--font-main', t.fontMain);
      root.style.setProperty('--font-heading', t.fontHeading);
    },

    getShopDisplayName: function () {
      if (this.effectiveConfig && this.effectiveConfig.shopName) {
        return this.effectiveConfig.shopName;
      }
      const b = this.activePreset.brand;
      return this.lang === 'ar' ? b.nameAr : (b.nameEn || b.nameAr);
    },

    getShopPhone: function () {
      if (this.effectiveConfig && this.effectiveConfig.phone) {
        return this.effectiveConfig.phone;
      }
      return (this.activePreset.contact && this.activePreset.contact.defaultPhone) || '201000000000';
    },

    getDeliveryFee: function () {
      if (this.orderType === 'takeaway') return 0;
      if (this.effectiveConfig && typeof this.effectiveConfig.deliveryFee === 'number') {
        return this.effectiveConfig.deliveryFee;
      }
      return 25;
    },

    renderAll: function () {
      const isAr = this.lang === 'ar';
      document.documentElement.setAttribute('lang', this.lang);
      document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');

      this.renderHeader();
      this.renderHero();
      this.renderCategoryTabs();
      this.renderMenuGrid();
      this.renderTrustAndReviews();
      this.renderContactInfo();
      this.renderFooter();
      this.updateCartUI();
    },

    renderHeader: function () {
      const headerMount = document.getElementById('headerMount');
      if (!headerMount) return;
      const isAr = this.lang === 'ar';
      const shopName = this.getShopDisplayName();
      const symbol = this.activePreset.brand.logoSymbol || '🍽️';
      const phone = this.getShopPhone();

      headerMount.innerHTML = `
        <div class="site-header-inner">
          <a href="#top" class="logo" title="${isAr ? 'اضغط 3 مرات لفتح أدوات العرض' : 'Triple tap to open Pitch Tools'}">
            <span class="logo-symbol">${symbol}</span>
            <span class="logo-text">${shopName}</span>
          </a>
          
          <nav class="header-nav">
            <a href="#menu">${isAr ? 'القائمة' : 'Menu'}</a>
            <a href="#reviews">${isAr ? 'التقييمات' : 'Reviews'}</a>
            <a href="#contact">${isAr ? 'الفروع' : 'Location'}</a>
          </nav>

          <div class="header-actions">
            <button class="lang-toggle-btn" id="langToggleBtn">${isAr ? 'EN' : 'عربي'}</button>
            <a class="header-order-btn" href="https://wa.me/${phone}" target="_blank" rel="noopener">
              ${isAr ? 'اطلب واتساب 💬' : 'WhatsApp Order 💬'}
            </a>
          </div>
        </div>
      `;

      const langBtn = document.getElementById('langToggleBtn');
      if (langBtn) {
        langBtn.onclick = () => {
          this.lang = this.lang === 'ar' ? 'en' : 'ar';
          this.renderAll();
        };
      }
    },

    renderHero: function () {
      const heroMount = document.getElementById('heroMount');
      if (!heroMount) return;
      const isAr = this.lang === 'ar';
      const p = this.activePreset;
      const h = p.hero;
      const r = p.rating;
      const phone = this.getShopPhone();

      heroMount.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url('${h.bgImage}')`;
      heroMount.innerHTML = `
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-star">★ ${r.googleScore}</span>
            <span class="badge-text">${isAr ? r.reviewCount : r.reviewCountEn}</span>
          </div>
          <h1 class="hero-title">${isAr ? h.titleAr : h.titleEn}</h1>
          <p class="hero-subtitle">${isAr ? h.descAr : h.descEn}</p>
          
          <div class="hero-buttons">
            <a class="hero-btn primary" href="#menu">${isAr ? 'تصفح قائمة الطعام 📋' : 'Explore Menu 📋'}</a>
            <a class="hero-btn secondary" href="https://wa.me/${phone}" target="_blank" rel="noopener">${isAr ? 'طلب فوري عبر واتساب 💬' : 'Direct WhatsApp 💬'}</a>
          </div>

          <div class="hero-perks">
            <div class="hero-perk"><span>⚡</span> ${isAr ? 'توصيل ساخن وسريع' : 'Fast & Hot Delivery'}</div>
            <div class="hero-perk"><span>💳</span> ${isAr ? '0% عمولة طلب مباشر' : '0% Direct Commission'}</div>
            <div class="hero-perk"><span>⭐</span> ${isAr ? 'ضمان جودة وطزاجة' : 'Freshness Guaranteed'}</div>
          </div>
        </div>
      `;
    },

    renderCategoryTabs: function () {
      const tabsMount = document.getElementById('categoryTabs');
      if (!tabsMount) return;
      const isAr = this.lang === 'ar';
      const cats = this.activePreset.categories || [];

      let html = `<button class="cat-tab-btn active" data-cat="all">${isAr ? 'الكل' : 'All'}</button>`;
      cats.forEach(function (c) {
        html += `<button class="cat-tab-btn" data-cat="${c.id}">${isAr ? c.nameAr : c.nameEn}</button>`;
      });

      tabsMount.innerHTML = html;

      tabsMount.querySelectorAll('.cat-tab-btn').forEach(btn => {
        btn.onclick = (e) => {
          tabsMount.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const catId = btn.getAttribute('data-cat');
          App.filterMenuByCategory(catId);
        };
      });
    },

    filterMenuByCategory: function (catId) {
      const cards = document.querySelectorAll('.menu-item-card');
      cards.forEach(card => {
        if (catId === 'all' || card.getAttribute('data-category') === catId) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    },

    renderMenuGrid: function () {
      const menuMount = document.getElementById('menuContainer');
      if (!menuMount) return;
      const isAr = this.lang === 'ar';
      const cats = this.activePreset.categories || [];
      const curr = isAr ? 'جنيه' : 'EGP';

      let html = '<div class="menu-grid">';
      cats.forEach(cat => {
        (cat.items || []).forEach(item => {
          const hasMods = Array.isArray(item.modifiers) && item.modifiers.length > 0;
          const name = isAr ? item.nameAr : (item.nameEn || item.nameAr);
          const desc = isAr ? item.descAr : (item.descEn || item.descAr);

          html += `
            <div class="menu-item-card" data-category="${cat.id}" data-item-id="${item.id}">
              <div class="item-img-wrap">
                <img src="${item.image}" alt="${name}" loading="lazy" class="item-img">
                ${hasMods ? `<span class="item-badge">${isAr ? 'خيارات متعددة' : 'Customizable'}</span>` : ''}
              </div>
              <div class="item-body">
                <div class="item-header">
                  <h3 class="item-title">${name}</h3>
                  <span class="item-price">${item.price} <small>${curr}</small></span>
                </div>
                <p class="item-desc">${desc}</p>
                <div class="item-footer">
                  ${hasMods 
                    ? `<button class="item-action-btn customize-btn" onclick="window.App.openModifierModal('${item.id}')">${isAr ? 'تخصيص الخيارات ⚙️' : 'Customize ⚙️'}</button>`
                    : `<button class="item-action-btn add-btn" onclick="window.App.quickAddToCart('${item.id}')">${isAr ? 'أضف للطلب +' : 'Add to Order +'}</button>`
                  }
                </div>
              </div>
            </div>
          `;
        });
      });
      html += '</div>';

      menuMount.innerHTML = html;
    },

    quickAddToCart: function (itemId) {
      const item = this.findItemById(itemId);
      if (!item) return;
      const key = this.generateCartKey(item.id, []);
      const existing = this.cart.find(c => c.key === key);
      if (existing) {
        existing.qty++;
      } else {
        this.cart.push({
          key: key,
          item: item,
          modifiers: [],
          unitPrice: item.price,
          qty: 1
        });
      }
      this.updateCartUI();
      if (window.PitchControls) {
        window.PitchControls.showToast(this.lang === 'ar' ? `تمت إضافة ${item.nameAr} للطلب 🛒` : `Added ${item.nameEn} to cart 🛒`);
      }
    },

    findItemById: function (itemId) {
      const cats = this.activePreset.categories || [];
      for (let i = 0; i < cats.length; i++) {
        const item = cats[i].items.find(it => it.id === itemId);
        if (item) return item;
      }
      return null;
    },

    openModifierModal: function (itemId) {
      const item = this.findItemById(itemId);
      if (!item) return;
      const isAr = this.lang === 'ar';
      const curr = isAr ? 'جنيه' : 'EGP';

      const modal = document.getElementById('modifierModal');
      if (!modal) return;

      let groupsHtml = '';
      (item.modifiers || []).forEach((mod, modIdx) => {
        const isSingle = mod.type === 'single';
        const modName = isAr ? mod.nameAr : (mod.nameEn || mod.nameAr);

        groupsHtml += `
          <div class="mod-group" data-mod-id="${mod.id}" data-mod-type="${mod.type}">
            <h4 class="mod-group-title">${modName} ${isSingle ? `<span class="mod-req">${isAr ? '(اختياري/مطلوب)' : '(Select one)'}</span>` : ''}</h4>
            <div class="mod-options-list">
        `;

        mod.options.forEach((opt, optIdx) => {
          const optName = isAr ? opt.nameAr : (opt.nameEn || opt.nameAr);
          const priceText = opt.priceDelta > 0 ? `+${opt.priceDelta} ${curr}` : (opt.priceDelta < 0 ? `${opt.priceDelta} ${curr}` : '');
          const checked = isSingle && optIdx === 0 ? 'checked' : '';
          const inputName = `mod_${mod.id}`;
          const inputType = isSingle ? 'radio' : 'checkbox';

          groupsHtml += `
            <label class="mod-option-label">
              <input type="${inputType}" name="${inputName}" value="${optIdx}" data-delta="${opt.priceDelta}" ${checked} onchange="window.App.recalculateModalPrice()">
              <span class="mod-opt-text">${optName}</span>
              ${priceText ? `<span class="mod-opt-price">${priceText}</span>` : ''}
            </label>
          `;
        });

        groupsHtml += `</div></div>`;
      });

      const modalContent = document.getElementById('modifierModalBody');
      if (modalContent) {
        modalContent.innerHTML = `
          <div class="mod-modal-header">
            <img src="${item.image}" alt="" class="mod-modal-img">
            <div class="mod-modal-info">
              <h3>${isAr ? item.nameAr : (item.nameEn || item.nameAr)}</h3>
              <p>${isAr ? item.descAr : (item.descEn || item.descAr)}</p>
              <div class="mod-base-price">${isAr ? 'السعر الأساسي:' : 'Base price:'} <b>${item.price} ${curr}</b></div>
            </div>
            <button class="mod-modal-close" onclick="window.App.closeModifierModal()">&times;</button>
          </div>
          <div class="mod-modal-groups">
            ${groupsHtml}
          </div>
          <div class="mod-modal-footer">
            <div class="mod-qty-selector">
              <button onclick="window.App.adjustModalQty(-1)">−</button>
              <span id="modalQtyDisplay">1</span>
              <button onclick="window.App.adjustModalQty(1)">+</button>
            </div>
            <button class="mod-add-to-cart-btn" id="modalAddToCartBtn" onclick="window.App.submitModifierModal('${item.id}')">
              ${isAr ? 'إضافة للطلب' : 'Add to Order'} • <span id="modalTotalBtnPrice">${item.price}</span> ${curr}
            </button>
          </div>
        `;
      }

      this._modalCurrentItem = item;
      this._modalQty = 1;
      this.recalculateModalPrice();
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    },

    adjustModalQty: function (delta) {
      if (!this._modalQty) this._modalQty = 1;
      this._modalQty = Math.max(1, this._modalQty + delta);
      const disp = document.getElementById('modalQtyDisplay');
      if (disp) disp.textContent = this._modalQty;
      this.recalculateModalPrice();
    },

    recalculateModalPrice: function () {
      if (!this._modalCurrentItem) return;
      const item = this._modalCurrentItem;
      let unitPrice = item.price;

      const modal = document.getElementById('modifierModal');
      if (!modal) return;

      const checkedInputs = modal.querySelectorAll('input:checked');
      checkedInputs.forEach(input => {
        const delta = parseFloat(input.getAttribute('data-delta')) || 0;
        unitPrice += delta;
      });

      const qty = this._modalQty || 1;
      const total = unitPrice * qty;
      const btnSpan = document.getElementById('modalTotalBtnPrice');
      if (btnSpan) btnSpan.textContent = total;
    },

    submitModifierModal: function (itemId) {
      const item = this._modalCurrentItem;
      if (!item) return;

      const modal = document.getElementById('modifierModal');
      const selectedMods = [];
      let unitPrice = item.price;

      if (modal) {
        (item.modifiers || []).forEach(mod => {
          const checked = modal.querySelectorAll(`input[name="mod_${mod.id}"]:checked`);
          checked.forEach(inp => {
            const optIdx = parseInt(inp.value, 10);
            const opt = mod.options[optIdx];
            if (opt) {
              selectedMods.push({
                group: mod.id,
                nameAr: opt.nameAr,
                nameEn: opt.nameEn,
                priceDelta: opt.priceDelta
              });
              unitPrice += opt.priceDelta;
            }
          });
        });
      }

      const qty = this._modalQty || 1;
      const key = this.generateCartKey(item.id, selectedMods);
      const existing = this.cart.find(c => c.key === key);

      if (existing) {
        existing.qty += qty;
      } else {
        this.cart.push({
          key: key,
          item: item,
          modifiers: selectedMods,
          unitPrice: unitPrice,
          qty: qty
        });
      }

      this.closeModifierModal();
      this.updateCartUI();
      if (window.PitchControls) {
        window.PitchControls.showToast(this.lang === 'ar' ? `تمت إضافة ${item.nameAr} بتعديلاتك 🛒` : `Added customized ${item.nameEn} 🛒`);
      }
    },

    closeModifierModal: function () {
      const modal = document.getElementById('modifierModal');
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      }
      this._modalCurrentItem = null;
    },

    updateCartUI: function () {
      const isAr = this.lang === 'ar';
      const curr = isAr ? 'جنيه' : 'EGP';
      const subtotal = this.calculateSubtotal(this.cart);
      const totalCount = this.cart.reduce((sum, entry) => sum + entry.qty, 0);

      // Sticky pill bar
      const cartPill = document.getElementById('cartPillBar');
      if (cartPill) {
        if (totalCount > 0) {
          cartPill.classList.add('visible');
          document.body.classList.add('has-cart-bar');
          const countElem = document.getElementById('cartPillCount');
          const totalElem = document.getElementById('cartPillTotal');
          if (countElem) countElem.textContent = `${totalCount} ${isAr ? 'أصناف' : 'items'}`;
          if (totalElem) totalElem.textContent = `${subtotal} ${curr}`;
        } else {
          cartPill.classList.remove('visible');
          document.body.classList.remove('has-cart-bar');
        }
      }

      // Render items inside drawer
      const listContainer = document.getElementById('cartDrawerItemsList');
      if (listContainer) {
        if (this.cart.length === 0) {
          listContainer.innerHTML = `<div class="cart-empty-state"><span class="empty-icon">🛒</span><p>${isAr ? 'سلة الطلبات فارغة حاليًا' : 'Your cart is currently empty'}</p></div>`;
        } else {
          let itemsHtml = '';
          this.cart.forEach((entry, idx) => {
            const name = isAr ? entry.item.nameAr : (entry.item.nameEn || entry.item.nameAr);
            let modChips = '';
            if (entry.modifiers && entry.modifiers.length > 0) {
              const tags = entry.modifiers.map(m => isAr ? m.nameAr : (m.nameEn || m.nameAr)).join(' • ');
              modChips = `<div class="cart-item-mods">${tags}</div>`;
            }

            itemsHtml += `
              <div class="cart-drawer-item">
                <div class="cart-item-details">
                  <div class="cart-item-name">${name}</div>
                  ${modChips}
                  <div class="cart-item-pricing">${entry.unitPrice} × ${entry.qty} = <b>${entry.unitPrice * entry.qty} ${curr}</b></div>
                </div>
                <div class="cart-item-actions">
                  <button class="cart-qty-btn" onclick="window.App.changeItemQty(${idx}, -1)">−</button>
                  <span class="cart-qty-num">${entry.qty}</span>
                  <button class="cart-qty-btn" onclick="window.App.changeItemQty(${idx}, 1)">+</button>
                  <button class="cart-del-btn" onclick="window.App.removeItem(${idx})" aria-label="حذف">🗑️</button>
                </div>
              </div>
            `;
          });
          listContainer.innerHTML = itemsHtml;
        }
      }

      // Calculate totals in drawer
      const fee = this.getDeliveryFee();
      const grandTotal = subtotal + fee;

      const subElem = document.getElementById('drawerSubtotal');
      if (subElem) subElem.textContent = `${subtotal} ${curr}`;

      const feeRow = document.getElementById('drawerDeliveryFeeRow');
      const feeElem = document.getElementById('drawerDeliveryFee');
      if (feeRow && feeElem) {
        if (this.orderType === 'delivery') {
          feeRow.style.display = 'flex';
          feeElem.textContent = `${fee} ${curr}`;
        } else {
          feeRow.style.display = 'none';
        }
      }

      const grandElem = document.getElementById('drawerGrandTotal');
      if (grandElem) grandElem.textContent = `${grandTotal} ${curr}`;

      // Toggle delivery fields visibility
      const addressField = document.getElementById('checkoutAddressWrap');
      if (addressField) {
        addressField.style.display = this.orderType === 'delivery' ? 'block' : 'none';
      }
    },

    changeItemQty: function (idx, delta) {
      if (!this.cart[idx]) return;
      this.cart[idx].qty += delta;
      if (this.cart[idx].qty <= 0) {
        this.cart.splice(idx, 1);
      }
      this.updateCartUI();
    },

    removeItem: function (idx) {
      if (!this.cart[idx]) return;
      this.cart.splice(idx, 1);
      this.updateCartUI();
    },

    setOrderType: function (type) {
      this.orderType = type;
      const deliveryBtn = document.getElementById('typeDeliveryBtn');
      const takeawayBtn = document.getElementById('typeTakeawayBtn');
      if (deliveryBtn && takeawayBtn) {
        if (type === 'delivery') {
          deliveryBtn.classList.add('active');
          takeawayBtn.classList.remove('active');
        } else {
          takeawayBtn.classList.add('active');
          deliveryBtn.classList.remove('active');
        }
      }
      this.updateCartUI();
    },

    openCartDrawer: function () {
      const drawer = document.getElementById('cartDrawer');
      if (drawer) {
        drawer.classList.add('active');
        drawer.setAttribute('aria-hidden', 'false');
      }
    },

    closeCartDrawer: function () {
      const drawer = document.getElementById('cartDrawer');
      if (drawer) {
        drawer.classList.remove('active');
        drawer.setAttribute('aria-hidden', 'true');
      }
    },

    sendWhatsAppOrder: function () {
      if (this.cart.length === 0) {
        alert(this.lang === 'ar' ? 'سلة الطلبات فارغة، يرجى إضافة وجبات أولاً!' : 'Cart is empty, please add items first!');
        return;
      }

      const isAr = this.lang === 'ar';
      const nameInput = document.getElementById('custName');
      const phoneInput = document.getElementById('custPhone');
      const addrInput = document.getElementById('custAddress');
      const notesInput = document.getElementById('custNotes');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const address = addrInput ? addrInput.value.trim() : '';
      const notes = notesInput ? notesInput.value.trim() : '';

      if (!name) {
        alert(isAr ? 'يرجى كتابة الاسم لتأكيد الطلب' : 'Please enter your name to confirm order');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!phone) {
        alert(isAr ? 'يرجى كتابة رقم الهاتف للتواصل' : 'Please enter your phone number');
        if (phoneInput) phoneInput.focus();
        return;
      }

      if (this.orderType === 'delivery' && !address) {
        alert(isAr ? 'يرجى كتابة عنوان التوصيل' : 'Please enter your delivery address');
        if (addrInput) addrInput.focus();
        return;
      }

      const orderInfo = {
        orderType: this.orderType,
        customerName: name,
        customerPhone: phone,
        address: address,
        notes: notes,
        deliveryFee: this.getDeliveryFee(),
        currency: isAr ? 'جنيه' : 'EGP',
        shopName: this.getShopDisplayName()
      };

      const message = this.formatWhatsAppReceipt(this.cart, orderInfo, this.lang);
      const targetPhone = this.getShopPhone().replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;

      window.open(waUrl, '_blank');
    },

    renderTrustAndReviews: function () {
      const revMount = document.getElementById('reviewsMount');
      if (!revMount) return;
      const isAr = this.lang === 'ar';
      const p = this.activePreset;
      const r = p.rating;

      revMount.innerHTML = `
        <div class="section-container">
          <div class="section-heading">
            <h2>${isAr ? 'آراء وتجارب العملاء ⭐' : 'Customer Reviews ⭐'}</h2>
            <p>${isAr ? r.platformNoteAr : r.platformNoteEn}</p>
          </div>
          
          <div class="reviews-grid">
            <div class="review-card">
              <div class="review-stars">★★★★★</div>
              <p class="review-text">${isAr ? 'أكل ممتاز جدًا وواصل سخن مولع ومظبوط على الشعرة، والتوصيل سريع جدًا.' : 'Amazing food, arrived super hot and fresh. Very fast delivery and excellent quality!'}</p>
              <div class="review-author"><b>${isAr ? 'أحمد كمال' : 'Ahmed Kamal'}</b> • Google Verified</div>
            </div>

            <div class="review-card">
              <div class="review-stars">★★★★★</div>
              <p class="review-text">${isAr ? 'طعم وجودة فوق الممتازة، التتبيلة رائعة والكميات وفيرة تشبع بجد، أنصح به بشدة.' : 'Outstanding quality and rich authentic taste. Generous portions and friendly packaging!'}</p>
              <div class="review-author"><b>${isAr ? 'مروة الشريف' : 'Marwa El-Sherif'}</b> • Google Verified</div>
            </div>

            <div class="review-card">
              <div class="review-stars">★★★★★</div>
              <p class="review-text">${isAr ? 'الطلب من الموقع بالواتساب سهل ومريح جدًا وبدون أي لخبطة في تفاصيل الأوردر.' : 'Ordering directly from the website via WhatsApp is super smooth and crystal clear.'}</p>
              <div class="review-author"><b>${isAr ? 'كريم زكي' : 'Kareem Zaki'}</b> • Google Verified</div>
            </div>
          </div>
        </div>
      `;
    },

    renderContactInfo: function () {
      const contactMount = document.getElementById('contactMount');
      if (!contactMount) return;
      const isAr = this.lang === 'ar';
      const c = this.activePreset.contact;
      const phone = this.getShopPhone();

      contactMount.innerHTML = `
        <div class="section-container">
          <div class="section-heading">
            <h2>${isAr ? 'الموقع ومواعيد العمل 📍' : 'Location & Hours 📍'}</h2>
          </div>

          <div class="contact-card">
            <div class="contact-row">
              <span class="contact-icon">📍</span>
              <div>
                <b>${isAr ? 'العنوان:' : 'Address:'}</b>
                <p>${isAr ? c.addressAr : c.addressEn}</p>
              </div>
            </div>

            <div class="contact-row">
              <span class="contact-icon">🕒</span>
              <div>
                <b>${isAr ? 'ساعات العمل:' : 'Working Hours:'}</b>
                <p>${isAr ? c.hoursAr : c.hoursEn}</p>
              </div>
            </div>

            <div class="contact-row">
              <span class="contact-icon">📞</span>
              <div>
                <b>${isAr ? 'الهاتف والطلب المباشر:' : 'Phone & Direct Orders:'}</b>
                <p><a href="tel:${phone}" dir="ltr">${phone}</a></p>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    renderFooter: function () {
      const footerMount = document.getElementById('footerMount');
      if (!footerMount) return;
      const isAr = this.lang === 'ar';
      const shopName = this.getShopDisplayName();

      footerMount.innerHTML = `
        <div class="footer-inner">
          <p>© 2026 <b>${shopName}</b>. ${isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.</p>
          <p class="footer-demo-note">${isAr ? 'منصة طلب مباشر عبر واتساب بدون عمولات' : 'Direct WhatsApp ordering platform with 0% commissions'}</p>
        </div>
      `;
    },

    bindGlobalEvents: function () {
      // Setup modal and drawer backdrop dismissals
      const modModal = document.getElementById('modifierModal');
      if (modModal) {
        modModal.addEventListener('click', (e) => {
          if (e.target === modModal) this.closeModifierModal();
        });
      }

      const cartDrawer = document.getElementById('cartDrawer');
      if (cartDrawer) {
        cartDrawer.addEventListener('click', (e) => {
          if (e.target === cartDrawer) this.closeCartDrawer();
        });
      }

      // Search input handler
      const searchInput = document.getElementById('menuSearchInput');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase().trim();
          const cards = document.querySelectorAll('.menu-item-card');
          cards.forEach(card => {
            const title = (card.querySelector('.item-title')?.textContent || '').toLowerCase();
            const desc = (card.querySelector('.item-desc')?.textContent || '').toLowerCase();
            if (!query || title.includes(query) || desc.includes(query)) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        });
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.App = App;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
  }
})();
