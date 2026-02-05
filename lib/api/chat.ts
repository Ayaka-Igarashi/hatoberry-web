import { apiClient } from './client';

export interface Message {
  id: string;
  content: string;
  postedAt: Date;
}

export const chatApi = {
  getAllMessages: () => apiClient.get<Message[]>('/chat/messages'),
  createMessage: (data: Omit<Message, 'id'>) => apiClient.post<Message>('/chat/messages', data),
};