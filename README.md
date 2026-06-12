# CreatorLens AI — Social Media Performance Analyzer

**CreatorLens AI** adalah prototype web app berbasis **React, Vite, Tailwind CSS, dan Gemini API** untuk membantu **UMKM dan kreator kecil** memahami performa konten media sosial mereka. Aplikasi ini menganalisis data performa postingan seperti views, likes, comments, shares, saves, engagement rate, format konten, dan waktu posting, lalu menghasilkan insight serta rekomendasi strategi menggunakan bantuan AI.

Project ini dikembangkan sebagai prototype untuk tugas besar **AI For Real Impact 2026** dengan fokus pada pemanfaatan AI sebagai alat bantu analisis, bukan sebagai pengganti seluruh proses perhitungan.

---

## Daftar Isi

- [Latar Belakang](#latar-belakang)
- [Target Pengguna](#target-pengguna)
- [Fitur Utama](#fitur-utama)
- [Cara Kerja Sistem](#cara-kerja-sistem)
- [Peran AI dalam Aplikasi](#peran-ai-dalam-aplikasi)
- [Tech Stack](#tech-stack)
- [Struktur Folder](#struktur-folder)
- [Instalasi dan Menjalankan Project](#instalasi-dan-menjalankan-project)
- [Penggunaan Gemini API Key](#penggunaan-gemini-api-key)
- [Alur Penggunaan Aplikasi](#alur-penggunaan-aplikasi)
- [Rumus Analisis Lokal](#rumus-analisis-lokal)
- [Caching AI Insight](#caching-ai-insight)
- [Keamanan API Key](#keamanan-api-key)
- [Testing Manual](#testing-manual)
- [Batasan Prototype](#batasan-prototype)
- [Potensi Pengembangan](#potensi-pengembangan)
- [Catatan GitHub](#catatan-github)

---

## Latar Belakang

Banyak UMKM dan kreator kecil sudah menggunakan TikTok atau Instagram untuk promosi, tetapi belum tentu mampu membaca data performa konten secara strategis. Metrik seperti views, likes, comments, shares, saves, dan engagement rate sering hanya dilihat sebagai angka, bukan sebagai dasar pengambilan keputusan konten.

Akibatnya, strategi konten sering dilakukan secara trial-and-error. CreatorLens AI mencoba menjawab masalah tersebut melalui dashboard analisis sederhana dan AI Assistant yang dapat menjelaskan performa konten dalam bahasa yang lebih mudah dipahami.

---

## Target Pengguna

Aplikasi ini ditujukan untuk:

- UMKM yang menggunakan TikTok/Instagram sebagai media promosi.
- Kreator konten kecil yang ingin memahami performa postingan.
- Mahasiswa atau pelaku usaha kecil yang mengelola akun media sosial sendiri.
- Pengguna yang membutuhkan rekomendasi konten berbasis data sederhana.

---

## Fitur Utama

### 1. Dashboard Analisis Performa

Dashboard menampilkan ringkasan performa dari dataset postingan, termasuk:

- Creator Score
- Total posts
- Average views
- Average likes
- Average comments
- Average shares
- Average saves
- Average engagement rate
- Best post
- Worst post
- Best content type
- Best posting time

### 2. Local Analytics Engine

Perhitungan metrik utama dilakukan secara lokal menggunakan JavaScript melalui file:

```text
src/utils/analytics.js
```

Gemini tidak digunakan untuk menghitung angka utama. AI hanya digunakan untuk membuat narasi insight dan rekomendasi strategi berdasarkan hasil analisis lokal.

### 3. Sample Posts Dataset

Aplikasi menyediakan dataset awal berisi contoh postingan UMKM dan kreator kecil Indonesia melalui file:

```text
src/data/samplePosts.js
```

Dataset ini memungkinkan dashboard langsung menampilkan hasil analisis tanpa harus menunggu user memasukkan data dari nol.

### 4. Form Tambah Postingan

User dapat menambahkan data postingan baru melalui form pada halaman Analysis. Data yang dimasukkan akan memperbarui hasil analisis dashboard secara dinamis.

Field utama yang digunakan:

- Platform
- Username
- Content type
- Caption
- Date
- Time
- Views
- Likes
- Comments
- Shares
- Saves
- Duration

### 5. AI Insight

Aplikasi dapat menghasilkan insight naratif menggunakan Gemini API berdasarkan ringkasan analytics lokal. AI Insight menghasilkan:

- Headline performa
- Penjelasan insight
- 3 rekomendasi strategi konten

### 6. AI Assistant

AI Assistant berfungsi sebagai chatbot strategis yang membaca konteks data dashboard. User dapat bertanya, misalnya:

```text
Konten mana yang performanya paling baik?
Buatkan ide konten untuk postingan berikutnya.
Jam posting mana yang paling efektif?
Bagaimana cara meningkatkan engagement rate?
```

Jawaban AI dibuat berdasarkan summary performa konten yang sudah dihitung secara lokal.

### 7. Settings Page

Halaman Settings menyediakan fitur:

- Menyimpan Gemini API Key
- Menghapus Gemini API Key
- Membersihkan cache AI Insight
- Menampilkan status penyimpanan API key

---

## Cara Kerja Sistem

Alur kerja utama aplikasi:

```text
Sample posts / input postingan user
        ↓
Local analytics engine
        ↓
Ringkasan metrik performa
        ↓
Dashboard Analysis
        ↓
AI Insight / AI Assistant
        ↓
Gemini API menghasilkan narasi dan rekomendasi
```

Pembagian tanggung jawab sistem:

```text
JavaScript lokal:
- Menghitung engagement rate
- Menghitung creator score
- Menentukan best post
- Menentukan worst post
- Menentukan best content type
- Menentukan best posting time

Gemini API:
- Membuat narasi insight
- Memberikan rekomendasi strategi
- Menjawab pertanyaan user melalui AI Assistant
- Membantu menyusun ide konten, hook, dan caption
```

---

## Peran AI dalam Aplikasi

AI digunakan sebagai **asisten analisis dan rekomendasi**, bukan sebagai satu-satunya sumber perhitungan.

Peran Gemini API:

1. Mengubah ringkasan metrik menjadi insight yang mudah dipahami.
2. Memberikan rekomendasi strategi konten yang actionable.
3. Menjawab pertanyaan user berdasarkan data dashboard.
4. Membantu menyusun ide konten, hook, dan caption.

Perhitungan dasar tetap dilakukan secara deterministik oleh aplikasi agar hasil metrik lebih konsisten dan dapat dijelaskan.

---

## Tech Stack

Project ini menggunakan:

- **React** — library utama untuk membangun UI.
- **Vite** — development server dan build tool.
- **Tailwind CSS** — styling utility-first.
- **React Router DOM** — routing halaman.
- **Lucide React** — icon.
- **Recharts** — visualisasi/chart dashboard.
- **Gemini API** — AI insight dan AI assistant.
- **localStorage** — penyimpanan API key, data user, dan cache insight.

---

## Struktur Folder

Struktur utama project:

```text
creatorlens-ai-social-media-analyzer/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── data/
│   │   └── samplePosts.js
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   └── dashboard/
│   │       ├── AIAssistant.jsx
│   │       ├── Analysis.jsx
│   │       ├── Layout.jsx
│   │       └── Settings.jsx
│   ├── services/
│   │   └── geminiService.js
│   ├── utils/
│   │   ├── analytics.js
│   │   ├── cache.js
│   │   └── promptBuilder.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── PROJECT_REQUIREMENTS.md
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## Instalasi dan Menjalankan Project

### 1. Clone Repository

```bash
git clone <link-repository>
cd creatorlens-ai-social-media-analyzer
```

### 2. Install Dependency

```bash
npm install
```

Jika menggunakan PowerShell Windows dan muncul error terkait `npm.ps1`, gunakan:

```powershell
npm.cmd install
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Atau pada PowerShell Windows:

```powershell
npm.cmd run dev
```

### 4. Buka Aplikasi

Buka URL yang muncul di terminal, biasanya:

```text
http://localhost:5173/
```

---

## Script NPM

Script yang tersedia:

```bash
npm run dev
```

Menjalankan aplikasi dalam mode development.

```bash
npm run build
```

Membuat production build ke folder `dist/`.

```bash
npm run preview
```

Menjalankan preview dari hasil build.

```bash
npm run lint
```

Menjalankan ESLint untuk pengecekan kode.

---

## Penggunaan Gemini API Key

Fitur AI Insight dan AI Assistant membutuhkan Gemini API Key.

Langkah penggunaan:

1. Buka aplikasi.
2. Masuk ke halaman Login.
3. Masuk ke dashboard.
4. Buka halaman Settings.
5. Masukkan Gemini API Key.
6. Klik **Simpan API Key**.
7. Kembali ke halaman Analysis atau AI Assistant.

API key akan disimpan di browser melalui `localStorage`, bukan di source code.

Model yang digunakan pada project ini:

```text
gemini-3.1-flash-lite
```

Endpoint API dikelola melalui file:

```text
src/services/geminiService.js
```

API key dikirim melalui header:

```text
x-goog-api-key
```

---

## Alur Penggunaan Aplikasi

### 1. Landing Page

User membuka halaman awal yang menjelaskan fungsi CreatorLens AI sebagai dashboard analisis performa untuk UMKM dan kreator kecil.

### 2. Login Page

Login pada project ini bersifat simulasi untuk kebutuhan prototype. Setelah login, user diarahkan ke dashboard.

### 3. Analysis Dashboard

User melihat ringkasan performa konten berdasarkan sample data dan data tambahan yang dimasukkan.

### 4. Tambah Postingan

User dapat menambahkan data postingan baru. Setelah data disimpan, dashboard otomatis menghitung ulang metrik performa.

### 5. Generate AI Insight

User dapat menekan tombol AI Insight untuk mendapatkan ringkasan naratif dan rekomendasi strategi dari Gemini API.

### 6. AI Assistant

User dapat bertanya kepada AI Assistant mengenai performa konten, ide konten, caption, hook, atau strategi peningkatan engagement.

### 7. Settings

User dapat menyimpan atau menghapus Gemini API Key dan membersihkan cache analisis.

---

## Rumus Analisis Lokal

### Engagement Rate

```text
Engagement Rate = ((Likes + Comments + Shares + Saves) / Views) × 100
```

Jika views bernilai 0, engagement rate dikembalikan sebagai 0 untuk menghindari pembagian dengan nol.

### Performance Classification

Klasifikasi performa berdasarkan engagement rate:

```text
ER > 8%           = High Performance
4% <= ER <= 8%    = Medium Performance
ER < 4%           = Low Performance
```

### Creator Score

Creator Score dihitung dari tiga komponen utama:

```text
Creator Score = Engagement Component + Consistency Component + Views Component
```

Komponen yang digunakan:

- Engagement Rate: maksimal 60 poin
- Konsistensi jumlah postingan: maksimal 20 poin
- Average views: maksimal 20 poin

Hasil akhir dibatasi dalam rentang 0–100.

---

## Caching AI Insight

Project ini menggunakan caching lokal untuk hasil AI Insight melalui file:

```text
src/utils/cache.js
```

Cache disimpan di `localStorage` dengan prefix:

```text
creatorlens_insight_cache_
```

Durasi cache:

```text
24 jam
```

Tujuan caching:

- Mengurangi request berulang ke Gemini API.
- Menghemat kuota API.
- Mempercepat pemuatan insight jika data belum berubah.

Cache key dibuat berdasarkan ringkasan data utama seperti:

- Total posts
- Average views
- Average engagement rate

Jika data berubah, cache key juga berubah sehingga AI Insight dapat dihasilkan ulang.

---

## Keamanan API Key

Pada prototype ini, API key tidak ditulis langsung di source code. API key dimasukkan oleh user melalui halaman Settings dan disimpan di browser.

Hal yang perlu diperhatikan:

- Jangan menuliskan API key langsung di file `.js`, `.jsx`, `.md`, atau `.env` yang di-upload.
- Jangan commit file `.env` atau `.env.local`.
- Jangan membagikan API key pribadi ke repository publik.
- Penyimpanan API key di `localStorage` hanya cocok untuk prototype/demo.
- Untuk production, pemanggilan Gemini API sebaiknya dipindahkan ke backend.

---

## Testing Manual

### 1. Cek Dashboard

1. Jalankan aplikasi.
2. Buka halaman Analysis.
3. Pastikan Creator Score, Average Views, Average Engagement, Best Post, dan Best Content Type tampil.
4. Tambahkan postingan baru.
5. Pastikan metrik dashboard berubah.

### 2. Cek Gemini API Key

1. Buka halaman Settings.
2. Masukkan Gemini API Key.
3. Klik Simpan API Key.
4. Refresh halaman.
5. Pastikan API key tetap tersimpan di browser.

### 3. Cek AI Insight

1. Buka halaman Analysis.
2. Klik Generate AI Insight.
3. Pastikan insight dan rekomendasi muncul.
4. Klik lagi dengan data yang sama.
5. Buka Console atau Network tab untuk memastikan hasil dapat diambil dari cache.

### 4. Cek AI Assistant

1. Buka halaman AI Assistant.
2. Tanyakan:

```text
Konten mana yang performanya paling baik?
```

3. Pastikan jawaban AI menyebut data performa seperti best post, engagement rate, atau format konten terbaik.

### 5. Cek Build

Jalankan:

```bash
npm run build
```

Jika berhasil, Vite akan membuat folder:

```text
dist/
```

Folder `dist/` tidak perlu di-upload ke GitHub karena dapat dibuat ulang kapan saja.

---

## Batasan Prototype

Project ini masih berupa prototype, sehingga memiliki beberapa batasan:

- Data performa konten masih berasal dari sample data dan input manual.
- Belum terhubung langsung dengan API TikTok atau Instagram.
- Belum memiliki backend atau database eksternal.
- API key masih disimpan di browser melalui localStorage.
- AI Assistant belum menggunakan caching percakapan khusus.
- Export PDF belum menjadi fitur production-ready.
- Upload CSV belum tersedia.
- Login masih bersifat simulasi untuk alur prototype.

---

## Potensi Pengembangan

Pengembangan lanjutan yang dapat dilakukan:

- Integrasi langsung dengan TikTok/Instagram API.
- Upload data performa melalui CSV.
- Export laporan analisis ke PDF.
- Backend untuk penyimpanan data dan keamanan API key.
- Database untuk menyimpan histori performa akun.
- Content planner mingguan berbasis AI.
- Analisis kategori konten seperti edukasi, promosi, storytelling, testimoni, dan behind the scene.
- Multi-user authentication.
- Deployment ke Vercel, Netlify, atau GitHub Pages.

---

## Catatan GitHub

File/folder yang sebaiknya di-upload:

```text
public/
src/
.gitignore
PROJECT_REQUIREMENTS.md
README.md
eslint.config.js
index.html
package-lock.json
package.json
postcss.config.js
tailwind.config.js
vite.config.js
```

File/folder yang tidak perlu di-upload:

```text
node_modules/
dist/
.env
.env.local
API key pribadi
```

Pastikan `.gitignore` memuat aturan berikut:

```gitignore
node_modules/
dist/
.env
.env.local
.env.*.local
```

---

## Status Project

Status saat ini:

- Dashboard analytics berjalan secara lokal.
- Gemini API sudah terintegrasi.
- Model Gemini yang digunakan adalah `gemini-3.1-flash-lite`.
- API key tidak hardcoded.
- AI Insight sudah menggunakan caching 24 jam.
- AI Assistant sudah menggunakan konteks data dashboard.
- Project dapat dijalankan dengan `npm run dev`.
- Project dapat di-build dengan `npm run build`.

---

## Lisensi

Project ini dibuat untuk kebutuhan akademik/prototype. Lisensi dapat disesuaikan kembali jika repository akan dikembangkan lebih lanjut.
