// src/components/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import { Phone, Video, Info, Smile, Image, Mic, ThumbsUp, Send } from "lucide-react";

const ChatWindow = ({ selectedChat, messages = [] }) => {
  const messagesEndRef = useRef(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between h-[101px] p-4 border-b bg-white shadow-sm border-gray-300">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={selectedChat.avatar}
              alt={selectedChat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {selectedChat.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedChat.name}
            </h2>
            <p className="text-xs text-gray-500">
              {selectedChat.isOnline ? "Active now" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex space-x-4 text-purple-600">
          <Phone className="w-5 h-5 cursor-pointer hover:text-purple-800" />
          <Video className="w-5 h-5 cursor-pointer hover:text-purple-800" />
          <Info className="w-5 h-5 cursor-pointer hover:text-purple-800" />
        </div>
      </div>

      {/* Messages or Profile Placeholder */}
      <div className="flex-1 px-6 py-4 bg-gray-100 flex flex-col items-center justify-start pt-10">
        {messages.length === 0 ? (
          <div className="text-center">
            <img
              src={selectedChat.avatar}
              alt={selectedChat.name}
              className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedChat.name}
            </h2>
            <p className="text-sm text-gray-500">
              Start your conversation <br />
              {/* You can also show bio, school, or description from backend here */}
            </p>

          </div>
        ) : (
          <div className="h-full max-h-[70vh] overflow-y-auto space-y-4 pr-2 w-full">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end space-x-2 ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "other" && (
                  <img
                    src={selectedChat.avatar}
                    alt={selectedChat.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}

                <div
                  className={`px-4 py-2 rounded-lg max-w-xs text-sm break-words ${
                    msg.sender === "me"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        )}
      </div>

     
        <div className="flex items-center p-3 border-t bg-white space-x-3 border-gray-300">
          <Mic className="w-5 h-5 text-blue-600 cursor-pointer" />
          <Image className="w-5 h-5 text-blue-600 cursor-pointer" />
          <Smile className="w-5 h-5 text-blue-600 cursor-pointer" />

          <input
            type="text"
            placeholder="Aa"
            value={message}  // bind state
            onChange={(e) => setMessage(e.target.value)} // update state on typing
            className="flex-1 px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
          />

          {message.trim() === "" ? (
            <ThumbsUp className="w-6 h-6 text-blue-600 cursor-pointer" />
          ) : (
            <Send className="w-6 h-6 text-blue-600 cursor-pointer" />
          )}

        </div>
    
    </div>
  );
};

export default ChatWindow;
