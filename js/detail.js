/* ========================================
   產品詳情頁邏輯 — detail.js
   ======================================== */

document.addEventListener('DOMContentLoaded', async () => {
  await fetchProducts();
  initCartSidebar();
  renderDetailPage();
});

function renderDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = getProductById(id);
  const container = document.getElementById('detail-content');

  if (!product) {
    container.innerHTML = `
      <div style="text-align:center; padding:6rem 2rem;">
        <h1 style="font-size:1.5rem; font-weight:700; color:var(--fg); margin-bottom:1rem;">找不到此水果</h1>
        <a href="index.html" style="color:var(--primary);">返回首頁</a>
      </div>
    `;
    return;
  }

  /* 設定頁面標題 */
  document.title = `${product.name} — 鮮果嚴選`;

  const images = [product.image, product.detailImage].filter(Boolean);
  const recommended = getRecommendedProducts(product.recommended);
  const soldOut = product.stock <= 0;

  const starsHTML = Array.from({ length: 5 }, (_, i) =>
    i < Math.round(product.rating)
      ? `<svg class="star-filled" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
      : `<svg class="star-empty" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
  ).join('');

  container.innerHTML = `
    <!-- 產品主體 -->
    <div class="detail-grid animate-fade-in-up">
      <!-- 圖片 -->
      <div class="detail-gallery">
        <img id="detail-main-img" src="${images[0]}" alt="${product.name}" class="${soldOut ? 'sold-out-img' : ''}" />
        ${images.length > 1 ? `
          <div class="detail-thumbnails">
            ${images.map((img, i) => `
              <button class="detail-thumbnail ${i === 0 ? 'active' : ''}" onclick="switchImage(${i}, '${img}')">
                <img src="${img}" alt="" />
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <!-- 資訊 -->
      <div class="detail-info" style="animation-delay: 0.15s;">
        ${soldOut
          ? '<span class="badge badge-muted">已結單</span>'
          : product.tag ? `<span class="badge badge-primary">${product.tag}</span>` : ''
        }
        <h1 style="font-size:clamp(1.75rem,3vw,2.5rem); font-weight:700; color:var(--fg);">${product.name}</h1>

        <div class="detail-meta">
          <span class="detail-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            產地：${product.origin}
          </span>
          ${product.season ? `
            <span class="detail-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              產季：${product.season}
            </span>
          ` : ''}
        </div>

        <div class="detail-stars">
          <div class="stars">${starsHTML}</div>
          <span class="rating-value">${product.rating}</span>
        </div>

        ${product.description ? `<p class="detail-desc">${product.description}</p>` : ''}

        ${product.storage ? `
          <div class="detail-storage">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>
            <div><strong>保存方式：</strong>${product.storage}</div>
          </div>
        ` : ''}

        <div class="detail-purchase">
          <div>
            <p class="detail-spec">規格：${product.spec}</p>
            <p class="detail-price">${product.priceLabel}</p>
          </div>
          ${soldOut
            ? `<span class="btn" style="background:var(--muted);color:var(--muted-fg);cursor:not-allowed;">已結單</span>`
            : `<button class="btn btn-primary" onclick="addToCartDetail('${product.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                加入清單
              </button>`
          }
        </div>
      </div>
    </div>

    <!-- 推薦商品 -->
    ${recommended.length > 0 ? `
      <div class="recommended-section animate-fade-in-up" style="animation-delay: 0.25s;">
        <h2 class="recommended-title">你可能也喜歡</h2>
        <div class="recommended-grid">
          ${recommended.map(r => `
            <a href="fruit-detail?id=${r.id}" class="recommended-card">
              <div style="overflow:hidden; border-radius:var(--radius-2xl) var(--radius-2xl) 0 0;">
                <img src="${r.image}" alt="${r.name}" loading="lazy" />
              </div>
              <div class="recommended-card-body">
                <div class="recommended-card-name">${r.name}</div>
                <div class="recommended-card-meta">${r.origin} · ${r.spec}</div>
                <div class="recommended-card-price">${r.priceLabel}</div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

/* 圖片切換 */
function switchImage(index, src) {
  document.getElementById('detail-main-img').src = src;
  document.querySelectorAll('.detail-thumbnail').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
}

/* 加入購物車 */
function addToCartDetail(productId) {
  const product = getProductById(productId);
  if (!product || product.stock <= 0) return;
  Cart.addItem(product);
  openCart();
}
