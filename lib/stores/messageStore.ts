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
    const trimmed = content.trim();
    if (!trimmed) return;

    set({ loading: true });
    try {
      if (isAiCommand(trimmed)) {
        const prompt = extractAiPrompt(trimmed);
        if (!prompt) return;

        // ユーザーの質問も通常メッセージとして保存（@AIプレフィックスは除去）
        await api.message.create({ content: prompt });

        const aiText = await fetchAiResponseText(prompt);
        if (aiText) {
          await api.message.create({ content: `AI: ${aiText}` });
        } else {
          await api.message.create({ content: 'AI: (no response)' });
        }
      } else {
        await api.message.create({ content: trimmed });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
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

function isAiCommand(text: string) {
  // 最初が「@AI」ならAI質問として扱う（例: "@AI こんにちは"）
  return text.startsWith('@AI');
}

function extractAiPrompt(text: string) {
  // "@AI" の後ろをプロンプトとして解釈する
  return text.slice(3).trimStart();
}

async function fetchAiResponseText(prompt: string): Promise<string> {
  const response = await api.aiChat.send(prompt);
  const body = response.body;
  if (!body) {
    // streamが取れない場合は諦める（環境によってはbodyがnullになる）
    return '';
  }

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let result = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Ollama形式などの改行区切りJSONを想定
    let newlineIndex = buffer.indexOf('\n');
    while (newlineIndex !== -1) {
      const rawLine = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);

      const line = rawLine.trim();
      if (line) {
        const chunkText = tryParseAiChunk(line);
        if (chunkText) result += chunkText;
      }

      newlineIndex = buffer.indexOf('\n');
    }
  }

  // 最後に残ったバッファも試す（改行なしで終わるケース）
  const tail = buffer.trim();
  if (tail) {
    const chunkText = tryParseAiChunk(tail);
    if (chunkText) result += chunkText;
  }

  return result.trim();
}

function tryParseAiChunk(line: string): string {
  // SSE的に "data: {json}" で来ることもあるので吸収
  const normalized = line.startsWith('data:') ? line.slice('data:'.length).trim() : line;
  if (!normalized || normalized === '[DONE]') return '';

  try {
    const json = JSON.parse(normalized) as unknown;
    if (!isRecord(json)) return '';

    // Ollama chat stream: { message: { content: "..." }, done: boolean }
    const message = json.message;
    if (isRecord(message) && typeof message.content === 'string') {
      return message.content;
    }

    // 他実装互換: { response: "..." }
    if (typeof json.response === 'string') return json.response;

    // OpenAI-like deltas: { choices: [{ delta: { content: "..." } }] }
    const choices = json.choices;
    if (Array.isArray(choices) && choices.length > 0 && isRecord(choices[0])) {
      const delta = choices[0].delta;
      if (isRecord(delta) && typeof delta.content === 'string') {
        return delta.content;
      }
    }

    return '';
  } catch {
    return '';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}