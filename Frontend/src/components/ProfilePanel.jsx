// src/components/ProfilePanel.jsx
import React, { useState } from "react";
import {
  User,
  Bell,
  Search,
  Image,
  FileText,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";

const ProfilePanel = ({ selectedChat }) => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a chat to view profile
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white text-gray-800 flex flex-col border-l border-gray-200">
      {/* Profile header */}
      <div className="flex flex-col items-center py-6 px-4 border-b border-gray-200 mt-4">
        <img
          src={selectedChat.avatar}
          alt={selectedChat.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <h2 className="mt-3 text-lg font-semibold">{selectedChat.name}</h2>

        {/* Encryption badge */}
        <span className="mt-1 px-3 py-1 text-xs bg-gray-100 border rounded-full flex items-center space-x-1 border-gray-200">
          <Shield className="w-3 h-3 text-gray-600" />
          <span>End-to-end encrypted</span>
        </span>

        {/* Quick actions */}
        <div className="flex space-x-10 mt-4">
          <div className="flex flex-col items-center cursor-pointer hover:text-blue-600">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-blue-600">
            <Bell className="w-6 h-6" />
            <span className="text-xs mt-1">Mute</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-blue-600">
            <Search className="w-6 h-6" />
            <span className="text-xs mt-1">Search</span>
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="flex-1 overflow-y-auto">
        {[
          { title: "Chat info" },
          { title: "Customize chat" },
          { title: "Media & files", children: ["Media", "Files"] },
          { title: "Privacy & support" },
        ].map((section, idx) => (
          <div key={idx} className="border-b border-gray-200">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex justify-between items-center px-5 py-3 hover:bg-gray-50"
            >
              <span className="font-medium">{section.title}</span>
              {openSection === section.title ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {openSection === section.title && section.children && (
              <div className="pl-10 pr-5 pb-3 space-y-2 text-sm text-gray-600">
                {section.children.map((child, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-2 hover:text-blue-600 cursor-pointer"
                  >
                    {child === "Media" && <Image className="w-4 h-4" />}
                    {child === "Files" && <FileText className="w-4 h-4" />}
                    <span>{child}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePanel;
