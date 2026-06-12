/**
 * Helper to build optimized prompts for the Gemini API
 */

/**
 * Builds a prompt for generating narrative AI Insights and Recommendations on the dashboard.
 * Takes a locally-computed summary object.
 */
export const buildInsightPrompt = (summary) => {
  const {
    totalPosts,
    avgViews,
    avgLikes,
    avgComments,
    avgShares,
    avgSaves,
    avgEngagementRate,
    bestPost,
    worstPost,
    bestContentType,
    bestPostingTime,
    contentTypeSummary
  } = summary;

  const contentTypesDetails = contentTypeSummary
    .map(t => `- Tipe: ${t.contentType}, Total Post: ${t.count}, Avg Views: ${t.avgViews}, Avg ER: ${t.avgEngagementRate}%`)
    .join("\n");

  return `Kamu adalah AI Insight Engine untuk CreatorLens AI. Tugasmu adalah memberikan analisis mendalam, saran strategi, dan rekomendasi pertumbuhan konten sosial media yang konkret untuk UMKM dan kreator kecil di Indonesia.

Berikut adalah Ringkasan Data Performa Akun (30 hari terakhir):
- Total Postingan dianalisis: ${totalPosts}
- Rata-rata Views per post: ${avgViews}
- Rata-rata Likes per post: ${avgLikes}
- Rata-rata Comments per post: ${avgComments}
- Rata-rata Shares per post: ${avgShares}
- Rata-rata Saves per post: ${avgSaves}
- Rata-rata Engagement Rate (ER): ${avgEngagementRate}%
- Tipe Konten Terbaik (berdasarkan ER tertinggi): ${bestContentType}
- Waktu Posting Terbaik (berdasarkan ER tertinggi): ${bestPostingTime}

Detail Performa berdasarkan Tipe Konten:
${contentTypesDetails}

Postingan dengan Performa Terbaik:
- Platform: ${bestPost?.platform || "-"}
- Tipe Konten: ${bestPost?.contentType || "-"}
- Caption: "${bestPost?.caption || "-"}"
- Views: ${bestPost?.views || 0}, Likes: ${bestPost?.likes || 0}, Comments: ${bestPost?.comments || 0}, ER: ${bestPost?.engagementRate || 0}%

Postingan dengan Performa Terendah:
- Platform: ${worstPost?.platform || "-"}
- Tipe Konten: ${worstPost?.contentType || "-"}
- Caption: "${worstPost?.caption || "-"}"
- Views: ${worstPost?.views || 0}, Likes: ${worstPost?.likes || 0}, ER: ${worstPost?.engagementRate || 0}%

Berikan analisis dalam bahasa Indonesia yang ramah, profesional, dan menyemangati. Format respons kamu harus menggunakan JSON terstruktur yang valid (pastikan JSON valid dan bisa diparsing menggunakan JSON.parse di Javascript). Jangan sertakan karakter markdown seperti \`\`\`json di awal atau akhir output, kirimkan RAW string JSON saja.

Struktur JSON yang WAJIB kamu kembalikan:
{
  "headline": "Satu kalimat headline yang mencolok tentang performa konten mereka saat ini",
  "insight": "Paragraf ringkas berisi analisis mendalam mengapa performa mereka seperti itu, apa kekuatan utama konten mereka (kaitkan dengan postingan terbaik atau tipe konten terbaik), dan area mana yang harus diperbaiki.",
  "recommendations": [
    {
      "icon": "Emoji yang sesuai (misal: 🕐, 📣, 🎬, 💡)",
      "title": "Judul rekomendasi singkat",
      "desc": "Penjelasan detail dan langkah konkret yang bisa langsung dicoba (actionable) untuk UMKM.",
      "tag": "Kategori dampak (misal: 'High Impact', 'Engagement', 'Visibility')",
      "tagColor": "Skema warna Tailwind (misal: 'text-purple-600 bg-purple-50', 'text-pink-600 bg-pink-50', 'text-orange-600 bg-orange-50')"
    }
  ]
}

Ketentuan: Jumlah rekomendasi dalam array harus tepat 3. Seluruh bahasa dalam JSON harus bahasa Indonesia.`;
};

/**
 * Builds the system prompt for the AI Assistant, injecting the local analytics context.
 */
export const buildAssistantSystemPrompt = (summary) => {
  if (!summary) {
    return `Kamu adalah Creator Assistant dari CreatorLens AI, asisten strategis sosial media untuk UMKM dan kreator kecil di Indonesia. Jawab pertanyaan dengan ramah, profesional, konkret, dan actionable dalam bahasa Indonesia.`;
  }

  const {
    totalPosts,
    avgViews,
    avgEngagementRate,
    bestContentType,
    bestPostingTime,
    bestPost
  } = summary;

  return `Kamu adalah Creator Assistant dari CreatorLens AI, seorang asisten strategis sosial media yang ahli di bidang konten media sosial untuk UMKM (Usaha Mikro, Kecil, Menengah) dan small creators di Indonesia. 

Tugasmu adalah membantu pengguna menyusun strategi konten, membuat caption/hook viral, dan menjawab pertanyaan seputar pertumbuhan media sosial berdasarkan data performa akun mereka yang sesungguhnya.

Saat ini, kamu telah menganalisis profil mereka secara lokal dengan ringkasan sebagai berikut:
- Total Postingan: ${totalPosts}
- Rata-rata Views: ${avgViews}
- Rata-rata Engagement Rate (ER): ${avgEngagementRate}%
- Format Konten Terbaik: ${bestContentType}
- Jam Posting Terbaik: ${bestPostingTime} WIB
- Contoh Postingan Terbaik: "${bestPost?.caption?.substring(0, 100) || "-"}..." (Platform: ${bestPost?.platform || "-"}, ER: ${bestPost?.engagementRate || 0}%)

Aturan Menjawab:
1. Jawab dalam bahasa Indonesia yang ramah, sopan, namun taktis dan solutif.
2. Gunakan data ringkasan di atas secara aktif saat memberikan jawaban. Contoh: "Berdasarkan data Anda, format ${bestContentType} memiliki performa terbaik, jadi mari kita kembangkan ide..."
3. Berikan hook (3 detik pertama) dan draf caption jika ditanya tentang ide konten.
4. Fokus pada strategi yang realistis dan ramah anggaran (organik) untuk UMKM kecil.
5. Akhiri saran dengan dorongan semangat bagi pelaku UMKM.`;
};
