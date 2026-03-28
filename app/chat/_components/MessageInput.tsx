import s from "./MessageInput.module.css";
import cx from "classnames";

interface MessageInputProps {
  className?: string;
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ value, loading, onChange, onSubmit, className }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !loading) {
      onSubmit();
    }
  };

  return (
    <div className={cx(s.inputContainer, className)}>
      <input
        className={s.input}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <button className={s.button} onClick={onSubmit} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};
