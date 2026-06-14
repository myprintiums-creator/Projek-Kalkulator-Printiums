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
  
  // Align sticker labels with the default unit (inch)
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
  document.getElementById('lbl-sticker-width').innerText = `Lebar (${unit})`;
  document.getElementById('lbl-sticker-height').innerText = `Tinggi (${unit})`;
}

function calculateStickerPrice() {
  const width = parseFloat(document.getElementById('sticker-width').value) || 0;
  const height = parseFloat(document.getElementById('sticker-height').value) || 0;
  const qty = parseInt(document.getElementById('sticker-qty').value) || 0;
  const unit = document.getElementById('sticker-unit').value;
  
  const selectedMatId = document.getElementById('sticker-material').value;
  const selectedLamId = document.getElementById('sticker-lamination').value;
  const selectedCutId = document.getElementById('sticker-cutting').value;
  const shapeId = state.sticker.shape;
  
  // Convert chosen unit to mm for layout fitting
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
  
  // Printable area dimensions in mm (A3+ sheet size 304.8 x 482.6 mm minus margins)
  const printAreaW = 294;
  const printAreaH = 472;
  const gap = selectedCutId === 'kiss_cut' ? 2 : 4; // 2mm gap for kiss-cut, 4mm gap for die-cut
  
  // Fit calculation: Normal Orientation
  const cols = Math.floor((printAreaW + gap) / (wMm + gap));
  const rows = Math.floor((printAreaH + gap) / (hMm + gap));
  const totalNormal = cols > 0 && rows > 0 ? cols * rows : 0;
  
  // Fit calculation: Rotated Orientation
  const colsRot = Math.floor((printAreaW + gap) / (hMm + gap));
  const rowsRot = Math.floor((printAreaH + gap) / (wMm + gap));
  const totalRotated = colsRot > 0 && rowsRot > 0 ? colsRot * rowsRot : 0;
  
  const stickersPerSheet = Math.max(totalNormal, totalRotated);
  
  // Handle case where sticker is too big
  if (stickersPerSheet <= 0 || wMm <= 0 || hMm <= 0) {
    document.getElementById('lbl-sticker-per-sheet').innerText = "Tidak Muat!";
    document.getElementById('lbl-sticker-sheets-needed').innerText = "-";
    document.getElementById('lbl-sticker-base').innerText = "RM 0.00";
    document.getElementById('lbl-sticker-finishing').innerText = "RM 0.00";
    document.getElementById('lbl-sticker-discount').innerText = "0%";
    document.getElementById('lbl-sticker-total').innerText = "RM 0.00";
    document.getElementById('lbl-sticker-unit').innerText = "RM 0.000 / pc";
    return;
  }
  
  const sheetsNeeded = Math.ceil(qty / stickersPerSheet);
  
  // Get data values
  const setupCost = PRINT_DATA.sticker.baseSetupCost;
  const basePricePerSheet = PRINT_DATA.sticker.basePricePerSheet;
  
  const shape = PRINT_DATA.sticker.shapes.find(s => s.id === shapeId);
  const mat = PRINT_DATA.sticker.materials.find(m => m.id === selectedMatId);
  const lam = PRINT_DATA.sticker.laminations.find(l => l.id === selectedLamId);
  const cut = PRINT_DATA.sticker.cuttings.find(c => c.id === selectedCutId);
  
  if (!shape || !mat || !lam || !cut || qty <= 0) return;
  
  const shapeMultiplier = shape.multiplier;
  const materialMultiplier = mat.multiplier;
  const laminationPricePerSheet = lam.pricePerSheet;
  const cuttingCostPerSticker = cut.baseCostPerPcs;
  
  // Sheet-based print cost
  const rawPricePerSheet = basePricePerSheet * shapeMultiplier * materialMultiplier;
  const totalRawPrintCost = rawPricePerSheet * sheetsNeeded;
  
  // Lamination & Cutting cost
  const totalLaminationCost = laminationPricePerSheet * sheetsNeeded;
  const totalCuttingCost = cuttingCostPerSticker * qty;
  const totalFinishingCost = totalLaminationCost + totalCuttingCost;
  
  const totalProductionCost = totalRawPrintCost + totalLaminationCost; // base material + print + lamination
  
  // Determine wholesale discount based on number of sheetsNeeded
  let discountRate = 0;
  for (const tier of PRINT_DATA.sticker.discountTiers) {
    if (sheetsNeeded <= tier.maxSheets) {
      discountRate = 1 - tier.discountMultiplier;
      break;
    }
  }
  
  const discountedProductionCost = totalProductionCost * (1 - discountRate);
  const finalPrice = discountedProductionCost + totalCuttingCost + setupCost;
  const unitPrice = finalPrice / qty;
  
  // Update UI Labels
  document.getElementById('lbl-sticker-setup').innerText = `RM ${setupCost.toFixed(2)}`;
  document.getElementById('lbl-sticker-per-sheet').innerText = `${stickersPerSheet} pcs`;
  document.getElementById('lbl-sticker-sheets-needed').innerText = `${sheetsNeeded} helai`;
  document.getElementById('lbl-sticker-base').innerText = `RM ${totalRawPrintCost.toFixed(2)}`;
  document.getElementById('lbl-sticker-finishing').innerText = `RM ${totalFinishingCost.toFixed(2)}`;
  document.getElementById('lbl-sticker-discount').innerText = `${(discountRate * 100).toFixed(0)}%`;
  document.getElementById('lbl-sticker-total').innerText = `RM ${finalPrice.toFixed(2)}`;
  document.getElementById('lbl-sticker-unit').innerText = `RM ${unitPrice.toFixed(3)} / pc`;
  
  // Update Visualizer
  const wCm = wMm / 10;
  const hCm = hMm / 10;
  document.getElementById('visual-sticker-text').innerText = `${wCm.toFixed(1)} x ${hCm.toFixed(1)} cm`;
  document.getElementById('visual-sticker-w').innerText = `${width}${unit}`;
  document.getElementById('visual-sticker-h').innerText = `${height}${unit}`;
  
  // Cache current values on state for saving quotes
  state.sticker.calculated = {
    setupCost,
    totalProductionCost: discountedProductionCost + totalCuttingCost,
    discountRate,
    finalPrice,
    unitPrice,
    width,
    height,
    unit,
    qty,
    stickersPerSheet,
    sheetsNeeded,
    materialName: mat.name,
    shapeName: shape.name
  };
}

