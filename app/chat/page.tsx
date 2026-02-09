"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useMessageStore } from '@/lib/stores/messageStore';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { normalizeMessage, isMessage } from '@/lib/utils/message';
import { MessageList } from "./_components/MessageList";
import { MessageInput } from "./_components/MessageInput";
import "./style.css";

export default function ChatPage() {
  const { messages, loading, addMessage, upsertMessage, loadMessages } = useMessageStore();
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

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
      <MessageList messages={messages} />
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
