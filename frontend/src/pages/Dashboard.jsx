import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import DailyPsychologyTest from "../components/DailyPsychologyTest";
import AdminDashboard from "./admin/AdminDashboard";
import StressCheckModal from "../components/StressCheckModal";
import aiService from "../services/aiService";
import studyRoomService from "../services/studyRoomService";
import api from "../services/api";

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
  const [showPsychologyTest, setShowPsychologyTest] = useState(false);
  const [showStressCheck, setShowStressCheck] = useState(false);
  const [todayTestStatus, setTodayTestStatus] = useState(null);
  const [recentRooms, setRecentRooms] = useState([]);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [weakTopics, setWeakTopics] = useState([]);
  const [strongTopics, setStrongTopics] = useState([]);

  // Show admin dashboard for admins
  if (isAdmin()) {
    return <AdminDashboard />;
  }

  useEffect(() => {
    checkTodayTestStatus();
    fetchDashboardData();
    checkStressCheckStatus();
  }, []);

  const checkStressCheckStatus = async () => {
    try {
      const response = await api.get("/v8/psychology/today-status");
      const lastCheck = response.data?.data?.lastStressCheck;
      const today = new Date().toISOString().split('T')[0];
      
      if (!lastCheck || new Date(lastCheck).toISOString().split('T')[0] !== today) {
        setShowStressCheck(true);
      }
    } catch (error) {
      console.error("Error checking stress status:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch recent study rooms
      const roomsResponse = await studyRoomService.getRooms({ isActive: true });
      setRecentRooms(roomsResponse.data.rooms.slice(0, 3));

      // Fetch motivational message
      const messageResponse = await aiService.getMotivationalMessage(
        user?.stressLevel || 'moderate',
        'Making good progress'
      );
      setMotivationalMessage(messageResponse.data.message);

      // Mock data for topics (replace with actual API call)
      setWeakTopics(['Data Structures', 'Algorithms', 'Operating Systems']);
      setStrongTopics(['Mathematics', 'Programming', 'Database']);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const checkTodayTestStatus = async () => {
    try {
      const response = await api.get("/v8/psychology/today-status");
      const hasTakenToday = response.data.data.hasTakenToday;
      setTodayTestStatus(response.data.data);
      
      // Show test if user hasn't taken it today and is a student
      if (!hasTakenToday && isStudent()) {
        setShowPsychologyTest(true);
      }
    } catch (error) {
      console.error("Error checking test status:", error);
    }
  };

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

      {/* New Dashboard Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Tracker */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Tracker</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-red-600 mb-2">Weak Topics (Need Focus)</h3>
              <div className="space-y-2">
                {weakTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <span className="text-sm text-red-800">{topic}</span>
                    <button className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                      Practice
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-600 mb-2">Strong Topics</h3>
              <div className="space-y-2">
                {strongTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-800">{topic}</span>
                    <span className="text-xs text-green-600">✓ Mastered</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Study Room Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Study Rooms</h2>
            <button
              onClick={() => navigate('/study-rooms')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentRooms.length > 0 ? (
              recentRooms.map((room) => (
                <div key={room._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{room.name}</p>
                    <p className="text-sm text-gray-500">{room.members.length} members • {room.subject}</p>
                  </div>
                  <button
                    onClick={() => navigate('/study-rooms')}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Join
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Access to Notes & Summarizer */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/notes')}
            className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="text-2xl mb-2">📚</div>
            <div className="text-sm font-medium">Notes & Summarizer</div>
            <div className="text-xs text-gray-500">AI-powered study tools</div>
          </button>
          <button
            onClick={() => navigate('/study-rooms')}
            className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="text-sm font-medium">Study Rooms</div>
            <div className="text-xs text-gray-500">Collaborative learning</div>
          </button>
          <button
            onClick={() => navigate('/quizzes')}
            className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="text-2xl mb-2">❓</div>
            <div className="text-sm font-medium">Mock Tests</div>
            <div className="text-xs text-gray-500">Practice & assessment</div>
          </button>
        </div>
      </div>

      {/* Leaderboard Highlights */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Leaderboard Highlights</h2>
          <button
            onClick={() => navigate('/leaderboard')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View Full Leaderboard
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl mb-2">🥇</div>
            <div className="font-medium text-gray-900">Aarav Shah</div>
            <div className="text-sm text-gray-500">2,450 points</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">🥈</div>
            <div className="font-medium text-gray-900">Priya Patel</div>
            <div className="text-sm text-gray-500">2,320 points</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl mb-2">🥉</div>
            <div className="font-medium text-gray-900">Rahul Kumar</div>
            <div className="text-sm text-gray-500">2,180 points</div>
          </div>
        </div>
      </div>

      {/* AI Motivational Message */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="text-gray-800 font-medium">
              {motivationalMessage || "Small steps every day lead to big results. Keep going 🚀"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Personalized message based on your stress level and progress.
            </p>
          </div>
        </div>
      </div>

      {/* Psychology Test Modal */}
      {showPsychologyTest && (
        <DailyPsychologyTest 
          onClose={() => setShowPsychologyTest(false)}
          onComplete={() => {
            setShowPsychologyTest(false);
            checkTodayTestStatus(); // Refresh status
          }}
        />
      )}

      {/* Stress Check Modal */}
      <StressCheckModal
        isOpen={showStressCheck}
        onClose={() => {
          setShowStressCheck(false);
          localStorage.setItem('lastStressCheck', new Date().toDateString());
        }}
      />
    </div>
  );
};

export default Dashboard;
