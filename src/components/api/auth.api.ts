const BACKEND = process.env.REACT_APP_BACKEND ?? "http://localhost:8000";

type AuthResponse = {
  token?: string;
  access_token?: string;
  access?: string;
  refresh?: string;
  role?: string;
  user?: { role?: string };
  [key: string]: unknown;
};

export class AuthApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

const postJson = async <T>(url: string, body: unknown): Promise<T> => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new AuthApiError(text || `Request failed: ${res.status}`, res.status);
  }

  const text = await res.text().catch(() => "");
  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
};

export const loginUser = (input: { email: string; password: string }) => {
  return postJson<AuthResponse>(`${BACKEND}/users/login`, {
    email: input.email.trim(),
    password: input.password,
  });
};

export const registerUser = (input: { name: string; email: string; password: string }) => {
  return postJson<AuthResponse>(`${BACKEND}/users/register`, {
    name: input.name.trim(),
    email: input.email.trim(),
    password: input.password,
  });
};

export const extractAuthToken = (data: AuthResponse) => {
  return data.token || data.access_token || data.access || null;
};

export const extractAuthRole = (data: AuthResponse) => {
  return data.role || data.user?.role || null;
};
