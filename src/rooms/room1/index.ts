/**
 * Room 1 — 어두운 서재 (10개 퍼즐)
 */

import type { Scene } from '../../engine/scene-manager';
import { verifyAnswer } from '../../engine/puzzle-engine';
import {
  createCodeInput, createTextInput, showWrongFeedback,
  Timer, typewriter, hapticFeedback
} from '../../ui/components';
import {
  P1_HASHES, P1_NOTE, P1_HIDDEN_WORDS,
  P2_HASHES, P2_WORDS,
  P3_HASHES, P3_ROWS,
  P4_HASHES, P4_EXAMPLES, P4_QUESTIONS,
  P5_HASHES, P5_MEMO, P5_BOOKS,
  P6_HASHES, P6_CLOCKS,
  P7_HASHES, P7_DISPLAY, P7_HINT_TEXT,
  P8_HASHES, P8_CARDS,
  P9_HASHES, P9_MORSE_GROUPS, P9_REF,
  P10_HASHES, P10_LETTER_LINES,
} from './puzzles';

/** 게임 상태 참조 (main.ts에서 주입) */
export interface GameState {
  completedPuzzles: string[];
  currentPuzzle: string;
  goToPuzzle: (puzzleId: string) => void;
}

let gameState: GameState | null = null;

export function setGameState(state: GameState): void {
  gameState = state;
}

const PUZZLE_NAMES = [
  '학자의 일기', '빠진 글자', '방향 암호', '숨겨진 패턴', '책장',
  '시계 암호', '7세그먼트', '카드 연결', '심장박동', '마지막 편지',
];

function toggleDropdown(anchor: HTMLElement): void {
  if (!gameState) return;
  const existing = document.querySelector('.puzzle-dropdown');
  if (existing) { existing.remove(); return; }

  const dropdown = document.createElement('div');
  dropdown.className = 'puzzle-dropdown';

  for (let i = 0; i < 10; i++) {
    const id = `puzzle-${i + 1}`;
    const solved = gameState.completedPuzzles.includes(id);
    const isCurrent = gameState.currentPuzzle === id;
    const accessible = solved || isCurrent;

    const item = document.createElement('div');
    item.className = `dropdown-item${solved ? ' solved' : ''}${isCurrent ? ' current' : ''}${!accessible ? ' locked' : ''}`;
    item.innerHTML = `
      <span class="dropdown-num">${i + 1}</span>
      <span class="dropdown-name">${PUZZLE_NAMES[i]}</span>
      <span class="dropdown-status">${solved ? '✓' : isCurrent ? '→' : ''}</span>
    `;
    if (accessible) {
      item.addEventListener('click', () => {
        dropdown.remove();
        gameState!.goToPuzzle(id);
      });
    }
    dropdown.appendChild(item);
  }

  // Position below anchor
  const rect = anchor.getBoundingClientRect();
  const app = document.getElementById('app')!;
  const appRect = app.getBoundingClientRect();
  dropdown.style.top = `${rect.bottom - appRect.top + 4}px`;
  dropdown.style.left = `${rect.left - appRect.left}px`;
  app.appendChild(dropdown);

  // Close on outside click
  const close = (e: MouseEvent) => {
    if (!dropdown.contains(e.target as Node) && e.target !== anchor) {
      dropdown.remove();
      document.removeEventListener('click', close);
    }
  };
  setTimeout(() => document.addEventListener('click', close), 0);
}

// Helper: 공통 퍼즐 화면 래퍼 생성
function createPuzzleWrapper(num: number, total: number, timer: Timer): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'puzzle-screen';

  const numBtn = document.createElement('button');
  numBtn.className = 'puzzle-num-btn';
  numBtn.innerHTML = `${num} / ${total} <span class="dropdown-arrow">▼</span>`;
  numBtn.addEventListener('click', () => toggleDropdown(numBtn));

  wrapper.appendChild(numBtn);
  wrapper.appendChild(timer.getElement());
  return wrapper;
}

// ============================================================
// INTRO
// ============================================================
export class IntroScene implements Scene {
  id = 'intro';
  private onTap: () => void;
  constructor(onTap: () => void) { this.onTap = onTap; }

