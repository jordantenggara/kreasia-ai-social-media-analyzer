import { buildInsightPrompt } from "../utils/promptBuilder";
import { getCachedInsight, setCachedInsight, generateCacheKey } from "../utils/cache";

const GEMINI_MODEL = "gemini-3.1-flash-lite";

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Retrieve and trim Gemini API Key from localStorage
 */
export const getApiKey = () => {
  const key = localStorage.getItem("gemini_api_key");
  return key ? key.trim() : "";
};

/**
 * Strips markdown code blocks (e.g. ```json ... ```) from strings to ensure safe parsing
 */
const cleanJsonResponse = (text) => {
  let cleanText = text.trim();

  // Remove starting ```json or ```
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```json\s*/i, "");
    cleanText = cleanText.replace(/^```\s*/i, "");
    // Remove ending ```
    cleanText = cleanText.replace(/\s*```$/, "");
  }

  return cleanText.trim();
};

/**
 * Direct Gemini API fetcher with headers-based key transmission
 */
export const generateContent = async (contents) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key belum diatur. Silakan pergi ke halaman Settings untuk mengatur Gemini API Key.");
  }

  try {
    const res = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({ contents }),
    });

    if (!res.ok) {
      let errorMessage = "Gagal menghubungi Gemini API";
      try {
        const errData = await res.json();
        if (errData?.error?.message) {
          errorMessage = errData.error.message;
        }
      } catch (parseErr) {
        // Fallback to text status
        errorMessage = `HTTP error ${res.status}: ${res.statusText}`;
      }

      if (res.status === 400 || res.status === 403) {
        throw new Error(`API Key tidak valid atau terjadi kesalahan otorisasi: ${errorMessage}`);
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      throw new Error("Gemini API mengembalikan respons kosong.");
    }

    return replyText;
  } catch (err) {
    console.error("Gemini service error:", err);
    throw err;
  }
};

/**
 * Computes live prompts, requests JSON content from Gemini, strips fences, parses it, and caches.
 */
export const generateDashboardInsight = async (summary) => {
  const cacheKey = generateCacheKey(summary);
  const cached = getCachedInsight(cacheKey);

  if (cached) {
    console.log("Serving dashboard insight from localStorage cache.");
    return JSON.parse(cached);
  }

  const prompt = buildInsightPrompt(summary);
  const contents = [
    {
      role: "user",
      parts: [{ text: prompt }]
    }
  ];

  const rawResult = await generateContent(contents);
  const cleanedResult = cleanJsonResponse(rawResult);

  try {
    const parsedData = JSON.parse(cleanedResult);

    // Validate required fields in the parsed object
    if (!parsedData.headline || !parsedData.insight || !Array.isArray(parsedData.recommendations)) {
      throw new Error("Data insight yang dihasilkan AI tidak lengkap.");
    }

    // Store as a serialized string in cache
    setCachedInsight(cacheKey, cleanedResult);
    return parsedData;
  } catch (parseError) {
    console.error("Failed to parse Gemini insight as JSON. Raw output was:", rawResult);
    throw new Error("Gagal mengurai respons kecerdasan buatan. Silakan klik tombol lagi untuk menghasilkan ulang.");
  }
};
