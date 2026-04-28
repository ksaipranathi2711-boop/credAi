/**
 * storage.js — localStorage / sessionStorage helpers
 * Used as a fallback when backend is unavailable.
 */

const DB_KEY  = 'credai_v2_users';
const SES_KEY = 'credai_v2_session';

// ── Password hashing ──────────────────────────────────────────────────────
export async function hashPassword(pw) {
  const enc = new TextEncoder().encode('credai_salt_v2' + pw);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Users DB (localStorage) ───────────────────────────────────────────────
export function getUsers() {
  try { return JSON.parse(localStorage.getItem(DB_KEY) || '{}'); } catch { return {}; }
}
export function saveUsers(users) {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
}

// ── Session (sessionStorage) ──────────────────────────────────────────────
export function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SES_KEY)); } catch { return null; }
}
export function setSession(session) {
  sessionStorage.setItem(SES_KEY, JSON.stringify(session));
}
export function clearSession() {
  sessionStorage.removeItem(SES_KEY);
}

// ── Per-user history ──────────────────────────────────────────────────────
export function getLocalHistory(email) {
  const users = getUsers();
  return users[email]?.history || [];
}

export function saveLocalHistory(email, entry) {
  const users = getUsers();
  if (!users[email]) users[email] = { history: [] };
  users[email].history = [entry, ...(users[email].history || [])].slice(0, 50);
  saveUsers(users);
}

export function clearLocalHistory(email) {
  const users = getUsers();
  if (users[email]) users[email].history = [];
  saveUsers(users);
}

// ── Local auth fallback ───────────────────────────────────────────────────
export async function localLogin(email, password) {
  const users = getUsers();
  const hash  = await hashPassword(password);
  if (!users[email] || users[email].pw !== hash) throw new Error('Invalid credentials');
  return { name: users[email].name };
}

export async function localRegister(name, email, password) {
  const users = getUsers();
  if (users[email]) throw new Error('Account already exists');
  const hash = await hashPassword(password);
  users[email] = { name, pw: hash, history: [] };
  saveUsers(users);
}

// ── CSV export ────────────────────────────────────────────────────────────
export function exportHistoryToCSV(history, filename = 'credai_history.csv') {
  const header = 'Date,Score,Band,Income,Expenses,Transactions,CreditUtil';
  const rows = history.map(h =>
    [
      new Date(h.date).toLocaleDateString(),
      h.score,
      h.band,
      h.income,
      h.expenses,
      h.transactions,
      h.creditUtil,
    ].join(',')
  );
  const csv  = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
