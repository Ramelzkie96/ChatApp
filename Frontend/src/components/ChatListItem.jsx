import React from "react";

const ChatListItem = ({ name, lastMessage, timeAgo, avatar, isOnline }) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-lg">
      {/* Avatar + Info */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        <div>
          <h3 className="font-medium text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500 truncate">{lastMessage}</p>
        </div>
      </div>

      {/* Time Ago */}
      <span className="text-xs text-gray-400">{timeAgo}</span>
    </div>
  );
};

export default ChatListItem;
