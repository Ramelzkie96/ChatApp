// ChatSearchArea.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatListItem from "../ChatListItem";

const ChatSearchArea = ({ onBack, onSelectChat, searchQuery }) => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `https://localhost:7085/api/UserSearch?query=${searchQuery}`
        );

        console.log("✅ API response:", res.data);

        // ✅ Get current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem("user"));

        // ✅ Fix image URLs and filter out current user
        const filteredResults = res.data
          .filter((user) => user.id !== currentUser?.id) // 👈 prevent showing current user
          .map((user) => ({
            ...user,
            profilePictureUrl: user.profilePictureUrl?.startsWith("http")
              ? user.profilePictureUrl
              : `https://localhost:7085${user.profilePictureUrl}`,
          }));

        setResults(filteredResults);
      } catch (err) {
        console.error("❌ Search failed:", err);

        if (err.response) {
          setError(
            `Server error: ${err.response.status} ${err.response.statusText}`
          );
        } else if (err.request) {
          setError("No response received from server.");
        } else {
          setError(`Unexpected error: ${err.message}`);
        }

        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 flex items-center">
        <span className="font-semibold text-gray-700">Search Results</span>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto mt-2">
        {loading && (
          <p className="text-center text-blue-500 mt-5">Searching...</p>
        )}

        {error && <p className="text-center text-red-500 mt-5">⚠️ {error}</p>}

        {!loading && !error && results.length > 0 ? (
          results.map((user) => (
            <ChatListItem
              key={user.id}
              chat={{
                id: user.id,
                name: user.userName ?? user.username,
                avatar: user.profilePictureUrl || "/default-avatar.png",
                isOnline: user.isOnline ?? false,
                lastMessage: user.lastMessage || "",
                timeAgo: user.timeAgo || "",
              }}
              onClick={onSelectChat}
            />
          ))
        ) : (
          !loading &&
          !error && (
            <p className="text-center text-gray-500 mt-5">
              {searchQuery ? "No users found." : "Start typing to search."}
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default ChatSearchArea;
