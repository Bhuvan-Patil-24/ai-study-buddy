import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Chats from "../pages/Chats";
import Session from "../pages/Session";
import Documents from "../pages/Documents";
import Team from "../pages/Team";
import Quizzes from "../pages/Quizzes";
import Profile from "../pages/Profile";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/session" element={<Session />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/team" element={<Team />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Layout;
