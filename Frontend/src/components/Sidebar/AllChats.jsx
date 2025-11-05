// src/components/AllChats.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatListItem from "../ChatListItem";

const AllChats = ({ currentUserId, onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const API_BASE = "https://localhost:7085";

  useEffect(() => {
  if (!currentUserId) return;

  const fetchChats = async () => {
    try {
      const res = await axios.get(`https://localhost:7085/api/chatlist/${currentUserId}`);
      setChats(res.data);
    } catch (err) {
      console.error("Error fetching all chats:", err);
    }
  };

  fetchChats();

  // ✅ Poll every 3 seconds
  const interval = setInterval(fetchChats, 1000);

  return () => clearInterval(interval);
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

  if (!chats || chats.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No conversations yet.</p>;
  }

  return (
  <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
    {chats.map((chat) => {
      // ✅ FIXED: don't prepend API_BASE again
      const profilePic = chat.profilePictureUrl || `${API_BASE}/images/user-image.jpg`;

      const chatItem = {
        id: chat.id,
        name: chat.username,
        profilePictureUrl: profilePic,
        lastMessage: chat.lastMessage || "No messages yet",
        isOnline: chat.isOnline,
        timeAgo: formatTime(chat.timeAgo),
      };

      const normalizedChat = {
        id: chat.id,
        name: chat.username,
        avatar: profilePic,
        isOnline: chat.isOnline,
      };

      return (
        <ChatListItem
          key={chat.id}
          chat={chatItem}
          onClick={() => onSelectChat(normalizedChat)}
        />
      );
    })}
  </div>
);
};

export default AllChats;
