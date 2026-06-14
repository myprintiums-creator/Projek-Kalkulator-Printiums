/**
 * PrintEcosys AI - Price Database and Pricing Configurations
 * All prices are in Malaysian Ringgit (RM)
 */

const PRINT_DATA = {
  // 1. Sticker Pricing Configuration
  sticker: {
    baseSetupCost: 10.00, // RM
    basePricePerSheet: 4.50, // RM per 12" x 19" sheet (A3+ size)

    shapes: [
      { id: 'circle', name: 'Bulat (Circle)', multiplier: 1.0 },
      { id: 'square', name: 'Petak (Square)', multiplier: 1.0 },
      { id: 'rectangle', name: 'Segi Empat Tepat (Rectangle)', multiplier: 1.0 },
      { id: 'custom', name: 'Bentuk Khas (Custom Shape)', multiplier: 1.15 }
    ],

    materials: [
      { id: 'mirrorcoat', name: 'Mirrorcoat (Gloss Paper)', multiplier: 1.0, description: 'Sesuai untuk label produk kering, murah & berkilat.' },
      { id: 'simili', name: 'Simili Paper (Matte Paper)', multiplier: 0.9, description: 'Kertas biasa matte, boleh ditulis dengan pen.' },
      { id: 'pp_white', name: 'PP White (Sintetik Putih)', multiplier: 1.5, description: 'Kalis air, tahan koyak, kemasan putih premium.' },
      { id: 'pp_transparent', name: 'PP Transparent (Lutsinar)', multiplier: 1.8, description: 'Kalis air, lutsinar, sesuai untuk botol kaca/plastik.' },
      { id: 'opvc', name: 'OPVC Matte / Gloss (Kalis Air Lasak)', multiplier: 2.2, description: 'Sangat lasak, kalis air & kimia, tahan pudar.' }
    ],

    laminations: [
      { id: 'none', name: 'Tiada Laminasi (No Lamination)', pricePerSheet: 0 },
      { id: 'gloss', name: 'Gloss Lamination (Lancar Berkilat)', pricePerSheet: 1.20 },
      { id: 'matte', name: 'Matte Lamination (Premium Doff/Matte)', pricePerSheet: 1.50 }
    ],

    cuttings: [
      { id: 'kiss_cut', name: 'Kiss Cut (Lembaran/Sheet)', baseCostPerPcs: 0.02, description: 'Potong sticker sahaja, pelapik belakang kekal dalam helaian.' },
      { id: 'die_cut', name: 'Die Cut (Potong Sebiji-sebiji)', baseCostPerPcs: 0.08, description: 'Potong terus tembus sticker dan pelapik belakang menjadi kepingan individu.' }
    ],

    // Tier-based sheet discount structure (wholesale discount on sheets)
    discountTiers: [
      { maxSheets: 4, discountMultiplier: 1.00 },     // No discount
      { maxSheets: 19, discountMultiplier: 0.90 },    // 10% discount
      { maxSheets: 49, discountMultiplier: 0.82 },    // 18% discount
      { maxSheets: 99, discountMultiplier: 0.75 },    // 25% discount
      { maxSheets: Infinity, discountMultiplier: 0.65 } // 35% discount
    ]
  },

  // 2. Banner/Bunting Pricing Configuration
  banner: {
    basePricePerSqFt: 2.00, // RM per square foot

    materials: [
      { id: 'tarpaulin_300g', name: 'Tarpaulin Standard (300gsm)', multiplier: 1.0, description: 'Biasa digunakan untuk bunting luar bangunan jangka pendek.' },
      { id: 'tarpaulin_380g', name: 'Tarpaulin Sederhana (380gsm)', multiplier: 1.2, description: 'Lebih tebal dan tahan angin.' },
      { id: 'tarpaulin_440g', name: 'Tarpaulin Tebal Premium (440gsm)', multiplier: 1.5, description: 'Sangat tebal, tahan lasak & tidak mudah koyak.' },
      { id: 'yupo', name: 'Yupo Paper (Sintetik Lembut)', multiplier: 2.2, description: 'Kertas sintetik berkualiti tinggi, licin tanpa grid benang.' },
      { id: 'canvas', name: 'Canvas Premium Artist', multiplier: 3.5, description: 'Tekstur kain kanvas sebenar untuk cetakan seni / hiasan dinding.' }
    ],

    finishings: [
      { id: 'clean_cut', name: 'Potong Bersih (Clean Cut)', unitCost: 0, description: 'Dipotong rapat pada garisan sempadan cetakan.' },
      { id: 'eyelets', name: 'Lubang Cincin (Eyelets) - 4 Penjuru', unitCost: 2.00, description: '4 lubang besi diletakkan di setiap bucu untuk digantung.' },
      { id: 'pvc_pipe', name: 'Paip PVC & Tali (Atas & Bawah)', unitCost: 5.00, description: 'Sesuai untuk bunting tegak biasa digantung.' },
      { id: 'pocket', name: 'Lisu Pocket (3 inci Keliling)', unitCost: 3.00, description: 'Lebihan tarpaulin dilipat dan dijahit untuk dimasukkan kayu/paip sendiri.' }
    ],

    discountTiers: [
      { maxSqFt: 20, discountMultiplier: 1.00 },
      { maxSqFt: 50, discountMultiplier: 0.90 },
      { maxSqFt: 150, discountMultiplier: 0.82 },
      { maxSqFt: 499, discountMultiplier: 0.75 },
      { maxSqFt: Infinity, discountMultiplier: 0.65 }
    ]
  },

  // 3. Printing Cost Configuration (Cards, Flyers, Booklets)
  generalPrint: {
    products: [
      {
        id: 'business_card',
        name: 'Kad Perniagaan (Business Card - 100pcs/box)',
        baseUnitCost: 14.00,
        unitLabel: 'Kotak (Box)',
        minQty: 1,
        qtyMultiplier: 100, // 1 unit = 100pcs
        description: 'Saiz standard 90mm x 54mm, dibungkus dalam kotak plastik lutsinar.'
      },
      {
        id: 'flyer_a4',
        name: 'Risalah A4 (Flyer A4)',
        baseUnitCost: 0.45,
        unitLabel: 'Helai (Sheet)',
        minQty: 100,
        qtyMultiplier: 1,
        description: 'Sesuai untuk pengedaran maklumat produk atau promosi.'
      },
      {
        id: 'flyer_a5',
        name: 'Risalah A5 (Flyer A5)',
        baseUnitCost: 0.28,
        unitLabel: 'Helai (Sheet)',
        minQty: 100,
        qtyMultiplier: 1,
        description: 'Saiz separuh A4, sangat praktikal dan kos efektif.'
      },
      {
        id: 'booklet_a5',
        name: 'Buku/Risalah Booklet A5 (Klip Tengah)',
        baseUnitCost: 3.20,
        unitLabel: 'Buku (Book)',
        minQty: 10,
        qtyMultiplier: 1,
        description: 'Saddle stitch binding (klip tengah), saiz kemasan A5.'
      }
    ],

    materials: [
      { id: 'simili_80', name: 'Simili Paper 80gsm', multiplier: 0.8, description: 'Kertas biasa seperti kertas fotostat A4.' },
      { id: 'artpaper_128', name: 'Art Paper 128gsm', multiplier: 1.0, description: 'Kertas licin sedikit berkilat, standard untuk flyer.' },
      { id: 'artcard_260', name: 'Art Card 260gsm (Tebal)', multiplier: 1.3, description: 'Kad tebal berkilat sesuai untuk kad perniagaan & kulit buku.' },
      { id: 'artcard_310', name: 'Art Card 310gsm (Sangat Tebal)', multiplier: 1.5, description: 'Kad sangat keras premium untuk ketahanan maksimum.' }
    ],

    sides: [
      { id: 'single', name: '1 Sisi (Single Sided)', multiplier: 1.0 },
      { id: 'double', name: '2 Sisi (Double Sided)', multiplier: 1.6 }
    ],

    colorTypes: [
      { id: 'color', name: 'Berwarna Penuh (Full Color)', multiplier: 1.0 },
      { id: 'grayscale', name: 'Hitam Putih (Grayscale)', multiplier: 0.65 }
    ],

    discountTiers: [
      { maxQty: 4, discountMultiplier: 1.00 },
      { maxQty: 9, discountMultiplier: 0.95 },
      { maxQty: 49, discountMultiplier: 0.88 },
      { maxQty: 199, discountMultiplier: 0.80 },
      { maxQty: 999, discountMultiplier: 0.70 },
      { maxQty: Infinity, discountMultiplier: 0.55 }
    ]
  }
};
