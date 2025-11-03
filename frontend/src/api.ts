import axios from "axios";

const base = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

export const API_BASE = base.replace(/\/+$/, "");
export const api = axios.create({ baseURL: API_BASE });

export function qs(params: Record<string, unknown>) {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length > 0) u.set(k, String(v));
  });
  return u.toString();
}
