// src/components/Sidebar/AllChats.jsx
import React, { useEffect, useState } from "react";
import ChatListItem from "../ChatListItem";
import axios from "axios";

const AllChats = ({ currentUserId, onSelectChat }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchFriends = async () => {
      try {
        const res = await axios.get(
          `https://localhost:7085/api/chat/friends/${currentUserId}`
        );
        setFriends(res.data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    fetchFriends();
  }, [currentUserId]);

  if (!friends || friends.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-5">No friends found.</p>
    );
  }

  return (
    <div>
      {friends.map((friend) => (
        <ChatListItem
          key={friend.id}
          chat={{
            id: friend.id,
            name: friend.username,             // ✅ match schema
            avatar: friend.profilePictureUrl,  // ✅ avatar mapping
            isOnline: friend.isOnline,
            lastMessage: friend.lastMessage || "",
            timeAgo: friend.timeAgo || ""
          }}
          onClick={onSelectChat}
        />
      ))}
    </div>
  );
};

export default AllChats;
