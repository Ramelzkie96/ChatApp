import React from "react";
import { MoreVertical, Search } from "lucide-react";
import ChatListItem from "./ChatListItem";

const Sidebar = () => {

    const sampleChats = [
    {
      name: "John Doe",
      lastMessage: "Hey, how are you?",
      timeAgo: "2m ago",
      avatar: "https://i.pravatar.cc/40?img=1",
      isOnline: true,
    },
    {
      name: "Jane Smith",
      lastMessage: "Let’s catch up tomorrow!",
      timeAgo: "10m ago",
      avatar: "https://i.pravatar.cc/40?img=2",
      isOnline: false,
    },
    {
      name: "Mike Johnson",
      lastMessage: "Got the files?",
      timeAgo: "30m ago",
      avatar: "https://i.pravatar.cc/40?img=3",
      isOnline: true,
    },
    {
      name: "Emily Davis",
      lastMessage: "See you soon 😊",
      timeAgo: "1h ago",
      avatar: "https://i.pravatar.cc/40?img=4",
      isOnline: true,
    },
    {
      name: "Chris Brown",
      lastMessage: "Good night!",
      timeAgo: "3h ago",
      avatar: "https://i.pravatar.cc/40?img=5",
      isOnline: false,
    },
    
  ];


  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {/* Title */}
        <h1 className="text-xl font-bold text-blue-600">ChatApp</h1>

        {/* Icons */}
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
         
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Messenger"
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Category Buttons */}
      <div className="flex justify-between px-3 border-b border-gray-200">
        <button className="flex-1 py-2 text-sm font-semibold text-blue-600 border-b-2 border-blue-600">
          All
        </button>
        <button className="flex-1 py-2 text-sm text-gray-500 hover:text-gray-800">
          Unread
        </button>
        <button className="flex-1 py-2 text-sm text-gray-500 hover:text-gray-800">
          Groups
        </button>
        <button className="flex-1 py-2 text-sm text-gray-500 hover:text-gray-800">
          Community
        </button>
      </div>

      {/* Placeholder for chats list */}
      {/* <div className="flex-1 overflow-y-auto text-center p-4 text-gray-500">
        No conversations yet.
      </div> */}
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto mt-5">
        {sampleChats.map((chat, index) => (
          <ChatListItem key={index} {...chat} />
        ))}
      </div>
    </div>
  
  );
};

export default Sidebar;
