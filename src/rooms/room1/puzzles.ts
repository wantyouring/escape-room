/**
 * Room 1 — 어두운 서재: 10개 퍼즐
 * Act 1: 발견 (Easy)    → 퍼즐 1~3
 * Act 2: 탐색 (Medium)  → 퍼즐 4~7
 * Act 3: 탈출 (Hard)    → 퍼즐 8~10
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
// 3x3 마방진 (모든 행/열/대각선 합=15). 네 모서리가 숨겨짐 → 2648
export const P2_HASHES = ['3a3a99897cabe3d52773c5dc0aac8aaf0ed23acf5fbefc6addb399f934288a48'];
export const P2_GRID = [
  [null, 7, null],
  [9,    5, 1   ],
  [null, 3, null],
];
// 모서리 해: (0,0)=2, (0,2)=6, (2,0)=4, (2,2)=8 → 코드: 2648

// ── 퍼즐 3: 방향 암호 ───────────────────────────────
// →=E, ←=W, ↑=N, ↓=S → "THE SECRET IS NEWS"
export const P3_HASHES = ['19fba0e995b9794fc2c26217bf3b725c2f0d9eeda16719fe75e3ba23ca73bfc4'];
export const P3_ROWS = [
  [ {t:'L',v:'T'}, {t:'L',v:'H'}, {t:'A',v:'→'} ],
  [ {t:'A',v:'↓'}, {t:'A',v:'→'}, {t:'L',v:'C'}, {t:'L',v:'R'}, {t:'A',v:'→'}, {t:'L',v:'T'} ],
  [ {t:'L',v:'I'}, {t:'A',v:'↓'} ],
  [ {t:'A',v:'↑'}, {t:'A',v:'→'}, {t:'A',v:'←'}, {t:'A',v:'↓'} ],
];

// ── 퍼즐 4: 숨겨진 패턴 ─────────────────────────────
// 영단어 안에 숨겨진 무언가... FIVE=4, SIX=9, SEVEN=5
// ELEVEN=5(V), SIXTEEN=9(IX) → 답: "59"
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
// 학자의 메모에 나온 순서(3→8→2)대로 책을 뒤집으면 ㄷ+ㅏ+ㄹ = "달"
export const P5_HASHES = ['2f941e6eb2150679c43fdd2d4078b9cabbf18065d9bb503b0d489811b6d75d8d'];
export const P5_MEMO = '학자의 메모: "세 번째, 여덟 번째, 두 번째 책을 이 순서대로 확인하게."';
export const P5_ORDER = [3, 8, 2];
export const P5_BOOKS = [
  { title: '심연',   back: 'ㅎ'  }, // 1  - distractor
  { title: '밤',     back: 'ㄹ'  }, // 2  - answer (3rd jamo)
  { title: '기억',   back: 'ㄷ'  }, // 3  - answer (1st jamo)
  { title: '미로',   back: 'ㄱ'  }, // 4  - distractor
  { title: '시간',   back: 'ㅛ'  }, // 5  - distractor
  { title: '비밀',   back: 'ㄴ'  }, // 6  - distractor
  { title: '침묵',   back: 'ㅔ'  }, // 7  - distractor
  { title: '안개',   back: 'ㅏ'  }, // 8  - answer (2nd jamo)
  { title: '그림자', back: 'ㅂ'  }, // 9  - distractor
  { title: '열쇠',   back: 'ㅣ'  }, // 10 - distractor
  { title: '출구',   back: 'ㅅ'  }, // 11 - distractor
  { title: '서재',   back: 'ㅜ'  }, // 12 - distractor
];

// ── 퍼즐 6: 단어 연결고리 ────────────────────────────
// 이탈→탈출→출구→구문: 각 연결 글자 = 탈, 출, 구 → "탈출구"
export const P6_HASHES = ['6dcad839e382386a001683483753e18aaef1bd5ac1766b9b023b940cfc8a6cf8'];
export const P6_CHAIN = ['이탈', '탈출', '출구', '구문'];
// bridges: 탈(이탈↔탈출), 출(탈출↔출구), 구(출구↔구문)

// ── 퍼즐 7: 7세그먼트 암호 ──────────────────────────
// 5317 → 뒤집으면 LIES (→=S, →=E, →=I, →=L)
export const P7_HASHES = ['f439f7f80e4c460da59083d41c9aefbf8efcab48e64c33b983d3716e4c4a97e1'];
export const P7_DISPLAY = ['5', '3', '1', '7'];
export const P7_HINT_TEXT = '어제 술을 너무 많이 마셨나.. 세상이 빙빙 돈다.';

// ── 퍼즐 8: 끝말잇기 순서 ────────────────────────────
// 비밀→밀봉→봉투→투명 (올바른 순서). 첫 글자 = 비밀봉투
export const P8_HASHES = ['774610de7dc974049b79e6bc069635d55353d73c50c9537b5248e9612b6dff79'];
export const P8_WORDS_SCRAMBLED = ['봉투', '비밀', '밀봉', '투명'];
export const P8_CORRECT_ORDER = ['비밀', '밀봉', '봉투', '투명'];
// 연결: 비밀→(밀)→밀봉, 밀봉→(봉)→봉투, 봉투→(투)→투명

// ── 퍼즐 9: 심장박동 ─────────────────────────────────
// 짧은 박동=점(·), 긴 박동=선(—) → 모스부호 → 3, 0, 9 → "309"
export const P9_HASHES = ['43c727ee4fc7250574d2ef90cfa16626388a10e1b30d36ece1c272953ad2ed9e'];
// 그룹 1: · · · — — = 3
// 그룹 2: — — — — — = 0
// 그룹 3: — — — — · = 9
export const P9_MORSE_GROUPS = [
  [0,0,0,1,1],  // 3: short short short long long
  [1,1,1,1,1],  // 0: long×5
  [1,1,1,1,0],  // 9: long long long long short
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
  '탈의 서재에서 마침내 출구를 찾았다.',
  '출구는 이 방의 마지막 단서가 열어준다.',
  '성공적으로 모든 퍼즐을 풀었다면 알 것이다.',
  '공들여 찾아낸 열쇠가 이제 문을 열 것이다.',
];

export const TRANSITIONS = [
  '일기장 사이로 종이가 떨어진다...',
  '벽에 이상한 숫자들이 새겨져 있다...',
  '이상한 기호가 새겨진 판이 있다...',
  '벽에 뭔가 각인되어 있다...',
  '책장 뒤에서 딸깍 소리가 들린다...',
  '단어들이 서로 이어져 있다...',
  '전광판이 깜빡이며 숫자를 보여준다...',
  '단어 카드들이 뒤섞여 있다...',
  '전등이 불규칙하게 깜빡인다...',
];
