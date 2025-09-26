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
import Wellness from "../pages/Wellness";
import Users from "../pages/Users";
import ProtectedRoute from "./ProtectedRoute";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import StudyRoomManagement from "../pages/admin/StudyRoomManagement";
import ContentAITools from "../pages/admin/ContentAITools";
import MockTestAnalytics from "../pages/admin/MockTestAnalytics";
import LeaderboardControls from "../pages/admin/LeaderboardControls";
import SystemMonitoring from "../pages/admin/SystemMonitoring";
import EngagementFeedback from "../pages/admin/EngagementFeedback";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-white">
        <Header />
        <main className="flex-1 p-8">
          <Routes>
            {/* Student Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/study-rooms" element={<StudyRooms />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/study-planner" element={<StudyPlanner />} />
            <Route path="/wellness" element={<Wellness />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/study-rooms" element={
              <ProtectedRoute requiredRole="admin">
                <StudyRoomManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/content-ai" element={
              <ProtectedRoute requiredRole="admin">
                <ContentAITools />
              </ProtectedRoute>
            } />
            <Route path="/admin/mock-tests" element={
              <ProtectedRoute requiredRole="admin">
                <MockTestAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/admin/leaderboards" element={
              <ProtectedRoute requiredRole="admin">
                <LeaderboardControls />
              </ProtectedRoute>
            } />
            <Route path="/admin/system" element={
              <ProtectedRoute requiredRole="admin">
                <SystemMonitoring />
              </ProtectedRoute>
            } />
            <Route path="/admin/engagement" element={
              <ProtectedRoute requiredRole="admin">
                <EngagementFeedback />
              </ProtectedRoute>
            } />
            
            {/* Legacy Admin Route */}
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
