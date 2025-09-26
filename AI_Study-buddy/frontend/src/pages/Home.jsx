import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";

const Home = () => {
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
      {/* Profile Circle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/profile")}
          className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-2xl font-bold text-purple-700 shadow hover:bg-purple-300 transition"
          title="Go to Profile"
        >
          R
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-2 text-purple-700">
        Centralized Dashboard
      </h1>
      <p className="mb-8 text-gray-600">
        Navigate through different modules and analytics.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card) => (
          <DashboardCard
            key={card.path}
            {...card}
            onClick={() => navigate(card.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
