import React from "react";
import { Phone, Video, Info, Smile, Image, Mic, ThumbsUp } from "lucide-react";

const ChatWindow = () => {
  const messages = [
    { id: 1, sender: "other", text: "Dara ay HAHAHAHA" },
    { id: 2, sender: "me", text: "try apply arang maam quiban basin diay dako sweldo hahahha 🤓" },
    { id: 3, sender: "me", text: "dakoa gurog kita na ana niya no 60k or 70k monthly guro sa work dayon naa pay negosyo baboy" },
    { id: 4, sender: "other", text: "Ouh uy chill ra kaayo vlogger na hahahaha" },
    { id: 5, sender: "other", text: "Labaw nas orioqeskie" },
    { id: 6, sender: "me", text: "yat naa pod disya to negosyo orioq" },
    { id: 7, sender: "other", text: "Wala uy, pero dako tog sweldo Hahahaah" },
    { id: 8, sender: "other", text: "Sige ra pajug pareport" },
    { id: 9, sender: "other", text: "Sige ra pajug pareport" },
    { id: 10, sender: "me", text: "Sige ra pajug pareport" },
    { id: 11, sender: "other", text: "Sige ra pajug pareport" },
    { id: 12, sender: "other", text: "Sige ra pajug pareport" },
    { id: 13, sender: "me", text: "Sige ra pajug pareport" },
    { id: 14, sender: "other", text: "Sige ra pajug pareport" },
    { id: 15, sender: "other", text: "Sige ra pajug pareport" },
    { id: 16, sender: "me", text: "Sige ra pajug pareport" },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 ">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm border-gray-300">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/40?img=11"
              alt="Disciple #1"
              className="w-10 h-10 rounded-full object-cover"
            />
            {/* Green circle online indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Disciple #1</h2>
            <p className="text-xs text-gray-500">Active 13m ago</p>
          </div>
        </div>
        <div className="flex space-x-4 text-purple-600">
          <Phone className="w-5 h-5 cursor-pointer hover:text-purple-800" />
          <Video className="w-5 h-5 cursor-pointer hover:text-purple-800" />
          <Info className="w-5 h-5 cursor-pointer hover:text-purple-800" />
        </div>
      </div>

      {/* Messages */}
<div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-100">
  {messages.map((msg) => (
    <div
      key={msg.id}
      className={`flex items-end space-x-2 ${
        msg.sender === "me" ? "justify-end" : "justify-start"
      }`}
    >
      {/* Show avatar only for "other" */}
      {msg.sender === "other" && (
        <div className="relative">
          <img
            src="https://i.pravatar.cc/40?img=11"
            alt="Other User"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
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

  {/* Example timestamp */}
  <p className="text-center text-xs text-gray-400 my-2">Sat 11:23 PM</p>
</div>


      {/* Input Area */}
      <div className="flex items-center p-3 border-t bg-white space-x-3 border-gray-300">
        <Mic className="w-5 h-5 text-blue-600 cursor-pointer" />
        <Image className="w-5 h-5 text-blue-600 cursor-pointer" />
        <Smile className="w-5 h-5 text-blue-600 cursor-pointer" />

        <input
          type="text"
          placeholder="Aa"
          className="flex-1 px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
        />

        <ThumbsUp className="w-6 h-6 text-blue-600 cursor-pointer" />
      </div>
    </div>
  );
};

export default ChatWindow;
