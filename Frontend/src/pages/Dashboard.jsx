import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar"; // ✅ import new Navbar
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ProfilePanel from "../components/ProfilePanel";

const Dashboard = () => {
  const location = useLocation();
  const toastShown = useRef(false);

  useEffect(() => {
    if (location.state?.showSuccess && !toastShown.current) {
      toast.success("Login successful! 🚀");
      toastShown.current = true;

      // Clear state after showing toast
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [location.state]);

  return (
    <div className="h-screen flex flex-col">
      {/* 🔹 Top Navbar */}
      <Navbar />

      {/* 🔹 Main Layout */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-1/4 border-r border-gray-200 bg-white">
          <Sidebar />
        </div>

        {/* Center Chat Window */}
        <div className="flex-1 border-r border-gray-200 bg-gray-50">
          <ChatWindow />
        </div>

        {/* Right Profile Panel */}
        <div className="w-1/4 bg-white">
          <ProfilePanel />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
