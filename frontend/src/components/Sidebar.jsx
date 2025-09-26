import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const { user, logout, isAdmin, isStudent } = useAuth()

  const studentMenuItems = [
    { path: '/', label: 'Dashboard', icon: '🎓' },
    { path: '/study-rooms', label: 'Study Rooms', icon: '👥' },
    { path: '/notes', label: 'Notes & Summaries', icon: '📚' },
    { path: '/quizzes', label: 'Quizzes & Mock Tests', icon: '✏️' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/study-planner', label: 'Study Planner', icon: '📅' },
    { path: '/wellness', label: 'Wellness Dashboard', icon: '🧠' },
    { path: '/settings', label: 'Settings / Profile', icon: '⚙️' }
  ]

  const adminMenuItems = [
    { path: '/', label: 'Admin Dashboard', icon: '👑' },
    { path: '/admin/users', label: 'User Management', icon: '👥' },
    { path: '/admin/study-rooms', label: 'Study Room Management', icon: '🏠' },
    { path: '/admin/content-ai', label: 'Content & AI Tools', icon: '📄' },
    { path: '/admin/mock-tests', label: 'Mock Test Analytics', icon: '📊' },
    { path: '/admin/leaderboards', label: 'Leaderboard Controls', icon: '🏆' },
    { path: '/admin/system', label: 'System Monitoring', icon: '🔧' },
    { path: '/admin/engagement', label: 'Engagement & Feedback', icon: '📈' },
    { path: '/settings', label: 'Settings / Profile', icon: '⚙️' }
  ]

  const menuItems = isAdmin() ? adminMenuItems : studentMenuItems

  return (
    <aside className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Study Buddy</h2>
        </div>
        <div className="text-sm text-gray-600">
          <div className="font-medium">{user?.name}</div>
          <div className="capitalize text-gray-500">{user?.role}</div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Navigate</h3>
        <nav className="flex flex-col gap-1">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                location.pathname === item.path 
                  ? 'bg-gray-200 text-gray-900 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-4 border-t border-gray-200">
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition w-full text-left"
          onClick={logout}
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar