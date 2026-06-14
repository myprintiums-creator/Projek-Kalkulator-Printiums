# Printiums Calculator 🖨️✨

**Printiums Calculator** ialah sebuah sistem papan pemuka (dashboard) automasi sebut harga percetakan premium bertema gelap (*dark mode*) yang direka untuk jurujual dan pelanggan percetakan. Aplikasi ini membolehkan pengiraan kos secara pintar, dinamik, dan masa nyata (*real-time*) bagi produk pelekat (sticker), kain rentang (banner/bunting), dan cetakan am (kad perniagaan, risalah, dan buku).

---

## 🚀 Ciri-Ciri Utama

1. **Kalkulator Pelekat Pintar (Sticker)**
   - Berasaskan **sistem susunan helaian (*layout fitting*)** pada saiz kertas tetap **12" x 19" (A3+)**.
   - Mengira secara automatik susunan optimum (orientasi normal vs putar) bagi mengira bilangan pelekat individu sehelai dan helaian kertas yang diperlukan.
   - Pilihan bahan (Mirrorcoat, Simili, PP White, PP Transparent, OPVC) dan jenis laminasi serta potongan (*kiss-cut* / *die-cut*).
   - Diskaun bertingkat mengikut bilangan helaian.

2. **Kalkulator Banner & Bunting**
   - Pengiraan kos berdasarkan luas kaki persegi (sqft).
   - Pilihan kemasan (*finishing*) industri: Lubang cincin (*eyelets*), paip PVC, lisu pocket, atau potong bersih.
   - Diskaun volum luas cetakan.

3. **Kalkulator Cetakan Am & Margin Jualan**
   - Menyokong produk seperti Kad Perniagaan (100pcs/box), Risalah A4/A5, dan Buku/Booklet (Klip Tengah).
   - Slider khas untuk pelarasan **Tokokan Margin Keuntungan (Markup %)** secara masa nyata untuk operasi jualan.

4. **Penjanaan Quotation PDF**
   - Menjana dokumen sebut harga rasmi (*Official Quotation*) dengan susun atur yang kemas untuk dicetak atau disimpan sebagai PDF.

5. **Sistem Rekod Simulasi**
   - Merekodkan sebut harga yang dihasilkan secara langsung untuk mengemas kini kad statistik papan pemuka (Dashboard) secara masa nyata.

---

## 🛠️ Cara Menjalankan Projek Secara Tempatan

Projek ini dibina tanpa sebarang kebergantungan luaran (no external dependencies) demi kelajuan maksimum.

### Jalankan Menggunakan PowerShell (Windows):
Di dalam direktori projek, jalankan perintah berikut:
```powershell
powershell -ExecutionPolicy Bypass -File server.ps1
```
Buka pelayar web anda dan layari:
👉 **http://localhost:8085**

---

## 📁 Struktur Fail Projek

* `index.html` - Struktur utama papan pemuka dan borang input.
* `styles.css` - Reka bentuk premium bertema gelap, kesan *glassmorphism*, dan animasi.
* `data.js` - Pangkalan data harga, multiplier bahan, dan tangga diskaun borong.
* `app.js` - Enjin pengiraan matematik, simulasi margin, dan logik susun helaian.
* `server.ps1` - Skrip pelayan web PowerShell asli.
* `logo.png` - Imej logo penjenamaan Printiums.
