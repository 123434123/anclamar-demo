// js/pitch-controls.js - Secret Pitch Controls, URL Params, Link Generator & Persistence
(function () {
  const STORAGE_KEY = 'shop_demo_overrides_v2';

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

  function parseQueryParams() {
    if (typeof window === 'undefined' || !window.location || !window.location.search) {
      return {};
    }
    const params = new URLSearchParams(window.location.search);
    return {
      shop: params.get('shop') || null,
      name: params.get('name') || null,
      phone: params.get('phone') ? sanitizePhone(params.get('phone')) : null,
      fee: params.get('fee') !== null && !isNaN(parseFloat(params.get('fee'))) ? parseFloat(params.get('fee')) : null,
      curr: params.get('curr') || null,
      demo: params.get('demo') === 'true' || params.get('demo') === '1'
    };
  }

  function getStoredState() {
    if (typeof window === 'undefined' || !window.localStorage) return { currentShopId: 'grill', presets: {} };
    try {
      const data = window.localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : { currentShopId: 'grill', presets: {} };
    } catch (e) {
      return { currentShopId: 'grill', presets: {} };
    }
  }

  function saveStoredState(state) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save demo overrides to localStorage', e);
    }
  }

  function clearStoredState() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  const PitchControls = {
    escapeHtml: escapeHtml,
    sanitizePhone: sanitizePhone,

    getEffectiveConfig: function () {
      const q = parseQueryParams();
      const s = getStoredState();

      // Current active shop preset
      const shopId = q.shop || s.currentShopId || 'grill';
      const presetOverrides = (s.presets && s.presets[shopId]) ? s.presets[shopId] : {};

      // URL parameters take precedence if provided, then preset-specific localStorage, then default
      const shopName = q.name || presetOverrides.shopName || null;
      const phone = q.phone || presetOverrides.phone || null;
      const deliveryFee = q.fee !== null ? q.fee : (typeof presetOverrides.deliveryFee === 'number' ? presetOverrides.deliveryFee : 25);
      const currency = q.curr || presetOverrides.currency || 'EGP';
      const isDemoMode = q.demo || s.isDemoMode || false;

      return {
        shopId: shopId,
        shopName: shopName,
        phone: phone,
        deliveryFee: deliveryFee,
        currency: currency,
        isDemoMode: isDemoMode
      };
    },

    saveOverrides: function (data) {
      const state = getStoredState();
      state.presets = state.presets || {};

      const targetShopId = data.shopId || state.currentShopId || 'grill';
      state.currentShopId = targetShopId;
      state.isDemoMode = data.isDemoMode !== undefined ? data.isDemoMode : true;

      state.presets[targetShopId] = {
        shopName: data.shopName !== undefined ? data.shopName : (state.presets[targetShopId]?.shopName || null),
        phone: data.phone !== undefined ? sanitizePhone(data.phone) : (state.presets[targetShopId]?.phone || null),
        deliveryFee: typeof data.deliveryFee === 'number' ? data.deliveryFee : (state.presets[targetShopId]?.deliveryFee ?? 25),
        currency: data.currency || state.presets[targetShopId]?.currency || 'EGP'
      };

      saveStoredState(state);

      // Synchronize browser URL query parameters without shadowing
      if (typeof window !== 'undefined' && window.location && window.history && window.history.replaceState) {
        const cleanUrl = this.generateClientLink({
          shopId: targetShopId,
          shopName: state.presets[targetShopId].shopName,
          phone: state.presets[targetShopId].phone,
          deliveryFee: state.presets[targetShopId].deliveryFee,
          currency: state.presets[targetShopId].currency
        });
        const urlObj = new URL(cleanUrl);
        if (state.isDemoMode) {
          urlObj.searchParams.set('demo', 'true');
        }
        window.history.replaceState(null, '', urlObj.toString());
      }

      return this.getEffectiveConfig();
    },

    resetDefaults: function () {
      clearStoredState();
      return this.getEffectiveConfig();
    },

    generateClientLink: function (overrides) {
      const cfg = Object.assign({}, this.getEffectiveConfig(), overrides || {});
      const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://example.com';
      const pathname = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '/';

      const params = new URLSearchParams();
      if (cfg.shopId) params.set('shop', cfg.shopId);
      if (cfg.shopName) params.set('name', cfg.shopName);
      if (cfg.phone) params.set('phone', sanitizePhone(cfg.phone));
      if (cfg.deliveryFee !== null && cfg.deliveryFee !== undefined) params.set('fee', cfg.deliveryFee);
      if (cfg.currency && cfg.currency !== 'EGP') params.set('curr', cfg.currency);
      // Ensure demo=true is NEVER included in client link
      params.delete('demo');

      const qs = params.toString();
      return origin + pathname + (qs ? '?' + qs : '');
    },

    copyClientLink: function (overrides) {
      const link = this.generateClientLink(overrides);
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(link).then(function () {
          PitchControls.showToast('تم نسخ الرابط للعميل بنجاح! 📋');
          return link;
        }).catch(function () {
          return PitchControls._fallbackCopy(link);
        });
      }
      return Promise.resolve(this._fallbackCopy(link));
    },

    _fallbackCopy: function (text) {
      if (typeof document === 'undefined') return text;
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        this.showToast('تم نسخ الرابط للعميل بنجاح! 📋');
      } catch (e) {
        prompt('انسخ الرابط:', text);
      }
      return text;
    },

    showToast: function (msg, durationMs) {
      if (typeof document === 'undefined') return;
      const duration = durationMs || 2800;
      let toast = document.getElementById('demoToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'demoToast';
        toast.className = 'demo-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(this._toastTimeout);
      this._toastTimeout = setTimeout(function () {
        toast.classList.remove('show');
      }, duration);
    },

    init: function () {
      if (typeof document === 'undefined') return;
      const cfg = this.getEffectiveConfig();

      this._setupDelegatedTriggers();
      this._renderToolbar(cfg);

      if (cfg.isDemoMode) {
        this.showToolbar();
      }
    },

    // Delegated event listener on document so triggers survive header re-renders
    _setupDelegatedTriggers: function () {
      if (this._triggersBound) return;
      this._triggersBound = true;

      let clickTimes = [];
      let pressTimer = null;

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.logo')) return;
        const now = Date.now();
        clickTimes.push(now);
        clickTimes = clickTimes.filter(t => now - t < 800);
        if (clickTimes.length >= 3) {
          e.preventDefault();
          clickTimes = [];
          this.toggleToolbar();
        }
      });

      const startPress = (e) => {
        if (!e.target.closest('.logo')) return;
        pressTimer = setTimeout(() => {
          this.toggleToolbar();
        }, 800);
      };

      const cancelPress = () => {
        if (pressTimer) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
      };

      document.addEventListener('touchstart', startPress, { passive: true });
      document.addEventListener('touchend', cancelPress, { passive: true });
      document.addEventListener('touchcancel', cancelPress, { passive: true });
      document.addEventListener('mousedown', startPress);
      document.addEventListener('mouseup', cancelPress);
    },

    toggleToolbar: function () {
      const tb = document.getElementById('pitchToolbar');
      if (!tb) return;
      if (tb.classList.contains('active')) {
        this.hideToolbar();
      } else {
        this.showToolbar();
      }
    },

    showToolbar: function () {
      const tb = document.getElementById('pitchToolbar');
      if (tb) {
        tb.classList.add('active');
        tb.setAttribute('aria-hidden', 'false');
      }
    },

    hideToolbar: function () {
      const tb = document.getElementById('pitchToolbar');
      if (tb) {
        tb.classList.remove('active');
        tb.setAttribute('aria-hidden', 'true');
      }
    },

    _renderToolbar: function (cfg) {
      let tb = document.getElementById('pitchToolbar');
      if (!tb) {
        tb = document.createElement('div');
        tb.id = 'pitchToolbar';
        tb.className = 'pitch-toolbar';
        tb.setAttribute('aria-hidden', 'true');
        document.body.appendChild(tb);
      }

      const presets = (typeof window !== 'undefined' && window.SHOP_PRESETS) ? window.SHOP_PRESETS : {};
      const presetKeys = Object.keys(presets);

      let optionsHtml = '';
      presetKeys.forEach(function (k) {
        const p = presets[k];
        const selected = k === cfg.shopId ? 'selected' : '';
        optionsHtml += `<option value="${escapeHtml(k)}" ${selected}>${p.brand.logoSymbol} ${escapeHtml(p.brand.nameAr)} (${escapeHtml(p.brand.nameEn)})</option>`;
      });

      const currencies = ['EGP', 'SAR', 'AED', 'KWD', 'USD'];
      let currOptions = '';
      currencies.forEach(function (c) {
        const sel = c === cfg.currency ? 'selected' : '';
        currOptions += `<option value="${c}" ${sel}>${c}</option>`;
      });

      tb.innerHTML = `
        <div class="pitch-toolbar-inner">
          <div class="pitch-toolbar-header">
            <span class="pitch-title">💼 أدوات العرض التقديمي (Pitch Mode)</span>
            <button class="pitch-close-btn" id="pitchCloseBtn" aria-label="إغلاق">&times;</button>
          </div>
          
          <div class="pitch-grid">
            <div class="pitch-field">
              <label>نموذج النشاط (Preset):</label>
              <select id="pitchPresetSelect">${optionsHtml}</select>
            </div>

            <div class="pitch-field">
              <label>اسم المطعم المخصص:</label>
              <input type="text" id="pitchShopName" placeholder="مثال: برجر هاوس" value="${escapeHtml(cfg.shopName || '')}">
            </div>

            <div class="pitch-field">
              <label>رقم واتساب المطعم:</label>
              <input type="tel" id="pitchPhone" placeholder="2010XXXXXXXX" value="${escapeHtml(cfg.phone || '')}">
            </div>

            <div class="pitch-field">
              <label>رسوم التوصيل الافتراضية:</label>
              <input type="number" id="pitchFee" value="${cfg.deliveryFee}">
            </div>

            <div class="pitch-field">
              <label>العملة (Currency):</label>
              <select id="pitchCurrency">${currOptions}</select>
            </div>
          </div>

          <div class="pitch-actions">
            <button class="pitch-btn primary" id="pitchApplyBtn">تطبيق وحفظ</button>
            <button class="pitch-btn success" id="pitchCopyBtn">نسخ رابط العميل 📋</button>
            <button class="pitch-btn danger" id="pitchResetBtn">إعادة ضبط</button>
          </div>
        </div>
      `;

      // Event listeners
      const closeBtn = document.getElementById('pitchCloseBtn');
      if (closeBtn) closeBtn.onclick = () => this.hideToolbar();

      const applyBtn = document.getElementById('pitchApplyBtn');
      if (applyBtn) {
        applyBtn.onclick = () => {
          const newPreset = document.getElementById('pitchPresetSelect').value;
          const newName = document.getElementById('pitchShopName').value.trim() || null;
          const newPhone = document.getElementById('pitchPhone').value.trim() || null;
          const newFee = parseFloat(document.getElementById('pitchFee').value) || 0;
          const newCurr = document.getElementById('pitchCurrency').value || 'EGP';

          this.saveOverrides({
            shopId: newPreset,
            shopName: newName,
            phone: newPhone,
            deliveryFee: newFee,
            currency: newCurr,
            isDemoMode: true
          });

          this.showToast('تم حفظ التعديلات بنجاح! جارٍ التحديث...');
          setTimeout(function () {
            if (typeof window.App !== 'undefined' && window.App.reload) {
              window.App.reload();
            } else {
              window.location.reload();
            }
          }, 200);
        };
      }

      const copyBtn = document.getElementById('pitchCopyBtn');
      if (copyBtn) {
        copyBtn.onclick = () => {
          const newPreset = document.getElementById('pitchPresetSelect').value;
          const newName = document.getElementById('pitchShopName').value.trim() || null;
          const newPhone = document.getElementById('pitchPhone').value.trim() || null;
          const newFee = parseFloat(document.getElementById('pitchFee').value) || 0;
          const newCurr = document.getElementById('pitchCurrency').value || 'EGP';

          this.copyClientLink({
            shopId: newPreset,
            shopName: newName,
            phone: newPhone,
            deliveryFee: newFee,
            currency: newCurr
          });
        };
      }

      const resetBtn = document.getElementById('pitchResetBtn');
      if (resetBtn) {
        resetBtn.onclick = () => {
          if (confirm('هل تريد استعادة الإعدادات الأصلية؟')) {
            this.resetDefaults();
            this.showToast('تمت استعادة الإعدادات الأصلية');
            setTimeout(function () {
              window.location.href = window.location.pathname;
            }, 250);
          }
        };
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.PitchControls = PitchControls;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PitchControls;
  }
})();
