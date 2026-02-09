interface MessageInputProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function MessageInput({ value, loading, onChange, onSubmit }: MessageInputProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !loading) {
      onSubmit();
    }
  };

  return (
    <div className="input-area">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <button onClick={onSubmit} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
