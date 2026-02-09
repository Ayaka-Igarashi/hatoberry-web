import { useEffect, useRef, useCallback } from "react";
import { config } from "../config";

export function useWebSocket({
  onMessage,
  onError,
  enabled = true,
}: {
  onMessage: (data: unknown) => void;
  onError?: (event: Event) => void;
  enabled?: boolean;
}) {
  const wsUrl = config.wsUrl;
  const socketRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (typeof event.data !== "string") return;
    try {
      const payload = JSON.parse(event.data);
      onMessageRef.current(payload);
    } catch (error) {
      if (onErrorRef.current) onErrorRef.current(error as Event);
    }
  }, []);

  useEffect(() => {
    if (!wsUrl || !enabled) return;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    socket.addEventListener("message", handleMessage);
    if (onErrorRef.current) {
      socket.addEventListener("error", onErrorRef.current);
    }
    return () => {
      socket.removeEventListener("message", handleMessage);
      if (onErrorRef.current) {
        socket.removeEventListener("error", onErrorRef.current);
      }
      socket.close();
      socketRef.current = null;
    };
  }, [wsUrl, enabled, handleMessage]);

  return socketRef;
}
