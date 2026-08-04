/* ========================================
   產品資料 — 鮮果嚴選
   ======================================== */

const SHEET_CSV_URL = ""; // ⭐ 請將您的 Google 試算表 CSV 網址貼在引號內

const fallbackProducts = [
  {
    id: "mango",
    name: "日本愛文芒果",
    origin: "宮崎縣",
    spec: "1箱 2kg（4~6顆）",
    price: 1280,
    priceLabel: "NT$ 1,280",
    rating: 4.9,
    image: "assets/fruit-mango.jpg",
    detailImage: "assets/fruit-mango-detail.jpg",
    tag: "限量",
    category: ["進口水果", "當季限定"],
    description: "來自日本宮崎縣的頂級愛文芒果，又稱「太陽之卵」。每顆皆在樹上自然熟成後才採摘，果肉細緻綿密、甜度極高，散發濃郁的熱帶芳香。嚴格篩選糖度達15度以上，是日本最高等級的芒果品種。",
    storage: "建議冷藏保存，收到後3~5天內食用風味最佳。食用前30分鐘取出回溫，口感更佳。",
    season: "5月～8月",
    nutrition: { calories: "60 kcal", sugar: "14g", fiber: "1.6g", vitaminC: "36mg", potassium: "168mg" },
    recommended: ["grapes", "peach", "cherry"],
    stock: 10,
  },
  {
    id: "grapes",
    name: "晴王麝香葡萄",
    origin: "日本岡山",
    spec: "1房 約600g",
    price: 2580,
    priceLabel: "NT$ 2,580",
    rating: 5.0,
    image: "assets/fruit-grapes.jpg",
    detailImage: "assets/fruit-grapes-detail.jpg",
    tag: "人氣王",
    category: ["進口水果", "禮盒系列"],
    description: "日本岡山縣產的「晴王」麝香葡萄，被譽為葡萄界的愛馬仕。果粒碩大飽滿，皮薄無籽可連皮食用，咬下瞬間麝香芳香充滿口腔，甜度高達20度以上。每一串都經過嚴格的品質檢測與分級。",
    storage: "冷藏保存，建議收到後一週內食用。避免清洗後再冷藏，食用前再輕柔沖洗即可。",
    season: "7月～10月",
    nutrition: { calories: "59 kcal", sugar: "15g", fiber: "0.9g", vitaminC: "2mg", potassium: "130mg" },
    recommended: ["mango", "peach", "strawberry"],
    stock: 8,
  },
  {
    id: "strawberry",
    name: "韓國草莓禮盒",
    origin: "韓國論山",
    spec: "1盒 500g（約20顆）",
    price: 980,
    priceLabel: "NT$ 980",
    rating: 4.8,
    image: "assets/fruit-strawberry.jpg",
    detailImage: "assets/fruit-strawberry-detail.jpg",
    tag: "當季",
    category: ["當季限定", "禮盒系列"],
    description: "韓國論山產區的冬季限定草莓，品種為人氣最高的「雪香」。果實碩大鮮紅，果肉飽滿多汁，酸甜比例完美。精美禮盒包裝，每顆草莓都有獨立保護，是送禮自用的絕佳選擇。",
    storage: "冷藏保存，建議收到後2~3天內食用。草莓嬌嫩，請輕拿輕放避免碰壓。",
    season: "12月～3月",
    nutrition: { calories: "33 kcal", sugar: "7g", fiber: "2g", vitaminC: "59mg", potassium: "153mg" },
    recommended: ["cherry", "grapes", "peach"],
    stock: 15,
  },
  {
    id: "dragonfruit",
    name: "越南紅心火龍果",
    origin: "越南",
    spec: "1箱 5kg（8~10顆）",
    price: 450,
    priceLabel: "NT$ 450",
    rating: 4.7,
    image: "assets/fruit-dragonfruit.jpg",
    detailImage: "assets/fruit-dragonfruit-detail.jpg",
    tag: "",
    category: ["進口水果"],
    description: "來自越南的紅心火龍果，果肉呈鮮豔的紫紅色，甜度高且富含天然花青素。果肉細緻多汁，清甜爽口，是炎夏消暑的最佳選擇。高纖低熱量，也是健康飲食的好夥伴。",
    storage: "室溫可保存約5天，冷藏可延長至7~10天。切開後請盡快食用。",
    season: "全年供應",
    nutrition: { calories: "50 kcal", sugar: "11g", fiber: "3g", vitaminC: "9mg", potassium: "227mg" },
    recommended: ["mango", "strawberry", "cherry"],
    stock: 20,
  },
  {
    id: "peach",
    name: "日本白桃",
    origin: "山梨縣",
    spec: "1箱 2kg（5~6顆）",
    price: 1680,
    priceLabel: "NT$ 1,680",
    rating: 4.9,
    image: "assets/fruit-peach.jpg",
    detailImage: "assets/fruit-peach-detail.jpg",
    tag: "預購",
    category: ["進口水果", "禮盒系列"],
    description: "日本山梨縣產的頂級白桃，果皮淡粉色澤如少女肌膚般細緻。果肉入口即化、汁水豐沛，甜度可達16度以上，帶有優雅的桃花香氣。每顆都經過人工精選，確保品質一致。",
    storage: "收到時若尚硬可室溫催熟1~2天，軟化後冷藏保存。建議冰鎮後食用風味最佳。",
    season: "6月～9月",
    nutrition: { calories: "40 kcal", sugar: "8g", fiber: "1.5g", vitaminC: "8mg", potassium: "190mg" },
    recommended: ["mango", "grapes", "cherry"],
    stock: 5,
  },
  {
    id: "cherry",
    name: "紐西蘭櫻桃",
    origin: "紐西蘭",
    spec: "1箱 2kg",
    price: 1380,
    priceLabel: "NT$ 1,380",
    rating: 4.8,
    image: "assets/fruit-cherry.jpg",
    detailImage: "assets/fruit-cherry-detail.jpg",
    tag: "熱銷",
    category: ["當季限定", "進口水果"],
    description: "紐西蘭南島產區的高品質櫻桃，在純淨的自然環境中生長。果粒飽滿碩大、色澤深紅亮麗，口感脆甜多汁，帶有淡淡的酸韻平衡。空運直送，保留最新鮮的風味。",
    storage: "冷藏保存，建議收到後5~7天內食用。避免清洗後再冷藏，食用前再沖洗。",
    season: "12月～2月",
    nutrition: { calories: "50 kcal", sugar: "12g", fiber: "1.6g", vitaminC: "7mg", potassium: "173mg" },
    recommended: ["strawberry", "grapes", "mango"],
    stock: 12,
  },
];

