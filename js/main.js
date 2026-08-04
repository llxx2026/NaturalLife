/* ========================================
   首頁互動邏輯 — main.js
   ======================================== */

document.addEventListener('DOMContentLoaded', async () => {
  await fetchProducts();
  initCountdown();
  initMobileMenu();
  initCategoryFilter();
  renderProducts('全部');
  initScrollFadeIn();
  initCartSidebar();
  initCheckoutDialog();
});

/* ── 倒數計時器 ──────────────────────── */
function initCountdown() {
  const el = document.getElementById('countdown-time');
  if (!el) return;

  /* 設定倒數到今天的 23:59:59 */
  function getEndOfDay() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  }

  function update() {
    const now = new Date();
    const end = getEndOfDay();
    let diff = Math.max(0, Math.floor((end - now) / 1000));

    const h = String(Math.floor(diff / 3600)).padStart(2, '0');
    diff %= 3600;
    const m = String(Math.floor(diff / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');

    el.textContent = `${h}:${m}:${s}`;
  }

  update();
  setInterval(update, 1000);
}

/* ── 手機版選單 ──────────────────────── */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('active');
    btn.innerHTML = isOpen ? ICON_X : ICON_MENU;
  });

  /* 點擊連結後關閉 */
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('active');
      btn.innerHTML = ICON_MENU;
    });
  });
}

/* ── 分類篩選 ─────────────────────────── */
function initCategoryFilter() {
  const container = document.getElementById('category-filters');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-btn');
    if (!btn) return;

    container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.category;
    renderProducts(cat);
  });
}

/* ── 渲染產品卡片 ──────────────────────── */
function renderProducts(category) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filtered = getProductsByCategory(category);

  grid.innerHTML = filtered.map((p, i) => {
    const soldOut = p.stock <= 0;
    return `
      <a href="fruit-detail?id=${p.id}" class="product-card scroll-fade-in" style="transition-delay: ${i * 0.05}s">
        <div class="product-card-image">
          <img src="${p.image}" alt="${p.name}" loading="lazy" class="${soldOut ? 'sold-out-img' : ''}" />
          ${p.detailImage && !soldOut ? `<img src="${p.detailImage}" alt="${p.name} 斷面" class="detail-img" loading="lazy" />` : ''}
          ${soldOut
            ? '<span class="badge badge-muted">已結單</span>'
            : p.tag ? `<span class="badge badge-primary">${p.tag}</span>` : ''
          }
        </div>
        <div class="product-card-body">
          <div class="product-card-header">
            <h3 class="product-card-name">${p.name}</h3>
            <div class="product-card-rating">
              ${ICON_STAR}
              <span>${p.rating}</span>
            </div>
          </div>
          <p class="product-card-origin">產地：${p.origin}</p>
          <p class="product-card-spec">規格：${p.spec}</p>
          <div class="product-card-footer">
            <span class="product-card-price">${p.priceLabel}</span>
            ${soldOut
              ? '<span class="btn btn-sm" style="background:var(--muted);color:var(--muted-fg);cursor:not-allowed;">已結單</span>'
              : `<button class="btn btn-secondary btn-sm add-to-cart-btn" data-id="${p.id}" onclick="event.preventDefault(); event.stopPropagation(); addToCart('${p.id}')">加入清單</button>`
            }
          </div>
        </div>
      </a>
    `;
  }).join('');

  /* 重新綁定滾動淡入 */
  initScrollFadeIn();
}

/* 加入購物車 */
function addToCart(productId) {
  const product = getProductById(productId);
  if (!product || product.stock <= 0) return;
  Cart.addItem(product);
  openCart();
}

/* ── 滾動淡入動畫 ──────────────────────── */
function initScrollFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.scroll-fade-in').forEach(el => {
    if (!el.classList.contains('visible')) {
      observer.observe(el);
    }
  });
}

/* ── SVG 圖標常數 ─────────────────────── */
const ICON_STAR = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

const ICON_LEAF = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;

const ICON_CART = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`;

const ICON_X = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

const ICON_MENU = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;

const ICON_SEARCH = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`;

const ICON_BAG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;

const ICON_TRUCK = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`;

const ICON_CHECK = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`;

const ICON_QUOTE = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>`;
