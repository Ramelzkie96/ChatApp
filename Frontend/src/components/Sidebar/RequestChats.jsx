import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatListItem from "../ChatListItem";


const RequestChats = ({ userId }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`/api/request/${userId}`);
        setRequests(res.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [userId]);

  return (
    <div>
      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No requests yet.</p>
      ) : (
        requests.map((req) => (
          <ChatListItem
            key={req.id}
            userId={req.id}
            username={req.username}
            profilePictureUrl={req.profilePictureUrl}
            lastMessage={req.lastMessage}
            timeAgo={req.timeAgo}
            isOnline={req.isOnline}
          />
        ))
      )}
    </div>
  );
};

export default RequestChats;
