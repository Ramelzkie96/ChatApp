// Dashboard.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ProfilePanel from "../components/ProfilePanel";

const Dashboard = () => {
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState(null); // ✅ track selected chat

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-1/4 border-r border-gray-200 bg-white">
          <Sidebar onSelectChat={setSelectedChat} /> {/* ✅ pass handler */}
        </div>

        {/* Center Chat Window */}
        <div className="flex-1 border-r border-gray-200 bg-gray-50">
          <ChatWindow selectedChat={selectedChat} /> {/* ✅ pass chat */}
        </div>

        {/* Right Profile Panel */}
        <div className="w-1/4 bg-white">
          <ProfilePanel selectedChat={selectedChat} /> {/* optional */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
