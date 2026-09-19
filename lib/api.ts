const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function api<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  const raw = await response.text();
  let data: (T & { message?: string | string[] }) | null = null;
  try {
    data = raw ? (JSON.parse(raw) as T & { message?: string | string[] }) : null;
  } catch {
    throw new Error(response.ok ? "The server returned an invalid response." : `Request failed (${response.status}). Please restart the backend server.`);
  }
  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(", ") : data?.message ?? "Something went wrong";
    throw new Error(message);
  }
  return data as T;
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
