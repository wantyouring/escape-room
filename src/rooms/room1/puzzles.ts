/**
 * Room 1 — 어두운 서재: 10개 퍼즐
 * Act 1: 발견 (Easy)    → 퍼즐 1~3
 * Act 2: 탐색 (Medium)  → 퍼즐 4~7
 * Act 3: 탈출 (Hard)    → 퍼즐 8~10
 */

// ── 퍼즐 1: 학자의 일기 ─────────────────────────────
// 한국어 숫자 단어 찾기 → 7392
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

// ── 퍼즐 2: 거울 속 메시지 ──────────────────────────
// CSS scaleX(-1) 뒤집힌 텍스트 → "열쇠"
export const P2_HASHES = ['5bebbcbf30ba30c059711d17fc3423424437ca5b7b755209b6f45a5feee773e3'];
export const P2_MIRROR_TEXT = '답은 열쇠';

// ── 퍼즐 3: 방향 암호 ───────────────────────────────
// →=E, ←=W, ↑=N, ↓=S 치환 → "THE SECRET IS NEWS"
// 답: news
export const P3_HASHES = ['19fba0e995b9794fc2c26217bf3b725c2f0d9eeda16719fe75e3ba23ca73bfc4'];
// 각 행: { type: 'letter'|'arrow', value: string }[]
export const P3_ROWS = [
  [ {t:'L',v:'T'}, {t:'L',v:'H'}, {t:'A',v:'→'} ],
  [ {t:'A',v:'↓'}, {t:'A',v:'→'}, {t:'L',v:'C'}, {t:'L',v:'R'}, {t:'A',v:'→'}, {t:'L',v:'T'} ],
  [ {t:'L',v:'I'}, {t:'A',v:'↓'} ],
  [ {t:'A',v:'↑'}, {t:'A',v:'→'}, {t:'A',v:'←'}, {t:'A',v:'↓'} ],
];
// → = East = E, ← = West = W, ↑ = North = N, ↓ = South = S

// ── 퍼즐 4: 숨은 로마숫자 ───────────────────────────
// F(IV)E=5, S(IX)=6 → 영단어 속 로마숫자 패턴으로 숫자 추론
// E(I)GHT=8, S(IX)=6, N(I)NE=9, F(IV)E=5 → 8695
export const P4_HASHES = ['ca953234a8b14221abfab0fd20ecbc79979042318f8402c3fbece26ec27754ab'];
export const P4_EXAMPLES = [
  { word: ['F','(IV)','E'], value: 5 },
  { word: ['S','(IX)',''], value: 6 },
];
export const P4_QUESTIONS = [
  { word: ['E','(I)','GHT'], label: '1번째 자리' },
  { word: ['S','(IX)',''],   label: '2번째 자리' },
  { word: ['N','(I)','NE'], label: '3번째 자리' },
  { word: ['F','(IV)','E'], label: '4번째 자리' },
];

// ── 퍼즐 5: 책장 암호 ───────────────────────────────
// 12권의 책 중 기호 찾기, 색상 순서로 자모 조합 → "달"
export const P5_HASHES = ['2f941e6eb2150679c43fdd2d4078b9cabbf18065d9bb503b0d489811b6d75d8d'];
export const P5_BOOKS = [
  { title: '심연', color: 'dark', symbol: null },
  { title: '밤',   color: 'blue', symbol: 'ㄷ' },
  { title: '기억', color: 'dark', symbol: null },
  { title: '시간', color: 'red', symbol: 'ㅏ' },
  { title: '미로', color: 'dark', symbol: null },
  { title: '출구', color: 'green', symbol: 'ㄹ' },
  { title: '열쇠', color: 'brown', symbol: null },
  { title: '그림자', color: 'dark', symbol: null },
  { title: '안개', color: 'dark', symbol: null },
  { title: '침묵', color: 'brown', symbol: null },
  { title: '거울', color: 'dark', symbol: null },
  { title: '시계', color: 'dark', symbol: null },
];
export const P5_COLOR_HINT = '파랑 → 빨강 → 초록';

// ── 퍼즐 6: 자음 번호 격자 ──────────────────────────
// ㄱ(1)~ㅈ(9) 자음 순서 = 격자 위치 → "자유탈출"
export const P6_HASHES = ['eb98bef9e952a5f0b442a37f45e20140e688a8ab91e664626863313c75678a8d'];
export const P6_GRID_CELLS = [
  { pos: 1, char: '비', consonant: 'ㄱ' },
  { pos: 2, char: '밀', consonant: 'ㄴ' },
  { pos: 3, char: '암', consonant: 'ㄷ' },
  { pos: 4, char: '호', consonant: 'ㄹ' },
  { pos: 5, char: '탈', consonant: 'ㅁ' },
  { pos: 6, char: '출', consonant: 'ㅂ' },
  { pos: 7, char: '자', consonant: 'ㅅ' },
  { pos: 8, char: '유', consonant: 'ㅇ' },
  { pos: 9, char: '문', consonant: 'ㅈ' },
];
// 예시: ㄱㄴ = 비밀 / 질문: ㅅ ㅇ ㅁ ㅂ = 자유탈출

