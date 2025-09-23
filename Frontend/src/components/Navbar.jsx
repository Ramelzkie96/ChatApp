import React, { useState } from "react";
import { Bell, User, Key, LogOut, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm relative">
      {/* App title */}
      <h1 className="text-lg font-bold text-blue-600">ChatApp</h1>

      <div className="flex items-center space-x-6">
        {/* Notification bell */}
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <div
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded-full"
            onClick={() => setOpen(!open)}
          >
            <img
              src="https://i.pravatar.cc/40?img=30"
              alt="User"
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">John Doe</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          {/* Dropdown Card */}
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                Edit Profile
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Key className="w-4 h-4 mr-2 text-gray-500" />
                Change Password
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
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
