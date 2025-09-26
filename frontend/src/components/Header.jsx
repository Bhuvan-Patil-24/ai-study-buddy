import { useAuth } from "../contexts/AuthContext";
import { FaBell, FaWandMagicSparkles } from "react-icons/fa6";

const Header = () => {
  const { user } = useAuth();
  
  const motivationalQuotes = [
    "Practice makes progress.",
    "Every expert was once a beginner.",
    "Success is the sum of small efforts.",
    "Learning never exhausts the mind.",
    "The future belongs to the curious."
  ];
  
  const currentQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold text-gray-900">AI Study Buddy</div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-sm text-gray-600 italic">
          {currentQuote}
        </div>
        
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
            <FaBell size={18} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </button>
          
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
            <FaWandMagicSparkles size={18} />
          </button>
          
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