// ==========================================================================
// BANNER CALCULATOR
// ==========================================================================
function initBannerForm() {
  // 1. Materials
  const matSelect = document.getElementById('banner-material');
  matSelect.innerHTML = PRINT_DATA.banner.materials.map(m => 
    `<option value="${m.id}">${m.name}</option>`
  ).join('');
  
  // 2. Finishings
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

function calculateBannerPrice() {
  const width = parseFloat(document.getElementById('banner-width').value) || 0;
  const height = parseFloat(document.getElementById('banner-height').value) || 0;
  const qty = parseInt(document.getElementById('banner-qty').value) || 0;
  
  const selectedMatId = document.getElementById('banner-material').value;
  const selectedFinId = document.getElementById('banner-finishing').value;
  
  const baseSqFtPrice = PRINT_DATA.banner.basePricePerSqFt;
  const mat = PRINT_DATA.banner.materials.find(m => m.id === selectedMatId);
  const fin = PRINT_DATA.banner.finishings.find(f => f.id === selectedFinId);
  
  if (!mat || !fin || qty <= 0 || width <= 0 || height <= 0) return;
  
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
  const unitPrice = finalPrice / qty;
  
  // Update UI Labels
  document.getElementById('lbl-banner-sqft').innerText = `${sqft.toFixed(2)} sqft`;
  document.getElementById('lbl-banner-base').innerText = `RM ${totalRawCost.toFixed(2)}`;
  document.getElementById('lbl-banner-finishing').innerText = `RM ${totalFinishingCost.toFixed(2)}`;
  document.getElementById('lbl-banner-discount').innerText = `${(discountRate * 100).toFixed(0)}%`;
  document.getElementById('lbl-banner-total').innerText = `RM ${finalPrice.toFixed(2)}`;
  document.getElementById('lbl-banner-unit').innerText = `RM ${unitPrice.toFixed(2)} / unit`;
  
  // Update Visualizer
  document.getElementById('visual-banner-text').innerText = `${width}' x ${height}'`;
  document.getElementById('visual-banner-w').innerText = `${width} kaki`;
  document.getElementById('visual-banner-h').innerText = `${height} kaki`;
  
  // Update aspect ratio of banner preview dynamically
  const visualEl = document.getElementById('visual-banner');
  const ratio = width / height;
  if (ratio > 1) { // Landscape
    visualEl.style.width = '170px';
    visualEl.style.height = `${Math.max(40, Math.min(100, 170 / ratio))}px`;
  } else { // Portrait
    visualEl.style.height = '140px';
    visualEl.style.width = `${Math.max(40, Math.min(120, 140 * ratio))}px`;
  }
  
  // Cache state for quotation saving
  state.banner.calculated = {
    sqft,
    totalRawCost,
    totalFinishingCost,
    discountRate,
    finalPrice,
    unitPrice,
    width,
    height,
    qty,
    materialName: mat.name,
    finishingName: fin.name
  };
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
  
  updateGeneralProductInfo();
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
  }
}

