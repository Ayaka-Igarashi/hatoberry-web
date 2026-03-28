import type { Message } from "@/lib/types";
import s from "./MessageList.module.css";
import cx from "classnames";

interface MessageListProps {
  className?: string;
  messages: Message[];
};

export const MessageList: React.FC<MessageListProps> = ({ className, messages }) => (
  <div className={cx(s.root, className)}>
    {messages.map((msg) => (
      <div key={msg.id} className={s.message}>
        {msg.content}
      </div>
    ))}
  </div>
);
