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
    // ✅ Full screen layout
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar stays fixed at the top */}
      <div className="flex-shrink-0">
        <Navbar />
      </div>

      {/* Main Content Area (fills remaining space) */}
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar */}
        <div className="w-1/4 border-r border-gray-200 bg-white overflow-y-auto">
          <Sidebar onSelectChat={setSelectedChat} /> {/* ✅ pass handler */}
        </div>

        {/* ✅ Center Chat Window (scrollable message area inside ChatWindow) */}
        <div className="flex-1 flex flex-col border-r border-gray-200 bg-gray-50 min-h-0">
          <ChatWindow selectedChat={selectedChat} />
        </div>

        {/* Right Profile Panel */}
        <div className="w-1/4 bg-white overflow-y-auto">
          <ProfilePanel selectedChat={selectedChat} /> {/* optional */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