// ── 퍼즐 7: 7세그먼트 암호 ──────────────────────────
// 숫자를 180도 뒤집으면 영어 알파벳이 됨
// 5317 → 뒤집으면 LIES
export const P7_HASHES = ['f439f7f80e4c460da59083d41c9aefbf8efcab48e64c33b983d3716e4c4a97e1'];
export const P7_DISPLAY = ['5', '3', '1', '7'];
// 뒤집기: 5→S, 3→E, 1→I, 7→L → 오른쪽→왼쪽: L I E S = "LIES"
export const P7_SEGMENT_MAP: Record<string, string> = {
  '0': 'O', '1': 'I', '2': '2(flip=?)',
  '3': 'E', '4': 'h', '5': 'S',
  '6': 'g', '7': 'L', '8': 'B', '9': '6',
};

// ── 퍼즐 8: 화살표 추적 ─────────────────────────────
// 5x5 격자, START에서 화살표 따라 이동 → 글자 수집 → "출구"
export const P8_HASHES = ['b4231a6de8f04520b2cd01542a56c71ec5bbf6340025c5820372e9826efd674f'];
export const P8_GRID = [
  [{ ch: '출', dir: '→', collect: true  }, { ch: '',  dir: '↓', collect: false }, { ch: '미', dir: '←', collect: false }, { ch: '로', dir: '↓', collect: false }, { ch: '속', dir: '←', collect: false }],
  [{ ch: '은', dir: '↑', collect: false }, { ch: '',  dir: '→', collect: false }, { ch: '구', dir: '★', collect: true  }, { ch: '의', dir: '↑', collect: false }, { ch: '밤', dir: '←', collect: false }],
  [{ ch: '서', dir: '→', collect: false }, { ch: '재', dir: '↑', collect: false }, { ch: '길', dir: '←', collect: false }, { ch: '을', dir: '↓', collect: false }, { ch: '찾', dir: '↓', collect: false }],
  [{ ch: '아', dir: '↑', collect: false }, { ch: '문', dir: '←', collect: false }, { ch: '이', dir: '↓', collect: false }, { ch: '열', dir: '→', collect: false }, { ch: '린', dir: '↑', collect: false }],
  [{ ch: '다', dir: '→', collect: false }, { ch: '빛', dir: '↑', collect: false }, { ch: '어', dir: '←', collect: false }, { ch: '둠', dir: '↑', collect: false }, { ch: '끝', dir: '←', collect: false }],
];
export const P8_START = { row: 0, col: 0 };

// ── 퍼즐 9: 모스 부호 ───────────────────────────────
// 점·선 패턴 → 숫자 해독 → "309"
export const P9_HASHES = ['43c727ee4fc7250574d2ef90cfa16626388a10e1b30d36ece1c272953ad2ed9e'];
export const P9_MORSE = ['· · · — —', '— — — — —', '— — — — ·'];
export const P9_REF: Record<string, string> = {
  '· — — — —': '1', '· · — — —': '2', '· · · — —': '3',
  '· · · · —': '4', '· · · · ·': '5', '— · · · ·': '6',
  '— — · · ·': '7', '— — — · ·': '8', '— — — — ·': '9',
  '— — — — —': '0',
};

// ── 퍼즐 10: 학자의 마지막 편지 (아크로스틱) ────────
// 각 문장의 첫 글자 → 탈출성공
export const P10_HASHES = ['a134f402f80916d77b3b6556bd47cd17b1845ab62284b75bdf71e54b9379b629'];
export const P10_LETTER_LINES = [
  '탈의 서재에서 마침내 출구를 찾았다.',
  '출구는 이 방의 마지막 단서가 열어준다.',
  '성공적으로 모든 퍼즐을 풀었다면 알 것이다.',
  '공들여 찾아낸 열쇠가 이제 문을 열 것이다.',
];
// 첫 글자: 탈, 출, 성, 공 → "탈출성공"

// ── 트랜지션 텍스트 ──────────────────────────────────
export const TRANSITIONS = [
  '일기장 사이로 종이가 떨어진다...',
  '거울 뒤에서 바스락 소리가 난다...',
  '이상한 기호들이 새겨진 판이 있다...',
  '벽에 무언가 각인되어 있다...',
  '책장 뒤에서 딸깍 소리가 들린다...',
  '바닥에 기호들이 흩어져 있다...',
  '서랍 안에 오래된 해독표가 있다...',
  '벽면에 격자판이 빛나기 시작한다...',
  '전등이 불규칙하게 깜빡인다...',
];
