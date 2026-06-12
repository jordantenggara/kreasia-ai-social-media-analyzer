import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BarChart2, MessageSquare, Settings, Zap, PlusCircle, LogOut } from 'lucide-react'

const navItems = [
  { to: '/dashboard/analysis', icon: BarChart2, label: 'Analysis' },
  { to: '/dashboard/ai-assistant', icon: MessageSquare, label: 'AI Assistant' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function DashboardLayout() {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-lavender-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-44 bg-lavender-100 flex flex-col shadow-sidebar shrink-0 border-r border-purple-100">
        {/* Logo */}
        <div className="p-5 pb-4 border-b border-purple-100">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">CreatorLens AI</span>
          </div>
          <p className="text-xs text-gray-400 mt-1 ml-0.5">Creator Workspace</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 pt-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-purple-700 shadow-sm border-l-2 border-purple-600'
                    : 'text-gray-600 hover:bg-white/60 hover:text-purple-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-purple-100 space-y-3">
          {/* Analyze Post Button */}
          <button
            onClick={() => navigate('/dashboard/analysis', { state: { openAddPostModal: true } })}
            className="w-full py-2.5 bg-gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Analyze Post
          </button>
          {/* User Info */}
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
              YS
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">Yogi Saputra</p>
              <p className="text-xs text-gray-400">Kreator UMKM</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
