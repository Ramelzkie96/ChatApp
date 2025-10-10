import React, { useEffect, useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import UnreadChats from "./Sidebar/UnreadChats";
import RequestChats from "./Sidebar/RequestChats";
import AllChats from "./Sidebar/AllChats";
import GroupsChats from "./Sidebar/GroupsChats";
import ChatSearchArea from "./Sidebar/ChatSearchArea";

const Sidebar = ({ onSelectChat }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 👇 Example counters — replace these with backend counts later
  const [unreadCount, setUnreadCount] = useState(3);
  const [groupCount, setGroupCount] = useState(5);
  const [requestCount, setRequestCount] = useState(2);

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

  const handleBackFromSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
    setActiveCategory("All");
  };

  const renderCategory = () => {
    switch (activeCategory) {
      case "Unread":
        return <UnreadChats onSelectChat={onSelectChat} />;
      case "Groups":
        return <GroupsChats onSelectChat={onSelectChat} />;
      case "Request":
        return <RequestChats onSelectChat={onSelectChat} />;
      default:
        return (
          <AllChats
            currentUserId={currentUser?.id}
            onSelectChat={onSelectChat}
          />
        );
    }
  };

 const renderBadge = (count) => {
  if (!count || count <= 0) return null;
  return (
    <span className="absolute -top-1 -right-0.2 bg-red-500 text-white text-[10px] font-bold rounded-full px-[5px] py-[1px] shadow-sm">
      {count}
    </span>
  );
};


  const categories = [
    { name: "All" },
    { name: "Unread", count: unreadCount },
    { name: "Groups", count: groupCount },
    { name: "Request", count: requestCount },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header Search Bar */}
      <div className="p-3 flex items-center">
        <div className="relative flex-1 flex items-center">
          {isSearching ? (
            <button
              onClick={handleBackFromSearch}
              className="absolute left-3 top-2.5 text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          )}

          <input
            type="text"
            placeholder="Search Messenger"
            className="w-full py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
          />
        </div>
      </div>

      {/* 👇 Search results vs normal chat list */}
      {isSearching ? (
        <ChatSearchArea
          searchQuery={searchQuery}
          onBack={handleBackFromSearch}
          onSelectChat={(chat) => {
            onSelectChat(chat);
            handleBackFromSearch();
          }}
        />
      ) : (
        <>
          {/* Category Buttons with Badges */}
          <div className="flex justify-between px-3 border-b border-gray-200 relative">
            {categories.map(({ name, count }) => (
              <div key={name} className="relative flex-1 text-center">
                <button
                  onClick={() => setActiveCategory(name)}
                  className={`relative w-full py-2 text-sm font-semibold border-b-2 cursor-pointer ${
                    activeCategory === name
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 border-transparent hover:text-gray-800"
                  }`}
                >
                  {name}
                  {name !== "All" && renderBadge(count)}
                </button>
              </div>
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
