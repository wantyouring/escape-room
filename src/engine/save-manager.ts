/**
 * Save Manager — localStorage 기반 진행 상태 저장
 */

const SAVE_KEY = 'escape-room-save';

export interface SaveData {
  currentScene: string;
  completedPuzzles: string[];
  startedAt: number;
  elapsedMs: number;
}

export function save(data: SaveData): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // localStorage 미지원 (시크릿 모드 등) — 무시
  }
}

export function load(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.currentScene === 'string' &&
      Array.isArray(parsed.completedPuzzles) &&
      typeof parsed.startedAt === 'number' &&
      typeof parsed.elapsedMs === 'number'
    ) {
      return parsed as SaveData;
    }
    return null;
  } catch {
    // 손상된 JSON — null 반환
    return null;
  }
}

export function clear(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // 무시
  }
}
