/**
 * Save Manager — localStorage 기반 진행 상태 저장
 *
 * 키 구조:
 *   escape-room-{roomId}-save    → 룸별 진행 상태
 *   escape-room-{roomId}-done    → 룸 클리어 여부
 *   escape-room-current-room     → 마지막으로 플레이한 룸 ID
 */

export interface SaveData {
  currentScene: string;
  completedPuzzles: string[];
  startedAt: number;
  elapsedMs: number;
}

function saveKey(roomId: string): string {
  return `escape-room-${roomId}-save`;
}

function doneKey(roomId: string): string {
  return `escape-room-${roomId}-done`;
}

const CURRENT_ROOM_KEY = 'escape-room-current-room';

export function save(data: SaveData, roomId = 'room1'): void {
  try {
    localStorage.setItem(saveKey(roomId), JSON.stringify(data));
  } catch {
    // localStorage 미지원 (시크릿 모드 등) — 무시
  }
}

export function load(roomId = 'room1'): SaveData | null {
  try {
    const raw = localStorage.getItem(saveKey(roomId));
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

export function clear(roomId = 'room1'): void {
  try {
    localStorage.removeItem(saveKey(roomId));
  } catch {
    // 무시
  }
}

export function markCompleted(roomId: string): void {
  try {
    localStorage.setItem(doneKey(roomId), '1');
  } catch {
    // 무시
  }
}

export function isCompleted(roomId: string): boolean {
  try {
    return localStorage.getItem(doneKey(roomId)) === '1';
  } catch {
    return false;
  }
}

export function getCurrentRoom(): string | null {
  try {
    return localStorage.getItem(CURRENT_ROOM_KEY);
  } catch {
    return null;
  }
}

export function setCurrentRoom(roomId: string): void {
  try {
    localStorage.setItem(CURRENT_ROOM_KEY, roomId);
  } catch {
    // 무시
  }
}

export function clearCurrentRoom(): void {
  try {
    localStorage.removeItem(CURRENT_ROOM_KEY);
  } catch {
    // 무시
  }
}
