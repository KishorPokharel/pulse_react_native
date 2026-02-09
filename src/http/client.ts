type UnauthorizedHandler = () => void;

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private onUnauthorized?: UnauthorizedHandler;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, ""); // trim trailing slash
  }

  setToken(token: string | null) {
    this.token = token;
  }

  setUnauthorizedHandler(handler: UnauthorizedHandler) {
    this.onUnauthorized = handler;
  }

  private getHeaders(extraHeaders?: HeadersInit): HeadersInit {
    return {
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      "Content-Type": "application/json",
      ...extraHeaders,
    };
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: this.getHeaders(options.headers),
    });

    if (response.status === 403) {
        this.onUnauthorized?.();
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return response.json() as Promise<T>;
  }

  get<T>(path: string) {
    return this.request<T>(path, { method: "GET" });
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

// const API_BASE_URL = "http://localhost:8787";
const API_BASE_URL = "https://pulse-hono-api.kishorpokharel7.workers.dev/";
// const API_BASE_URL = "http://10.0.2.2:8787";
export const apiClient = new ApiClient(API_BASE_URL);
