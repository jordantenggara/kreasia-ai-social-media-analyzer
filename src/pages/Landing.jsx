import { useNavigate } from 'react-router-dom'
import { Zap, Brain, TrendingUp, MessageSquare, ArrowRight, Star } from 'lucide-react'

const features = [
  {
    icon: <Star className="w-6 h-6 text-purple-600" />,
    bg: 'bg-purple-100',
    title: 'Creator Score',
    desc: 'Nilai kesehatan akun Anda berdasarkan 15+ metrik performa industri terkini.',
  },
  {
    icon: <Brain className="w-6 h-6 text-pink-500" />,
    bg: 'bg-pink-100',
    title: 'AI Insight',
    desc: 'Analisis sentimen dan tren topik yang sedang populer di niche konten Anda secara real-time.',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
    bg: 'bg-blue-100',
    title: 'Growth Recommendation',
    desc: 'Saran langkah demi langkah untuk meningkatkan jangkauan dan interaksi setiap harinya.',
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
    bg: 'bg-purple-100',
    title: 'AI Assistant',
    desc: 'Tanya jawab langsung dengan asisten AI yang dilatih khusus untuk strategi konten creator.',
  },
]

const steps = [
  { num: '1', title: 'Masukkan data akun', desc: 'Hubungkan media sosial atau upload riwayat data Anda dengan aman.' },
  { num: '2', title: 'Sistem menganalisis', desc: 'Sistem kami mengolah data performa konten dalam hitungan detik.' },
  { num: '3', title: 'AI menghasilkan insight', desc: 'Dapatkan visualisasi data yang mudah dimengerti dan poin penting yang relevan.' },
  { num: '4', title: 'Dapatkan rekomendasi', desc: 'Terapkan strategi pertumbuhan yang disarankan dan pantau hasilnya.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-lavender-50 font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">CreatorLens AI</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-semibold text-white rounded-full bg-gradient-primary hover:opacity-90 transition-all shadow-md hover:shadow-purple-200"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 pt-20 pb-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Zap className="w-3 h-3" />
              AI-POWERED OPTIMIZATION
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Analisis Performa Akun{' '}
              <span className="gradient-text">UMKM & Kreator Anda</span> dengan AI
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              Dapatkan insight mendalam tentang konten Anda, rekomendasi strategi konten, dan tips pertumbuhan menggunakan bantuan AI.
            </p>
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-purple-300 flex items-center gap-2"
              >
                Mulai Analisis <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-purple-300 hover:text-purple-600 transition-all">
                Lihat Demo
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">
                🚀 Prototype analisis untuk UMKM dan kreator kecil
              </span>
            </div>
          </div>

          {/* Right - Mockup */}
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-5 w-full max-w-sm border border-gray-100 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Creator Workspace</p>
                  <p className="text-xs text-gray-400">Analisis berbasis data input</p>
                </div>
                <div className="flex gap-1.5">
                  {['#EF4444','#FBBF24','#10B981'].map((c,i) => (
                    <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Engagement Rate</p>
                  <p className="text-xl font-bold text-gray-900">8.42%</p>
                  <p className="text-xs text-green-500 font-medium mt-1">↑ +12%</p>
                </div>
                <div className="bg-pink-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Total Reach</p>
                  <p className="text-xl font-bold text-gray-900">1.2M</p>
                  <p className="text-xs text-green-500 font-medium mt-1">↑ +5.4%</p>
                </div>
              </div>
              {/* Mini Chart Bars */}
              <div className="flex items-end gap-1.5 h-20 mb-4">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      background: i === 9 || i === 11 ? 'linear-gradient(180deg, #7C3AED, #a78bfa)' : '#E9D5FF'
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mb-4">
                {['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(d => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-purple-50 rounded-xl p-3">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">AI Insights Ready</p>
                  <p className="text-xs text-gray-500">3 new recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Fitur Cerdas untuk Kreativitas Tanpa Batas</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Dirancang untuk membantu Anda memahami audiens dengan lebih baik melalui kekuatan data.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-8 bg-lavender-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Bagaimana CreatorLens AI Bekerja</h2>
            <p className="text-gray-500">Hanya butuh beberapa menit untuk mulai mengoptimalkan konten Anda.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-primary text-white font-bold text-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200">
                  {s.num}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto bg-gradient-primary rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-10 w-32 h-32 rounded-full bg-white" />
            <div className="absolute bottom-4 left-10 w-20 h-20 rounded-full bg-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3 relative z-10">Siap Mengoptimalkan Konten Anda?</h2>
          <p className="text-purple-100 mb-8 max-w-xl mx-auto relative z-10">
            Gunakan sistem asisten analisis performa konten berbasis kecerdasan buatan untuk merancang strategi berikutnya.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap relative z-10">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-all shadow-lg cursor-pointer"
            >
              Mulai Sekarang
            </button>
            <span className="px-8 py-3 border border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all cursor-default">
              Prototype Mode
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-gray-800">CreatorLens AI</p>
            <p className="text-xs text-gray-400 mt-1">© 2024 CreatorLens AI. Empowering Analyzers.</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            {/* Twitter / X */}
            <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
