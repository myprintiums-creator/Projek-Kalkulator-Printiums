// State Management for the Digital Ecosystem
const state = {
  activeTab: 'sticker',
  stats: {
    calculationsCount: 0,
    totalQuotationValue: 0.00,
    totalMarginSum: 0,
    savedQuotes: []
  },
  sticker: {
    shape: 'circle',
    width: 50,
    height: 50,
    material: 'mirrorcoat',
    lamination: 'none',
    cutting: 'kiss_cut',
    qty: 100
  },
  banner: {
    width: 4,
    height: 8,
    material: 'tarpaulin_300g',
    finishing: 'clean_cut',
    qty: 1
  },
  general: {
    product: 'business_card',
    material: 'artcard_260',
    sides: 'single',
    color: 'color',
    qty: 5,
    markup: 40
  }
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initStickerForm();
  initBannerForm();
  initGeneralForm();
  
  // Align sticker labels with the default unit (mm)
  updateStickerLabels();
  
  // Initial calculations
  calculateStickerPrice();
  calculateBannerPrice();
  calculateGeneralPrice();
  
  // Set up markup slider listener
  const markupSlider = document.getElementById('general-markup');
  if (markupSlider) {
    markupSlider.addEventListener('input', (e) => {
      document.getElementById('lbl-general-markup-val').innerText = `${e.target.value}%`;
    });
  }
});

// Helper: Show toast notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '<i class="fa-solid fa-circle-check"></i>';
  if (type === 'info') icon = '<i class="fa-solid fa-circle-info"></i>';
  if (type === 'danger') icon = '<i class="fa-solid fa-triangle-exclamation"></i>';
  
  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);
  
  // Auto remove after 3.5s
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Helper: Dynamic Business Days Calculator (Skips Saturdays and Sundays)
function calculateReadyDate(businessDays) {
  let date = new Date();
  
  // Cut-off time: orders placed after 5:00 PM are processed starting tomorrow
  if (date.getHours() >= 17) {
    date.setDate(date.getDate() + 1);
  }
  
  let addedDays = 0;
  while (addedDays < businessDays) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    if (day !== 0 && day !== 6) {
      addedDays++;
    }
  }
  
  const daysName = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
  const monthsName = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];
  
  return `${daysName[date.getDay()]}, ${date.getDate()} ${monthsName[date.getMonth()]} ${date.getFullYear()}`;
}