function calculateGeneralPrice() {
  const productId = document.getElementById('general-product').value;
  const matId = document.getElementById('general-material').value;
  const sideId = document.getElementById('general-sides').value;
  const colorId = document.getElementById('general-color').value;
  const qty = parseInt(document.getElementById('general-qty').value) || 0;
  const markupPercent = parseFloat(document.getElementById('general-markup').value) || 0;
  
  const prod = PRINT_DATA.generalPrint.products.find(p => p.id === productId);
  const mat = PRINT_DATA.generalPrint.materials.find(m => m.id === matId);
  const side = PRINT_DATA.generalPrint.sides.find(s => s.id === sideId);
  const color = PRINT_DATA.generalPrint.colorTypes.find(c => c.id === colorId);
  
  if (!prod || !mat || !side || !color || qty <= 0) return;
  
  // Enforce minimum order quantity
  if (qty < prod.minQty) {
    document.getElementById('general-qty').value = prod.minQty;
    return calculateGeneralPrice();
  }
  
  // Base cost calculation
  const totalBaseCost = prod.baseUnitCost * qty;
  const combinedMultiplier = mat.multiplier * side.multiplier * color.multiplier;
  const rawProductionCost = totalBaseCost * combinedMultiplier;
  
  // Calculate quantity discount on production cost
  let discountRate = 0;
  for (const tier of PRINT_DATA.generalPrint.discountTiers) {
    if (qty <= tier.maxQty) {
      discountRate = 1 - tier.discountMultiplier;
      break;
    }
  }
  
  const productionCostWithDiscount = rawProductionCost * (1 - discountRate);
  
  // Operations logic: Sales markup
  const markupValue = productionCostWithDiscount * (markupPercent / 100);
  const proposedPrice = productionCostWithDiscount + markupValue;
  const unitPrice = proposedPrice / qty;
  
  // Update Labels
  document.getElementById('lbl-general-production').innerText = `RM ${productionCostWithDiscount.toFixed(2)}`;
  document.getElementById('lbl-general-discount').innerText = `${(discountRate * 100).toFixed(0)}%`;
  document.getElementById('lbl-general-markup-cost').innerText = `RM ${markupValue.toFixed(2)}`;
  document.getElementById('lbl-general-total').innerText = `RM ${proposedPrice.toFixed(2)}`;
  document.getElementById('lbl-general-unit').innerText = `RM ${unitPrice.toFixed(2)} / ${prod.unitLabel.toLowerCase()}`;
  
  // Visualizer
  document.getElementById('visual-general-text').innerText = prod.name.split(' (')[0];
  
  // Cache state for quotation saving
  state.general.calculated = {
    productionCost: productionCostWithDiscount,
    discountRate,
    markupValue,
    markupPercent,
    finalPrice: proposedPrice,
    unitPrice,
    qty,
    productName: prod.name,
    unitLabel: prod.unitLabel,
    materialName: mat.name
  };
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
      <p><strong>Saiz Sticker:</strong> ${quote.width}${quote.unit} x ${quote.height}${quote.unit} (${(quote.width * (quote.unit === 'inch' ? 2.54 : quote.unit === 'mm' ? 0.1 : 1)).toFixed(1)} x ${(quote.height * (quote.unit === 'inch' ? 2.54 : quote.unit === 'mm' ? 0.1 : 1)).toFixed(1)} cm)</p>
      <p><strong>Bahan:</strong> ${quote.materialName}</p>
      <p><strong>Susunan:</strong> ${quote.stickersPerSheet} pcs sehelai (Kertas 12" x 19")</p>
      <p><strong>Jumlah Helaian:</strong> ${quote.sheetsNeeded} helai</p>
      <p><strong>Laminasi / Potong:</strong> ${document.getElementById('sticker-lamination').options[document.getElementById('sticker-lamination').selectedIndex].text} / ${document.getElementById('sticker-cutting').options[document.getElementById('sticker-cutting').selectedIndex].text}</p>
    `;
  } else if (state.activeTab === 'banner') {
    quote = state.banner.calculated;
    specHTML = `
      <p><strong>Saiz:</strong> ${quote.width}' x ${quote.height}' (${quote.sqft.toFixed(2)} sqft)</p>
      <p><strong>Bahan:</strong> ${quote.materialName}</p>
      <p><strong>Kemasan:</strong> ${quote.finishingName}</p>
    `;
  } else if (state.activeTab === 'general') {
    quote = state.general.calculated;
    specHTML = `
      <p><strong>Produk:</strong> ${quote.productName}</p>
      <p><strong>Bahan Kertas:</strong> ${quote.materialName}</p>
      <p><strong>Muka:</strong> ${document.getElementById('general-sides').options[document.getElementById('general-sides').selectedIndex].text}</p>
      <p><strong>Warna:</strong> ${document.getElementById('general-color').options[document.getElementById('general-color').selectedIndex].text}</p>
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
