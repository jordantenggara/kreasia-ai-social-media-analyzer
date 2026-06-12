import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Image, Zap, Brain, AlertTriangle } from 'lucide-react'
import { getAllPosts } from '../../data/samplePosts'
import { runLocalAnalytics } from '../../utils/analytics'
import { buildAssistantSystemPrompt } from '../../utils/promptBuilder'
import { generateContent, getApiKey } from '../../services/geminiService'

const SUGGESTIONS = [
  { title: 'Konten mana yang performanya paling baik?', desc: 'Lihat postingan dengan tingkat interaksi tertinggi' },
  { title: 'Kenapa engagement rate saya rendah?', desc: 'Analisis faktor penyebab interaksi turun' },
  { title: 'Buatkan 5 ide konten untuk UMKM saya', desc: 'Ide kreatif pemasaran produk lokal' },
  { title: 'Buat caption dan hook untuk konten berikutnya', desc: 'Kata pembuka viral & copywriting menarik' },
  { title: 'Buat jadwal konten 7 hari', desc: 'Roadmap postingan mingguan terstruktur' },
  { title: 'Analisis jenis konten yang cocok dari data saya', desc: 'Rekomendasi format postingan terbaik' },
]

function TypingDot() {
  return (
    <div className="flex items-center gap-1 py-1 px-1">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 bg-purple-400 rounded-full typing-dot"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  )
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! Saya adalah **Creator Assistant** Anda. Saya siap membantu menyusun strategi konten media sosial untuk bisnis UMKM atau akun creator Anda.\n\nSaya telah membaca ringkasan data performa Anda dari dashboard. Ada yang ingin ditanyakan mengenai optimasi konten Anda hari ini?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const hasApiKey = !!getApiKey()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>')
  }

  const sendMessage = async (text) => {
    const userText = text || input.trim()
    if (!userText || loading) return

    const apiKey = getApiKey()
    if (!apiKey) {
      alert('⚠️ API Key belum diatur. Silakan masuk ke Settings dan input Gemini API Key Anda terlebih dahulu.')
      return
    }

    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setShowSuggestions(false)

    try {
      // Build current local summary and construct prompt context
      const posts = getAllPosts()
      const summary = runLocalAnalytics(posts)
      const systemPrompt = buildAssistantSystemPrompt(summary)

      const contents = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Siap! Saya Creator Assistant yang siap membantu strategi konten Anda.' }] },
        ...newMessages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1') }],
        })),
      ]

      const reply = await generateContent(contents)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ **Error**: ${err.message}\n\nPastikan API Key Anda valid dan aktif di halaman Settings.`,
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">Creator Assistant</h2>
            <p className="text-xs text-gray-400">AI-Powered Content Strategist for UMKM</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-400">Status</p>
            <p className="text-sm font-semibold text-purple-600">Prototype Mode</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
            YS
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-lavender-50/30">
        {/* Missing API Key warning banner inside the chat area */}
        {!hasApiKey && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 text-sm flex items-start gap-3 animate-fade-in max-w-2xl">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Gemini API Key Belum Diatur</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                Anda masih dapat melihat riwayat dashboard. Namun untuk mengajukan pertanyaan strategis kepada AI Assistant, silakan atur API Key Anda di halaman Settings terlebih dahulu.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                <Brain className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-xl px-5 py-4 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai text-gray-800'
              }`}
              dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
            />
            {msg.role === 'user' && (
              <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                YS
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center shrink-0 shadow-md">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="chat-bubble-ai px-5 py-3">
              <TypingDot />
            </div>
          </div>
        )}

        {/* Suggestion Cards */}
        {showSuggestions && messages.length <= 1 && (
          <div className="mt-6 animate-slide-up">
            <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Saran Pertanyaan:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s.title)}
                  disabled={loading || !hasApiKey}
                  className="text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-purple-700">{s.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="px-6 pb-5 pt-3 bg-white border-t border-gray-100 shrink-0">
        <div className="border border-purple-200 rounded-2xl bg-lavender-50 px-4 py-3 flex items-center gap-3 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
          <button className="text-gray-400 hover:text-purple-600 transition-colors shrink-0" disabled={loading || !hasApiKey}>
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasApiKey ? "Ketik pesan atau tanyakan strategi konten..." : "Masukkan API key di Settings untuk mulai bertanya..."}
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed"
            disabled={loading || !hasApiKey}
          />
          <button className="text-gray-400 hover:text-purple-600 transition-colors shrink-0" disabled={loading || !hasApiKey}>
            <Image className="w-5 h-5" />
          </button>
          <button
            id="send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim() || !hasApiKey}
            className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center hover:opacity-90 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          CreatorLens Assistant dapat membuat kesalahan. Periksa kembali rekomendasi penting.
        </p>
      </div>
    </div>
  )
}
