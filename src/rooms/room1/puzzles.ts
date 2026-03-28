/**
 * Room 1 — 어두운 서재: 10개 퍼즐
 *
 * Act 1: 발견 (Easy)    → 퍼즐 1~3
 * Act 2: 탐색 (Medium)  → 퍼즐 4~7
 * Act 3: 탈출 (Hard)    → 퍼즐 8~10
 */

// ── 퍼즐 1: 찢어진 쪽지 ──────────────────────────────
// 한국어 숫자 단어 찾기 → 7392
export const P1_HASHES = ['fa68d2ed5f32f14746be3ce92a07e5dcc7431b3ac4e7717b6947a4054fae5c18'];
export const P1_NOTE = '오래된 서재의 일곱번째 선반에서 찾은 이 쪽지는 셋째 달의 기록이다. 누군가 아홉번째 밤, 두 시에 사라졌다.';
export const P1_HIDDEN_WORDS = [
  { search: '일곱', digit: '7' },
  { search: '셋', digit: '3' },
  { search: '아홉', digit: '9' },
  { search: '두', digit: '2' },
];

// ── 퍼즐 2: 거울 문장 ────────────────────────────────
// 좌우반전 텍스트 → "열쇠"
export const P2_HASHES = ['5bebbcbf30ba30c059711d17fc3423424437ca5b7b755209b6f45a5feee773e3'];
// "답은 열쇠" 를 음절 단위로 뒤집으면 "쇠열 은답"
export const P2_MIRROR_TEXT = '쇠열 은 답';

// ── 퍼즐 3: 초성 퀴즈 ────────────────────────────────
// ㅌ ㅊ + 힌트 → "탈출"
export const P3_HASHES = ['38e93480657d42e93b966b3da1f7e66e4b7fbd1cf0db6669ebc9e74afa252550'];
export const P3_CONSONANTS = 'ㅌ ㅊ';
export const P3_CONTEXT = '이 방에서 해야 할 단 하나의 일';

// ── 퍼즐 4: 수열 완성 ────────────────────────────────
// 2, 6, 12, 20, ? → 30 (차이: 4,6,8,10)
export const P4_HASHES = ['624b60c58c9d8bfb6ff1886c2fd605d2adeb6ea4da576068201b6c6958ce93f4'];
export const P4_SEQUENCE = [2, 6, 12, 20];
export const P4_SUB_HINT = '각 수 사이의 차이를 보세요';

// ── 퍼즐 5: 책장 암호 ────────────────────────────────
// 책 뒤집어 자모 찾기, 색상 순서로 조합 → "달"
export const P5_HASHES = ['2f941e6eb2150679c43fdd2d4078b9cabbf18065d9bb503b0d489811b6d75d8d'];
export const P5_BOOKS = [
  { title: '심연', color: 'dark', symbol: null },
  { title: '밤',   color: 'blue', symbol: 'ㄷ' },
  { title: '기억', color: 'brown', symbol: null },
  { title: '시간', color: 'red', symbol: 'ㅏ' },
  { title: '비밀', color: 'dark', symbol: null },
  { title: '출구', color: 'green', symbol: 'ㄹ' },
  { title: '열쇠', color: 'brown', symbol: null },
  { title: '그림자', color: 'dark', symbol: null },
];
export const P5_COLOR_HINT = '파랑 → 빨강 → 초록';

// ── 퍼즐 6: 그림자 세기 ──────────────────────────────
// 어둠 속 별 개수 세기 → 7
export const P6_HASHES = ['7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451'];
export const P6_STAR_POSITIONS = [
  { x: 15, y: 20 }, { x: 72, y: 12 }, { x: 45, y: 55 },
  { x: 88, y: 38 }, { x: 28, y: 78 }, { x: 65, y: 72 },
  { x: 50, y: 35 },
];

