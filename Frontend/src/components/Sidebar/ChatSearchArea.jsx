import React from "react";
import { ArrowLeft } from "lucide-react";
import AllChats from "./AllChats";

const ChatSearchArea = ({ chats, searchQuery, setSearchQuery, onBack }) => {
  // ✅ Filter chats by search query
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 flex items-center">
        <button
          onClick={onBack}
          className="mr-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <input
          type="text"
          placeholder="Search Contacts"
          className="flex-1 pl-3 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
      </div>

      {/* Header for contacts */}
      <div className="px-3 py-2 border-b border-gray-200 font-semibold text-gray-700">
        Your Contacts
      </div>

      {/* Filtered chats */}
      <div className="flex-1 overflow-y-auto mt-2">
        {filteredChats.length > 0 ? (
          <AllChats chats={filteredChats} />
        ) : (
          <p className="text-center text-gray-500 mt-5">No contacts found.</p>
        )}
      </div>
    </div>
  );
};

export default ChatSearchArea;
