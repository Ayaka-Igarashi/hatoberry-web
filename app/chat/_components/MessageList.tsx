import { useEffect, useRef } from "react";
import type { Message } from "@/lib/types";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages">
      {messages.map((msg) => (
        <div key={msg.id} className="message">
          {msg.content}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
