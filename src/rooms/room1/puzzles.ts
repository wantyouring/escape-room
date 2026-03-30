/**
 * Room 1 — 어두운 서재: 10개 퍼즐
 *
 * Act 1: 발견 (Easy)    → 퍼즐 1~3
 * Act 2: 탐색 (Medium)  → 퍼즐 4~7
 * Act 3: 탈출 (Hard)    → 퍼즐 8~10
 *
 * 설계 원칙:
 * - 모든 퍼즐은 화면에 단서가 있고, 그 단서를 해석하면 답이 나온다
 * - 각 퍼즐은 최소 2단계 사고가 필요하다
 * - 방탈출/미궁 게임의 다양한 트릭 유형을 활용
 */

// ── 퍼즐 1: 학자의 일기 ─────────────────────────────
// 일기장 텍스트에 숫자를 뜻하는 한국어 단어가 숨어 있다.
// 찾아서 순서대로 숫자로 변환 → 4자리 코드
// 답: 7392
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
// CSS scaleX(-1)로 뒤집힌 텍스트. 거울처럼 읽으면 "답은 열쇠"
// 답: 열쇠
export const P2_HASHES = ['5bebbcbf30ba30c059711d17fc3423424437ca5b7b755209b6f45a5feee773e3'];
export const P2_MIRROR_TEXT = '답은 열쇠';

// ── 퍼즐 3: 가려진 문서 ─────────────────────────────
// 기밀 문서처럼 특정 단어가 검은 블록으로 가려져 있다.
// 문맥을 읽고 가려진 단어를 추론해야 한다.
// 답: 진실
export const P3_HASHES = ['dd30b6103efafc756001c3f26416931799f79a1a911195ca6bea01654305d9c4'];
export const P3_DOC_LINES = [
  { text: '보고서 #1247 — 기밀', type: 'header' },
  { text: '학자 K는 평생을 거짓 속에서 살았다.', type: 'normal' },
  { text: '그가 마지막으로 남긴 것은 하나의 단어뿐이었다.', type: 'normal' },
  { text: '"세상에 알려야 할 것은 오직 ■■뿐이다."', type: 'redacted' },
  { text: '거짓의 반대. 감춰진 것. 밝혀져야 할 것.', type: 'hint' },
];
export const P3_REDACTED_WORD = '진실';

// ── 퍼즐 4: 벽의 수식 ───────────────────────────────
// 벽에 새겨진 연립방정식. 두 미지수를 구해 이어 붙인다.
// □ × ■ = 24, □ + ■ = 10, □ > ■
// → □=6, ■=4 → 답: "64"
export const P4_HASHES = ['a68b412c4282555f15546cf6e1fc42893b7e07f271557ceb021821098dd66c1b'];
export const P4_EQUATIONS = [
  '□ × ■ = 24',
  '□ + ■ = 10',
  '□ > ■',
];
export const P4_INSTRUCTION = '두 수를 차례로 이어 붙이세요';

// ── 퍼즐 5: 책장 암호 ───────────────────────────────
// 12권의 책 중 일부 뒷면에 한글 자모가 적혀 있다.
// 색상 순서 힌트로 자모를 정렬하면 한 글자 완성
// 답: 달
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

// ── 퍼즐 6: 기호 해독 ───────────────────────────────
// 여러 종류의 기호가 흩어져 있다. 각 기호의 개수가 숫자 한 자리.
// ★의 개수 = 첫째 자리, ◆의 개수 = 둘째 자리, ●의 개수 = 셋째 자리
// ★=3, ◆=9, ●=2 → 답: "392"
export const P6_HASHES = ['6ea2fdb3399f4d2e806beb01e9a3371bd622bed6a409acf3151818d738c370ec'];
export const P6_SYMBOLS = [
  // ★ 3개
  { type: '★', x: 12, y: 15 }, { type: '★', x: 78, y: 62 }, { type: '★', x: 42, y: 88 },
  // ◆ 9개
  { type: '◆', x: 25, y: 32 }, { type: '◆', x: 55, y: 8 },  { type: '◆', x: 85, y: 45 },
  { type: '◆', x: 10, y: 70 }, { type: '◆', x: 65, y: 28 }, { type: '◆', x: 38, y: 50 },
  { type: '◆', x: 92, y: 75 }, { type: '◆', x: 18, y: 48 }, { type: '◆', x: 70, y: 85 },
  // ● 2개
  { type: '●', x: 50, y: 22 }, { type: '●', x: 30, y: 68 },
];
export const P6_KEY = '★ = 첫째 자리  ◆ = 둘째 자리  ● = 셋째 자리';

