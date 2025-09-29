// src/components/Sidebar/AllChats.jsx
import React, { useEffect, useState } from "react";
import ChatListItem from "../ChatListItem";
import axios from "axios";

const AllChats = ({ currentUserId, onSelectChat }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (!currentUserId) return;

    axios
      .get(`/api/chat/friends/${currentUserId}`)
      .then((res) => setFriends(res.data))
      .catch((err) => console.error("Error fetching friends:", err));
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
          chat={friend}
          onClick={onSelectChat}
        />
      ))}
    </div>
  );
};

export default AllChats;
