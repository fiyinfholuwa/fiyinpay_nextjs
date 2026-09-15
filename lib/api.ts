const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function api<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  const data = (await response.json()) as T & { message?: string | string[] };
  if (!response.ok) {
    const message = Array.isArray(data.message) ? data.message.join(", ") : data.message ?? "Something went wrong";
    throw new Error(message);
  }
  return data;
}

export function saveAccessToken(token: string) {
  window.localStorage.setItem("daralearn-access-token", token);
}

export function authorizedApi<T>(path: string, options: RequestInit = {}) {
  const token = window.localStorage.getItem("daralearn-access-token");
  return api<T>(path, {
    ...options,
    headers: { ...(options.headers ?? {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
}
