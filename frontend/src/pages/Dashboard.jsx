import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const weeklyProgress = [
  { day: "Mon", value: 75 },
  { day: "Tue", value: 85 },
  { day: "Wed", value: 60 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 95 },
  { day: "Sat", value: 80 },
  { day: "Sun", value: 70 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isStudent } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">🎓</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Current Streak */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Current Streak</h3>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">7 days</div>
          <p className="text-sm text-gray-500">Keep it going!</p>
        </div>

        {/* Syllabus Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Syllabus Progress</h3>
            <span className="text-2xl">📚</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">68%</div>
          <p className="text-sm text-gray-500">+4% this week</p>
        </div>

        {/* Badges Earned */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Badges Earned</h3>
            <span className="text-2xl">🏅</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">5</div>
          <p className="text-sm text-gray-500">Great progress!</p>
        </div>

        {/* Next Focus Area */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Next Focus Area</h3>
            <span className="text-2xl">🧠</span>
          </div>
          <div className="text-lg font-semibold text-gray-900 mb-1">Electrostatics</div>
          <p className="text-sm text-gray-500">Revise Gauss's Law and practice 3 problems.</p>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Progress</h2>
        <div className="flex items-end justify-between h-40 space-x-2">
          {weeklyProgress.map((day, index) => (
            <div key={day.day} className="flex flex-col items-center flex-1">
              <div
                className="bg-blue-500 w-full rounded-t transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(day.value / 100) * 120}px` }}
                title={`${day.value}%`}
              ></div>
              <span className="mt-2 text-xs text-gray-600 font-medium">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-gray-800 font-medium">
              Small steps every day lead to big results. Keep going 🚀
            </p>
            <p className="text-sm text-gray-600 mt-1">
              You're making great progress! Stay consistent and you'll achieve your goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
