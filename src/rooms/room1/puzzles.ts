/**
 * Room 1 — 어두운 서재: 10개 퍼즐
 */

// ── 퍼즐 1: 학자의 일기 ─────────────────────────────
export const P1_HASHES = ['fa68d2ed5f32f14746be3ce92a07e5dcc7431b3ac4e7717b6947a4054fae5c18'];
export const P1_NOTE = `나는 이 서재에서 일곱 번째 겨울을 보내고 있다.
창밖의 달은 셋째 날에 가장 밝았다.
아홉 겹의 자물쇠 뒤에 진실을 숨겨둔 건 실수였을까.
두 번 다시 이곳에 올 일은 없을 것이다.`;
export const P1_HIDDEN_WORDS = [
  { search: '일곱', digit: '7' },
  { search: '셋', digit: '3' },
  { search: '아홉', digit: '9' },
  { search: '두', digit: '2' },
];

// ── 퍼즐 2: 마방진 ───────────────────────────────────
export const P2_HASHES = ['3a3a99897cabe3d52773c5dc0aac8aaf0ed23acf5fbefc6addb399f934288a48'];
export const P2_GRID = [
  [null, 7, null],
  [9,    5, 1   ],
  [null, 3, null],
];

// ── 퍼즐 3: 방향 암호 ───────────────────────────────
export const P3_HASHES = ['19fba0e995b9794fc2c26217bf3b725c2f0d9eeda16719fe75e3ba23ca73bfc4'];
export const P3_ROWS = [
  [ {t:'L',v:'T'}, {t:'L',v:'H'}, {t:'A',v:'→'} ],
  [ {t:'A',v:'↓'}, {t:'A',v:'→'}, {t:'L',v:'C'}, {t:'L',v:'R'}, {t:'A',v:'→'}, {t:'L',v:'T'} ],
  [ {t:'L',v:'I'}, {t:'A',v:'↓'} ],
  [ {t:'A',v:'↑'}, {t:'A',v:'→'}, {t:'A',v:'←'}, {t:'A',v:'↓'} ],
];

// ── 퍼즐 4: 숨겨진 패턴 ─────────────────────────────
export const P4_HASHES = ['3e1e967e9b793e908f8eae83c74dba9bcccce6a5535b4b462bd9994537bfe15c'];
export const P4_EXAMPLES = [
  { label: 'FIVE',  value: 4 },
  { label: 'SIX',   value: 9 },
  { label: 'SEVEN', value: 5 },
];
export const P4_QUESTIONS = [
  { label: 'ELEVEN',  digit: '1번째' },
  { label: 'SIXTEEN', digit: '2번째' },
];

// ── 퍼즐 5: 책장 ─────────────────────────────────────
// 메모 속 단어 "기억", "안개", "밤" 순서로 뒤집으면 ㄷ+ㅏ+ㄹ = "달"
export const P5_HASHES = ['2f941e6eb2150679c43fdd2d4078b9cabbf18065d9bb503b0d489811b6d75d8d'];
export const P5_MEMO = `기억이 안개처럼 천천히 번져간다.
그 사이로 밤이 조용히 스며든다.`;
export const P5_BOOKS = [
  { title: '심연',   back: 'ㅎ'  },
  { title: '밤',     back: 'ㄹ'  }, // answer 3rd
  { title: '기억',   back: 'ㄷ'  }, // answer 1st
  { title: '미로',   back: 'ㄱ'  },
  { title: '시간',   back: 'ㅛ'  },
  { title: '비밀',   back: 'ㄴ'  },
  { title: '침묵',   back: 'ㅔ'  },
  { title: '안개',   back: 'ㅏ'  }, // answer 2nd
  { title: '그림자', back: 'ㅂ'  },
  { title: '열쇠',   back: 'ㅣ'  },
  { title: '출구',   back: 'ㅅ'  },
  { title: '서재',   back: 'ㅜ'  },
];

// ── 퍼즐 6: 주사위 ───────────────────────────────────
// 표준 주사위: 마주 보는 면의 합 = 7
// 보이는 면: 1, 5, 3, 2 → 반대면: 6, 2, 4, 5 → "6245"
export const P6_HASHES = ['a288403a28bae669ae3e0face3416fae6b627c58c60dc52d2b00168e28a62979'];
export const P6_DICE_FACES = [1, 5, 3, 2]; // shown faces → answer: 6245

// ── 퍼즐 7: 7세그먼트 암호 ──────────────────────────
export const P7_HASHES = ['f439f7f80e4c460da59083d41c9aefbf8efcab48e64c33b983d3716e4c4a97e1'];
export const P7_DISPLAY = ['5', '3', '1', '7'];
export const P7_HINT_TEXT = '어제 술을 너무 많이 마셨나.. 세상이 빙빙 돈다.';

// ── 퍼즐 8: 카드 연결 ────────────────────────────────
// 4장의 카드. 올바른 순서(서재→재미→미용→용기)로 뒤집으면
// 뒷면 ㄱ+ㅓ+ㅁ+ㅣ = "거미"
export const P8_HASHES = ['9b3c26809b20b88ebdb5fd4c0dfc33a47035544b9f00928ff396906bab3175b9'];
export const P8_CARDS = [
  { word: '서재', back: 'ㄱ' },
  { word: '재미', back: 'ㅓ' },
  { word: '미용', back: 'ㅁ' },
  { word: '용기', back: 'ㅣ' },
];
// 연결 순서: 서재→재미(재)→미용(미)→용기(용) → 뒤집은 순 ㄱ+ㅓ+ㅁ+ㅣ = 거미

// ── 퍼즐 9: 심장박동 ─────────────────────────────────
// 진폭 작은 파형 = · (점), 진폭 큰 파형 = — (선)
// 그룹1: ···—— = 3, 그룹2: ————— = 0, 그룹3: ————· = 9 → "309"
export const P9_HASHES = ['43c727ee4fc7250574d2ef90cfa16626388a10e1b30d36ece1c272953ad2ed9e'];
export const P9_MORSE_GROUPS = [
  [0,0,0,1,1],
  [1,1,1,1,1],
  [1,1,1,1,0],
];
export const P9_REF: Record<string, string> = {
  '· — — — —': '1', '· · — — —': '2', '· · · — —': '3',
  '· · · · —': '4', '· · · · ·': '5', '— · · · ·': '6',
  '— — · · ·': '7', '— — — · ·': '8', '— — — — ·': '9',
  '— — — — —': '0',
};

// ── 퍼즐 10: 학자의 마지막 편지 ─────────────────────
// 각 줄 첫 글자: 탈, 출, 성, 공 → "탈출성공"
export const P10_HASHES = ['a134f402f80916d77b3b6556bd47cd17b1845ab62284b75bdf71e54b9379b629'];
export const P10_LETTER_LINES = [
  '탈출의 실마리는 어둠 속에 숨겨져 있고,',
  '출구는 보일 듯 말 듯 나를 시험한다.',
  '성벽처럼 막힌 침묵 속에서,',
  '공포를 뚫고 나아가야만 비로소 성공이다.',
];

export const TRANSITIONS = [
  '일기장 사이로 종이가 떨어진다...',
  '벽에 이상한 숫자들이 새겨져 있다...',
  '이상한 기호가 새겨진 판이 있다...',
  '벽에 뭔가 각인되어 있다...',
  '책장 뒤에서 딸깍 소리가 들린다...',
  '서랍 안에서 무언가 발견됐다...',
  '전광판이 깜빡이며 숫자를 보여준다...',
  '카드 네 장이 흩어져 있다...',
  '전등이 불규칙하게 깜빡인다...',
];
