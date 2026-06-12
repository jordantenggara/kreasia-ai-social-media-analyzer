# Project Requirements — CreatorLens AI

CreatorLens AI adalah prototype web app berbasis React, Vite, dan Tailwind CSS yang dirancang untuk membantu UMKM dan kreator kecil menganalisis performa konten media sosial, khususnya TikTok dan Instagram.

## 1. Latar Belakang Masalah

Banyak UMKM dan kreator kecil sudah menggunakan media sosial untuk promosi, tetapi masih kesulitan memahami data performa konten seperti views, likes, comments, shares, saves, dan engagement rate. Akibatnya, strategi konten sering dilakukan secara trial-and-error tanpa dasar analisis yang jelas.

## 2. Target Pengguna

- UMKM yang menggunakan TikTok/Instagram untuk promosi
- Kreator konten kecil
- Mahasiswa yang menjalankan usaha kecil
- Pengguna media sosial yang ingin memahami performa kontennya

## 3. Tujuan Sistem

CreatorLens AI bertujuan membantu pengguna memahami performa konten secara lebih mudah melalui dashboard analisis dan rekomendasi berbasis AI. Sistem tidak hanya menampilkan angka, tetapi juga membantu menjelaskan makna dari data performa konten.

## 4. Fitur Utama

1. Dashboard analisis performa konten
2. Sample data postingan TikTok/Instagram
3. Form tambah postingan baru
4. Perhitungan engagement rate
5. Perhitungan creator score
6. Identifikasi best post dan worst post
7. Identifikasi best content type
8. Identifikasi best posting time
9. AI Insight berbasis Gemini API
10. AI Assistant berbasis konteks data dashboard
11. Caching hasil AI Insight menggunakan localStorage
12. Pengaturan Gemini API Key melalui halaman Settings

## 5. Peran AI

Gemini API digunakan untuk menghasilkan narasi insight, rekomendasi strategi konten, dan jawaban dari AI Assistant. Perhitungan metrik utama seperti engagement rate, creator score, best post, worst post, best content type, dan best posting time dilakukan secara lokal menggunakan JavaScript, bukan oleh AI.

## 6. Batasan Prototype

- Data konten masih dimasukkan secara manual atau menggunakan sample data.
- Sistem belum terhubung langsung ke API TikTok/Instagram.
- API key disimpan di localStorage browser untuk kebutuhan prototype.
- Sistem tidak melatih model AI dari nol.
- Caching utama diterapkan pada AI Insight dashboard.
- Aplikasi belum menggunakan backend/database eksternal.

## 7. Teknologi

- React
- Vite
- Tailwind CSS
- Gemini API
- JavaScript
- localStorage

## 8. Potensi Pengembangan

- Integrasi langsung dengan TikTok/Instagram API
- Upload data melalui CSV
- Export laporan PDF
- Content planner mingguan
- Analisis kategori konten yang lebih detail
- Backend untuk penyimpanan data dan keamanan API key
