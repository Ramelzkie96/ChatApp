// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ProfilePanel from "../components/ProfilePanel";

const Dashboard = () => {
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState(null);

  // ✅ Load saved chat from localStorage on first render
  useEffect(() => {
    const savedChat = localStorage.getItem("selectedChat");
    if (savedChat) {
      setSelectedChat(JSON.parse(savedChat));
    }
  }, []);

  // ✅ Save selected chat to localStorage whenever it changes
  useEffect(() => {
    if (selectedChat) {
      localStorage.setItem("selectedChat", JSON.stringify(selectedChat));
    }
  }, [selectedChat]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <div className="flex-shrink-0">
        <Navbar />
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="w-1/4 border-r border-gray-200 bg-white overflow-y-auto">
          <Sidebar onSelectChat={setSelectedChat} />
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col border-r border-gray-200 bg-gray-50 min-h-0">
          <ChatWindow selectedChat={selectedChat} />
        </div>

        {/* Profile Panel */}
        <div className="w-1/4 bg-white overflow-y-auto">
          <ProfilePanel selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