let products = fallbackProducts;

const categories = ["全部", "當季限定", "進口水果", "禮盒系列"];

/* ── Google 試算表 CSV 處理 ──────────────────────── */
function parseCSV(str) {
  const arr = [];
  let quote = false;
  for (let row = 0, col = 0, c = 0; c < str.length; c++) {
    let cc = str[c], nc = str[c+1];
    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || '';
    if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
    if (cc == '"') { quote = !quote; continue; }
    if (cc == ',' && !quote) { ++col; continue; }
    if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
    if (cc == '\n' && !quote) { ++row; col = 0; continue; }
    if (cc == '\r' && !quote) { ++row; col = 0; continue; }
    arr[row][col] += cc;
  }
  return arr;
}

async function fetchProducts() {
  if (!SHEET_CSV_URL) return; // 未設定時使用 fallbackProducts
  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    
    if (rows.length < 2) return;
    const headers = rows[0];
    const newProducts = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 2 || !row[0]) continue;
      
      const rowData = {};
      headers.forEach((h, index) => {
        if(h) rowData[h.trim()] = row[index] || "";
      });
      
      // 若狀態為下架，則不加入顯示陣列
      if (rowData["狀態"] === "下架" || rowData["status"] === "下架") continue;
      if (rowData["狀態"] === "隱藏" || rowData["status"] === "隱藏") continue;
      
      newProducts.push({
        id: rowData["id"],
        name: rowData["name"],
        origin: rowData["origin"],
        spec: rowData["spec"],
        price: parseInt(rowData["price"] || 0, 10),
        priceLabel: `NT$ ${parseInt(rowData["price"] || 0, 10).toLocaleString()}`,
        rating: parseFloat(rowData["rating"] || 5.0),
        image: rowData["image"],
        detailImage: rowData["detailImage"],
        tag: rowData["tag"],
        category: rowData["category"] ? rowData["category"].split(/[,、]/).map(c => c.trim()) : [],
        description: rowData["description"],
        storage: rowData["storage"],
        season: rowData["season"],
        stock: parseInt(rowData["stock"] || 0, 10),
        // 以下預設保留空，因為 Google Sheet 可能沒寫這麼細
        nutrition: { calories: "-", sugar: "-", fiber: "-", vitaminC: "-", potassium: "-" },
        recommended: []
      });
    }
    
    if (newProducts.length > 0) {
      products = newProducts;
    }
  } catch (error) {
    console.error("載入試算表商品失敗，將使用預設資料:", error);
  }
}

/* 工具函式 */
function getProductById(id) {
  return products.find(p => p.id === id) || null;
}

function getProductsByCategory(category) {
  if (category === "全部") return products;
  return products.filter(p => p.category.includes(category));
}

function getRecommendedProducts(ids) {
  return ids.map(id => getProductById(id)).filter(Boolean);
}
