import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      navigate('/dashboard/analysis')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-lavender-100 flex flex-col items-center justify-center px-4 py-12">
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 animate-slide-up">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full border-2 border-purple-500 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-purple-600" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Masuk ke KREASIA</h1>
        <p className="text-sm text-gray-500 text-center mb-8">Lanjutkan perjalanan konten Anda dengan AI</p>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="email-input"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700">Kata Sandi</label>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium">Lupa Password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Masuk <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">Atau masuk dengan</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="google-login-btn"
            className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button
            id="instagram-login-btn"
            className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig)" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" stroke="url(#ig2)" strokeWidth="2"/>
              <circle cx="17.5" cy="6.5" r="1" fill="#E1306C"/>
              <defs>
                <linearGradient id="ig" x1="2" y1="2" x2="22" y2="22">
                  <stop stopColor="#F58529"/><stop offset="0.5" stopColor="#E1306C"/><stop offset="1" stopColor="#833AB4"/>
                </linearGradient>
                <linearGradient id="ig2" x1="8" y1="8" x2="16" y2="16">
                  <stop stopColor="#F58529"/><stop offset="0.5" stopColor="#E1306C"/><stop offset="1" stopColor="#833AB4"/>
                </linearGradient>
              </defs>
            </svg>
            Instagram
          </button>
        </div>

        {/* Register link */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Belum punya akun?{' '}
          <a href="#" className="text-purple-600 font-semibold hover:text-purple-700">Daftar sekarang</a>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400 mb-2">© 2024 KREASIA. Empowering visionaries.</p>
        <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
          <a href="#" className="hover:text-purple-600 transition-colors">Syarat & Ketentuan</a>
          <span>·</span>
          <a href="#" className="hover:text-purple-600 transition-colors">Privasi</a>
          <span>·</span>
          <a href="#" className="hover:text-purple-600 transition-colors">Bantuan</a>
        </div>
      </div>
    </div>
  )
}
