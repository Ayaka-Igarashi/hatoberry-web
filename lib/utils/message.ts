import type { Message } from '@/lib/types';

export const normalizeMessage = (message: Message): Message => ({
  ...message,
  postedAt: new Date(message.postedAt),
});

export const isMessage = (value: unknown): value is Message => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    "id" in candidate &&
    typeof candidate.content === "string" &&
    "postedAt" in candidate
  );
};
