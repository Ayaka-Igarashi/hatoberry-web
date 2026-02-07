"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import type { Message } from "@/lib/types";
import "./style.css";

const normalizeMessage = (message: Message): Message => ({
  ...message,
  postedAt: new Date(message.postedAt),
});

const isMessage = (value: unknown): value is Message => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    "id" in candidate &&
    typeof candidate.content === "string" &&
    "postedAt" in candidate
  );
};

const upsertMessage = (current: Message[], incoming: Message) => {
  const index = current.findIndex((msg) => msg.id === incoming.id);
  if (index === -1) {
    return [...current, incoming];
  }

  return [
    ...current.slice(0, index),
    incoming,
    ...current.slice(index + 1),
  ];
};

const resolveWsUrl = () => {
  const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envBaseUrl) {
    try {
      const apiUrl = new URL(envBaseUrl);
      const wsProtocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
      const apiPath = apiUrl.pathname.replace(/\/?api\/?$/, "");
      const basePath = apiPath === "/" ? "" : apiPath;
      return `${wsProtocol}//${apiUrl.host}${basePath}/ws`;
    } catch {
      return null;
    }
  }

  if (typeof window === "undefined") return null;

  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${wsProtocol}//${window.location.host}/ws`;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const applyIncomingPayload = useCallback((payload: unknown) => {
    if (isMessage(payload)) {
      const incoming = normalizeMessage(payload);
      setMessages((prev) => upsertMessage(prev, incoming));
    }
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await api.message.getAll();
        setMessages(data.map(normalizeMessage));
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };
    loadMessages();
  }, []);

  useEffect(() => {
    const wsUrl = resolveWsUrl();
    if (!wsUrl) return;

    const socket = new WebSocket(wsUrl);

    socket.addEventListener("message", (event) => {
      if (typeof event.data !== "string") return;

      try {
        const payload = JSON.parse(event.data) as unknown;
        applyIncomingPayload(payload);
      } catch (error) {
        console.warn("Failed to parse websocket message:", error);
      }
    });

    socket.addEventListener("error", (event) => {
      console.warn("WebSocket error:", event);
    });

    return () => {
      socket.close();
    };
  }, [applyIncomingPayload]);

  const addMessage = async () => {
    if (!newMessage.trim()) return;
    
    setLoading(true);
    try {
      const newMsg = await api.message.create({
        content: newMessage,
        postedAt: new Date(),
      });
      
      // APIが空レスポンスの場合はWebSocketからの更新を待つ
      if (!newMsg.id || !newMsg.content) {
        setNewMessage("");
        return;
      }
      
      const normalized = normalizeMessage(newMsg);
      setMessages((prev) => [...prev, normalized]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !loading) {
      addMessage();
    }
  };

  return (
    <div className="root">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button onClick={addMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
