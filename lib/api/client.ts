import { config } from '@/lib/config';

class ApiClient {
  private baseURL: string;
  
  constructor() {
    this.baseURL = config.apiBaseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit,
    stream = false
  ): Promise<T | Response> {
    // endpointが絶対URLならbaseURLを付与しない
    let url: string;
    try {
      // new URLが成功すれば絶対URL
      url = new URL(endpoint).toString();
    } catch {
      url = `${this.baseURL}${endpoint}`;
    }
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    };
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    if (stream) {
      return response;
    }
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }) as Promise<T>;
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<T>;
  }

  async postStream(endpoint: string, data: unknown): Promise<Response> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, true) as Promise<Response>;
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }) as Promise<T>;
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }) as Promise<T>;
  }
}

export const apiClient = new ApiClient();