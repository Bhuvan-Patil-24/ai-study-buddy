import { useState } from "react";

const StudyPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [studyGoal, setStudyGoal] = useState(2);

  const studySessions = [
    { time: "09:00", subject: "Mathematics", duration: "2h", completed: true },
    { time: "14:00", subject: "Physics", duration: "1.5h", completed: false },
    { time: "19:00", subject: "Chemistry", duration: "1h", completed: false },
  ];

  const weeklyGoals = [
    { day: "Mon", goal: 2, completed: 2.5, color: "bg-green-500" },
    { day: "Tue", goal: 2, completed: 1.8, color: "bg-yellow-500" },
    { day: "Wed", goal: 2, completed: 2.2, color: "bg-green-500" },
    { day: "Thu", goal: 2, completed: 1.5, color: "bg-red-500" },
    { day: "Fri", goal: 2, completed: 2.0, color: "bg-green-500" },
    { day: "Sat", goal: 3, completed: 2.8, color: "bg-yellow-500" },
    { day: "Sun", goal: 2, completed: 0, color: "bg-gray-300" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">📅</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Study Planner</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-4">
              {studySessions.map((session, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    session.completed
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-mono text-gray-600">{session.time}</div>
                      <div>
                        <h3 className="font-medium text-gray-900">{session.subject}</h3>
                        <p className="text-sm text-gray-600">{session.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.completed ? (
                        <span className="text-green-600 text-sm font-medium">✓ Completed</span>
                      ) : (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Add New Session
            </button>
          </div>
        </div>

        {/* Weekly Goals */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Goals</h2>
            
            <div className="space-y-3 mb-6">
              {weeklyGoals.map((day) => (
                <div key={day.day} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 w-8">{day.day}</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${day.color}`}
                        style={{ width: `${Math.min((day.completed / day.goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {day.completed}/{day.goal}h
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Daily Study Goal</h3>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={studyGoal}
                  onChange={(e) => setStudyGoal(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-semibold text-gray-900">{studyGoal}h</span>
              </div>
            </div>
          </div>

          {/* Study Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Study Tip</h3>
            <p className="text-sm text-gray-700">
              Break your study sessions into 25-minute focused intervals with 5-minute breaks. 
              This Pomodoro technique helps maintain concentration and prevents burnout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
