import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";

const fakeLeaderboard = [
  { name: "Alice", score: 98 },
  { name: "Bob", score: 95 },
  { name: "Charlie", score: 93 },
  { name: "David", score: 91 },
  { name: "Eva", score: 89 },
  { name: "Frank", score: 87 },
  { name: "Grace", score: 85 },
  { name: "Helen", score: 83 },
  { name: "Ivan", score: 81 },
  { name: "Judy", score: 80 },
];

const quizStats = [
  { label: "Jan", value: 10 },
  { label: "Feb", value: 15 },
  { label: "Mar", value: 8 },
  { label: "Apr", value: 12 },
  { label: "May", value: 18 },
  { label: "Jun", value: 14 },
];

const rewards = [
  { icon: "🏅", label: "Quiz Master", desc: "Completed 10 quizzes" },
  {
    icon: "🎯",
    label: "Consistent Learner",
    desc: "Logged in 7 days in a row",
  },
  { icon: "📈", label: "Top Scorer", desc: "Scored above 90% in 3 quizzes" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Quiz Analytics",
      description:
        "Detailed insights into quiz performance and user engagement.",
      icon: "📊",
      color: "blue",
      path: "/quizzes",
    },
    {
      title: "Session Management",
      description: "Monitor and manage ongoing user sessions.",
      icon: "🎯",
      color: "orange",
      path: "/session",
    },
    {
      title: "My Documents",
      description: "View and manage personal documents.",
      icon: "📄",
      color: "red",
      path: "/documents",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-purple-700">
        Centralized Dashboard
      </h1>
      <p className="mb-8 text-gray-600">
        Navigate through different modules and analytics.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {cards.map((card) => (
          <DashboardCard
            key={card.path}
            {...card}
            onClick={() => navigate(card.path)}
          />
        ))}
      </div>

      {/* Progress Graph */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          Your Quiz Progress (Last 6 Months)
        </h2>
        <div className="flex items-end h-40 space-x-4">
          {quizStats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div
                className="bg-purple-400 w-8 rounded-t"
                style={{ height: `${stat.value * 8}px` }}
                title={stat.value}
              ></div>
              <span className="mt-2 text-sm text-gray-600">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          Your Rewards
        </h2>
        <div className="flex flex-wrap gap-6">
          {rewards.map((reward) => (
            <div
              key={reward.label}
              className="flex items-center gap-4 bg-purple-50 rounded-lg px-4 py-3 shadow"
            >
              <span className="text-3xl">{reward.icon}</span>
              <div>
                <div className="font-bold text-purple-700">{reward.label}</div>
                <div className="text-gray-600 text-sm">{reward.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          Leaderboard
        </h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4">Rank</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {fakeLeaderboard.map((student, idx) => (
              <tr
                key={student.name}
                className={idx < 3 ? "font-bold text-purple-700" : ""}
              >
                <td className="py-2 px-4">{idx + 1}</td>
                <td className="py-2 px-4">{student.name}</td>
                <td className="py-2 px-4">{student.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
