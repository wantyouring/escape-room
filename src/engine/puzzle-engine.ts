/**
 * Puzzle Engine — 퍼즐 상태 관리 및 해시 기반 정답 검증
 *
 * Puzzle interface:
 *   mount(container) → 화면 렌더
 *   teardown()       → 정리
 *   getTransitionText() → "서랍 뒤에 뭔가 더 있다..."
 *
 * Flow:
 *   [사용자 입력] → hashString() → answerHashes에 포함? → onCorrect/onWrong
 */

export interface Puzzle {
  id: string;
  answerHashes: string[];
  mount(container: HTMLElement): void;
  teardown(): void;
  getTransitionText(): string;
}

export async function hashString(input: string): Promise<string> {
  const normalized = input.trim().toLowerCase();
  const data = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAnswer(input: string, hashes: string[]): Promise<boolean> {
  const inputHash = await hashString(input);
  return hashes.includes(inputHash);
}
