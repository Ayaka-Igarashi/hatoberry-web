"use client";

import { useState, useEffect, useRef } from "react";
import { useMessageStore } from '@/lib/stores/messageStore';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { normalizeMessage, isMessage } from '@/lib/utils/message';
import { MessageList } from "./_components/MessageList";
import { MessageInput } from "./_components/MessageInput";
import "./style.css";

const ChatPage = () => {
  const { messages, loading, addMessage, upsertMessage, loadMessages } = useMessageStore();

  const [inputText, setInputText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useWebSocket({
    onMessage: (payload: unknown) => {
      if (isMessage(payload)) {
        const incoming = normalizeMessage(payload);
        upsertMessage(incoming);
      }
    },
    onError: (event) => {
      console.warn("WebSocket error:", event);
    },
  });

  return (
    <div className="root">
      <MessageList className="messageList" messages={messages} />
      <div ref={messagesEndRef}>a</div>
      <MessageInput
        value={inputText}
        loading={loading}
        onChange={setInputText}
        onSubmit={async () => {
          await addMessage(inputText);
          setInputText("");
        }}
      />
    </div>
  );
}

export default ChatPage;
