/**
 * LocalStorage caching layer with 24-hour TTL
 */

const CACHE_PREFIX = "creatorlens_insight_cache_";
const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Generate a cache key based on key analytics metrics to ensure key updates bust cache
 */
export const generateCacheKey = (summary) => {
  if (!summary) return `${CACHE_PREFIX}default`;
  const { totalPosts, avgViews, avgEngagementRate } = summary;
  return `${CACHE_PREFIX}${totalPosts}_${avgViews}_${Math.round((avgEngagementRate || 0) * 100)}`;
};

/**
 * Retrieve cached data by key, enforcing 24-hour TTL expiration.
 */
export const getCachedInsight = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const payload = JSON.parse(raw);
    if (!payload || !payload.timestamp || !payload.data) {
      // Invalid cache format, clean it
      localStorage.removeItem(key);
      return null;
    }

    const now = Date.now();
    const age = now - payload.timestamp;

    if (age > ONE_DAY_MS) {
      // Cache expired
      localStorage.removeItem(key);
      return null;
    }

    return payload.data;
  } catch (e) {
    console.error("Error retrieving cached insight", e);
    return null;
  }
};

/**
 * Store data in cache with a timestamp
 */
export const setCachedInsight = (key, data) => {
  try {
    const payload = {
      timestamp: Date.now(),
      data: data
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (e) {
    console.error("Error setting cached insight", e);
  }
};

/**
 * Clear all CreatorLens analysis cache keys
 */
export const clearAnalysisCache = () => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    return true;
  } catch (e) {
    console.error("Error clearing analysis cache", e);
    return false;
  }
};
