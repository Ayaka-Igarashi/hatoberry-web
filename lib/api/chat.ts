import { apiClient } from './client';

export interface Message {
  id: string;
  content: string;
  postedAt: Date;
}

export const chatApi = {
  getAllMessages: () => apiClient.get<Message[]>('/messages'),
  createMessage: (data: Omit<Message, 'id'>) => apiClient.post<Message>('/messages', data),
};