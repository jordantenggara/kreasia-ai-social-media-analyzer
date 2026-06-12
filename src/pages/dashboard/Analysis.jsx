import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Users, Eye, Heart, MessageCircle, TrendingUp, TrendingDown, 
  Download, Calendar, ArrowRight, Zap, Brain, PlusCircle, 
  X, HelpCircle, AlertTriangle, FileText, Share2, Bookmark 
} from 'lucide-react'
import { getAllPosts, saveUserPost } from '../../data/samplePosts'
import { runLocalAnalytics, getPerformanceClass } from '../../utils/analytics'
import { generateDashboardInsight, getApiKey } from '../../services/geminiService'
import { generateCacheKey } from '../../utils/cache'

const defaultRecommendations = [
  {
    icon: '🕐',
    title: 'Upload Konsisten',
    desc: 'Postingan di jam 19:00 WIB terbukti mendapatkan reach 2x lipat lebih tinggi untuk demografi audiens Anda.',
    tag: 'High Impact',
    tagColor: 'text-purple-600 bg-purple-50',
  },
  {
    icon: '📣',
    title: 'Gunakan CTA',
    desc: 'Tambahkan call-to-action "Share if you agree" untuk meningkatkan engagement rate sebesar 15%.',
    tag: 'Engagement',
    tagColor: 'text-pink-600 bg-pink-50',
  },
  {
    icon: '🎬',
    title: 'Format Efektif',
    desc: 'Gunakan aspek rasio 9:16 dengan durasi di bawah 45 detik untuk memaksimalkan peluang masuk ke Explore.',
    tag: 'Visibility',
    tagColor: 'text-orange-600 bg-orange-50',
  },
]