// ── 퍼즐 7: 암호 해독표 ─────────────────────────────
// 자음 순서 치환 암호 + 모음 힌트 → "비밀"
// 6(ㅂ)+ㅣ=비, 5(ㅁ)+ㅣ=미, 4(ㄹ)=ㄹ(받침) → 비밀
export const P7_HASHES = ['00897c8f8b298fae0a09bd61b233f37b30f9fc4954b1330a2361a8e9a25edad8'];
export const P7_CIPHER = '6 - 5 - 4';
export const P7_TABLE_HINT = '모음은 모두 ㅣ입니다. 숫자는 자음의 순서입니다.';
export const P7_TABLE = [
  { consonant: 'ㄱ', num: 1 }, { consonant: 'ㄴ', num: 2 },
  { consonant: 'ㄷ', num: 3 }, { consonant: 'ㄹ', num: 4 },
  { consonant: 'ㅁ', num: 5 }, { consonant: 'ㅂ', num: 6 },
  { consonant: 'ㅅ', num: 7 }, { consonant: 'ㅇ', num: 8 },
  { consonant: 'ㅈ', num: 9 }, { consonant: 'ㅊ', num: 10 },
  { consonant: 'ㅋ', num: 11 }, { consonant: 'ㅌ', num: 12 },
  { consonant: 'ㅍ', num: 13 }, { consonant: 'ㅎ', num: 14 },
];

// ── 퍼즐 8: 화살표 추적 ─────────────────────────────
// 5x5 격자. 각 칸에 화살표와 글자가 있다.
// START 칸에서 시작, 화살표를 따라가며 글자를 모으면 답이 된다.
// 경로: (0,0)출→(0,1)→(1,1)→(1,2)구 → 답: "출구"
export const P8_HASHES = ['b4231a6de8f04520b2cd01542a56c71ec5bbf6340025c5820372e9826efd674f'];
export const P8_GRID = [
  [{ ch: '출', dir: '→' }, { ch: '',  dir: '↓' }, { ch: '미', dir: '←' }, { ch: '로', dir: '↓' }, { ch: '속', dir: '←' }],
  [{ ch: '은', dir: '↑' }, { ch: '',  dir: '→' }, { ch: '구', dir: '★' }, { ch: '의', dir: '↑' }, { ch: '밤', dir: '←' }],
  [{ ch: '서', dir: '→' }, { ch: '재', dir: '↑' }, { ch: '길', dir: '←' }, { ch: '을', dir: '↓' }, { ch: '찾', dir: '↓' }],
  [{ ch: '아', dir: '↑' }, { ch: '문', dir: '←' }, { ch: '이', dir: '↓' }, { ch: '열', dir: '→' }, { ch: '린', dir: '↑' }],
  [{ ch: '다', dir: '→' }, { ch: '빛', dir: '↑' }, { ch: '어', dir: '←' }, { ch: '둠', dir: '↑' }, { ch: '끝', dir: '←' }],
];
export const P8_START = { row: 0, col: 0 };
// Path: (0,0)출→(0,1)↓(1,1)→(1,2)구★ = "출구"

// ── 퍼즐 9: 모스 부호 ───────────────────────────────
// 전등이 깜빡이는 패턴. 모스 부호 참조표로 해독.
// · · · — —  /  — — — — —  /  — — — — · → 3, 0, 9 → "309"
export const P9_HASHES = ['43c727ee4fc7250574d2ef90cfa16626388a10e1b30d36ece1c272953ad2ed9e'];
export const P9_MORSE = ['· · · — —', '— — — — —', '— — — — ·'];
export const P9_REF: Record<string, string> = {
  '· — — — —': '1', '· · — — —': '2', '· · · — —': '3',
  '· · · · —': '4', '· · · · ·': '5', '— · · · ·': '6',
  '— — · · ·': '7', '— — — · ·': '8', '— — — — ·': '9',
  '— — — — —': '0',
};

// ── 퍼즐 10: 네 개의 수수께끼 ───────────────────────
// 자물쇠 4자리. 각 자리를 수수께끼로 풀어야 한다.
// 답: 3794
export const P10_HASHES = ['b0c71dc912263c36812f2ae847ce911bd0a2df1c68c33e85851cf6cc15b351e0'];
export const P10_RIDDLES = [
  { question: '삼각형의 변의 수', answer: '3' },
  { question: '일주일의 날 수', answer: '7' },
  { question: '야구에서 한 팀의 선수 수', answer: '9' },
  { question: '사각형의 꼭짓점 수', answer: '4' },
];

// ── 트랜지션 텍스트 ──────────────────────────────────
export const TRANSITIONS = [
  '일기장 사이로 종이가 떨어진다...',
  '거울 뒤에서 바스락 소리가 난다...',
  '검게 칠해진 문서가 바닥에 놓여 있다...',
  '벽에 무언가 새겨져 있다...',
  '책장 뒤에서 딸깍 소리가 들린다...',
  '바닥에 기호들이 흩어져 있다...',
  '서랍 안에 오래된 해독표가 있다...',
  '벽면에 격자판이 빛나기 시작한다...',
  '전등이 불규칙하게 깜빡인다...',
];
