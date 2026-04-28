/**
 * api.js — Backend integration layer
 * All API calls go through here. The local fallback logic lives in components.
 * Swap API_BASE to your deployed endpoint.
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const TIMEOUT  = 3000; // ms

// ── Generic fetch with timeout ────────────────────────────────────────────
async function apiFetch(path, method = 'GET', body = null, token = null) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────
export async function apiLogin(email, password) {
  const res = await apiFetch('/auth/login', 'POST', { email, password });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json(); // { name, token }
}

export async function apiRegister(name, email, password) {
  const res = await apiFetch('/auth/register', 'POST', { name, email, password });
  if (res.status === 409) throw new Error('Account already exists');
  if (!res.ok) throw new Error('Registration failed');
  return res.json(); // { token }
}

// ── Score prediction ──────────────────────────────────────────────────────
export async function apiPredict(payload, token = null) {
  const res = await apiFetch('/predict', 'POST', payload, token);
  if (!res.ok) throw new Error('Prediction failed');
  return res.json();
}

// ── History ───────────────────────────────────────────────────────────────
export async function apiSaveScore(email, entry, token = null) {
  const res = await apiFetch(`/history/${encodeURIComponent(email)}`, 'POST', entry, token);
  if (!res.ok) throw new Error('Failed to save score');
  return res.json();
}

export async function apiFetchHistory(email, token = null) {
  const res = await apiFetch(`/history/${encodeURIComponent(email)}`, 'GET', null, token);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json(); // array of entries
}

export async function apiDeleteHistory(email, token = null) {
  const res = await apiFetch(`/history/${encodeURIComponent(email)}`, 'DELETE', null, token);
  if (!res.ok) throw new Error('Failed to delete history');
  return res.json();
}
