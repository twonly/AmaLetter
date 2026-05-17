import type { StyleKey } from './styles';

export interface HistoryEntry {
  id: string;
  style: StyleKey;
  recipient: string;
  recipientName: string;
  senderName: string;
  preview: string;
  ts: number;
}

const KEY = 'qiaopi:history';
const MAX = 50;

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function readHistory(): HistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is HistoryEntry =>
          x && typeof x.id === 'string' && typeof x.preview === 'string' && typeof x.ts === 'number'
      )
      .sort((a, b) => b.ts - a.ts);
  } catch {
    return [];
  }
}

export function recordHistory(entry: HistoryEntry): void {
  if (!isBrowser()) return;
  try {
    const list = readHistory().filter((e) => e.id !== entry.id);
    list.unshift(entry);
    const trimmed = list.slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    // ignore quota errors
  }
}

export function removeHistory(id: string): void {
  if (!isBrowser()) return;
  try {
    const list = readHistory().filter((e) => e.id !== id);
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function clearHistory(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function formatRelativeTime(ts: number, now = Date.now()): string {
  const diff = Math.max(0, now - ts);
  const min = Math.floor(diff / 60_000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} 小时前`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day} 天前`;
  const week = Math.floor(day / 7);
  if (week < 5) return `${week} 周前`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month} 个月前`;
  const year = Math.floor(day / 365);
  return `${year} 年前`;
}
