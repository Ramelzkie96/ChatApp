import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import AllChats from "./AllChats";
import axios from "axios";

const ChatSearchArea = ({ onBack, onSelectChat }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchQuery) {
        setResults([]);
        return;
      }
      try {
        const res = await axios.get(
          `https://localhost:7085/api/UserSearch?query=${searchQuery}`
        );
        setResults(res.data);
      } catch (err) {
        console.error("Search failed:", err);
      }
    };

    // ✅ debounce (wait 400ms after typing)
    const timeout = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

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
        Search Results
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto mt-2">
        {results.length > 0 ? (
          <AllChats chats={results} onSelectChat={onSelectChat} />
        ) : (
          <p className="text-center text-gray-500 mt-5">
            {searchQuery ? "No users found." : "Start typing to search."}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatSearchArea;
