import { useState, useEffect } from 'react'
import { Eye, EyeOff, Save, Search, Bell, HelpCircle, Sun, Moon, Globe, ExternalLink, CheckCircle, Key, Palette, Trash2, RefreshCw } from 'lucide-react'
import { clearAnalysisCache } from '../../utils/cache'

export default function Settings() {
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [savedTime, setSavedTime] = useState('')
  const [savedStatus, setSavedStatus] = useState(false)
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('indonesia')
  const [searchQuery, setSearchQuery] = useState('')
  const [cacheClearedStatus, setCacheClearedStatus] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('gemini_api_key')
    if (stored) setApiKey(stored)
    const time = localStorage.getItem('gemini_api_key_saved')
    if (time) setSavedTime(time)
  }, [])

  const handleSaveApiKey = () => {
    const trimmed = apiKey.trim()
    localStorage.setItem('gemini_api_key', trimmed)
    setApiKey(trimmed)
    const now = new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
    localStorage.setItem('gemini_api_key_saved', now)
    setSavedTime(now)
    setSavedStatus(true)
    setTimeout(() => setSavedStatus(false), 2500)
  }

  const handleDeleteApiKey = () => {
    localStorage.removeItem('gemini_api_key')
    localStorage.removeItem('gemini_api_key_saved')
    setApiKey('')
    setSavedTime('')
    alert('Gemini API Key telah dihapus dari browser Anda.')
  }

  const handleClearCache = () => {
    clearAnalysisCache()
    setCacheClearedStatus(true)
    setTimeout(() => setCacheClearedStatus(false), 2500)
  }

  return (
    <div className="min-h-screen bg-lavender-50 font-sans">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
        <div className="flex-1 max-w-xs relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search settings..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-lavender-100 border border-transparent rounded-xl text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button className="w-9 h-9 rounded-xl bg-lavender-100 flex items-center justify-center text-gray-500 hover:text-purple-600 hover:bg-purple-100 transition-all">
            <Bell className="w-4.5 h-4.5" />
          </button>
          <button className="w-9 h-9 rounded-xl bg-lavender-100 flex items-center justify-center text-gray-500 hover:text-purple-600 hover:bg-purple-100 transition-all">
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <div className="p-8 max-w-3xl space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your workspace configuration and preferences for KREASIA.</p>
        </div>

        {/* API Configuration */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
              <Key className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">API Configuration</h2>
              <p className="text-sm text-gray-400 mt-0.5">Connect your external AI models to power your analysis.</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Gemini API Key</label>
            <div className="relative">
              <input
                id="api-key-input"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="AIzaSy••••••••••••••••••••••••••••••••••"
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <button
              id="save-api-key-btn"
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim()}
              className="px-5 py-2 bg-gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {savedStatus ? (
                <><CheckCircle className="w-4 h-4" /> Tersimpan!</>
              ) : (
                <><Save className="w-4 h-4" /> Simpan API Key</>
              )}
            </button>

            {apiKey && (
              <button
                id="delete-api-key-btn"
                onClick={handleDeleteApiKey}
                className="px-5 py-2 border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Hapus API Key
              </button>
            )}

            <button
              id="clear-cache-btn"
              onClick={handleClearCache}
              className="px-5 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              {cacheClearedStatus ? (
                <><CheckCircle className="w-4 h-4 text-green-500" /> Cache Dibersihkan!</>
              ) : (
                <><RefreshCw className="w-4 h-4" /> Bersihkan Cache Analisis</>
              )}
            </button>

            {savedTime && (
              <div className="flex items-center gap-1.5 text-sm text-gray-400 ml-auto">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Last saved: {savedTime}
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-700 leading-relaxed">
              🔒 API Key Anda disimpan secara lokal di browser Anda. Penyimpanan API key di localStorage hanya untuk keperluan prototype / demo.
              Anda bisa mendapatkan Gemini API Key gratis di{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-purple-600 underline font-medium">
                Google AI Studio
              </a>
              .
            </p>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center shrink-0">
              <Palette className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Theme</h2>
              <p className="text-sm text-gray-400 mt-0.5">Choose your preferred visual experience.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Light Mode */}
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                theme === 'light' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sun className="w-4 h-4 text-amber-500" />
                <div className={`w-3 h-3 rounded-full border-2 ${theme === 'light' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'}`} />
              </div>
              <p className="font-semibold text-gray-800 text-sm">Light Mode</p>
              <p className="text-xs text-gray-400 mt-0.5">Optimized for productivity and daylight.</p>
              <div className="mt-3 h-8 bg-gray-100 rounded-lg" />
            </button>
            {/* Dark Mode */}
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border-2 transition-all text-left bg-gray-900 ${
                theme === 'dark' ? 'border-purple-500' : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-4 h-4 text-gray-300" />
                <div className={`w-3 h-3 rounded-full border-2 ${theme === 'dark' ? 'border-purple-500 bg-purple-500' : 'border-gray-600'}`} />
              </div>
              <p className="font-semibold text-gray-300 text-sm">Dark Mode</p>
              <p className="text-xs text-gray-500 mt-0.5">Easy on the eyes in low-light environments.</p>
              <div className="mt-3 h-8 bg-gray-800 rounded-lg" />
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Language</h2>
              <p className="text-sm text-gray-400 mt-0.5">Select the primary language for your dashboard interface.</p>
            </div>
          </div>
          <select
            id="language-select"
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all bg-white appearance-none cursor-pointer"
          >
            <option value="indonesia">Indonesia</option>
            <option value="english">English</option>
            <option value="malay">Bahasa Melayu</option>
            <option value="japanese">日本語</option>
          </select>
          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Some specialized analysis reports may remain in their original source language.
          </p>
        </div>

        {/* Power up card */}
        <div className="bg-lavender-100 border border-purple-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-purple-700 mb-2">Power up your workflow</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Explore the documentation to find out how to integrate KREASIA with your existing content pipeline.
          </p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
          >
            View Documentation <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 px-8 py-5 border-t border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800 text-sm">KREASIA</p>
            <p className="text-xs text-gray-400 mt-0.5">© 2024 KREASIA. Empowering Visionary Creators.</p>
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-400">
            <a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
