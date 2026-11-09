// js/app.js - Core Application, Modifiers Modal, Cart State & WhatsApp Receipt Engine
(function () {
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function sanitizePhone(phone) {
    if (!phone) return '';
    return String(phone).replace(/[^0-9]/g, '');
  }

  // Bilingual UI Dictionary
  const I18N = {
    ar: {
      menu: 'القائمة',
      reviews: 'التقييمات',
      location: 'الفروع',
      orderNowHeader: 'اطلب واتساب 💬',
      browseMenu: 'تصفح قائمة الطعام 📋',
      directWhatsApp: 'طلب فوري عبر واتساب 💬',
      perkDelivery: 'توصيل ساخن وسريع',
      perkZeroCommission: '0% عمولة طلب مباشر',
      perkFreshness: 'ضمان جودة وطزاجة',
      searchPlaceholder: '🔍 ابحث في الأصناف والمأكولات...',
      allCategories: 'الكل',
      customizableBadge: 'خيارات متعددة',
      customizeBtn: 'تخصيص الخيارات ⚙️',
      addToOrderBtn: 'أضف للطلب +',
      addedToCartToast: 'تمت إضافة الوجبة للطلب 🛒',
      basePriceLabel: 'السعر الأساسي:',
      requiredSingleChoice: '(مطلوب - اختر خياراً واحداً)',
      addToOrderModal: 'إضافة للطلب',
      cartTitle: 'سلة الطلبات 🛍️',
      deliveryOption: '🛵 توصيل للمنزل',
      takeawayOption: '🛍️ استلام من الفرع',
      emptyCartMsg: 'سلة الطلبات فارغة حاليًا',
      custNameLabel: 'الاسم بالكامل *',
      custNamePh: 'اكتب اسمك هنا',
      custPhoneLabel: 'رقم الهاتف للتواصل *',
      custPhonePh: '01XXXXXXXXX',
      custAddressLabel: 'عنوان التوصيل بالتفصيل *',
      custAddressPh: 'المنطقة، الشارع، رقم العمارة، الدور، الشقة',
      custNotesLabel: 'ملاحظات إضافية على الطلب',
      custNotesPh: 'أي تفاصيل خاصة بالتتبيلة أو طريقة الاستلام',
      subtotalLabel: 'المجموع الفرعي:',
      deliveryFeeLabel: 'رسوم التوصيل:',
      grandTotalLabel: 'الإجمالي النهائي:',
      sendWhatsAppBtn: 'إرسال الطلب عبر واتساب 💬',
      viewOrderPill: 'عرض الطلب',
      itemsCountPill: 'أصناف',
      reviewsHeading: 'آراء وتجارب العملاء ⭐',
      locationHeading: 'الموقع ومواعيد العمل 📍',
      addressTitle: 'العنوان:',
      hoursTitle: 'ساعات العمل:',
      phoneTitle: 'الهاتف والطلب المباشر:',
      allRightsReserved: 'جميع الحقوق محفوظة',
      platformNoteFooter: 'منصة طلب مباشر عبر واتساب بدون عمولات',
      nameValidationErr: 'يرجى كتابة الاسم لتأكيد الطلب',
      phoneValidationErr: 'يرجى كتابة رقم الهاتف للتواصل',
      addressValidationErr: 'يرجى كتابة عنوان التوصيل',
      emptyCartAlert: 'سلة الطلبات فارغة، يرجى إضافة وجبات أولاً!'
    },
    en: {
      menu: 'Menu',
      reviews: 'Reviews',
      location: 'Location',
      orderNowHeader: 'WhatsApp Order 💬',
      browseMenu: 'Explore Menu 📋',
      directWhatsApp: 'Direct WhatsApp 💬',
      perkDelivery: 'Fast & Hot Delivery',
      perkZeroCommission: '0% Direct Commission',
      perkFreshness: 'Freshness Guaranteed',
      searchPlaceholder: '🔍 Search delicious items...',
      allCategories: 'All',
      customizableBadge: 'Customizable',
      customizeBtn: 'Customize ⚙️',
      addToOrderBtn: 'Add to Order +',
      addedToCartToast: 'Added item to cart 🛒',
      basePriceLabel: 'Base price:',
      requiredSingleChoice: '(Required - choose one)',
      addToOrderModal: 'Add to Order',
      cartTitle: 'Your Cart 🛍️',
      deliveryOption: '🛵 Home Delivery',
      takeawayOption: '🛍️ Store Pickup',
      emptyCartMsg: 'Your cart is currently empty',
      custNameLabel: 'Full Name *',
      custNamePh: 'Enter your name',
      custPhoneLabel: 'Contact Phone Number *',
      custPhonePh: '01XXXXXXXXX',
      custAddressLabel: 'Detailed Delivery Address *',
      custAddressPh: 'Area, street, building, floor, apt',
      custNotesLabel: 'Order Notes',
      custNotesPh: 'Any special seasoning or delivery instructions',
      subtotalLabel: 'Subtotal:',
      deliveryFeeLabel: 'Delivery Fee:',
      grandTotalLabel: 'Grand Total:',
      sendWhatsAppBtn: 'Send Order via WhatsApp 💬',
      viewOrderPill: 'View Order',
      itemsCountPill: 'items',
      reviewsHeading: 'Customer Reviews ⭐',
      locationHeading: 'Location & Hours 📍',
      addressTitle: 'Address:',
      hoursTitle: 'Working Hours:',
      phoneTitle: 'Phone & Direct Orders:',
      allRightsReserved: 'All rights reserved',
      platformNoteFooter: 'Direct WhatsApp ordering platform with 0% commissions',
      nameValidationErr: 'Please enter your name to confirm order',
      phoneValidationErr: 'Please enter your phone number',
      addressValidationErr: 'Please enter your delivery address',
      emptyCartAlert: 'Your cart is empty, please add items first!'
    }
  };

  const App = {
    lang: 'ar',
    orderType: 'delivery',
    cart: [],
    activePreset: null,
    effectiveConfig: null,
    _currentPresetId: null,

    escapeHtml: escapeHtml,
    sanitizePhone: sanitizePhone,

    t: function (key) {
      const dict = I18N[this.lang] || I18N.ar;
      return dict[key] || key;
    },

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

    // Helper: get configured currency
    getCurrency: function () {
      if (this.effectiveConfig && this.effectiveConfig.currency) {
        return this.effectiveConfig.currency;
      }
      return this.lang === 'ar' ? 'جنيه' : 'EGP';
    },

    // Helper: format complete structured WhatsApp receipt
    formatWhatsAppReceipt: function (cartState, orderInfo, lang) {
      const activeLang = lang || this.lang;
      const isAr = activeLang === 'ar';
      const items = cartState || this.cart;
      const subtotal = this.calculateSubtotal(items);
      const fee = orderInfo.orderType === 'delivery' ? (orderInfo.deliveryFee || 0) : 0;
      const total = items.length === 0 ? 0 : (subtotal + fee);
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

      const separator = isAr ? '، ' : ', ';
      items.forEach(function (entry) {
        const itemName = isAr ? entry.item.nameAr : (entry.item.nameEn || entry.item.nameAr);
        let line = `• ${entry.qty}x ${itemName}`;
        if (entry.modifiers && entry.modifiers.length > 0) {
          const modStr = entry.modifiers.map(m => isAr ? m.nameAr : (m.nameEn || m.nameAr)).join(separator);
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

      const presetId = this.effectiveConfig.shopId || 'grill';
      
      // Reset cart if preset has changed to avoid mismatched items
      if (this._currentPresetId && this._currentPresetId !== presetId) {
        this.cart = [];
      }
      this._currentPresetId = presetId;
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
        return sanitizePhone(this.effectiveConfig.phone);
      }
      return sanitizePhone((this.activePreset.contact && this.activePreset.contact.defaultPhone) || '201000000000');
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
      this.renderSearchAndControls();
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
      const shopName = escapeHtml(this.getShopDisplayName());
      const symbol = this.activePreset.brand.logoSymbol || '🍽️';
      const phone = sanitizePhone(this.getShopPhone());

      headerMount.innerHTML = `
        <div class="site-header-inner">
          <a href="#top" class="logo" title="${isAr ? 'اضغط 3 مرات لفتح أدوات العرض' : 'Triple tap to open Pitch Tools'}">
            <span class="logo-symbol">${symbol}</span>
            <span class="logo-text">${shopName}</span>
          </a>
          
          <nav class="header-nav">
            <a href="#menu">${this.t('menu')}</a>
            <a href="#reviews">${this.t('reviews')}</a>
            <a href="#contact">${this.t('location')}</a>
          </nav>

          <div class="header-actions">
            <button class="lang-toggle-btn" id="langToggleBtn">${isAr ? 'EN' : 'عربي'}</button>
            <a class="header-order-btn" href="https://wa.me/${phone}" target="_blank" rel="noopener">
              ${this.t('orderNowHeader')}
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
      const phone = sanitizePhone(this.getShopPhone());

      heroMount.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url('${h.bgImage}')`;
      heroMount.innerHTML = `
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-star">★ ${escapeHtml(r.googleScore)}</span>
            <span class="badge-text">${escapeHtml(isAr ? r.reviewCount : r.reviewCountEn)}</span>
          </div>
          <h1 class="hero-title">${escapeHtml(isAr ? h.titleAr : h.titleEn)}</h1>
          <p class="hero-subtitle">${escapeHtml(isAr ? h.descAr : h.descEn)}</p>
          
          <div class="hero-buttons">
            <a class="hero-btn primary" href="#menu">${this.t('browseMenu')}</a>
            <a class="hero-btn secondary" href="https://wa.me/${phone}" target="_blank" rel="noopener">${this.t('directWhatsApp')}</a>
          </div>

          <div class="hero-perks">
            <div class="hero-perk"><span>⚡</span> ${this.t('perkDelivery')}</div>
            <div class="hero-perk"><span>💳</span> ${this.t('perkZeroCommission')}</div>
            <div class="hero-perk"><span>⭐</span> ${this.t('perkFreshness')}</div>
          </div>
        </div>
      `;
    },

    renderSearchAndControls: function () {
      const searchInput = document.getElementById('menuSearchInput');
      if (searchInput) {
        searchInput.placeholder = this.t('searchPlaceholder');
      }
    },

    renderCategoryTabs: function () {
      const tabsMount = document.getElementById('categoryTabs');
      if (!tabsMount) return;
      const isAr = this.lang === 'ar';
      const cats = this.activePreset.categories || [];

      let html = `<button class="cat-tab-btn active" data-cat="all">${this.t('allCategories')}</button>`;
      cats.forEach((c) => {
        html += `<button class="cat-tab-btn" data-cat="${escapeHtml(c.id)}">${escapeHtml(isAr ? c.nameAr : c.nameEn)}</button>`;
      });

      tabsMount.innerHTML = html;

      tabsMount.querySelectorAll('.cat-tab-btn').forEach(btn => {
        btn.onclick = () => {
          tabsMount.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const catId = btn.getAttribute('data-cat');
          this.filterMenuByCategory(catId);
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
      const curr = escapeHtml(this.getCurrency());

      let html = '<div class="menu-grid">';
      cats.forEach(cat => {
        (cat.items || []).forEach(item => {
          const hasMods = Array.isArray(item.modifiers) && item.modifiers.length > 0;
          const name = escapeHtml(isAr ? item.nameAr : (item.nameEn || item.nameAr));
          const desc = escapeHtml(isAr ? item.descAr : (item.descEn || item.descAr));

          html += `
            <div class="menu-item-card" data-category="${escapeHtml(cat.id)}" data-item-id="${escapeHtml(item.id)}">
              <div class="item-img-wrap">
                <img src="${escapeHtml(item.image)}" alt="${name}" loading="lazy" class="item-img">
                ${hasMods ? `<span class="item-badge">${this.t('customizableBadge')}</span>` : ''}
              </div>
              <div class="item-body">
                <div class="item-header">
                  <h3 class="item-title">${name}</h3>
                  <span class="item-price">${item.price} <small>${curr}</small></span>
                </div>
                <p class="item-desc">${desc}</p>
                <div class="item-footer">
                  ${hasMods 
                    ? `<button class="item-action-btn customize-btn" onclick="window.App.openModifierModal('${escapeHtml(item.id)}')">${this.t('customizeBtn')}</button>`
                    : `<button class="item-action-btn add-btn" onclick="window.App.quickAddToCart('${escapeHtml(item.id)}')">${this.t('addToOrderBtn')}</button>`
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
        window.PitchControls.showToast(this.t('addedToCartToast'));
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
      const curr = escapeHtml(this.getCurrency());

      const modal = document.getElementById('modifierModal');
      if (!modal) return;

      let groupsHtml = '';
      (item.modifiers || []).forEach((mod) => {
        const isSingle = mod.type === 'single';
        const modName = escapeHtml(isAr ? mod.nameAr : (mod.nameEn || mod.nameAr));

        groupsHtml += `
          <div class="mod-group" data-mod-id="${escapeHtml(mod.id)}" data-mod-type="${escapeHtml(mod.type)}">
            <h4 class="mod-group-title">${modName} ${isSingle ? `<span class="mod-req">${this.t('requiredSingleChoice')}</span>` : ''}</h4>
            <div class="mod-options-list">
        `;

        mod.options.forEach((opt, optIdx) => {
          const optName = escapeHtml(isAr ? opt.nameAr : (opt.nameEn || opt.nameAr));
          const priceText = opt.priceDelta > 0 ? `+${opt.priceDelta} ${curr}` : (opt.priceDelta < 0 ? `${opt.priceDelta} ${curr}` : '');
          const checked = isSingle && optIdx === 0 ? 'checked' : '';
          const inputName = `mod_${escapeHtml(mod.id)}`;
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
            <img src="${escapeHtml(item.image)}" alt="" class="mod-modal-img">
            <div class="mod-modal-info">
              <h3>${escapeHtml(isAr ? item.nameAr : (item.nameEn || item.nameAr))}</h3>
              <p>${escapeHtml(isAr ? item.descAr : (item.descEn || item.descAr))}</p>
              <div class="mod-base-price">${this.t('basePriceLabel')} <b>${item.price} ${curr}</b></div>
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
            <button class="mod-add-to-cart-btn" id="modalAddToCartBtn" onclick="window.App.submitModifierModal('${escapeHtml(item.id)}')">
              ${this.t('addToOrderModal')} • <span id="modalTotalBtnPrice">${item.price}</span> ${curr}
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
        window.PitchControls.showToast(this.t('addedToCartToast'));
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
      const curr = escapeHtml(this.getCurrency());
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
          const ctaElem = document.getElementById('cartPillCtaText');
          if (countElem) countElem.textContent = `${totalCount} ${this.t('itemsCountPill')}`;
          if (totalElem) totalElem.textContent = `${subtotal} ${curr}`;
          if (ctaElem) ctaElem.textContent = this.t('viewOrderPill');
        } else {
          cartPill.classList.remove('visible');
          document.body.classList.remove('has-cart-bar');
        }
      }

      // Drawer Header & Switch labels
      const drawerTitle = document.getElementById('cartDrawerTitle');
      if (drawerTitle) drawerTitle.textContent = this.t('cartTitle');

      const deliveryBtn = document.getElementById('typeDeliveryBtn');
      if (deliveryBtn) deliveryBtn.textContent = this.t('deliveryOption');

      const takeawayBtn = document.getElementById('typeTakeawayBtn');
      if (takeawayBtn) takeawayBtn.textContent = this.t('takeawayOption');

      // Form labels & placeholders
      const nameLbl = document.getElementById('labelCustName');
      if (nameLbl) nameLbl.textContent = this.t('custNameLabel');
      const nameInp = document.getElementById('custName');
      if (nameInp) nameInp.placeholder = this.t('custNamePh');

      const phoneLbl = document.getElementById('labelCustPhone');
      if (phoneLbl) phoneLbl.textContent = this.t('custPhoneLabel');
      const phoneInp = document.getElementById('custPhone');
      if (phoneInp) phoneInp.placeholder = this.t('custPhonePh');

      const addrLbl = document.getElementById('labelCustAddress');
      if (addrLbl) addrLbl.textContent = this.t('custAddressLabel');
      const addrInp = document.getElementById('custAddress');
      if (addrInp) addrInp.placeholder = this.t('custAddressPh');

      const notesLbl = document.getElementById('labelCustNotes');
      if (notesLbl) notesLbl.textContent = this.t('custNotesLabel');
      const notesInp = document.getElementById('custNotes');
      if (notesInp) notesInp.placeholder = this.t('custNotesPh');

      // Summary label updates
      const subLbl = document.getElementById('labelSubtotal');
      if (subLbl) subLbl.textContent = this.t('subtotalLabel');
      const feeLbl = document.getElementById('labelDeliveryFee');
      if (feeLbl) feeLbl.textContent = this.t('deliveryFeeLabel');
      const grandLbl = document.getElementById('labelGrandTotal');
      if (grandLbl) grandLbl.textContent = this.t('grandTotalLabel');

      const submitBtn = document.getElementById('whatsappSubmitBtnText');
      if (submitBtn) submitBtn.textContent = this.t('sendWhatsAppBtn');

      // Render items inside drawer
      const listContainer = document.getElementById('cartDrawerItemsList');
      if (listContainer) {
        if (this.cart.length === 0) {
          listContainer.innerHTML = `<div class="cart-empty-state"><span class="empty-icon">🛒</span><p>${this.t('emptyCartMsg')}</p></div>`;
        } else {
          let itemsHtml = '';
          this.cart.forEach((entry, idx) => {
            const name = escapeHtml(isAr ? entry.item.nameAr : (entry.item.nameEn || entry.item.nameAr));
            let modChips = '';
            if (entry.modifiers && entry.modifiers.length > 0) {
              const tags = entry.modifiers.map(m => escapeHtml(isAr ? m.nameAr : (m.nameEn || m.nameAr))).join(' • ');
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

      // Calculate totals in drawer: if cart is empty, grandTotal is 0
      const fee = this.getDeliveryFee();
      const grandTotal = this.cart.length === 0 ? 0 : (subtotal + fee);

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
        alert(this.t('emptyCartAlert'));
        return;
      }

      const nameInput = document.getElementById('custName');
      const phoneInput = document.getElementById('custPhone');
      const addrInput = document.getElementById('custAddress');
      const notesInput = document.getElementById('custNotes');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const address = addrInput ? addrInput.value.trim() : '';
      const notes = notesInput ? notesInput.value.trim() : '';

      if (!name) {
        alert(this.t('nameValidationErr'));
        if (nameInput) nameInput.focus();
        return;
      }

      if (!phone) {
        alert(this.t('phoneValidationErr'));
        if (phoneInput) phoneInput.focus();
        return;
      }

      if (this.orderType === 'delivery' && !address) {
        alert(this.t('addressValidationErr'));
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
        currency: this.getCurrency(),
        shopName: this.getShopDisplayName()
      };

      const message = this.formatWhatsAppReceipt(this.cart, orderInfo, this.lang);
      const targetPhone = sanitizePhone(this.getShopPhone());
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
            <h2>${this.t('reviewsHeading')}</h2>
            <p>${escapeHtml(isAr ? r.platformNoteAr : r.platformNoteEn)}</p>
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
      const phone = sanitizePhone(this.getShopPhone());

      contactMount.innerHTML = `
        <div class="section-container">
          <div class="section-heading">
            <h2>${this.t('locationHeading')}</h2>
          </div>

          <div class="contact-card">
            <div class="contact-row">
              <span class="contact-icon">📍</span>
              <div>
                <b>${this.t('addressTitle')}</b>
                <p>${escapeHtml(isAr ? c.addressAr : c.addressEn)}</p>
              </div>
            </div>

            <div class="contact-row">
              <span class="contact-icon">🕒</span>
              <div>
                <b>${this.t('hoursTitle')}</b>
                <p>${escapeHtml(isAr ? c.hoursAr : c.hoursEn)}</p>
              </div>
            </div>

            <div class="contact-row">
              <span class="contact-icon">📞</span>
              <div>
                <b>${this.t('phoneTitle')}</b>
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
      const shopName = escapeHtml(this.getShopDisplayName());

      footerMount.innerHTML = `
        <div class="footer-inner">
          <p>© 2026 <b>${shopName}</b>. ${this.t('allRightsReserved')}.</p>
          <p class="footer-demo-note">${this.t('platformNoteFooter')}</p>
        </div>
      `;
    },

    bindGlobalEvents: function () {
      if (this._eventsBound) return;
      this._eventsBound = true;

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
