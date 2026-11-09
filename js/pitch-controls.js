// js/pitch-controls.js - Secret Pitch Controls, URL Params, Link Generator & Persistence
(function () {
  const STORAGE_KEY = 'shop_demo_overrides';

  function parseQueryParams() {
    if (typeof window === 'undefined' || !window.location || !window.location.search) {
      return {};
    }
    const params = new URLSearchParams(window.location.search);
    return {
      shop: params.get('shop') || null,
      name: params.get('name') || null,
      phone: params.get('phone') || null,
      fee: params.get('fee') !== null ? parseFloat(params.get('fee')) : null,
      curr: params.get('curr') || null,
      demo: params.get('demo') === 'true' || params.get('demo') === '1'
    };
  }

  function getStoredOverrides() {
    if (typeof window === 'undefined' || !window.localStorage) return {};
    try {
      const data = window.localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveStoredOverrides(overrides) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch (e) {
      console.warn('Failed to save demo overrides to localStorage', e);
    }
  }

  function clearStoredOverrides() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  const PitchControls = {
    getEffectiveConfig: function () {
      const q = parseQueryParams();
      const s = getStoredOverrides();

      const shopId = q.shop || s.shopId || 'grill';
      const shopName = q.name || s.shopName || null;
      const phone = q.phone || s.phone || null;
      const deliveryFee = q.fee !== null && !isNaN(q.fee) ? q.fee : (s.deliveryFee !== undefined && !isNaN(s.deliveryFee) ? s.deliveryFee : 25);
      const currency = q.curr || s.currency || 'EGP';
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
      const current = getStoredOverrides();
      const updated = Object.assign({}, current, data);
      saveStoredOverrides(updated);
      return this.getEffectiveConfig();
    },

    resetDefaults: function () {
      clearStoredOverrides();
      return this.getEffectiveConfig();
    },

    generateClientLink: function (overrides) {
      const cfg = Object.assign({}, this.getEffectiveConfig(), overrides || {});
      const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://example.com';
      const pathname = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '/';

      const params = new URLSearchParams();
      if (cfg.shopId) params.set('shop', cfg.shopId);
      if (cfg.shopName) params.set('name', cfg.shopName);
      if (cfg.phone) params.set('phone', cfg.phone);
      if (cfg.deliveryFee !== null && cfg.deliveryFee !== undefined) params.set('fee', cfg.deliveryFee);
      if (cfg.currency && cfg.currency !== 'EGP') params.set('curr', cfg.currency);
      // Explicitly ensure demo=true is NEVER included in client link
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

      this._setupTriggers();
      this._renderToolbar(cfg);

      if (cfg.isDemoMode) {
        this.showToolbar();
      }
    },

    _setupTriggers: function () {
      // Secret triggers: triple tap or long press (800ms) on .logo element
      const logo = document.querySelector('.logo');
      if (!logo) return;

      let clickTimes = [];
      let pressTimer = null;

      logo.addEventListener('click', function (e) {
        const now = Date.now();
        clickTimes.push(now);
        clickTimes = clickTimes.filter(t => now - t < 800);
        if (clickTimes.length >= 3) {
          e.preventDefault();
          clickTimes = [];
          PitchControls.toggleToolbar();
        }
      });

      const startPress = function () {
        pressTimer = setTimeout(function () {
          PitchControls.toggleToolbar();
        }, 800);
      };

      const cancelPress = function () {
        if (pressTimer) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
      };

      logo.addEventListener('touchstart', startPress, { passive: true });
      logo.addEventListener('touchend', cancelPress, { passive: true });
      logo.addEventListener('touchcancel', cancelPress, { passive: true });
      logo.addEventListener('mousedown', startPress);
      logo.addEventListener('mouseup', cancelPress);
      logo.addEventListener('mouseleave', cancelPress);
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
        optionsHtml += `<option value="${k}" ${selected}>${p.brand.logoSymbol} ${p.brand.nameAr} (${p.brand.nameEn})</option>`;
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
              <input type="text" id="pitchShopName" placeholder="مثال: برجر هاوس" value="${cfg.shopName || ''}">
            </div>

            <div class="pitch-field">
              <label>رقم واتساب المطعم:</label>
              <input type="tel" id="pitchPhone" placeholder="2010XXXXXXXX" value="${cfg.phone || ''}">
            </div>

            <div class="pitch-field">
              <label>رسوم التوصيل الافتراضية:</label>
              <input type="number" id="pitchFee" value="${cfg.deliveryFee}">
            </div>
          </div>

          <div class="pitch-actions">
            <button class="pitch-btn primary" id="pitchApplyBtn">تطبيق وحفظ</button>
            <button class="pitch-btn success" id="pitchCopyBtn">نسخ رابط العميل 📋</button>
            <button class="pitch-btn danger" id="pitchResetBtn">إعادة ضبط</button>
          </div>
        </div>
      `;

      // Event listeners for toolbar buttons
      const closeBtn = document.getElementById('pitchCloseBtn');
      if (closeBtn) closeBtn.onclick = () => this.hideToolbar();

      const applyBtn = document.getElementById('pitchApplyBtn');
      if (applyBtn) {
        applyBtn.onclick = () => {
          const newPreset = document.getElementById('pitchPresetSelect').value;
          const newName = document.getElementById('pitchShopName').value.trim() || null;
          const newPhone = document.getElementById('pitchPhone').value.trim() || null;
          const newFee = parseFloat(document.getElementById('pitchFee').value) || 0;

          this.saveOverrides({
            shopId: newPreset,
            shopName: newName,
            phone: newPhone,
            deliveryFee: newFee,
            isDemoMode: true
          });

          this.showToast('تم حفظ التعديلات بنجاح! جارٍ التحديث...');
          setTimeout(function () {
            if (typeof window.App !== 'undefined' && window.App.reload) {
              window.App.reload();
            } else {
              window.location.reload();
            }
          }, 300);
        };
      }

      const copyBtn = document.getElementById('pitchCopyBtn');
      if (copyBtn) {
        copyBtn.onclick = () => {
          const newPreset = document.getElementById('pitchPresetSelect').value;
          const newName = document.getElementById('pitchShopName').value.trim() || null;
          const newPhone = document.getElementById('pitchPhone').value.trim() || null;
          const newFee = parseFloat(document.getElementById('pitchFee').value) || 0;

          this.copyClientLink({
            shopId: newPreset,
            shopName: newName,
            phone: newPhone,
            deliveryFee: newFee
          });
        };
      }

      const resetBtn = document.getElementById('pitchResetBtn');
      if (resetBtn) {
        resetBtn.onclick = () => {
          if (confirm('هل تريد إعادة ضبط جميع التخصيصات للوضع الافتراضي؟')) {
            this.resetDefaults();
            this.showToast('تمت استعادة الإعدادات الأصلية');
            setTimeout(function () {
              window.location.href = window.location.pathname;
            }, 300);
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
