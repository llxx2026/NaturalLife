/* ========================================
   結帳邏輯 — Google Form 版
   ======================================== */

function initCheckoutDialog() {
  const overlay = document.getElementById('checkout-overlay');
  if (!overlay) return;

  /* 開啟 */
  window.openCheckout = function () {
    /* 先關閉購物車 */
    if (typeof closeCart === 'function') closeCart();

    const items = Cart.getItems();
    if (items.length === 0) return;

    /* 渲染訂單摘要 */
    const summaryEl = document.getElementById('order-summary');
    const totalEl = document.getElementById('checkout-total');

    summaryEl.innerHTML = items.map(item => `
      <div class="order-summary-item">
        <span>${item.name} × ${item.quantity}</span>
        <span style="font-weight:500;">NT$ ${(item.price * item.quantity).toLocaleString()}</span>
      </div>
    `).join('') + `
      <div class="order-summary-total">
        <span>合計</span>
        <span>NT$ ${Cart.getTotalPrice().toLocaleString()}</span>
      </div>
    `;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  /* 關閉 */
  window.closeCheckout = function () {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCheckout();
  });

  /* 表單提交 */
  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', handleCheckoutSubmit);
  }
}

function handleCheckoutSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const lineId = document.getElementById('checkout-line').value.trim();

  /* 驗證 */
  let hasError = false;
  clearErrors();

  if (!name) { showError('checkout-name', '請輸入姓名'); hasError = true; }
  if (!phone) { showError('checkout-phone', '請輸入電話'); hasError = true; }
  else if (!/^[0-9+\-() ]+$/.test(phone)) { showError('checkout-phone', '電話格式不正確'); hasError = true; }
  if (!address) { showError('checkout-address', '請輸入收件地址'); hasError = true; }
  if (!lineId) { showError('checkout-line', '請輸入 LINE ID'); hasError = true; }

  if (hasError) return;

  /* 組合訂單資料 */
  const items = Cart.getItems();
  const orderDetails = items.map(i => `${i.name} ×${i.quantity} (NT$${(i.price * i.quantity).toLocaleString()})`).join('\n');
  const totalPrice = Cart.getTotalPrice();
  const orderNumber = 'ORD-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.random().toString(36).substr(2, 8);

  /* 跳轉到 Google Form（預填） */
  /* 
   * 請將下方 GOOGLE_FORM_URL 替換為您實際的 Google Form 連結
   * 以及 entry.XXXXX 替換為各欄位的 entry ID
   * 
   * 暫時使用本地儲存方式，讓使用者可以看到結果
   */
  
  /* 先儲存到 localStorage 作為備份 */
  const order = {
    orderNumber,
    name,
    phone,
    address,
    lineId,
    items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
    totalPrice,
    createdAt: new Date().toISOString(),
    status: '待處理',
  };

  const orders = JSON.parse(localStorage.getItem('freshfruit_orders') || '[]');
  orders.push(order);
  localStorage.setItem('freshfruit_orders', JSON.stringify(orders));

  /* 清空購物車並跳轉 */
  Cart.clear();
  closeCheckout();
  window.location.href = `thank-you?order=${orderNumber}`;
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.classList.add('error');
  const errorEl = input.parentElement.querySelector('.form-error');
  if (errorEl) errorEl.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}
