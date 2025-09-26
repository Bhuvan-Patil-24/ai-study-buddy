import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const { user, logout } = useAuth()

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/chats', label: 'My Chats', icon: '💭' },
    { path: '/session', label: 'Get Session', icon: '🎯' },
    { path: '/documents', label: 'My Documents', icon: '📄' },
    { path: '/team', label: 'User Team', icon: '👥' },
    { path: '/quizzes', label: 'My Quizzes', icon: '📝' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ]

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-purple-800 to-purple-600 text-white flex flex-col">
      <div className="p-6 border-b border-purple-700">
        <h2 className="text-2xl font-bold mb-2">AI BUDDY</h2>
        <div className="text-sm">
          <div className="font-semibold">{user?.name}</div>
          <div className="text-purple-200">{user?.role}</div>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-1 mt-4">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-purple-700 transition ${
              location.pathname === item.path ? 'bg-purple-700 font-semibold' : ''
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <button
          className="flex items-center gap-3 px-6 py-3 mt-auto hover:bg-purple-700 transition text-left"
          onClick={logout}
        >
          <span>🚪</span>
          Logout
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar