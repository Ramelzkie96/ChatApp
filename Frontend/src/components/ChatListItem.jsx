// src/components/ChatListItem.jsx
import React from "react";

const ChatListItem = ({ chat, onClick }) => {
  if (!chat) return null;

  const truncatedMessage =
    chat.lastMessage?.length > 30
      ? chat.lastMessage.slice(0, 30) + "..."
      : chat.lastMessage || "No messages yet";

  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick(chat); // ✅ send the whole chat object back up
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-lg"
    >
      {/* Avatar + Info */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={chat.avatar || chat.profilePictureUrl || "/images/user-image.jpg"}
            alt={chat.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {chat.isOnline && (
            <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        <div>
          <h3 className="font-medium text-gray-800">{chat.name}</h3>
          <p className="text-sm text-gray-500">{truncatedMessage}</p>
        </div>
      </div>

      {/* Time Ago */}
      <span className="text-xs text-gray-400">{chat.timeAgo || ""}</span>
    </div>
  );
};

export default ChatListItem;
