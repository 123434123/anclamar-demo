// tests/verify-app-logic.js
const assert = require('assert');

// Mock browser environment
global.window = {};
global.document = {
  documentElement: {
    style: { setProperty() {} },
    getAttribute() { return 'ar'; },
    setAttribute() {}
  },
  body: { classList: { add() {}, remove() {} } },
  getElementById() { return null; },
  querySelector() { return null; },
  querySelectorAll() { return []; }
};

require('../data/presets.js');
require('../js/pitch-controls.js');
require('../js/app.js');

const app = window.App;
assert.ok(app, 'App must be defined on window');

// Test 1: Cart key generation with modifiers
const item = {
  id: 'burger_1',
  nameAr: 'أوريجينال دبل سماش',
  nameEn: 'Original Double Smash',
  price: 185
};
const modSizeDouble = { group: 'size', nameAr: 'دبل (قطعتين)', nameEn: 'Double', priceDelta: 0 };
const modSizeTriple = { group: 'size', nameAr: 'تريبل عملاق', nameEn: 'Triple Monster', priceDelta: 55 };
const modCheese = { group: 'addon', nameAr: 'جبنة شيدر سائلة', nameEn: 'Melted Cheddar', priceDelta: 25 };

const key1 = app.generateCartKey(item.id, [modSizeDouble, modCheese]);
const key2 = app.generateCartKey(item.id, [modSizeTriple, modCheese]);
const key3 = app.generateCartKey(item.id, []);

assert.notStrictEqual(key1, key2, 'Burgers with different sizes must have different cart keys');
assert.notStrictEqual(key1, key3, 'Customized burger must differ from default item');

// Test 2: Subtotal and item total calculations
const cartState = [
  { item: item, modifiers: [modSizeTriple, modCheese], qty: 2, unitPrice: 185 + 55 + 25 }, // 265 * 2 = 530
  { item: { id: 'fries', nameAr: 'بطاطس', nameEn: 'Fries', price: 40 }, modifiers: [], qty: 1, unitPrice: 40 } // 40
];

const subtotal = app.calculateSubtotal(cartState);
assert.strictEqual(subtotal, 570, 'Subtotal should be 530 + 40 = 570');

// Test 3: WhatsApp receipt formatting for Delivery
const orderInfoDelivery = {
  orderType: 'delivery',
  customerName: 'محمد علي',
  customerPhone: '01012345678',
  address: 'شارع 9، المعادي، عمارة 12 شقة 4',
  notes: 'بدون بصل',
  deliveryFee: 30,
  currency: 'جنيه',
  shopName: 'سماش ماستر برجر'
};

const msgDelivery = app.formatWhatsAppReceipt(cartState, orderInfoDelivery, 'ar');
assert.ok(msgDelivery.includes('*طلب جديد من الموقع* - سماش ماستر برجر'), 'Should include header with shop name');
assert.ok(msgDelivery.includes('نوع الطلب:* توصيل 🛵'), 'Should identify delivery');
assert.ok(msgDelivery.includes('محمد علي'), 'Should include customer name');
assert.ok(msgDelivery.includes('01012345678'), 'Should include customer phone');
assert.ok(msgDelivery.includes('شارع 9، المعادي'), 'Should include address');
assert.ok(msgDelivery.includes('تريبل عملاق، جبنة شيدر سائلة'), 'Should list selected modifiers');
assert.ok(msgDelivery.includes('المجموع الفرعي:* 570 جنيه'), 'Should format subtotal correctly');
assert.ok(msgDelivery.includes('رسوم التوصيل:* 30 جنيه'), 'Should format delivery fee');
assert.ok(msgDelivery.includes('الإجمالي النهائي:* 600 جنيه'), 'Total should equal subtotal + fee');

// Test 4: WhatsApp receipt formatting for Takeaway (0 delivery fee)
const orderInfoTakeaway = {
  orderType: 'takeaway',
  customerName: 'سارة أحمد',
  customerPhone: '01223344556',
  address: '',
  notes: 'الاستلام خلال 20 دقيقة',
  deliveryFee: 0,
  currency: 'جنيه',
  shopName: 'سماش ماستر برجر'
};

const msgTakeaway = app.formatWhatsAppReceipt(cartState, orderInfoTakeaway, 'ar');
assert.ok(msgTakeaway.includes('نوع الطلب:* استلام من الفرع / تيك أواي 🛍️'), 'Should identify takeaway');
assert.ok(!msgTakeaway.includes('رسوم التوصيل:'), 'Takeaway receipt should omit delivery fee row');
assert.ok(!msgTakeaway.includes('العنوان:'), 'Takeaway receipt should omit delivery address row');
assert.ok(msgTakeaway.includes('الإجمالي النهائي:* 570 جنيه'), 'Takeaway total must equal subtotal');

console.log('App logic, cart keys & receipt formatting tests passed successfully.');