// ==========================================================================
// TABS & NAVIGATION
// ==========================================================================
function switchTab(tabId) {
  state.activeTab = tabId;
  
  // Update nav menu active states
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.getElementById(`nav-${tabId}`).classList.add('active');
  
  // Update visible sections
  document.querySelectorAll('.calculator-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(`section-${tabId}`).classList.add('active');
  
  // Update header titles dynamically based on tab
  const heading = document.getElementById('main-heading');
  const subheading = document.getElementById('main-subheading');
  
  if (tabId === 'sticker') {
    heading.innerText = 'Automasi Sebut Harga Pelekat (Stickers)';
    subheading.innerText = 'Kira saiz, bahan, potongan, dan lamination secara dinamik berasaskan diskaun volum.';
    calculateStickerPrice();
  } else if (tabId === 'banner') {
    heading.innerText = 'Automasi Sebut Harga Banner & Bunting';
    subheading.innerText = 'Kira kos kain rentang tarpaulin, canvas, atau yupo berasaskan luas kaki persegi.';
    calculateBannerPrice();
  } else if (tabId === 'general') {
    heading.innerText = 'Sebut Harga Cetakan Am & Operasi Kos';
    subheading.innerText = 'Sesuai untuk kad perniagaan, flyer, dan booklet dengan penetapan margin keuntungan terus.';
    calculateGeneralPrice();
  }
}

// ==========================================================================
// STICKER CALCULATOR
// ==========================================================================
function initStickerForm() {
  // 1. Shapes
  const shapeContainer = document.getElementById('sticker-shapes');
  shapeContainer.innerHTML = '';
  
  PRINT_DATA.sticker.shapes.forEach((shape, index) => {
    const activeClass = index === 0 ? 'active' : '';
    let icon = 'fa-circle';
    if (shape.id === 'square') icon = 'fa-square';
    if (shape.id === 'rectangle') icon = 'fa-vector-square';
    if (shape.id === 'custom') icon = 'fa-wand-magic-sparkles';
    
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `shape-btn ${activeClass}`;
    btn.id = `btn-shape-${shape.id}`;
    btn.onclick = () => selectStickerShape(shape.id);
    btn.innerHTML = `<i class="fa-solid ${icon}"></i><span>${shape.name}</span>`;
    shapeContainer.appendChild(btn);
  });
  
  // 2. Materials dropdown
  const matSelect = document.getElementById('sticker-material');
  matSelect.innerHTML = PRINT_DATA.sticker.materials.map(m => 
    `<option value="${m.id}">${m.name}</option>`
  ).join('');
  
  // 3. Lamination dropdown
  const lamSelect = document.getElementById('sticker-lamination');
  lamSelect.innerHTML = PRINT_DATA.sticker.laminations.map(l => 
    `<option value="${l.id}">${l.name}</option>`
  ).join('');
  
  // 4. Cutting dropdown
  const cutSelect = document.getElementById('sticker-cutting');
  cutSelect.innerHTML = PRINT_DATA.sticker.cuttings.map(c => 
    `<option value="${c.id}">${c.name}</option>`
  ).join('');
  
  updateStickerMaterialInfo();
}

function selectStickerShape(shapeId) {
  state.sticker.shape = shapeId;
  document.getElementById('sticker-shape-input').value = shapeId;
  
  // Update active button classes
  document.querySelectorAll('#sticker-shapes .shape-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`btn-shape-${shapeId}`).classList.add('active');
  
  // Visualizer shape rendering
  const visualEl = document.getElementById('visual-sticker');
  visualEl.style.borderRadius = '0px'; // reset
  if (shapeId === 'circle') visualEl.style.borderRadius = '50%';
  if (shapeId === 'square') visualEl.style.borderRadius = '6px';
  if (shapeId === 'rectangle') visualEl.style.borderRadius = '12px';
  if (shapeId === 'custom') visualEl.style.borderRadius = '40% 60% 70% 30% / 40% 50% 60% 50%';
  
  calculateStickerPrice();
}

function updateStickerMaterialInfo() {
  const selectedMatId = document.getElementById('sticker-material').value;
  const mat = PRINT_DATA.sticker.materials.find(m => m.id === selectedMatId);
  if (mat) {
    document.getElementById('sticker-material-desc').innerText = mat.description;
  }
}

function updateStickerLabels() {
  const unit = document.getElementById('sticker-unit').value;
  document.getElementById('lbl-sticker-width').innerText = `Lebar Sticker (${unit})`;
  document.getElementById('lbl-sticker-height').innerText = `Tinggi Sticker (${unit})`;
}

// Pure calculation logic for Sticker (used by comparison table & main calculator)
function getStickerPriceForQty(qty) {
  const width = parseFloat(document.getElementById('sticker-width').value) || 0;
  const height = parseFloat(document.getElementById('sticker-height').value) || 0;
  const unit = document.getElementById('sticker-unit').value;
  
  const selectedMatId = document.getElementById('sticker-material').value;
  const selectedLamId = document.getElementById('sticker-lamination').value;
  const selectedCutId = document.getElementById('sticker-cutting').value;
  const shapeId = state.sticker.shape;
  
  let wMm = 0;
  let hMm = 0;
  if (unit === 'mm') {
    wMm = width;
    hMm = height;
  } else if (unit === 'cm') {
    wMm = width * 10;
    hMm = height * 10;
  } else if (unit === 'inch') {
    wMm = width * 25.4;
    hMm = height * 25.4;
  }
  
  const printAreaW = 294;
  const printAreaH = 472;
  const gap = selectedCutId === 'kiss_cut' ? 2 : 4;
  
  const cols = Math.floor((printAreaW + gap) / (wMm + gap));
  const rows = Math.floor((printAreaH + gap) / (hMm + gap));
  const totalNormal = cols > 0 && rows > 0 ? cols * rows : 0;
  
  const colsRot = Math.floor((printAreaW + gap) / (hMm + gap));
  const rowsRot = Math.floor((printAreaH + gap) / (wMm + gap));
  const totalRotated = colsRot > 0 && rowsRot > 0 ? colsRot * rowsRot : 0;
  
  const stickersPerSheet = Math.max(totalNormal, totalRotated);
  if (stickersPerSheet <= 0 || wMm <= 0 || hMm <= 0) return null;
  
  const sheetsNeeded = Math.ceil(qty / stickersPerSheet);
  
  const setupCost = PRINT_DATA.sticker.baseSetupCost;
  const basePricePerSheet = PRINT_DATA.sticker.basePricePerSheet;
  
  const shape = PRINT_DATA.sticker.shapes.find(s => s.id === shapeId);
  const mat = PRINT_DATA.sticker.materials.find(m => m.id === selectedMatId);
  const lam = PRINT_DATA.sticker.laminations.find(l => l.id === selectedLamId);
  const cut = PRINT_DATA.sticker.cuttings.find(c => c.id === selectedCutId);
  
  if (!shape || !mat || !lam || !cut) return null;
  
  const rawPricePerSheet = basePricePerSheet * shape.multiplier * mat.multiplier;
  const totalRawPrintCost = rawPricePerSheet * sheetsNeeded;
  const totalLaminationCost = lam.pricePerSheet * sheetsNeeded;
  const totalCuttingCost = cut.baseCostPerPcs * qty;
  
  const totalProductionCost = totalRawPrintCost + totalLaminationCost;
  
  let discountRate = 0;
  for (const tier of PRINT_DATA.sticker.discountTiers) {
    if (sheetsNeeded <= tier.maxSheets) {
      discountRate = 1 - tier.discountMultiplier;
      break;
    }
  }
  
  const discountedProductionCost = totalProductionCost * (1 - discountRate);
  const finalPrice = discountedProductionCost + totalCuttingCost + setupCost;
  
  return {
    setupCost,
    totalRawPrintCost,
    totalFinishingCost: totalLaminationCost + totalCuttingCost,
    discountRate,
    finalPrice,
    unitPrice: finalPrice / qty,
    stickersPerSheet,
    sheetsNeeded,
    width,
    height,
    unit,
    qty,
    materialName: mat.name,
    shapeName: shape.name
  };
}

function calculateStickerPrice() {
  const qty = parseInt(document.getElementById('sticker-qty').value) || 0;
  const res = getStickerPriceForQty(qty);
  
  if (!res) {
    document.getElementById('lbl-sticker-per-sheet').innerText = "Tidak Muat!";
    document.getElementById('lbl-sticker-sheets-needed').innerText = "-";
    document.getElementById('lbl-sticker-base').innerText = "RM 0.00";
    document.getElementById('lbl-sticker-finishing').innerText = "RM 0.00";
    document.getElementById('lbl-sticker-discount').innerText = "0%";
    document.getElementById('lbl-sticker-total').innerText = "RM 0.00";
    document.getElementById('lbl-sticker-unit').innerText = "RM 0.000 / pc";
    return;
  }
  
  // Update UI Labels
  document.getElementById('lbl-sticker-setup').innerText = `RM ${res.setupCost.toFixed(2)}`;
  document.getElementById('lbl-sticker-per-sheet').innerText = `${res.stickersPerSheet} pcs`;
  document.getElementById('lbl-sticker-sheets-needed').innerText = `${res.sheetsNeeded} helai`;
  document.getElementById('lbl-sticker-base').innerText = `RM ${res.totalRawPrintCost.toFixed(2)}`;
  document.getElementById('lbl-sticker-finishing').innerText = `RM ${res.totalFinishingCost.toFixed(2)}`;
  document.getElementById('lbl-sticker-discount').innerText = `${(res.discountRate * 100).toFixed(0)}%`;
  document.getElementById('lbl-sticker-total').innerText = `RM ${res.finalPrice.toFixed(2)}`;
  document.getElementById('lbl-sticker-unit').innerText = `RM ${res.unitPrice.toFixed(3)} / pc`;
  
  // Ready Date: 2 Business Days
  document.getElementById('lbl-sticker-ready-date').innerText = calculateReadyDate(2);
  
  // Update Visualizer
  const unit = res.unit;
  let wCm = res.width;
  let hCm = res.height;
  if (unit === 'mm') { wCm /= 10; hCm /= 10; }
  else if (unit === 'inch') { wCm *= 2.54; hCm *= 2.54; }
  document.getElementById('visual-sticker-text').innerText = `${wCm.toFixed(1)} x ${hCm.toFixed(1)} cm`;
  document.getElementById('visual-sticker-w').innerText = `${res.width}${unit}`;
  document.getElementById('visual-sticker-h').innerText = `${res.height}${unit}`;
  
  // Cache to state
  state.sticker.calculated = res;
  
  // Render Comparison Grid (Excard style)
  renderComparisonGrid('sticker', qty);
}

// ==========================================================================
// BANNER CALCULATOR
// ==========================================================================
function initBannerForm() {
  const matSelect = document.getElementById('banner-material');
  matSelect.innerHTML = PRINT_DATA.banner.materials.map(m => 
    `<option value="${m.id}">${m.name}</option>`
  ).join('');
  
  const finSelect = document.getElementById('banner-finishing');
  finSelect.innerHTML = PRINT_DATA.banner.finishings.map(f => 
    `<option value="${f.id}">${f.name}</option>`
  ).join('');
  
  updateBannerMaterialInfo();
}

function updateBannerMaterialInfo() {
  const selectedMatId = document.getElementById('banner-material').value;
  const mat = PRINT_DATA.banner.materials.find(m => m.id === selectedMatId);
  if (mat) {
    document.getElementById('banner-material-desc').innerText = mat.description;
  }
}

function getBannerPriceForQty(qty) {
  const width = parseFloat(document.getElementById('banner-width').value) || 0;
  const height = parseFloat(document.getElementById('banner-height').value) || 0;
  const selectedMatId = document.getElementById('banner-material').value;
  const selectedFinId = document.getElementById('banner-finishing').value;
  
  const baseSqFtPrice = PRINT_DATA.banner.basePricePerSqFt;
  const mat = PRINT_DATA.banner.materials.find(m => m.id === selectedMatId);
  const fin = PRINT_DATA.banner.finishings.find(f => f.id === selectedFinId);
  
  if (!mat || !fin || qty <= 0 || width <= 0 || height <= 0) return null;
  
  const sqft = width * height;
  const totalSqFt = sqft * qty;
  
  // Base raw material cost
  const rawPricePerSqFt = baseSqFtPrice * mat.multiplier;
  const totalRawCost = rawPricePerSqFt * totalSqFt;
  
  // Finishes cost
  const totalFinishingCost = fin.unitCost * qty;
  
  // Determine wholesale discount based on total SQFT
  let discountRate = 0;
  for (const tier of PRINT_DATA.banner.discountTiers) {
    if (totalSqFt <= tier.maxSqFt) {
      discountRate = 1 - tier.discountMultiplier;
      break;
    }
  }
  
  const discountedRawCost = totalRawCost * (1 - discountRate);
  const finalPrice = discountedRawCost + totalFinishingCost;
  
  return {
    sqft,
    totalRawCost,
    totalFinishingCost,
    discountRate,
    finalPrice,
    unitPrice: finalPrice / qty,
    width,
    height,
    qty,
    materialName: mat.name,
    finishingName: fin.name
  };
}

function calculateBannerPrice() {
  const qty = parseInt(document.getElementById('banner-qty').value) || 0;
  const res = getBannerPriceForQty(qty);
  
  if (!res) return;
  
  // Update UI Labels
  document.getElementById('lbl-banner-sqft').innerText = `${res.sqft.toFixed(2)} sqft`;
  document.getElementById('lbl-banner-base').innerText = `RM ${res.totalRawCost.toFixed(2)}`;
  document.getElementById('lbl-banner-finishing').innerText = `RM ${res.totalFinishingCost.toFixed(2)}`;
  document.getElementById('lbl-banner-discount').innerText = `${(res.discountRate * 100).toFixed(0)}%`;
  document.getElementById('lbl-banner-total').innerText = `RM ${res.finalPrice.toFixed(2)}`;
  document.getElementById('lbl-banner-unit').innerText = `RM ${res.unitPrice.toFixed(2)} / unit`;
  
  // Ready Date: 1 Business Day
  document.getElementById('lbl-banner-ready-date').innerText = calculateReadyDate(1);
  
  // Update Visualizer
  document.getElementById('visual-banner-text').innerText = `${res.width}' x ${res.height}'`;
  document.getElementById('visual-banner-w').innerText = `${res.width} kaki`;
  document.getElementById('visual-banner-h').innerText = `${res.height} kaki`;
  
  const visualEl = document.getElementById('visual-banner');
  const ratio = res.width / res.height;
  if (ratio > 1) { // Landscape
    visualEl.style.width = '170px';
    visualEl.style.height = `${Math.max(40, Math.min(100, 170 / ratio))}px`;
  } else { // Portrait
    visualEl.style.height = '140px';
    visualEl.style.width = `${Math.max(40, Math.min(120, 140 * ratio))}px`;
  }
  
  // Cache state
  state.banner.calculated = res;
  
  // Render Comparison Grid (Excard style)
  renderComparisonGrid('banner', qty);
}

// ==========================================================================
// GENERAL PRINTING COST CALCULATOR
// ==========================================================================
function initGeneralForm() {
  const pSelect = document.getElementById('general-product');
  pSelect.innerHTML = PRINT_DATA.generalPrint.products.map(p => 
    `<option value="${p.id}">${p.name}</option>`
  ).join('');
  
  const mSelect = document.getElementById('general-material');
  mSelect.innerHTML = PRINT_DATA.generalPrint.materials.map(m => 
    `<option value="${m.id}">${m.name}</option>`
  ).join('');
  
  const sSelect = document.getElementById('general-sides');
  sSelect.innerHTML = PRINT_DATA.generalPrint.sides.map(s => 
    `<option value="${s.id}">${s.name}</option>`
  ).join('');
  
  const cSelect = document.getElementById('general-color');
  cSelect.innerHTML = PRINT_DATA.generalPrint.colorTypes.map(c => 
    `<option value="${c.id}">${c.name}</option>`
  ).join('');
  
  // Render finishing checkbox card list
  const fGrid = document.getElementById('general-finishings-list');
  fGrid.innerHTML = PRINT_DATA.generalPrint.finishings.map(f => `
    <div class="finishing-card" id="fin-card-${f.id}" onclick="toggleGeneralFinishing('${f.id}')">
      <input type="checkbox" id="chk-fin-${f.id}" value="${f.id}" onclick="event.stopPropagation(); toggleGeneralFinishing('${f.id}', true);">
      <div class="finishing-card-content">
        <span class="finishing-card-title">${f.name}</span>
        <span class="finishing-card-desc">${f.description} (RM ${f.baseUnitCost.toFixed(2)})</span>
      </div>
    </div>
  `).join('');
  
  updateGeneralProductInfo();
}

function toggleGeneralFinishing(finId, isCheckboxClick) {
  const chk = document.getElementById(`chk-fin-${finId}`);
  const card = document.getElementById(`fin-card-${finId}`);
  
  if (!isCheckboxClick) {
    chk.checked = !chk.checked;
  }
  
  if (chk.checked) {
    card.classList.add('active');
  } else {
    card.classList.remove('active');
  }
  
  calculateGeneralPrice();
}

function updateGeneralProductInfo() {
  const productId = document.getElementById('general-product').value;
  const prod = PRINT_DATA.generalPrint.products.find(p => p.id === productId);
  if (prod) {
    document.getElementById('general-product-desc').innerText = prod.description;
    
    // Update quantity label and minimums
    const qtyInput = document.getElementById('general-qty');
    qtyInput.min = prod.minQty;
    if (parseInt(qtyInput.value) < prod.minQty) {
      qtyInput.value = prod.minQty;
    }
    
    document.getElementById('lbl-general-qty-heading').innerText = `Kuantiti (${prod.unitLabel})`;
    
    // Conditional display of premium finishings (Excard style) - only for Business Card
    const finContainer = document.getElementById('general-finishing-container');
    if (productId === 'business_card') {
      finContainer.style.display = 'block';
    } else {
      finContainer.style.display = 'none';
      // Reset checkboxes
      document.querySelectorAll('#general-finishings-list input[type="checkbox"]').forEach(chk => {
        chk.checked = false;
        document.getElementById(`fin-card-${chk.value}`).classList.remove('active');
      });
    }
    
    calculateGeneralPrice();
  }
}

function getGeneralPriceForQty(qty) {
  const productId = document.getElementById('general-product').value;
  const matId = document.getElementById('general-material').value;
  const sideId = document.getElementById('general-sides').value;
  const colorId = document.getElementById('general-color').value;
  const markupPercent = parseFloat(document.getElementById('general-markup').value) || 0;
  
  const prod = PRINT_DATA.generalPrint.products.find(p => p.id === productId);
  const mat = PRINT_DATA.generalPrint.materials.find(m => m.id === matId);
  const side = PRINT_DATA.generalPrint.sides.find(s => s.id === sideId);
  const color = PRINT_DATA.generalPrint.colorTypes.find(c => c.id === colorId);
  
  if (!prod || !mat || !side || !color || qty <= 0) return null;
  
  // Base cost calculation
  const totalBaseCost = prod.baseUnitCost * qty;
  const combinedMultiplier = mat.multiplier * side.multiplier * color.multiplier;
  const rawProductionCost = totalBaseCost * combinedMultiplier;
  
  // Calculate selected premium finishings (only for business card)
  let totalFinishingCost = 0;
  const selectedFinNames = [];
  if (productId === 'business_card') {
    document.querySelectorAll('#general-finishings-list input[type="checkbox"]:checked').forEach(chk => {
      const fin = PRINT_DATA.generalPrint.finishings.find(f => f.id === chk.value);
      if (fin) {
        totalFinishingCost += fin.baseUnitCost * qty;
        selectedFinNames.push(fin.name);
      }
    });
  }
  
  // Calculate quantity discount on production cost
  let discountRate = 0;
  for (const tier of PRINT_DATA.generalPrint.discountTiers) {
    if (qty <= tier.maxQty) {
      discountRate = 1 - tier.discountMultiplier;
      break;
    }
  }
  
  const productionCostWithDiscount = (rawProductionCost * (1 - discountRate)) + totalFinishingCost;
  
  // Operations logic: Sales markup
  const markupValue = productionCostWithDiscount * (markupPercent / 100);
  const proposedPrice = productionCostWithDiscount + markupValue;
  
  return {
    productionCost: productionCostWithDiscount,
    discountRate,
    markupValue,
    markupPercent,
    finalPrice: proposedPrice,
    unitPrice: proposedPrice / qty,
    qty,
    productName: prod.name,
    unitLabel: prod.unitLabel,
    materialName: mat.name,
    selectedFinNames
  };
}

function calculateGeneralPrice() {
  const qty = parseInt(document.getElementById('general-qty').value) || 0;
  const res = getGeneralPriceForQty(qty);
  
  if (!res) return;
  
  // Update Labels
  document.getElementById('lbl-general-production').innerText = `RM ${res.productionCost.toFixed(2)}`;
  document.getElementById('lbl-general-discount').innerText = `${(res.discountRate * 100).toFixed(0)}%`;
  document.getElementById('lbl-general-markup-cost').innerText = `RM ${res.markupValue.toFixed(2)}`;
  document.getElementById('lbl-general-total').innerText = `RM ${res.finalPrice.toFixed(2)}`;
  document.getElementById('lbl-general-unit').innerText = `RM ${res.unitPrice.toFixed(2)} / ${res.unitLabel.toLowerCase()}`;
  
  // Ready Date: 3 Business Days
  document.getElementById('lbl-general-ready-date').innerText = calculateReadyDate(3);
  
  // Visualizer
  document.getElementById('visual-general-text').innerText = res.productName.split(' (')[0];
  
  // Cache state
  state.general.calculated = res;
  
  // Render Comparison Grid (Excard style)
  renderComparisonGrid('general', qty);
}

// ==========================================================================
// EXCARD STYLE COMPARISON GRID RENDERER
// ==========================================================================
function renderComparisonGrid(tabId, currentQty) {
  let containerId = '';
  let getPriceFn = null;
  let unitLabel = '';
  let comparedQtys = [];
  
  if (tabId === 'sticker') {
    containerId = 'sticker-comparison-grid';
    getPriceFn = getStickerPriceForQty;
    unitLabel = 'pc';
    // Generate relative quantities based on currentQty
    comparedQtys = [
      Math.max(10, Math.round(currentQty * 0.25 / 10) * 10),
      Math.max(20, Math.round(currentQty * 0.5 / 10) * 10),
      currentQty,
      Math.round(currentQty * 2 / 50) * 50,
      Math.round(currentQty * 5 / 100) * 100,
      Math.round(currentQty * 10 / 100) * 100
    ];
  } else if (tabId === 'banner') {
    containerId = 'banner-comparison-grid';
    getPriceFn = getBannerPriceForQty;
    unitLabel = 'unit';
    comparedQtys = [
      1, 2, 5, 10, 20
    ];
    if (!comparedQtys.includes(currentQty)) {
      comparedQtys.push(currentQty);
    }
    comparedQtys.sort((a,b) => a-b);
  } else if (tabId === 'general') {
    containerId = 'general-comparison-grid';
    getPriceFn = getGeneralPriceForQty;
    const prodId = document.getElementById('general-product').value;
    const prod = PRINT_DATA.generalPrint.products.find(p => p.id === prodId);
    unitLabel = prod ? prod.unitLabel.toLowerCase() : 'unit';
    
    // For general printing, Excard style business cards standard volumes: 1, 2, 5, 10, 20, 50 boxes
    if (prodId === 'business_card') {
      comparedQtys = [1, 2, 5, 10, 20, 50];
    } else {
      comparedQtys = [100, 200, 500, 1000, 2000, 5000];
    }
    if (!comparedQtys.includes(currentQty)) {
      comparedQtys.push(currentQty);
    }
    comparedQtys.sort((a,b) => a-b);
  }
  
  // Deduplicate and filter out 0 or negative quantities
  comparedQtys = [...new Set(comparedQtys)].filter(q => q > 0);
  
  // Calculate price for current selection to use as baseline
  const baselineRes = getPriceFn(currentQty);
  if (!baselineRes) return;
  const baselineUnitPrice = baselineRes.unitPrice;
  
  let html = `
    <table class="comparison-table">
      <thead>
        <tr>
          <th>Kuantiti</th>
          <th>Harga Jualan</th>
          <th>Harga Seunit</th>
          <th>Penjimatan</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  comparedQtys.forEach(qty => {
    const res = getPriceFn(qty);
    if (!res) return;
    
    const isActive = qty === currentQty ? 'class="active"' : '';
    const diffPct = ((res.unitPrice - baselineUnitPrice) / baselineUnitPrice) * 100;
    
    let savingBadge = '';
    if (qty === currentQty) {
      savingBadge = `<span class="compare-save-badge" style="background-color: var(--primary-glow); color: var(--primary); border-color: var(--primary);">Pilihan</span>`;
    } else if (diffPct < -1) {
      savingBadge = `<span class="compare-save-badge">Jimat ${Math.abs(diffPct).toFixed(0)}%</span>`;
    } else if (diffPct > 1) {
      savingBadge = `<span class="compare-save-badge" style="background-color: hsla(355, 85%, 55%, 0.1); color: var(--danger); border-color: hsla(355, 85%, 55%, 0.15);">+${diffPct.toFixed(0)}%</span>`;
    } else {
      savingBadge = `<span class="compare-save-badge" style="background-color: hsla(220, 15%, 65%, 0.1); color: var(--text-muted); border-color: hsla(220, 15%, 65%, 0.15);">-</span>`;
    }
    
    html += `
      <tr ${isActive} style="cursor: pointer;" onclick="updateQtyAndRecalculate('${tabId}', ${qty})">
        <td><strong>${qty}</strong> ${unitLabel}</td>
        <td>RM ${res.finalPrice.toFixed(2)}</td>
        <td>RM ${res.unitPrice.toFixed(3)}</td>
        <td>${savingBadge}</td>
      </tr>
    `;
  });
  
  html += `
      </tbody>
    </table>
  `;
  
  document.getElementById(containerId).innerHTML = html;
}

function updateQtyAndRecalculate(tabId, qty) {
  if (tabId === 'sticker') {
    document.getElementById('sticker-qty').value = qty;
    calculateStickerPrice();
  } else if (tabId === 'banner') {
    document.getElementById('banner-qty').value = qty;
    calculateBannerPrice();
  } else if (tabId === 'general') {
    document.getElementById('general-qty').value = qty;
    calculateGeneralPrice();
  }
  showToast(`Kuantiti dikemas kini ke ${qty}!`, 'info');
}

// ==========================================================================
// SALES & OPERATIONS SIMULATION RECORD SYSTEM
// ==========================================================================
function saveQuotation(typeName) {
  let quoteData = null;
  
  if (state.activeTab === 'sticker') {
    quoteData = state.sticker.calculated;
  } else if (state.activeTab === 'banner') {
    quoteData = state.banner.calculated;
  } else if (state.activeTab === 'general') {
    quoteData = state.general.calculated;
  }
  
  if (!quoteData) {
    showToast('Ralat: Pengiraan tidak lengkap!', 'danger');
    return;
  }
  
  // Add to local state list
  const record = {
    id: 'Q-' + Math.floor(100000 + Math.random() * 900000),
    type: typeName,
    date: new Date().toLocaleTimeString(),
    qty: quoteData.qty,
    price: quoteData.finalPrice,
    margin: state.activeTab === 'general' ? quoteData.markupPercent : 40 // Default margin if sticker/banner
  };
  
  state.stats.savedQuotes.push(record);
  
  // Recalculate Dashboard statistics
  state.stats.calculationsCount = state.stats.savedQuotes.length;
  state.stats.totalQuotationValue = state.stats.savedQuotes.reduce((acc, q) => acc + q.price, 0);
  
  const sumMargin = state.stats.savedQuotes.reduce((acc, q) => acc + q.margin, 0);
  const avgMargin = sumMargin / state.stats.savedQuotes.length;
  
  // Update dashboard metric cards with cool animation
  animateValue('stat-calculations', parseInt(document.getElementById('stat-calculations').innerText), state.stats.calculationsCount, 300);
  animatePrice('stat-total-value', parseFloat(document.getElementById('stat-total-value').innerText.replace('RM ', '')) || 0, state.stats.totalQuotationValue, 300);
  document.getElementById('stat-avg-margin').innerText = `${avgMargin.toFixed(1)}%`;
  
  showToast(`Sebut harga ${record.id} berjaya direkodkan!`);
}

// Helper animation for counts
function animateValue(id, start, end, duration) {
  const obj = document.getElementById(id);
  if (start === end) return;
  const range = end - start;
  let current = start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / range)) || 20;
  const timer = setInterval(() => {
    current += increment;
    obj.innerText = current;
    if (current == end) {
      clearInterval(timer);
    }
  }, stepTime);
}

// Helper animation for prices
function animatePrice(id, start, end, duration) {
  const obj = document.getElementById(id);
  const startTimestamp = performance.now();
  const step = (timestamp) => {
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = progress * (end - start) + start;
    obj.innerText = `RM ${value.toFixed(2)}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Print Quotation helper
function printQuotation() {
  let quote = null;
  let specHTML = '';
  
  if (state.activeTab === 'sticker') {
    quote = state.sticker.calculated;
    specHTML = `
      <p><strong>Bentuk:</strong> ${quote.shapeName}</p>
      <p><strong>Saiz Sticker:</strong> ${quote.width}${quote.unit} x ${quote.height}${quote.unit} (${(quote.width * (quote.unit === 'inch' ? 2.54 : quote.unit === 'mm' ? 0.1 : 1)).toFixed(1)} x  ${(quote.height * (quote.unit === 'inch' ? 2.54 : quote.unit === 'mm' ? 0.1 : 1)).toFixed(1)} cm)</p>
      <p><strong>Bahan:</strong> ${quote.materialName}</p>
      <p><strong>Susunan:</strong> ${quote.stickersPerSheet} pcs sehelai (Kertas 12" x 19")</p>
      <p><strong>Jumlah Helaian:</strong> ${quote.sheetsNeeded} helai</p>
      <p><strong>Laminasi / Potong:</strong> ${document.getElementById('sticker-lamination').options[document.getElementById('sticker-lamination').selectedIndex].text} / ${document.getElementById('sticker-cutting').options[document.getElementById('sticker-cutting').selectedIndex].text}</p>
      <p><strong>Tarikh Jangka Siap:</strong> ${calculateReadyDate(2)}</p>
    `;
  } else if (state.activeTab === 'banner') {
    quote = state.banner.calculated;
    specHTML = `
      <p><strong>Saiz:</strong> ${quote.width}' x ${quote.height}' (${quote.sqft.toFixed(2)} sqft)</p>
      <p><strong>Bahan:</strong> ${quote.materialName}</p>
      <p><strong>Kemasan:</strong> ${quote.finishingName}</p>
      <p><strong>Tarikh Jangka Siap:</strong> ${calculateReadyDate(1)}</p>
    `;
  } else if (state.activeTab === 'general') {
    quote = state.general.calculated;
    const listFinishings = quote.selectedFinNames.length > 0 ? quote.selectedFinNames.join(', ') : 'Tiada';
    specHTML = `
      <p><strong>Produk:</strong> ${quote.productName}</p>
      <p><strong>Bahan Kertas:</strong> ${quote.materialName}</p>
      <p><strong>Muka:</strong> ${document.getElementById('general-sides').options[document.getElementById('general-sides').selectedIndex].text}</p>
      <p><strong>Warna:</strong> ${document.getElementById('general-color').options[document.getElementById('general-color').selectedIndex].text}</p>
      <p><strong>Kemasan Premium:</strong> ${listFinishings}</p>
      <p><strong>Tarikh Jangka Siap:</strong> ${calculateReadyDate(3)}</p>
    `;
  }
  
  if (!quote) return;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Sebut Harga Rasmi - Printiums Calculator</title>
        <style>
          body { font-family: 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .container { max-width: 650px; margin: auto; border: 1px solid #ddd; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
          .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .logo { font-size: 24px; font-weight: 700; color: #1a73e8; }
          h2 { margin-top: 0; }
          .specifications { background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #1a73e8; }
          .specifications p { margin: 6px 0; font-size: 14px; }
          .total-row { font-size: 20px; font-weight: bold; border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px; display: flex; justify-content: space-between; }
          .footer { margin-top: 40px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
          .btn-print-now { background-color: #1a73e8; color: white; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer; border-radius: 4px; display: block; margin: 20px auto 0 auto; }
          @media print { .btn-print-now { display: none; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Printiums Calculator</div>
            <div style="text-align: right; font-size: 13px;">Tarikh: ${new Date().toLocaleDateString('ms-MY')}</div>
          </div>
          <h2>Sebut Harga Rasmi Cetakan</h2>
          <p>Terima kasih kerana memilih Printiums Calculator. Berikut adalah perincian kos yang telah dijana secara automatik:</p>
          
          <div class="specifications">
            <strong>Spesifikasi Produk:</strong>
            ${specHTML}
            <p><strong>Kuantiti:</strong> ${quote.qty}</p>
          </div>
          
          <div class="total-row">
            <span>Anggaran Harga Jualan (SST 0%):</span>
            <span style="color: #1a73e8;">RM ${quote.finalPrice.toFixed(2)}</span>
          </div>
          <p style="font-size: 13px; color: #666; margin-top: 10px;">Purata harga seunit: RM ${quote.unitPrice.toFixed(3)}</p>
          
          <button class="btn-print-now" onclick="window.print()">Cetak Halaman Ini</button>
          
          <div class="footer">
            Sebut harga ini dihasilkan secara komputer oleh Enjin Printiums Calculator.
          </div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
}
