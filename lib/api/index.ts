export * from './message';
export * from './aiChat';

import { messageApi } from './message';
import { aiChatApi } from './aiChat';

export const api = {
  message: messageApi,
  aiChat: aiChatApi,
};