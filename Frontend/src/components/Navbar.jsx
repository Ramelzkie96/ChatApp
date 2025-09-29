import React, { useState, useEffect } from "react";
import { Bell, User, Key, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsed = JSON.parse(storedUser);
    console.log("Loaded user from localStorage:", parsed);
    setUser(parsed);
  }
}, []);


  const handleLogout = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const response = await fetch("https://localhost:7085/api/users/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Logged out successfully");
      } else {
        toast.error("Logout failed!");
      }
    } catch (err) {
      console.error("Logout request failed:", err);
      toast.error("Server error while logging out");
    }
  }

  // ✅ Delay navigation slightly so user sees the toast
  setTimeout(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  }, 500);
};

  return (
    <div className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm relative">
      <h1 className="text-lg font-bold text-blue-600">ChatApp</h1>

      <div className="flex items-center space-x-6">
        {/* Notification */}
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <div
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded-full"
            onClick={() => setOpen(!open)}
          >
            <img
  src={
    user?.profilePictureUrl
      ? `https://localhost:7085${user.profilePictureUrl}` // prepend backend URL
      : "/images/user-image.jpg" // fallback from public/images
  }
  alt="User"
  className="w-9 h-9 rounded-full object-cover"
/>

<span className="text-sm font-medium text-gray-700">
  {user?.username || "Guest"}
</span>

            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
              <button className="flex items-center w-full px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                Edit Profile
              </button>
              <button className="flex items-center w-full px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100">
                <Key className="w-4 h-4 mr-2 text-gray-500" />
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 cursor-pointer py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2 text-red-500" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
