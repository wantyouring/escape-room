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
  P2_HASHES, P2_MIRROR_TEXT,
  P3_HASHES, P3_ROWS,
  P4_HASHES, P4_EXAMPLES, P4_QUESTIONS,
  P5_HASHES, P5_BOOKS, P5_COLOR_HINT,
  P6_HASHES, P6_GRID_CELLS,
  P7_HASHES, P7_DISPLAY,
  P8_HASHES, P8_GRID, P8_START,
  P9_HASHES, P9_MORSE, P9_REF,
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
  '찢어진 쪽지', '거울 문장', '초성 퀴즈', '수열 완성', '책장 암호',
  '그림자 세기', '암호 해독표', '좌표 그리드', '모스 부호', '규칙 찾기',
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
    desc.textContent = '벽에 걸린 거울에 글씨가 비친다...';
    w.appendChild(desc);

    const mirror = document.createElement('div');
    mirror.className = 'mirror-frame';
    const mirrorText = document.createElement('div');
    mirrorText.className = 'mirror-text';
    mirrorText.textContent = P2_MIRROR_TEXT;
    mirror.appendChild(mirrorText);
    w.appendChild(mirror);

    const hint = document.createElement('p');
    hint.className = 'puzzle-sub-hint';
    hint.textContent = '거울에 비친 글자는 뒤집혀 보입니다';
    w.appendChild(hint);

    const input = createTextInput('○○', '거울 속 단어를 입력하세요 (2글자)', async (v) => {
      if (await verifyAnswer(v, P2_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    });
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
    const compass = document.createElement('div');
    compass.className = 'compass-hint';
    compass.innerHTML = `
      <span class="compass-item">↑ = North</span>
      <span class="compass-item">↓ = South</span>
      <span class="compass-item">→ = East</span>
      <span class="compass-item">← = West</span>
    `;
    w.appendChild(compass);

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
    desc.textContent = '영어 숫자 단어 속에 로마 숫자가 숨어있다...';
    w.appendChild(desc);

    // Examples
    const exBox = document.createElement('div');
    exBox.className = 'roman-box';

    const exTitle = document.createElement('div');
    exTitle.className = 'roman-title';
    exTitle.textContent = '예시';
    exBox.appendChild(exTitle);

    P4_EXAMPLES.forEach(ex => {
      const row = document.createElement('div');
      row.className = 'roman-row roman-example';
      const wordEl = document.createElement('span');
      wordEl.className = 'roman-word';
      wordEl.innerHTML = ex.word.map(p => p.startsWith('(') ? `<span class="roman-num">${p}</span>` : p).join('');
      const eq = document.createElement('span');
      eq.className = 'roman-eq';
      eq.textContent = ` = ${ex.value}`;
      row.appendChild(wordEl);
      row.appendChild(eq);
      exBox.appendChild(row);
    });
    w.appendChild(exBox);

    // Questions
    const qBox = document.createElement('div');
    qBox.className = 'roman-box roman-questions';

    const qTitle = document.createElement('div');
    qTitle.className = 'roman-title';
    qTitle.textContent = '비밀번호의 각 자리는?';
    qBox.appendChild(qTitle);

    P4_QUESTIONS.forEach(q => {
      const row = document.createElement('div');
      row.className = 'roman-row';
      const wordEl = document.createElement('span');
      wordEl.className = 'roman-word';
      wordEl.innerHTML = q.word.map(p => p.startsWith('(') ? `<span class="roman-num">${p}</span>` : p).join('');
      const label = document.createElement('span');
      label.className = 'roman-label';
      label.textContent = ` → ${q.label}`;
      row.appendChild(wordEl);
      row.appendChild(label);
      qBox.appendChild(row);
    });
    w.appendChild(qBox);

    const input = createCodeInput(4, async (v) => {
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

    const desc = document.createElement('p');
    desc.className = 'puzzle-description';
    desc.textContent = '책장의 책들을 뒤집어 보세요...';
    w.appendChild(desc);

    const shelf = document.createElement('div');
    shelf.className = 'bookshelf';
    P5_BOOKS.forEach(book => {
      const el = document.createElement('div');
      el.className = `book book-${book.color}`;
      const front = document.createElement('div');
      front.className = 'book-front';
      front.innerHTML = `<span class="book-title">${book.title}</span>`;
      const back = document.createElement('div');
      back.className = 'book-back';
      if (book.symbol) back.innerHTML = `<span class="book-symbol">${book.symbol}</span>`;
      el.appendChild(front);
      el.appendChild(back);
      el.addEventListener('click', () => el.classList.toggle('flipped'));
      shelf.appendChild(el);
    });
    w.appendChild(shelf);

    const colorHint = document.createElement('p');
    colorHint.className = 'puzzle-sub-hint';
    colorHint.textContent = `색상 순서: ${P5_COLOR_HINT}`;
    w.appendChild(colorHint);

    const input = createTextInput('○', '조합된 글자를 입력하세요 (1글자)', async (v) => {
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
    desc.textContent = '벽에 격자판이 빛나고 있다. 자음의 순서가 위치를 나타낸다...';
    w.appendChild(desc);

    // 3x3 Grid
    const gridEl = document.createElement('div');
    gridEl.className = 'consonant-grid';
    P6_GRID_CELLS.forEach(cell => {
      const el = document.createElement('div');
      el.className = 'cg-cell';
      el.innerHTML = `<span class="cg-char">${cell.char}</span><span class="cg-cons">${cell.consonant}</span>`;
      gridEl.appendChild(el);
    });
    w.appendChild(gridEl);

    // Example
    const ex = document.createElement('p');
    ex.className = 'puzzle-sub-hint';
    ex.textContent = '예시: ㄱ ㄴ = 비밀 / 질문: ㅅ ㅇ ㅁ ㅂ = ?';
    w.appendChild(ex);

    const input = createTextInput('○○○○', '해당하는 글자를 순서대로 (4글자)', async (v) => {
      if (await verifyAnswer(v, P6_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    }, 10);
    w.appendChild(input);
    container.appendChild(w);
  }
  teardown(): void {}
}

// ============================================================
// 퍼즐 7: 암호 해독표
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
    desc.textContent = '디지털 표시판이 깜빡이고 있다. 뭔가 이상하다...';
    w.appendChild(desc);

    // 7-segment display
    const segDisplay = document.createElement('div');
    segDisplay.className = 'seg-display';
    P7_DISPLAY.forEach(digit => {
      const d = document.createElement('div');
      d.className = `seg-digit seg-${digit}`;
      d.setAttribute('data-digit', digit);
      segDisplay.appendChild(d);
    });
    w.appendChild(segDisplay);

    const hint = document.createElement('p');
    hint.className = 'puzzle-sub-hint';
    hint.textContent = '이 숫자들을 180° 뒤집어 읽으면? (영어 4글자)';
    w.appendChild(hint);

    const input = createTextInput('○○○○', '영어 단어를 입력하세요 (4글자)', async (v) => {
      if (await verifyAnswer(v, P7_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    }, 10);
    w.appendChild(input);
    container.appendChild(w);
  }
  teardown(): void {}
}

// ============================================================
// 퍼즐 8: 좌표 그리드
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
    desc.textContent = '격자판에 화살표와 글자가 있다. 시작점에서 화살표를 따라가세요.';
    w.appendChild(desc);

    const grid = document.createElement('div');
    grid.className = 'arrow-grid';
    P8_GRID.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        const el = document.createElement('div');
        el.className = 'arrow-cell';
        const isStart = ri === P8_START.row && ci === P8_START.col;
        if (isStart) el.classList.add('arrow-start');
        if (cell.dir === '★') el.classList.add('arrow-end');

        el.innerHTML = `
          <span class="arrow-char">${cell.ch}</span>
          <span class="arrow-dir">${cell.dir}</span>
        `;
        grid.appendChild(el);
      });
    });
    w.appendChild(grid);

    const hint = document.createElement('p');
    hint.className = 'puzzle-sub-hint';
    hint.textContent = '강조된 칸에서 출발. 화살표 방향으로 이동하며 글자가 있는 칸의 글자를 모으세요. ★이 도착점.';
    w.appendChild(hint);

    const input = createTextInput('○○', '모은 글자를 입력하세요 (2글자)', async (v) => {
      if (await verifyAnswer(v, P8_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    });
    w.appendChild(input);
    container.appendChild(w);
  }
  teardown(): void {}
}

// ============================================================
// 퍼즐 9: 모스 부호
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
    desc.textContent = '전등이 깜빡인다. 신호를 해독하세요...';
    w.appendChild(desc);

    // Morse signal display
    const morseDisplay = document.createElement('div');
    morseDisplay.className = 'morse-display';
    P9_MORSE.forEach(line => {
      const row = document.createElement('div');
      row.className = 'morse-line';
      row.textContent = line;
      morseDisplay.appendChild(row);
    });
    w.appendChild(morseDisplay);

    // Reference table
    const ref = document.createElement('div');
    ref.className = 'morse-ref';
    const refTitle = document.createElement('div');
    refTitle.className = 'morse-ref-title';
    refTitle.textContent = '모스 부호 참조표';
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
    desc.textContent = '학자가 마지막으로 남긴 편지다. 무언가 숨겨져 있다...';
    w.appendChild(desc);

    const letter = document.createElement('div');
    letter.className = 'acrostic-letter';

    P10_LETTER_LINES.forEach((line) => {
      const lineEl = document.createElement('p');
      lineEl.className = 'acrostic-line';
      const firstChar = document.createElement('span');
      firstChar.className = 'acrostic-first';
      firstChar.textContent = line[0];
      const rest = document.createElement('span');
      rest.textContent = line.slice(1);
      lineEl.appendChild(firstChar);
      lineEl.appendChild(rest);
      letter.appendChild(lineEl);
    });
    w.appendChild(letter);

    const hint = document.createElement('p');
    hint.className = 'puzzle-sub-hint';
    hint.textContent = '각 줄의 첫 글자를 순서대로 모으세요';
    w.appendChild(hint);

    const input = createTextInput('○○○○', '모은 글자를 입력하세요 (4글자)', async (v) => {
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
