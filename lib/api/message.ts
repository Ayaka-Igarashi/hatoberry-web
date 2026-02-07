import { apiClient } from './client';
import type { Message } from '@/lib/types';

export const messageApi = {
  getAll: () => apiClient.get<Message[]>('/messages'),
  create: (data: Omit<Message, 'id'>) => apiClient.post<Message>('/messages', data),
};