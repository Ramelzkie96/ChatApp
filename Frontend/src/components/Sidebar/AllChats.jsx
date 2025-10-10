// src/components/AllChats.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatListItem from "../ChatListItem";

const AllChats = ({ currentUserId, onSelectChat }) => {
  const [friends, setFriends] = useState([]);
  const API_BASE = "https://localhost:7085"; // ✅ backend base URL

  useEffect(() => {
    if (!currentUserId) return;

    const fetchFriends = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/chat/friends/${currentUserId}`);
        setFriends(res.data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    fetchFriends();
  }, [currentUserId]);

  const formatTime = (timeAgo) => {
    if (!timeAgo) return "";
    const date = new Date(timeAgo);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  if (!friends || friends.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No conversations yet.</p>;
  }

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
      {friends.map((friend) => {
        const profilePic = friend.profilePictureUrl
          ? `${API_BASE}${friend.profilePictureUrl.startsWith("/") ? "" : "/"}${friend.profilePictureUrl}`
          : `${API_BASE}/images/user-image.jpg`;

        // ✅ Add "You:" if current user sent the last message
        const lastMessageText =
          friend.lastMessageSenderId === currentUserId
            ? `You: ${friend.lastMessage || ""}`
            : friend.lastMessage || "No messages yet";

        // ✅ Build ChatListItem props
        const chatItem = {
          id: friend.id,
          name: friend.username,
          profilePictureUrl: profilePic,
          lastMessage: lastMessageText,
          isOnline: friend.isOnline,
          timeAgo: formatTime(friend.timeAgo),
        };

        // ✅ Normalize object for ChatWindow
        const normalizedChat = {
          id: friend.id,
          name: friend.username,
          avatar: profilePic,
          isOnline: friend.isOnline,
        };

        return (
          <ChatListItem
            key={friend.id}
            chat={chatItem}
            onClick={() => onSelectChat(normalizedChat)} // ✅ now passes correct fields
          />
        );
      })}
    </div>
  );
};

export default AllChats;
