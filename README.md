# Kreasia AI

**Kreasia AI** adalah asisten analisis performa media sosial berbasis kecerdasan buatan yang dirancang khusus untuk pelaku UMKM (*Usaha Mikro, Kecil, Menengah*) dan kreator konten kecil di Indonesia.

Aplikasi ini membantu pengguna menganalisis performa postingan Instagram & TikTok secara lokal, merumuskan metrik kinerja utama secara instan, serta menyusun narasi insight dan strategi konten lanjutan yang didukung oleh **Gemini AI API**.

---

## 🚀 Fitur Utama

1. **Local Analytics Engine**: Perhitungan *engagement rate*, skor kreator (*Creator Score*), identifikasi postingan terbaik/terburuk, format konten terpopuler, dan waktu posting terbaik dilakukan 100% secara lokal di sisi klien menggunakan JavaScript murni.
2. **Secure API Key Handling**: Integrasi dengan Google Gemini AI API dilakukan dengan mengirimkan API Key secara aman melalui header HTTP `x-goog-api-key` daripada menggunakan parameter query URL yang berisiko ter-log di sisi server atau proxy.
3. **Smart Caching Layer**: Menggunakan penyimpanan cache lokal (`localStorage`) untuk menyimpan hasil analisis Gemini AI dengan masa kedaluwarsa (TTL) selama 24 jam. Ini mencegah panggilan API berulang yang tidak perlu dan menghemat alokasi kuota token pengguna.
4. **Post Performance Input Form**: Form interaktif dengan validasi data real-time untuk menambahkan data postingan baru secara instan dan memperbarui visualisasi dashboard secara dinamis.
5. **Context-Aware AI Assistant**: Halaman asisten chat interaktif yang membaca konteks ringkasan data statistik performa dari dashboard secara dinamis untuk memberikan jawaban konsultatif yang personal bagi pelaku UMKM.

---

## 🛠️ Arsitektur Data & Aliran Proses

```
                        +----------------------------+
                        | Data Postingan Baru (User) |
                        +--------------+-------------+
                                       |
                                       v
+-------------------------+     +------+------+     +----------------------------+
| Sample Posts (15 posts) +---->| analytics.js +--->| Summary Ringkasan Metrik   |
+-------------------------+     +-------------+     +-------------+--------------+
                                                                  |
                                                                  v
                                                        +---------+---------+
                                                        |   Analysis.jsx    |
                                                        +---------+---------+
                                                                  |
                                              +-------------------+------------------+
                                              |                                      |
                                              v                                      v
                                    [ Generate Insight ]                     [ AI Assistant ]
                                              |                                      |
                                              v                                      v
                                    +---------+---------+                  +---------+---------+
                                    |     cache.js      |                  |  promptBuilder.js |
                                    +----+---------+----+                  +---------+---------+
                                         |         |                                 |
                                    Hit  |         | Miss                            v
                                         v         v                       +---------+---------+
                                   [Cached]  +-----+---------------+       | geminiService.js  |
                                             |  geminiService.js   |<------+-------------------+
                                             +----------+----------+
                                                        |
                                                        v
                                             +----------+----------+
                                             |   Gemini 3.1 Flash Lite  |
                                             +---------------------+
```

---

## 📁 Struktur Folder Proyek

```text
src/
├── data/
│   └── samplePosts.js       # Dataset awal 15 postingan UMKM & helper LocalStorage
├── utils/
│   ├── analytics.js         # Logika penghitung Engagement Rate, Creator Score, dll.
│   ├── cache.js             # Manajemen cache LocalStorage dengan TTL 24 jam
│   └── promptBuilder.js     # Penyusun prompt terstruktur berbahasa Indonesia
├── services/
│   └── geminiService.js     # Integrasi API Gemini berbasis x-goog-api-key header
├── pages/
│   ├── Landing.jsx          # Welcome page dengan framing produk UMKM & Small Creator
│   ├── Login.jsx            # Halaman login simulasi
│   └── dashboard/
│       ├── Analysis.jsx      # Dashboard grafik, data lokal, & form penambahan post
│       ├── AIAssistant.jsx   # Chat asisten yang membaca riwayat analytics
│       ├── Settings.jsx      # Panel input API Key, hapus key, & bersihkan cache
│       └── Layout.jsx        # Sidebar navigasi umum
```

