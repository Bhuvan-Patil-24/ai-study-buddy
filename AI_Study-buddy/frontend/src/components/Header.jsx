import { useAuth } from "../contexts/AuthContext";
import { FaBell } from "react-icons/fa";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
      <div className="text-2xl font-bold text-purple-700">GATE AI Tutor</div>
      <div className="flex items-center gap-6">
        <button className="relative text-purple-700 hover:text-purple-900">
          <FaBell size={22} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            2
          </span>
        </button>
        <div className="flex items-center gap-2">
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border border-purple-200"
          />
          <span className="font-medium text-gray-700">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
