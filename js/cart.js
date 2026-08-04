/* ========================================
   購物車邏輯 — localStorage 版
   ======================================== */

const CART_KEY = 'freshfruit_cart';

const Cart = {
  /* 取得購物車項目 */
  getItems() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  },

  /* 儲存購物車 */
  _save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    this._notify();
  },

  /* 新增商品 */
  addItem(product) {
    const items = this.getItems();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        origin: product.origin,
        spec: product.spec,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }
    this._save(items);
  },

  /* 移除商品 */
  removeItem(id) {
    const items = this.getItems().filter(i => i.id !== id);
    this._save(items);
  },

  /* 更新數量 */
  updateQuantity(id, qty) {
    if (qty <= 0) {
      this.removeItem(id);
      return;
    }
    const items = this.getItems();
    const item = items.find(i => i.id === id);
    if (item) {
      item.quantity = qty;
      this._save(items);
    }
  },

  /* 清空購物車 */
  clear() {
    localStorage.removeItem(CART_KEY);
    this._notify();
  },

  /* 總數量 */
  getTotalItems() {
    return this.getItems().reduce((sum, i) => sum + i.quantity, 0);
  },

  /* 總金額 */
  getTotalPrice() {
    return this.getItems().reduce((sum, i) => sum + i.price * i.quantity, 0);
  },

  /* 事件通知 — 讓 UI 更新 */
  _listeners: [],

  onChange(fn) {
    this._listeners.push(fn);
  },

  _notify() {
    this._listeners.forEach(fn => fn());
  },
};

/* ── 購物車側邊欄 UI ─────────────────── */
function initCartSidebar() {
  const overlay = document.getElementById('cart-overlay');
  const sidebar = document.getElementById('cart-sidebar');
  if (!overlay || !sidebar) return;

  /* 開啟 */
  window.openCart = function () {
    overlay.classList.add('active');
    sidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCartItems();
  };

  /* 關閉 */
  window.closeCart = function () {
    overlay.classList.remove('active');
    sidebar.classList.remove('active');
    document.body.style.overflow = '';
  };

  overlay.addEventListener('click', closeCart);

  /* 徽章更新 */
  function updateBadges() {
    const count = Cart.getTotalItems();
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  /* 渲染購物車項目 */
  function renderCartItems() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    const items = Cart.getItems();

    if (items.length === 0) {
      container.innerHTML = '<div class="cart-empty">🛒 購物車是空的，快去選購水果吧！</div>';
      if (totalEl) totalEl.textContent = 'NT$ 0';
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    container.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-spec">${item.origin} · ${item.spec}</div>
          <div class="cart-item-price">NT$ ${(item.price * item.quantity).toLocaleString()}</div>
          <div class="cart-item-qty">
            <button onclick="Cart.updateQuantity('${item.id}', ${item.quantity - 1}); renderCartItems();" aria-label="減少">−</button>
            <span>${item.quantity}</span>
            <button onclick="Cart.updateQuantity('${item.id}', ${item.quantity + 1}); renderCartItems();" aria-label="增加">+</button>
          </div>
          <div class="cart-item-remove" onclick="Cart.removeItem('${item.id}'); renderCartItems();">移除</div>
        </div>
      </div>
    `).join('');

    if (totalEl) totalEl.textContent = `NT$ ${Cart.getTotalPrice().toLocaleString()}`;
  }

  /* 讓 renderCartItems 可被外部呼叫 */
  window.renderCartItems = renderCartItems;

  /* 初始化 */
  Cart.onChange(updateBadges);
  Cart.onChange(renderCartItems);
  updateBadges();
}
