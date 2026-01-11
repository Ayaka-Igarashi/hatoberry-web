"use client";

import { useState } from "react";
import "./style.css"; // Qwik の styles に相当（後でCSS例も載せます）

export default function ChatPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const addMessage = () => {
    if (!newMessage) return;
    setMessages([...messages, newMessage]);
    setNewMessage("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addMessage();
    }
  };

  return (
    <div className="root">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className="message">
            {msg}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={addMessage}>Send</button>
      </div>
    </div>
  );
}
