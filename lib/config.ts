export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://hatoberry/api',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://hatoberry/ws',
} as const;