---

## 📐 Rumus Perhitungan Metrik Lokal

*   **Engagement Rate (ER)**:
    $$\text{Engagement Rate} = \frac{\text{Likes} + \text{Comments} + \text{Shares} + \text{Saves}}{\text{Views}} \times 100\%$$
*   **Performance Classification**:
    *   $\text{ER} > 8\%$: *High Performance*
    *   $4\% \le \text{ER} \le 8\%$: *Medium Performance*
    *   $\text{ER} < 4\%$: *Low Performance*
*   **Creator Score**:
    Dihitung dengan menjumlahkan kontribusi Engagement Rate (maks 60 poin), Konsistensi jumlah postingan (maks 20 poin), dan Skala rata-rata tayangan views (maks 20 poin) untuk menghasilkan skor bulat akhir berindeks $0 - 100$.

---

## 💻 Cara Menjalankan & Menguji Proyek

### Prerequisites
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/).

### Langkah Instalasi
1. Clone repositori ini atau navigasikan ke direktori kerja Anda.
2. Instal dependensi yang diperlukan:
   ```bash
   npm install
   ```
3. Jalankan server pengembangan lokal (Vite):
   ```bash
   npm run dev
   ```
4. Buka URL yang tertera di terminal (biasanya `http://localhost:5173`) di browser Anda.

---

## 🧪 Panduan Pengujian Manual

1.  **Pengaturan API Key**:
    *   Buka dashboard lalu masuk ke halaman **Settings**.
    *   Dapatkan kunci API gratis dari [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Tempelkan kunci tersebut pada kolom **Gemini API Key** dan klik **Simpan API Key**.
    *   Perhatikan pemberitahuan bertuliskan *"Tersimpan!"* dan info *"Last saved"*.
2.  **Verifikasi Penghapusan Key & Cache**:
    *   Di halaman **Settings**, klik **Hapus API Key** untuk menghapus kunci dari browser Anda.
    *   Klik **Bersihkan Cache Analisis** untuk menghapus semua cache insight yang tersimpan secara lokal.
3.  **Pengujian Dashboard Analisis**:
    *   Buka halaman **Analysis**. Dashboard akan menampilkan metrik dinamis yang dihitung dari 15 postingan bawaan.
    *   Klik **Tambah Postingan** di sudut kanan atas. Masukkan data postingan baru dengan views tinggi (misal: Views: 50.000, Likes: 5.000, Comments: 500, Shares: 400, Saves: 300).
    *   Klik **Simpan Postingan**.
    *   Verifikasi bahwa **Creator Score**, **Total Posts**, **Avg Views**, dan **Avg Engagement** berubah secara instan di dashboard.
4.  **Pengujian AI Insight**:
    *   Kembali ke halaman **Analysis**, klik tombol **Generate AI Insight** di kartu banner ungu AI.
    *   Lihat animasi loading berjalan. Setelah selesai, headline dan ringkasan insight naratif yang dikembalikan oleh Gemini akan muncul, beserta 3 rekomendasi di bagian bawah.
    *   Buka tab *Network* di inspect element browser. Klik **Generate AI Insight** sekali lagi. Verifikasi bahwa respons dimuat langsung dari cache tanpa mengirimkan request HTTP baru ke Google API.
5.  **Pengujian AI Assistant**:
    *   Masuk ke halaman **AI Assistant**.
    *   Klik salah satu saran pertanyaan di bagian bawah (misalnya *"Konten mana yang performanya paling baik?"*).
    *   Verifikasi bahwa AI menjawab pertanyaan dengan merujuk langsung ke statistik performa tertinggi dari postingan Anda di dashboard.
