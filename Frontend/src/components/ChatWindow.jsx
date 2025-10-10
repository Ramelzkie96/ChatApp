import React, { useEffect, useRef, useState } from "react";
import {
  Phone,
  Video,
  Info,
  Smile,
  Image,
  Mic,
  ThumbsUp,
  Send,
  MessageSquare,
} from "lucide-react";
import axios from "axios";

const ChatWindow = ({ selectedChat, messages = [], onNewMessage }) => {
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null); // ✅ input reference
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(messages || []);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const API_BASE = "https://localhost:7085/api/UserMessages";

  // ✅ Scroll to bottom smoothly
  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  };

  // ✅ Scroll down when new messages come in
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, selectedChat]);

  // ✅ Load messages when a chat is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat || !currentUser?.id) return;
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE}/conversation/${currentUser.id}/${selectedChat.id}`
        );
        setChatMessages(res.data);
      } catch (err) {
        console.error("❌ Failed to load messages:", err);
      } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100); // ✅ focus after loading
      }
    };
    fetchMessages();
  }, [selectedChat]);

  // ✅ Send message
  const handleSend = async () => {
    if (!message.trim() || isSending) return;
    const newMsg = {
      senderId: currentUser.id,
      receiverId: selectedChat.id,
      content: message.trim(),
    };
    try {
      setIsSending(true);
      const res = await axios.post(`${API_BASE}/send`, newMsg);
      const saved = res.data;
      setChatMessages((prev) => [...prev, saved]);
      setMessage("");
      if (onNewMessage) onNewMessage(saved);
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    } finally {
      setIsSending(false);
      setTimeout(() => {
        scrollToBottom();
        inputRef.current?.focus(); // ✅ re-focus input after send
      }, 50);
    }
  };

  // ✅ Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full bg-gray-50 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between h-[101px] p-4 border-b bg-white shadow-sm border-gray-300">
        <div className="flex items-center space-x-3">
          <img
            src={selectedChat.avatar}
            alt={selectedChat.name}
            className="w-10 h-10 rounded-full object-cover"
          />
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

      {/* ✅ Messages area (starts from bottom) */}
      <div
        ref={scrollContainerRef}
        className="flex-1 px-6 py-4 bg-gray-100 flex flex-col-reverse overflow-y-auto"
        style={{ scrollBehavior: "smooth", minHeight: 0 }}
      >
        {isLoading ? (
          <div className="text-center text-gray-400">Loading messages...</div>
        ) : chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageSquare className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-lg font-medium">Start a conversation!</p>
            <p className="text-sm text-gray-400">
              Say hi to {selectedChat.name} 👋
            </p>
          </div>
        ) : (
          [...chatMessages]
            .reverse()
            .map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex items-end mb-2 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isMe && (
                    <img
                      src={selectedChat.avatar}
                      alt={selectedChat.name}
                      className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0"
                    />
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow break-words whitespace-pre-wrap ${
                      isMe
                        ? "bg-purple-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                    style={{ maxHeight: 200, overflowY: "auto" }}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* ✅ Input Bar */}
      <div className="flex items-center p-3 border-t bg-white space-x-3 border-gray-300">
        <Mic className="w-5 h-5 text-blue-600 cursor-pointer" />
        <Image className="w-5 h-5 text-blue-600 cursor-pointer" />
        <Smile className="w-5 h-5 text-blue-600 cursor-pointer" />

        <input
          ref={inputRef} // ✅ keep reference
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          autoFocus // ✅ focus when opened
          className="flex-1 px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
        />

        {message.trim() === "" ? (
          <ThumbsUp className="w-6 h-6 text-blue-600 cursor-pointer" />
        ) : (
          <Send
            className={`w-6 h-6 text-blue-600 cursor-pointer ${
              isSending ? "opacity-50 cursor-wait" : ""
            }`}
            onClick={handleSend}
          />
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
