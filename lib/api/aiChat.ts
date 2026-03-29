import { apiClient } from './client';
export const aiChatApi = {
  /**
   * AIチャットAPIにメッセージを送信
   * @param content メッセージ内容
   * @returns fetch Response（bodyはストリーム）
   */
  send: (content: string) =>
    apiClient.postStream('http://hatox:11434/api/chat', {
      model: 'qwen3:8b',
      messages: [{ role: 'user', content }],
      stream: true,
    }),
};