import { create } from 'zustand';
import type { Message } from '@/lib/types';
import { api } from '@/lib/api';

interface MessageStore {
  messages: Message[];
  loading: boolean;
  addMessage: (content: string) => Promise<void>;
  setMessages: (messages: Message[]) => void;
  upsertMessage: (incoming: Message) => void;
  loadMessages: () => Promise<void>;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  loading: false,
  setMessages: (messages) => set({ messages }),
  addMessage: async (content) => {
    set({ loading: true });
    try {
      await api.message.create({
        content
      });
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },
  upsertMessage: (incoming) => {
    set((state) => ({
      messages: upsertMessageInArray(state.messages, incoming),
    }));
  },
  loadMessages: async () => {
    try {
      const data = await api.message.getAll();
      set({ messages: data });
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  },
}));

function upsertMessageInArray(current: Message[], incoming: Message) {
  const index = current.findIndex((msg) => msg.id === incoming.id);
  if (index === -1) {
    return [...current, incoming];
  }
  return [
    ...current.slice(0, index),
    incoming,
    ...current.slice(index + 1),
  ];
}