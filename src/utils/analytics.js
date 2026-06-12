/**
 * CreatorLens AI Local Analytics Engine
 */

/**
 * Calculate engagement rate for a single post.
 * Formula: ((likes + comments + shares + saves) / views) * 100
 */
export const calculateEngagementRate = (post) => {
  const views = Number(post.views) || 0;
  if (views === 0) return 0;
  const interactions = 
    (Number(post.likes) || 0) + 
    (Number(post.comments) || 0) + 
    (Number(post.shares) || 0) + 
    (Number(post.saves) || 0);
  return (interactions / views) * 100;
};

/**
 * Classify performance based on engagement rate.
 * - > 8% = High Performance
 * - 4-8% = Medium Performance
 * - < 4% = Low Performance
 */
export const getPerformanceClass = (er) => {
  if (er > 8) return "High Performance";
  if (er >= 4) return "Medium Performance";
  return "Low Performance";
};

/**
 * Calculate Creator Score (0 - 100).
 * Based on Engagement Rate (60pts), Consistency (20pts), and Average Views (20pts).
 */
export const calculateCreatorScore = (avgER, totalPosts, avgViews) => {
  if (totalPosts === 0) return 0;
  
  // Engagement component (Capped at 12% ER for max 60 points)
  const erComponent = Math.min((avgER / 12) * 60, 60);
  
  // Consistency component (Capped at 15 posts for max 20 points)
  const consistencyComponent = Math.min((totalPosts / 15) * 20, 20);
  
  // Views component (Capped at 80,000 avg views for max 20 points)
  const viewsComponent = Math.min((avgViews / 80000) * 20, 20);
  
  const score = Math.round(erComponent + consistencyComponent + viewsComponent);
  return Math.max(10, Math.min(score, 100)); // Minimum baseline of 10 if posts exist
};

/**
 * Main analytics calculator. Takes an array of posts and returns all key summary metrics.
 */
export const runLocalAnalytics = (posts = []) => {
  if (!posts || posts.length === 0) {
    return {
      creatorScore: 0,
      totalPosts: 0,
      avgViews: 0,
      avgLikes: 0,
      avgComments: 0,
      avgShares: 0,
      avgSaves: 0,
      avgEngagementRate: 0,
      bestPost: null,
      worstPost: null,
      bestContentType: "-",
      bestPostingTime: "-",
      contentTypeSummary: [],
    };
  }

  let totalViews = 0;
  let totalLikes = 0;
  let totalComments = 0;
  let totalShares = 0;
  let totalSaves = 0;
  let totalER = 0;

  let bestPost = null;
  let maxER = -1;
  let worstPost = null;
  let minER = Infinity;

  // Grouping structures
  const typeGroups = {}; // { type: { views: 0, erSum: 0, count: 0 } }
  const timeGroups = {}; // { time: { views: 0, erSum: 0, count: 0 } }

  posts.forEach((post) => {
    const views = Number(post.views) || 0;
    const likes = Number(post.likes) || 0;
    const comments = Number(post.comments) || 0;
    const shares = Number(post.shares) || 0;
    const saves = Number(post.saves) || 0;
    const er = calculateEngagementRate(post);

    totalViews += views;
    totalLikes += likes;
    totalComments += comments;
    totalShares += shares;
    totalSaves += saves;
    totalER += er;

    // Track best post (highest ER, fallback to views if tie)
    if (er > maxER) {
      maxER = er;
      bestPost = post;
    } else if (er === maxER && bestPost && views > bestPost.views) {
      bestPost = post;
    }

    // Track worst post (lowest ER)
    if (er < minER) {
      minER = er;
      worstPost = post;
    } else if (er === minER && worstPost && views < worstPost.views) {
      worstPost = post;
    }

    // Process Content Type Performance
    const cType = post.contentType ? post.contentType.toLowerCase() : "unknown";
    if (!typeGroups[cType]) {
      typeGroups[cType] = { views: 0, erSum: 0, count: 0 };
    }
    typeGroups[cType].views += views;
    typeGroups[cType].erSum += er;
    typeGroups[cType].count += 1;

    // Process Posting Time Performance
    const timeKey = post.time || "unknown";
    if (!timeGroups[timeKey]) {
      timeGroups[timeKey] = { views: 0, erSum: 0, count: 0 };
    }
    timeGroups[timeKey].views += views;
    timeGroups[timeKey].erSum += er;
    timeGroups[timeKey].count += 1;
  });

  const totalPosts = posts.length;
  const avgViews = Math.round(totalViews / totalPosts);
  const avgLikes = Math.round(totalLikes / totalPosts);
  const avgComments = Math.round(totalComments / totalPosts);
  const avgShares = Math.round(totalShares / totalPosts);
  const avgSaves = Math.round(totalSaves / totalPosts);
  const avgEngagementRate = Number((totalER / totalPosts).toFixed(2));

  // Determine Best Content Type by ER
  let bestType = "-";
  let maxTypeER = -1;
  const contentTypeSummary = Object.keys(typeGroups).map((type) => {
    const g = typeGroups[type];
    const avgTypeViews = Math.round(g.views / g.count);
    const avgTypeER = Number((g.erSum / g.count).toFixed(2));
    
    if (avgTypeER > maxTypeER) {
      maxTypeER = avgTypeER;
      bestType = type;
    }
    
    return {
      contentType: type,
      count: g.count,
      avgViews: avgTypeViews,
      avgEngagementRate: avgTypeER,
    };
  });

  // Determine Best Posting Time by ER
  let bestTime = "-";
  let maxTimeER = -1;
  Object.keys(timeGroups).forEach((time) => {
    const g = timeGroups[time];
    const avgTimeER = g.erSum / g.count;
    if (avgTimeER > maxTimeER) {
      maxTimeER = avgTimeER;
      bestTime = time;
    }
  });

  const creatorScore = calculateCreatorScore(avgEngagementRate, totalPosts, avgViews);

  return {
    creatorScore,
    totalPosts,
    avgViews,
    avgLikes,
    avgComments,
    avgShares,
    avgSaves,
    avgEngagementRate,
    bestPost: bestPost ? { ...bestPost, engagementRate: Number(calculateEngagementRate(bestPost).toFixed(2)) } : null,
    worstPost: worstPost ? { ...worstPost, engagementRate: Number(calculateEngagementRate(worstPost).toFixed(2)) } : null,
    bestContentType: bestType.charAt(0).toUpperCase() + bestType.slice(1),
    bestPostingTime: bestTime,
    contentTypeSummary,
  };
};