// ── 퍼즐 7: 암호 해독표 ─────────────────────────────
// 자음순서 치환 → "비밀"
export const P7_HASHES = ['00897c8f8b298fae0a09bd61b233f37b30f9fc4954b1330a2361a8e9a25edad8'];
export const P7_CIPHER = '6 - 5 - 4';
export const P7_TABLE_HINT = '모음은 모두 ㅣ';
export const P7_TABLE = [
  { consonant: 'ㄱ', num: 1 }, { consonant: 'ㄴ', num: 2 },
  { consonant: 'ㄷ', num: 3 }, { consonant: 'ㄹ', num: 4 },
  { consonant: 'ㅁ', num: 5 }, { consonant: 'ㅂ', num: 6 },
  { consonant: 'ㅅ', num: 7 }, { consonant: 'ㅇ', num: 8 },
  { consonant: 'ㅈ', num: 9 }, { consonant: 'ㅊ', num: 10 },
  { consonant: 'ㅋ', num: 11 }, { consonant: 'ㅌ', num: 12 },
  { consonant: 'ㅍ', num: 13 }, { consonant: 'ㅎ', num: 14 },
];

// ── 퍼즐 8: 좌표 그리드 ─────────────────────────────
// 5x5 격자 + 좌표 → "문"
export const P8_HASHES = ['e2c7d5c49b61f5326c139536e680e8e54fe4a180e48dd7390550969967180eb9'];
export const P8_GRID = [
  ['가', '나', '다', '라', '마'],
  ['바', '사', '아', '자', '차'],
  ['카', '타', '파', '하', '거'],
  ['출', '노', '도', '문', '모'],
  ['보', '소', '오', '조', '초'],
];
export const P8_COORDS = [{ row: 4, col: 4 }]; // 0-indexed → (4행,4열) = "문"
export const P8_COORD_TEXT = '네 번째 줄, 네 번째 칸';

// ── 퍼즐 9: 모스 부호 ───────────────────────────────
// · · · — —  /  — — — — —  /  — — — — · → 3, 0, 9 → "309"
export const P9_HASHES = ['43c727ee4fc7250574d2ef90cfa16626388a10e1b30d36ece1c272953ad2ed9e'];
export const P9_MORSE = ['· · · — —', '— — — — —', '— — — — ·'];
export const P9_REF: Record<string, string> = {
  '· — — — —': '1', '· · — — —': '2', '· · · — —': '3',
  '· · · · —': '4', '· · · · ·': '5', '— · · · ·': '6',
  '— — · · ·': '7', '— — — · ·': '8', '— — — — ·': '9',
  '— — — — —': '0',
};

// ── 퍼즐 10: 규칙 찾기 ──────────────────────────────
// 3x3 한글 격자. 행=같은 자음, 열=같은 모음. 빈칸 채우기 → "도"
// 가(ㄱ+ㅏ) 거(ㄱ+ㅓ) 고(ㄱ+ㅗ)
// 나(ㄴ+ㅏ) 너(ㄴ+ㅓ) 노(ㄴ+ㅗ)
// 다(ㄷ+ㅏ) 더(ㄷ+ㅓ)  ?(ㄷ+ㅗ) → 도
export const P10_HASHES = ['a3ec07cdd87ae1fabd096b38c905a573d8249886d8272495ab5ea825b98b2820'];
export const P10_GRID = [
  ['가', '거', '고'],
  ['나', '너', '노'],
  ['다', '더', '?'],
];

// ── 트랜지션 텍스트 ──────────────────────────────────
export const TRANSITIONS = [
  '먼지 사이로 무언가 보인다...',
  '벽에 이상한 글씨가 새겨져 있다...',
  '서랍이 열렸다...',
  '바닥에서 종이 한 장이 미끄러져 나온다...',
  '책장 뒤에서 바스락 소리가 난다...',
  '어딘가에서 희미한 빛이 새어 나온다...',
  '자물쇠가 풀리는 소리...',
  '벽의 격자판에 불이 들어온다...',
  '신호음이 울리기 시작한다...',
];
