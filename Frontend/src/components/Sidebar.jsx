// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { Search, ArrowLeft } from "lucide-react"; // ✅ Import ArrowLeft

import UnreadChats from "./Sidebar/UnreadChats";
import RequestChats from "./Sidebar/RequestChats";
import AllChats from "./Sidebar/AllChats"; // adjust path if needed
import GroupsChats from "./Sidebar/GroupsChats";

const Sidebar = ({ onSelectChat }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchChats = async () => {
      try {
        const res = await fetch(
          `https://localhost:7085/api/ChatList?currentUser=${currentUser.username}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const filteredChats = data.filter(
          (chat) => chat.name !== currentUser.username
        );
        setChats(filteredChats);
      } catch (err) {
        console.error("Failed to fetch chat list:", err);
      }
    };

    fetchChats();
  }, [currentUser]);

  // live filter for search
  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategory = () => {
    switch (activeCategory) {
      case "Unread":
        return <UnreadChats onSelectChat={onSelectChat} />;
      case "Groups":
        return <GroupsChats onSelectChat={onSelectChat} />;
      case "Request":
        return <RequestChats onSelectChat={onSelectChat} />;
      default:
        return <AllChats chats={chats} onSelectChat={onSelectChat} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Search / Header */}
      <div className="p-3 flex items-center">
        <div className="relative flex-1 flex items-center">
          {/* Back icon - only when searching */}
          {isSearching && (
            <ArrowLeft
              className="w-5 h-5 text-gray-600 cursor-pointer mr-2"
              onClick={() => {
                setIsSearching(false);
                setSearchQuery(""); // clear search when going back
              }}
            />
          )}

          {/* Search icon - only if not searching */}
          {!isSearching && (
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          )}

          <input
            type="text"
            placeholder="Search Messenger"
            className={`w-full py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isSearching ? "pl-4" : "pl-10"
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
          />
        </div>
      </div>

      {isSearching ? (
        <>
          <div className="px-3 py-2 border-b border-gray-200 font-semibold text-gray-700">
            Your Contacts
          </div>
          <div className="flex-1 overflow-y-auto mt-2">
            {/* pass filtered list + handler */}
            <AllChats chats={filteredChats} onSelectChat={onSelectChat} />
          </div>
        </>
      ) : (
        <>
          {/* Category Buttons */}
          <div className="flex justify-between px-3 border-b border-gray-200">
            {["All", "Unread", "Groups", "Request"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-1 py-2 text-sm font-semibold border-b-2 cursor-pointer ${
                  activeCategory === category
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto mt-5">{renderCategory()}</div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