export default function Analysis() {
  const navigate = useNavigate()
  const location = useLocation()

  // Data State
  const [posts, setPosts] = useState(getAllPosts())
  const [showAddPostModal, setShowAddPostModal] = useState(false)

  // AI Insight State
  const [loadingInsight, setLoadingInsight] = useState(false)
  const [insight, setInsight] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  // Form State
  const [formPlatform, setFormPlatform] = useState('instagram')
  const [formUsername, setFormUsername] = useState('')
  const [formContentType, setFormContentType] = useState('reels')
  const [formCaption, setFormCaption] = useState('')
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0])
  const [formTime, setFormTime] = useState('19:00')
  const [formViews, setFormViews] = useState('0')
  const [formLikes, setFormLikes] = useState('0')
  const [formComments, setFormComments] = useState('0')
  const [formShares, setFormShares] = useState('0')
  const [formSaves, setFormSaves] = useState('0')
  const [formDuration, setFormDuration] = useState('')
  const [formErrors, setFormErrors] = useState({})

  // Compute analytics locally
  const summary = useMemo(() => runLocalAnalytics(posts), [posts])

  // Map local analytics to performance overview
  const performanceItems = useMemo(() => {
    // Estimate Reach percentage: average views relative to 100k target
    const reachVal = Math.min(Math.round((summary.avgViews / 100000) * 100), 100)
    // Estimate Engagement score: average ER relative to 10% target
    const engVal = Math.min(Math.round((summary.avgEngagementRate / 10) * 100), 100)
    // Growth Potential derived from creator score + variety
    const growthVal = Math.min(Math.round((summary.creatorScore + engVal) / 2), 100)

    return [
      { label: 'Reach Index', value: reachVal || 10, color: 'bg-purple-600' },
      { label: 'Engagement Level', value: engVal || 10, color: 'bg-pink-500' },
      { label: 'Growth Potential', value: growthVal || 10, color: 'bg-amber-500' },
    ]
  }, [summary])

  // Watch navigation state to trigger Add Post Modal
  useEffect(() => {
    if (location.state?.openAddPostModal) {
      setShowAddPostModal(true)
      // Clear state so it doesn't pop open again on refresh
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  // Load cached insights when summary updates
  useEffect(() => {
    const cacheKey = generateCacheKey(summary)
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        const payload = JSON.parse(cached)
        // Check 24 hour TTL (24 hours = 86400000 ms)
        if (payload && payload.timestamp && (Date.now() - payload.timestamp < 86400000) && payload.data) {
          setInsight(JSON.parse(payload.data))
          setErrorMessage("")
        } else {
          setInsight(null)
        }
      } catch (e) {
        setInsight(null)
      }
    } else {
      setInsight(null)
    }
  }, [summary])

  // Format numbers to short suffixes (e.g. 1.2K)
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  // Trigger Gemini API to analyze summary metrics
  const handleGenerateAIInsight = async () => {
    const key = getApiKey()
    if (!key) {
      setErrorMessage("⚠️ API Key Gemini belum diatur. Silakan pergi ke halaman Settings untuk mengaturnya terlebih dahulu.")
      return
    }

    setLoadingInsight(true)
    setErrorMessage("")

    try {
      const data = await generateDashboardInsight(summary)
      setInsight(data)
    } catch (err) {
      setErrorMessage(`❌ Error: ${err.message}`)
    } finally {
      setLoadingInsight(false)
    }
  }

  // Handle Form Submission with Validation
  const handleAddPostSubmit = (e) => {
    e.preventDefault()
    const errors = {}

    if (!formUsername.trim()) errors.username = "Username wajib diisi"
    if (!formCaption.trim()) errors.caption = "Caption wajib diisi"
    if (!formDate) errors.date = "Tanggal wajib diisi"
    if (!formTime) errors.time = "Waktu wajib diisi"

    const viewsVal = parseInt(formViews)
    const likesVal = parseInt(formLikes)
    const commentsVal = parseInt(formComments)
    const sharesVal = parseInt(formShares)
    const savesVal = parseInt(formSaves)

    if (isNaN(viewsVal) || viewsVal < 0) errors.views = "Views harus berupa angka positif"
    if (isNaN(likesVal) || likesVal < 0) errors.likes = "Likes harus berupa angka positif"
    if (isNaN(commentsVal) || commentsVal < 0) errors.comments = "Comments harus berupa angka positif"
    if (isNaN(sharesVal) || sharesVal < 0) errors.shares = "Shares harus berupa angka positif"
    if (isNaN(savesVal) || savesVal < 0) errors.saves = "Saves harus berupa angka positif"

    const needsDuration = formPlatform === 'tiktok' || formContentType === 'reels' || formContentType === 'video'
    let durationVal = null
    if (needsDuration) {
      durationVal = parseInt(formDuration)
      if (isNaN(durationVal) || durationVal <= 0) {
        errors.duration = "Durasi video wajib diisi dengan angka lebih dari 0 detik"
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const newPost = {
      id: "user-" + Date.now(),
      platform: formPlatform,
      username: formUsername.trim(),
      contentType: formContentType,
      caption: formCaption.trim(),
      date: formDate,
      time: formTime,
      views: viewsVal,
      likes: likesVal,
      comments: commentsVal,
      shares: sharesVal,
      saves: savesVal,
      duration: durationVal
    }

    // Save and reload
    saveUserPost(newPost)
    const updated = getAllPosts()
    setPosts(updated)

    // Reset Form
    setFormPlatform('instagram')
    setFormUsername('')
    setFormContentType('reels')
    setFormCaption('')
    setFormDate(new Date().toISOString().split('T')[0])
    setFormTime('19:00')
    setFormViews('0')
    setFormLikes('0')
    setFormComments('0')
    setFormShares('0')
    setFormSaves('0')
    setFormDuration('')
    setFormErrors({})
    setShowAddPostModal(false)
  }

  // Dynamic status evaluation for local Creator Score
  const scoreStatus = useMemo(() => {
    if (summary.creatorScore >= 80) return { label: 'OPTIMAL', color: 'bg-green-100 text-green-700' }
    if (summary.creatorScore >= 60) return { label: 'BAIK', color: 'bg-blue-100 text-blue-700' }
    return { label: 'PERLU DIOPTIMALKAN', color: 'bg-amber-100 text-amber-700' }
  }, [summary.creatorScore])

  // Custom visual mappings for stats cards
  const statsCards = useMemo(() => {
    return [
      { icon: FileText, label: 'TOTAL POSTS', value: summary.totalPosts.toString(), iconColor: 'text-blue-500', bg: 'bg-blue-50' },
      { icon: Zap, label: 'AVG ENGAGEMENT', value: `${summary.avgEngagementRate}%`, iconColor: 'text-pink-500', bg: 'bg-pink-50' },
      { icon: Eye, label: 'AVG VIEWS', value: formatNumber(summary.avgViews), iconColor: 'text-purple-500', bg: 'bg-purple-50' },
      { icon: Heart, label: 'AVG LIKES', value: formatNumber(summary.avgLikes), iconColor: 'text-red-400', bg: 'bg-red-50' },
      { icon: MessageCircle, label: 'AVG COMMENTS', value: formatNumber(summary.avgComments), iconColor: 'text-teal-500', bg: 'bg-teal-50' },
      { icon: Share2, label: 'AVG SHARES', value: formatNumber(summary.avgShares), iconColor: 'text-indigo-400', bg: 'bg-indigo-50' },
    ]
  }, [summary])

  return (
    <div className="min-h-screen bg-lavender-50 font-sans pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Analisis</h1>
          <p className="text-sm text-gray-400 mt-0.5">Analisis performa sosial media UMKM & Kreator Kecil</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddPostModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-purple-200 rounded-xl text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Tambah Postingan
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md cursor-pointer">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Top Row: Creator Score + Stats */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Creator Score Card */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 w-full lg:w-72 shrink-0 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 tracking-widest mb-4">CREATOR SCORE</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-6xl font-extrabold text-gray-900">{summary.creatorScore}</span>
                <span className="text-xl text-gray-400 mb-2">/100</span>
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full mb-4 ${scoreStatus.color}`}>
                <TrendingUp className="w-3 h-3" /> {scoreStatus.label}
              </span>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Skor akun Anda dihitung berdasarkan performa keterlibatan (engagement rate), konsistensi publikasi, dan jangkauan tayangan video.
              </p>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-primary transition-all duration-500" style={{ width: `${summary.creatorScore}%` }} />
            </div>
          </div>

          {/* Stats Grid - Symmetrical 3x2 Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            {statsCards.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 flex flex-col justify-between hover:shadow-card-hover transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <s.icon className={`w-4.5 h-4.5 ${s.iconColor}`} />
                  </div>
                  <span className="text-xs font-semibold text-green-500 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> Aktif
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium tracking-wide">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Row: Performance Overview + AI Insight */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Performance Overview (Calculated Index) */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 w-full lg:w-72 shrink-0">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Performance Overview</h2>
            <div className="space-y-5">
              {performanceItems.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="font-bold text-gray-800">{item.value}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-700`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight (Cached or Triggered) */}
          <div className="flex-1 bg-gradient-primary rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[260px]">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <Brain className="w-40 h-40" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-bold tracking-widest uppercase">AI Insight Engine</span>
              </div>

              {loadingInsight ? (
                <div className="py-6 space-y-4 animate-pulse">
                  <div className="h-6 bg-white/20 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-white/20 rounded w-full"></div>
                    <div className="h-4 bg-white/20 rounded w-5/6"></div>
                  </div>
                </div>
              ) : errorMessage ? (
                <div className="bg-red-500/20 border border-white/20 rounded-xl p-4 mb-4">
                  <p className="text-sm font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-300" /> Gagal Mendapatkan Analisis
                  </p>
                  <p className="text-xs text-purple-100 mt-1">{errorMessage}</p>
                </div>
              ) : insight ? (
                <>
                  <h3 className="text-xl font-bold leading-snug mb-3 max-w-xl">
                    {insight.headline}
                  </h3>
                  <p className="text-purple-100 text-sm leading-relaxed mb-4 max-w-2xl">
                    {insight.insight}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold leading-snug mb-3 max-w-xl">
                    Analisis Insight Akun Anda Siap Diproses
                  </h3>
                  <p className="text-purple-100 text-sm leading-relaxed mb-4 max-w-2xl">
                    Klik tombol di bawah ini untuk merumuskan draf narasi insight bisnis dan rekomendasi pertumbuhan yang disesuaikan secara khusus dengan karakter niche UMKM Anda.
                  </p>
                </>
              )}
            </div>

            <div className="relative z-10 flex gap-3 flex-wrap mt-4">
              <button 
                onClick={handleGenerateAIInsight}
                disabled={loadingInsight}
                className="px-5 py-2.5 bg-white text-purple-700 font-semibold text-sm rounded-xl hover:bg-purple-50 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingInsight ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent rounded-full animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    {insight ? "Perbarui Insight AI" : "Generate AI Insight"}
                  </>
                )}
              </button>
              <button
                onClick={() => navigate('/dashboard/ai-assistant')}
                className="px-5 py-2.5 border border-white/40 text-white font-semibold text-sm rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
              >
                Tanya AI Assistant <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Detail Metrics - Best/Worst Post Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Best Content Type */}
          <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
            <p className="text-xs text-gray-400 font-semibold mb-1.5 uppercase">Best Content Type</p>
            <p className="text-2xl font-bold text-purple-700">{summary.bestContentType || '-'}</p>
            <p className="text-xs text-gray-500 mt-2">Format postingan dengan tingkat keterlibatan audiens tertinggi.</p>
          </div>
          
          {/* Best Posting Time */}
          <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
            <p className="text-xs text-gray-400 font-semibold mb-1.5 uppercase">Best Posting Time</p>
            <p className="text-2xl font-bold text-purple-700">{summary.bestPostingTime ? `${summary.bestPostingTime} WIB` : '-'}</p>
            <p className="text-xs text-gray-500 mt-2">Waktu publikasi konten dengan perolehan views paling optimal.</p>
          </div>

          {/* Best Post Detail */}
          <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 flex flex-col justify-between">
            <div>
              <p className="text-xs text-green-600 font-bold mb-2 uppercase flex items-center gap-1">
                🏆 Best Performing Post
              </p>
              <p className="text-sm font-medium text-gray-700 line-clamp-2 italic">
                "{summary.bestPost?.caption || "Belum ada postingan terdata"}"
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-2 shrink-0">
              <span>Views: {summary.bestPost ? formatNumber(summary.bestPost.views) : 0}</span>
              <span className="font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">ER: {summary.bestPost ? summary.bestPost.engagementRate : 0}%</span>
            </div>
          </div>

          {/* Worst Post Detail */}
          <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 flex flex-col justify-between">
            <div>
              <p className="text-xs text-red-500 font-bold mb-2 uppercase flex items-center gap-1">
                ⚠️ Low Performing Post
              </p>
              <p className="text-sm font-medium text-gray-700 line-clamp-2 italic">
                "{summary.worstPost?.caption || "Belum ada postingan terdata"}"
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-2 shrink-0">
              <span>Views: {summary.worstPost ? formatNumber(summary.worstPost.views) : 0}</span>
              <span className="font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded">ER: {summary.worstPost ? summary.worstPost.engagementRate : 0}%</span>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">AI Recommendations</h2>
            <button className="text-sm text-purple-600 font-medium hover:text-purple-700 flex items-center gap-1 cursor-pointer">
              See All Recommendations <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(insight?.recommendations || defaultRecommendations).map((rec, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between">
                <div>
                  <div className={`w-10 h-10 ${insight ? 'bg-purple-100' : 'bg-purple-100'} rounded-xl flex items-center justify-center text-xl mb-4`}>
                    {rec.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{rec.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{rec.desc}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${rec.tagColor || 'text-purple-600 bg-purple-50'}`}>
                    {rec.tag || 'Strategy'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Add Post Form */}
      {showAddPostModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 relative my-8 animate-slide-up">
            <button 
              onClick={() => {
                setShowAddPostModal(false)
                setFormErrors({})
              }}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-purple-600" />
              Tambah Postingan Baru
            </h2>
            <p className="text-xs text-gray-400 mb-6">Input performa konten secara manual untuk memperbarui metrik dashboard Anda.</p>

            <form onSubmit={handleAddPostSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Platform */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Platform</label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    placeholder="e.g. kedai.kopi"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    className={`w-full px-3 py-2 border ${formErrors.username ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300`}
                  />
                  {formErrors.username && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.username}</span>}
                </div>

                {/* Content Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tipe Konten</label>
                  <select
                    value={formContentType}
                    onChange={(e) => setFormContentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white"
                  >
                    <option value="reels">Reels (Instagram)</option>
                    <option value="video">Video (TikTok/Instagram)</option>
                    <option value="carousel">Carousel (Instagram)</option>
                    <option value="image">Single Image (Instagram)</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal Posting</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className={`w-full px-3 py-2 border ${formErrors.date ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300`}
                  />
                  {formErrors.date && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.date}</span>}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Waktu Posting (WIB)</label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className={`w-full px-3 py-2 border ${formErrors.time ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300`}
                  />
                  {formErrors.time && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.time}</span>}
                </div>

                {/* Views */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Views</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formViews}
                    onChange={(e) => setFormViews(e.target.value)}
                    className={`w-full px-3 py-2 border ${formErrors.views ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300`}
                  />
                  {formErrors.views && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.views}</span>}
                </div>

                {/* Likes */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Likes</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formLikes}
                    onChange={(e) => setFormLikes(e.target.value)}
                    className={`w-full px-3 py-2 border ${formErrors.likes ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300`}
                  />
                  {formErrors.likes && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.likes}</span>}
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Comments</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formComments}
                    onChange={(e) => setFormComments(e.target.value)}
                    className={`w-full px-3 py-2 border ${formErrors.comments ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300`}
                  />
                  {formErrors.comments && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.comments}</span>}
                </div>

                {/* Shares */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Shares</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formShares}
                    onChange={(e) => setFormShares(e.target.value)}
                    className={`w-full px-3 py-2 border ${formErrors.shares ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300`}
                  />
                  {formErrors.shares && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.shares}</span>}
                </div>

                {/* Saves */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Saves</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formSaves}
                    onChange={(e) => setFormSaves(e.target.value)}
                    className={`w-full px-3 py-2 border ${formErrors.saves ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300`}
                  />
                  {formErrors.saves && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.saves}</span>}
                </div>

                {/* Duration */}
                {(formPlatform === 'tiktok' || formContentType === 'reels' || formContentType === 'video') && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Durasi Video (detik)</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 15"
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                      className={`w-full px-3 py-2 border ${formErrors.duration ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300`}
                    />
                    {formErrors.duration && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.duration}</span>}
                  </div>
                )}
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Caption Konten</label>
                <textarea
                  rows="3"
                  placeholder="Masukkan caption lengkap postingan Anda..."
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  className={`w-full px-3 py-2 border ${formErrors.caption ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300`}
                />
                {formErrors.caption && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.caption}</span>}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPostModal(false)
                    setFormErrors({})
                  }}
                  className="px-5 py-2 border border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md cursor-pointer"
                >
                  Simpan Postingan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
