import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "../pages/Dashboard";
import StudyRooms from "../pages/StudyRooms";
import Notes from "../pages/Notes";
import Quizzes from "../pages/Quizzes";
import Leaderboard from "../pages/Leaderboard";
import StudyPlanner from "../pages/StudyPlanner";
import Settings from "../pages/Settings";
import Users from "../pages/Users";
import ProtectedRoute from "./ProtectedRoute";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-white">
        <Header />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/study-rooms" element={<StudyRooms />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/study-planner" element={<StudyPlanner />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/users" element={
              <ProtectedRoute requiredRole="admin">
                <Users />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Layout;