  mount(container: HTMLElement): void {
    container.innerHTML = `
      <div class="intro-screen">
        <div class="intro-tap-text">화면을 탭하세요</div>
      </div>`;
    container.querySelector('.intro-screen')?.addEventListener('click', this.onTap, { once: true });
  }
  teardown(): void {}
}

// ============================================================
// 퍼즐 1: 찢어진 쪽지 — 숨겨진 숫자 단어 찾기
// ============================================================
export class Puzzle1Scene implements Scene {
  id = 'puzzle-1';
  private onSolved: () => void;
  private timer: Timer;
  private nudgeTimeout: number | null = null;

  constructor(onSolved: () => void, timer: Timer) {
    this.onSolved = onSolved;
    this.timer = timer;
  }

  mount(container: HTMLElement): void {
    const w = createPuzzleWrapper(1, 10, this.timer);
    const note = document.createElement('div');
    note.className = 'torn-note';

    const noteText = document.createElement('div');
    noteText.className = 'note-text';
    let html = P1_NOTE;
    P1_HIDDEN_WORDS.forEach(({ search, digit }) => {
      html = html.replace(search, `<span class="hidden-char" data-digit="${digit}">${search}</span>`);
    });
    noteText.innerHTML = html;
    note.appendChild(noteText);
    w.appendChild(note);

    const hiddenChars = noteText.querySelectorAll('.hidden-char');
    hiddenChars.forEach(el => el.addEventListener('click', () => el.classList.add('found')));

    this.nudgeTimeout = window.setTimeout(() => {
      hiddenChars.forEach(el => el.classList.add('pulse-glow'));
      setTimeout(() => hiddenChars.forEach(el => el.classList.remove('pulse-glow')), 1000);
    }, 30000);

    const input = createCodeInput(4, async (v) => {
      if (await verifyAnswer(v, P1_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    });
    w.appendChild(input);
    container.appendChild(w);
  }
  teardown(): void { if (this.nudgeTimeout) clearTimeout(this.nudgeTimeout); }
}

// ============================================================
// 퍼즐 2: 거울 문장 — 좌우반전 텍스트
// ============================================================
export class Puzzle2Scene implements Scene {
  id = 'puzzle-2';
  private onSolved: () => void;
  private timer: Timer;
  constructor(onSolved: () => void, timer: Timer) { this.onSolved = onSolved; this.timer = timer; }

  mount(container: HTMLElement): void {
    const w = createPuzzleWrapper(2, 10, this.timer);

    const desc = document.createElement('p');
    desc.className = 'puzzle-description';
    desc.textContent = '낡은 쪽지에 단어 조각들이 있다. 빈칸에 들어갈 글자를 찾아라...';
    w.appendChild(desc);

    const wordList = document.createElement('div');
    wordList.className = 'word-fill-list';

    P2_WORDS.forEach(item => {
      const row = document.createElement('div');
      row.className = 'word-fill-row';
      row.innerHTML = `<span class="wf-blank">${item.blank}</span><span class="wf-arrow">→</span><span class="wf-hint">?</span>`;
      wordList.appendChild(row);
    });
    w.appendChild(wordList);

    const hint = document.createElement('p');
    hint.className = 'puzzle-sub-hint';
    hint.textContent = '빈칸(□) 글자들을 순서대로 이어 붙이세요 (4글자)';
    w.appendChild(hint);

    const input = createTextInput('○○○○', '4글자를 입력하세요', async (v) => {
      if (await verifyAnswer(v, P2_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    }, 10);
    w.appendChild(input);
    container.appendChild(w);
  }
  teardown(): void {}
}

// ============================================================
// 퍼즐 3: 초성 퀴즈
// ============================================================
export class Puzzle3Scene implements Scene {
  id = 'puzzle-3';
  private onSolved: () => void;
  private timer: Timer;
  constructor(onSolved: () => void, timer: Timer) { this.onSolved = onSolved; this.timer = timer; }

  mount(container: HTMLElement): void {
    const w = createPuzzleWrapper(3, 10, this.timer);

    const desc = document.createElement('p');
    desc.className = 'puzzle-description';
    desc.textContent = '벽에 이상한 기호가 새겨져 있다. 화살표는 무엇을 의미할까...';
    w.appendChild(desc);

    // Direction cipher grid
    const grid = document.createElement('div');
    grid.className = 'dir-cipher-grid';
    P3_ROWS.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'dir-row';
      row.forEach(cell => {
        const cellEl = document.createElement('div');
        cellEl.className = `dir-cell ${cell.t === 'A' ? 'dir-arrow' : 'dir-letter'}`;
        cellEl.textContent = cell.v;
        rowEl.appendChild(cellEl);
      });
      grid.appendChild(rowEl);
    });
    w.appendChild(grid);

    // Compass hint

    const input = createTextInput('○○○○', '마지막 단어를 영어로 입력하세요 (4글자)', async (v) => {
      if (await verifyAnswer(v, P3_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    }, 10);
    w.appendChild(input);
    container.appendChild(w);
  }
  teardown(): void {}
}

// ============================================================
// 퍼즐 4: 수열 완성
// ============================================================
export class Puzzle4Scene implements Scene {
  id = 'puzzle-4';
  private onSolved: () => void;
  private timer: Timer;
  constructor(onSolved: () => void, timer: Timer) { this.onSolved = onSolved; this.timer = timer; }

  mount(container: HTMLElement): void {
    const w = createPuzzleWrapper(4, 10, this.timer);

    const desc = document.createElement('p');
    desc.className = 'puzzle-description';
    desc.textContent = '낡은 암호표가 발견됐다. 규칙을 찾아 빈칸을 채우시오.';
    w.appendChild(desc);

    const table = document.createElement('div');
    table.className = 'pattern-table';

    // Examples
    P4_EXAMPLES.forEach(ex => {
      const row = document.createElement('div');
      row.className = 'pattern-row';
      row.innerHTML = `<span class="pattern-word">${ex.label}</span><span class="pattern-sep">=</span><span class="pattern-val">${ex.value}</span>`;
      table.appendChild(row);
    });

    // Divider
    const div = document.createElement('div');
    div.className = 'pattern-divider';
    table.appendChild(div);

    // Questions
    P4_QUESTIONS.forEach(q => {
      const row = document.createElement('div');
      row.className = 'pattern-row pattern-question';
      row.innerHTML = `<span class="pattern-word">${q.label}</span><span class="pattern-sep">=</span><span class="pattern-val pattern-unknown">?</span>`;
      table.appendChild(row);
    });

    w.appendChild(table);

    const hint = document.createElement('p');
    hint.className = 'puzzle-sub-hint';
    hint.textContent = '두 자리 숫자를 입력하세요';
    w.appendChild(hint);

    const input = createCodeInput(2, async (v) => {
      if (await verifyAnswer(v, P4_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    });
    w.appendChild(input);
    container.appendChild(w);
  }
  teardown(): void {}
}

// ============================================================
// 퍼즐 5: 책장 암호
// ============================================================
export class Puzzle5Scene implements Scene {
  id = 'puzzle-5';
  private onSolved: () => void;
  private timer: Timer;
  constructor(onSolved: () => void, timer: Timer) { this.onSolved = onSolved; this.timer = timer; }

  mount(container: HTMLElement): void {
    const w = createPuzzleWrapper(5, 10, this.timer);

    // Memo above bookshelf
    const memo = document.createElement('div');
    memo.className = 'bookshelf-memo';
    memo.textContent = P5_MEMO;
    w.appendChild(memo);

    // 12-book shelf (3 rows × 4)
    const shelf = document.createElement('div');
    shelf.className = 'bookshelf bookshelf-12';
    P5_BOOKS.forEach((book) => {
      const el = document.createElement('div');
      el.className = 'book book-dark';

      const front = document.createElement('div');
      front.className = 'book-front';
      front.innerHTML = `<span class="book-title">${book.title}</span>`;

      const back = document.createElement('div');
      back.className = 'book-back';
      back.innerHTML = `<span class="book-symbol">${book.back}</span>`;

      el.appendChild(front);
      el.appendChild(back);
      el.addEventListener('click', () => el.classList.toggle('flipped'));
      shelf.appendChild(el);
    });
    w.appendChild(shelf);

    const hint = document.createElement('p');
    hint.className = 'puzzle-sub-hint';
    hint.textContent = '1글자';
    w.appendChild(hint);

    const input = createTextInput('○', '조합된 글자를 입력하세요', async (v) => {
      if (await verifyAnswer(v, P5_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    });
    w.appendChild(input);
    container.appendChild(w);
  }
  teardown(): void {}
}

// ============================================================
// 퍼즐 6: 그림자 세기
// ============================================================
export class Puzzle6Scene implements Scene {
  id = 'puzzle-6';
  private onSolved: () => void;
  private timer: Timer;
  constructor(onSolved: () => void, timer: Timer) { this.onSolved = onSolved; this.timer = timer; }

  mount(container: HTMLElement): void {
    const w = createPuzzleWrapper(6, 10, this.timer);

    const desc = document.createElement('p');
    desc.className = 'puzzle-description';
    desc.textContent = '벽에 낡은 시계 두 개가 걸려 있다...';
    w.appendChild(desc);

    const clockRow = document.createElement('div');
    clockRow.className = 'clock-row';

    P6_CLOCKS.forEach((c, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'clock-wrap';
      wrap.innerHTML = buildClock(c.hour, c.minute);
      const label = document.createElement('div');
      label.className = 'clock-label';
      label.textContent = `${i + 1}번`;
      wrap.appendChild(label);
      clockRow.appendChild(wrap);
    });
    w.appendChild(clockRow);

    const hint = document.createElement('p');
    hint.className = 'puzzle-sub-hint';
    hint.textContent = '시침과 분침이 가리키는 숫자를 이어 붙이세요 (4자리)';
    w.appendChild(hint);

    const input = createCodeInput(4, async (v) => {
      if (await verifyAnswer(v, P6_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    });
    w.appendChild(input);
    container.appendChild(w);
  }
  teardown(): void {}
}

function buildClock(hour: number, minute: number): string {
  const cx = 60, cy = 60, r = 54;
  // Hour hand angle (includes partial hour from minutes)
  const hourAngle = ((hour % 12) + minute / 60) * 30 - 90;
  // Minute hand angle
  const minAngle = (minute / 60) * 360 - 90;

  const toXY = (angle: number, len: number) => ({
    x: cx + len * Math.cos(angle * Math.PI / 180),
    y: cy + len * Math.sin(angle * Math.PI / 180),
  });

  const hEnd = toXY(hourAngle, 32);
  const mEnd = toXY(minAngle, 46);

  // Hour tick marks and numbers
  let ticks = '';
  let nums = '';
  for (let i = 1; i <= 12; i++) {
    const a = (i * 30 - 90) * Math.PI / 180;
    const x1 = cx + 48 * Math.cos(a), y1 = cy + 48 * Math.sin(a);
    const x2 = cx + 54 * Math.cos(a), y2 = cy + 54 * Math.sin(a);
    ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="rgba(200,200,200,0.4)" stroke-width="1.5"/>`;
    const nx = cx + 38 * Math.cos(a), ny = cy + 38 * Math.sin(a);
    nums += `<text x="${nx.toFixed(1)}" y="${(ny + 4).toFixed(1)}" text-anchor="middle" font-size="9" fill="rgba(200,200,200,0.5)" font-family="monospace">${i}</text>`;
  }

  return `<svg width="120" height="120" viewBox="0 0 120 120">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0a0a10" stroke="rgba(200,200,200,0.2)" stroke-width="2"/>
    ${ticks}${nums}
    <line x1="${cx}" y1="${cy}" x2="${hEnd.x.toFixed(1)}" y2="${hEnd.y.toFixed(1)}" stroke="#c8c8c8" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${mEnd.x.toFixed(1)}" y2="${mEnd.y.toFixed(1)}" stroke="var(--accent-amber)" stroke-width="2" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="3" fill="#c8c8c8"/>
  </svg>`;
}

// ============================================================
// 퍼즐 7: 7세그먼트 암호
// ============================================================
export class Puzzle7Scene implements Scene {
  id = 'puzzle-7';
  private onSolved: () => void;
  private timer: Timer;
  constructor(onSolved: () => void, timer: Timer) { this.onSolved = onSolved; this.timer = timer; }

  mount(container: HTMLElement): void {
    const w = createPuzzleWrapper(7, 10, this.timer);

    const desc = document.createElement('p');
    desc.className = 'puzzle-description';
    desc.textContent = P7_HINT_TEXT;
    w.appendChild(desc);

    // 7-segment display using CSS
    const segDisplay = document.createElement('div');
    segDisplay.className = 'seg-display';
    P7_DISPLAY.forEach(digit => {
      const d = document.createElement('div');
      d.className = `seg-digit`;
      // Build 7 segments: a(top) b(top-right) c(bot-right) d(bot) e(bot-left) f(top-left) g(mid)
      const segs = getSegments(digit);
      ['a','b','c','d','e','f','g'].forEach(s => {
        const seg = document.createElement('span');
        seg.className = `seg seg-${s} ${segs.includes(s) ? 'seg-on' : 'seg-off'}`;
        d.appendChild(seg);
      });
      segDisplay.appendChild(d);
    });
    w.appendChild(segDisplay);

    const input = createTextInput('○○○○', '영어 단어를 입력하세요 (4글자)', async (v) => {
      if (await verifyAnswer(v, P7_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    }, 10);
    w.appendChild(input);
    container.appendChild(w);
  }
  teardown(): void {}
}

function getSegments(digit: string): string[] {
  const map: Record<string, string[]> = {
    '0': ['a','b','c','d','e','f'],
    '1': ['b','c'],
    '2': ['a','b','d','e','g'],
    '3': ['a','b','c','d','g'],
    '4': ['b','c','f','g'],
    '5': ['a','c','d','f','g'],
    '6': ['a','c','d','e','f','g'],
    '7': ['a','b','c'],
    '8': ['a','b','c','d','e','f','g'],
    '9': ['a','b','c','d','f','g'],
  };
  return map[digit] ?? [];
}

// ============================================================
// 퍼즐 8: 끝말잇기 순서
// ============================================================
export class Puzzle8Scene implements Scene {
  id = 'puzzle-8';
  private onSolved: () => void;
  private timer: Timer;
  constructor(onSolved: () => void, timer: Timer) { this.onSolved = onSolved; this.timer = timer; }

  mount(container: HTMLElement): void {
    const w = createPuzzleWrapper(8, 10, this.timer);

    const desc = document.createElement('p');
    desc.className = 'puzzle-description';
    desc.textContent = '책상 위에 카드 네 장이 흩어져 있다. 무슨 카드일까..';
    w.appendChild(desc);

    // 2x2 flip cards
    const grid = document.createElement('div');
    grid.className = 'flip-card-grid';

    // Shuffle display order (서재,용기 top / 재미,미용 bottom)
    const displayOrder = [P8_CARDS[0], P8_CARDS[3], P8_CARDS[1], P8_CARDS[2]];
    displayOrder.forEach(card => {
      const el = document.createElement('div');
      el.className = 'flip-card';

      const front = document.createElement('div');
      front.className = 'flip-front';
      front.textContent = card.word;

      const back = document.createElement('div');
      back.className = 'flip-back';
      back.textContent = card.back;

      el.appendChild(front);
      el.appendChild(back);
      el.addEventListener('click', () => el.classList.toggle('flipped'));
      grid.appendChild(el);
    });
    w.appendChild(grid);

    const hint = document.createElement('p');
    hint.className = 'puzzle-sub-hint';
    hint.textContent = '정답은 2글자';
    w.appendChild(hint);

    const input = createTextInput('○○', '2글자를 입력하세요', async (v) => {
      if (await verifyAnswer(v, P8_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    }, 10);
    w.appendChild(input);
    container.appendChild(w);
  }
  teardown(): void {}
}

// ============================================================
// 퍼즐 9: 심장박동
// ============================================================
export class Puzzle9Scene implements Scene {
  id = 'puzzle-9';
  private onSolved: () => void;
  private timer: Timer;
  constructor(onSolved: () => void, timer: Timer) { this.onSolved = onSolved; this.timer = timer; }

  mount(container: HTMLElement): void {
    const w = createPuzzleWrapper(9, 10, this.timer);

    const desc = document.createElement('p');
    desc.className = 'puzzle-description';
    desc.textContent = '심장은 뛰고 있지만, 탈출하지 못하면 그 의미도 사라진다.';
    w.appendChild(desc);

    // Heartbeat ECG SVG
    const ecgWrap = document.createElement('div');
    ecgWrap.className = 'ecg-wrap';
    ecgWrap.innerHTML = buildECG(P9_MORSE_GROUPS);
    w.appendChild(ecgWrap);

    // Reference table
    const ref = document.createElement('div');
    ref.className = 'morse-ref';
    const refTitle = document.createElement('div');
    refTitle.className = 'morse-ref-title';
    refTitle.textContent = '신호 해독표';
    ref.appendChild(refTitle);
    Object.entries(P9_REF).forEach(([code, digit]) => {
      const row = document.createElement('div');
      row.className = 'morse-ref-row';
      row.innerHTML = `<span class="morse-ref-digit">${digit}</span><span class="morse-ref-code">${code}</span>`;
      ref.appendChild(row);
    });
    w.appendChild(ref);

    const input = createCodeInput(3, async (v) => {
      if (await verifyAnswer(v, P9_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    });
    w.appendChild(input);
    container.appendChild(w);
  }
  teardown(): void {}
}

function buildECG(groups: number[][]): string {
  // 진폭 기반: 작은 진폭 = 짧은 박동(·), 큰 진폭 = 긴 박동(—)
  // 꺾은선 그래프 형태: 위아래 진동
  const W = 320, H = 80;
  const mid = 40;
  const shortAmp = 10;  // small amplitude
  const longAmp = 26;   // large amplitude
  const beatW = 14;     // width per wave
  const groupGap = 18;

  let pts = `0,${mid}`;
  let x = 6;

  groups.forEach((group, gi) => {
    group.forEach((beat, bi) => {
      const amp = beat === 1 ? longAmp : shortAmp;
      const half = beatW / 2;
      // Zigzag: up then down then back to baseline
      pts += ` ${x},${mid}`;
      pts += ` ${x + half * 0.4},${mid - amp}`;
      pts += ` ${x + half},${mid}`;
      pts += ` ${x + half * 1.4},${mid + amp * 0.4}`;
      pts += ` ${x + beatW},${mid}`;
      x += beatW + (beat === 1 ? 4 : 3);
      if (bi < group.length - 1) x += 2;
    });
    if (gi < groups.length - 1) x += groupGap;
  });
  pts += ` ${W},${mid}`;

  return `<svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
    <line x1="0" y1="${mid}" x2="${W}" y2="${mid}" stroke="rgba(212,160,23,0.1)" stroke-width="1"/>
    <polyline points="${pts}" fill="none" stroke="var(--accent-amber)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

// ============================================================
// 퍼즐 10: 최종 관문
// ============================================================
export class Puzzle10Scene implements Scene {
  id = 'puzzle-10';
  private onSolved: () => void;
  private timer: Timer;
  constructor(onSolved: () => void, timer: Timer) { this.onSolved = onSolved; this.timer = timer; }

  mount(container: HTMLElement): void {
    const w = createPuzzleWrapper(10, 10, this.timer);

    const desc = document.createElement('p');
    desc.className = 'puzzle-description';
    desc.textContent = '학자가 마지막으로 남긴 편지다...';
    w.appendChild(desc);

    const letter = document.createElement('div');
    letter.className = 'acrostic-letter';

    P10_LETTER_LINES.forEach((line) => {
      const lineEl = document.createElement('p');
      lineEl.className = 'acrostic-line';
      lineEl.textContent = line;
      letter.appendChild(lineEl);
    });

    // Macguffin: tiny barely-visible exit door at bottom-right
    const macguffin = document.createElement('div');
    macguffin.className = 'macguffin-exit';
    macguffin.innerHTML = `<svg width="14" height="18" viewBox="0 0 14 18">
      <rect x="1" y="1" width="12" height="16" rx="1" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
      <rect x="3" y="3" width="8" height="12" rx="1" fill="rgba(255,255,200,0.04)"/>
      <circle cx="10" cy="9" r="1" fill="rgba(255,255,255,0.08)"/>
      <text x="7" y="20" font-size="3" fill="rgba(255,255,255,0.04)" text-anchor="middle">EXIT</text>
    </svg>`;
    letter.appendChild(macguffin);

    w.appendChild(letter);

    const input = createTextInput('○○○○', '4글자를 입력하세요', async (v) => {
      if (await verifyAnswer(v, P10_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    }, 10);
    w.appendChild(input);
    container.appendChild(w);
  }
  teardown(): void {}
}

// ============================================================
// TRANSITION
// ============================================================
export class TransitionScene implements Scene {
  id: string;
  private text: string;
  private onDone: () => void;
  constructor(id: string, text: string, onDone: () => void) {
    this.id = id; this.text = text; this.onDone = onDone;
  }
  mount(container: HTMLElement): void {
    const el = document.createElement('div');
    el.className = 'transition-screen';
    const p = document.createElement('p');
    p.className = 'transition-text';
    el.appendChild(p);
    container.appendChild(el);
    typewriter(p, this.text).then(() => setTimeout(this.onDone, 1500));
  }
  teardown(): void {}
}

// ============================================================
// ESCAPE
// ============================================================
export class EscapeScene implements Scene {
  id = 'escape';
  private elapsedMs: number;
  private onRestart: () => void;
  constructor(elapsedMs: number, onRestart: () => void) {
    this.elapsedMs = elapsedMs; this.onRestart = onRestart;
  }
  mount(container: HTMLElement): void {
    const totalSec = Math.floor(this.elapsedMs / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const timeStr = `${min}:${sec.toString().padStart(2, '0')}`;
    container.innerHTML = `
      <div class="escape-screen">
        <div class="escape-content">
          <div class="escape-text">탈출 성공</div>
          <div class="escape-time">${timeStr}</div>
          <div class="escape-subtext">당신은 방을 탈출했습니다</div>
          <div class="escape-actions">
            <button class="share-btn">친구에게 공유</button>
            <button class="retry-btn">다시 하기</button>
          </div>
        </div>
      </div>`;
    container.querySelector('.share-btn')?.addEventListener('click', () => {
      const text = `나 ${timeStr}에 탈출했어! 너도 해봐`;
      if (navigator.share) navigator.share({ title: '방을 탈출하세요', text, url: location.href });
      else { navigator.clipboard.writeText(`${text}\n${location.href}`); const b = container.querySelector('.share-btn') as HTMLElement; if (b) b.textContent = '복사됨!'; }
    });
    container.querySelector('.retry-btn')?.addEventListener('click', this.onRestart);
  }
  teardown(): void {}
}

// ============================================================
// CONTINUE DIALOG
// ============================================================
export class ContinueDialog implements Scene {
  id = 'continue-dialog';
  private puzzleNum: number; private timeStr: string;
  private onContinue: () => void; private onRestart: () => void;
  constructor(puzzleNum: number, timeStr: string, onContinue: () => void, onRestart: () => void) {
    this.puzzleNum = puzzleNum; this.timeStr = timeStr;
    this.onContinue = onContinue; this.onRestart = onRestart;
  }
  mount(container: HTMLElement): void {
    container.innerHTML = `
      <div class="continue-screen">
        <div class="continue-dialog">
          <p class="continue-title">이전 기록이 있습니다</p>
          <p class="continue-info">퍼즐 ${this.puzzleNum}/10 · ${this.timeStr}</p>
          <button class="continue-btn continue-btn-primary">이어하기</button>
          <button class="continue-btn continue-btn-secondary">처음부터</button>
        </div>
      </div>`;
    container.querySelector('.continue-btn-primary')?.addEventListener('click', this.onContinue);
    container.querySelector('.continue-btn-secondary')?.addEventListener('click', this.onRestart);
  }
  teardown(): void {}
}
