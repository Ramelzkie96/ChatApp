import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatListItem from "../ChatListItem";

const RequestChats = ({ userId, onChatSelect }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch pending requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`https://localhost:7085/api/request/${userId}`);
        const formattedRequests = response.data.map((req) => ({
          id: req.id,
          name: req.username,
          avatar: req.profilePictureUrl,
          lastMessage: req.lastMessage,
          timeAgo: req.timeAgo,
          isOnline: req.isOnline,
          status: req.status,
        }));
        setRequests(formattedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchRequests();
  }, [userId]);

  if (loading)
    return <p className="text-center text-gray-500">Loading requests...</p>;

  if (!requests.length)
    return <p className="text-center text-gray-500">No request yet.</p>;

  // ✅ Handle when user clicks a request to open ChatWindow
  const handleSelectUser = (req) => {
    if (typeof onChatSelect === "function") {
      onChatSelect(req);
    }
  };

  // ✅ Accept Request (remove immediately from UI)
  const handleAccept = async (req) => {
    try {
      await axios.post(`https://localhost:7085/api/request/accept`, {
        requesterId: req.id,
        receiverId: userId,
      });
      alert(`${req.name} has been added as a friend!`);
      // remove request from list in real time
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // ✅ Block Request (remove immediately from UI)
  const handleBlock = async (req) => {
    try {
      await axios.post(`https://localhost:7085/api/request/block`, {
        requesterId: req.id,
        receiverId: userId,
      });
      alert(`You blocked ${req.name}.`);
      // remove request from list in real time
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
    } catch (error) {
      console.error("Error blocking request:", error);
    }
  };

  return (
    <div className="px-4 space-y-3">
      {requests.map((req) => (
        <div
          key={req.id}
          className="relative bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          {/* ✅ Clicking this triggers ChatWindow */}
          <ChatListItem chat={req} onClick={() => handleSelectUser(req)} />

          {/* ✅ Accept/Block buttons */}
          <div className="flex justify-end space-x-2 p-2 border-t border-gray-100">
            <button
              onClick={() => handleAccept(req)}
              className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600"
            >
              Accept
            </button>
            <button
              onClick={() => handleBlock(req)}
              className="bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded-md hover:bg-gray-400"
            >
              Block
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestChats;
