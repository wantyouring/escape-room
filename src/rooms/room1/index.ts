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
  P3_HASHES, P3_CONSONANTS, P3_CONTEXT,
  P4_HASHES, P4_SEQUENCE, P4_SUB_HINT,
  P5_HASHES, P5_BOOKS, P5_COLOR_HINT,
  P6_HASHES, P6_STAR_POSITIONS,
  P7_HASHES, P7_CIPHER, P7_TABLE_HINT, P7_TABLE,
  P8_HASHES, P8_GRID, P8_COORD_TEXT,
  P9_HASHES, P9_MORSE, P9_REF,
  P10_HASHES, P10_GRID,
} from './puzzles';

// Helper: 공통 퍼즐 화면 래퍼 생성
function createPuzzleWrapper(num: number, total: number, timer: Timer): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'puzzle-screen';
  wrapper.innerHTML = `<div class="puzzle-num">${num} / ${total}</div>`;
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

    const input = createTextInput('__', '거울 속 단어를 입력하세요', async (v) => {
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
    desc.textContent = '벽에 긁힌 글자가 보인다. 일부가 지워져 있다...';
    w.appendChild(desc);

    const consonants = document.createElement('div');
    consonants.className = 'consonant-display';
    consonants.textContent = P3_CONSONANTS;
    w.appendChild(consonants);

    const ctx = document.createElement('p');
    ctx.className = 'puzzle-sub-hint';
    ctx.textContent = `힌트: ${P3_CONTEXT}`;
    w.appendChild(ctx);

    const input = createTextInput('__', '완성된 단어를 입력하세요', async (v) => {
      if (await verifyAnswer(v, P3_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    });
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
    desc.textContent = '서랍 안에 숫자가 적힌 카드가 놓여 있다...';
    w.appendChild(desc);

    const seq = document.createElement('div');
    seq.className = 'sequence-display';
    seq.innerHTML = P4_SEQUENCE.map(n => `<span class="seq-num">${n}</span>`).join('') +
      '<span class="seq-num seq-blank">?</span>';
    w.appendChild(seq);

    const hint = document.createElement('p');
    hint.className = 'puzzle-sub-hint';
    hint.textContent = P4_SUB_HINT;
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

    const input = createTextInput('_', '조합된 글자를 입력하세요', async (v) => {
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
    desc.textContent = '어둠 속에 별이 떠 있다. 몇 개인지 세어보세요...';
    w.appendChild(desc);

    const sky = document.createElement('div');
    sky.className = 'star-field';
    P6_STAR_POSITIONS.forEach(pos => {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${pos.x}%`;
      star.style.top = `${pos.y}%`;
      star.textContent = '★';
      sky.appendChild(star);
    });
    w.appendChild(sky);

    const input = createCodeInput(1, async (v) => {
      if (await verifyAnswer(v, P6_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    });
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
    desc.textContent = '오래된 해독표와 암호문이 발견되었다...';
    w.appendChild(desc);

    // Cipher text
    const cipher = document.createElement('div');
    cipher.className = 'cipher-display';
    cipher.textContent = P7_CIPHER;
    w.appendChild(cipher);

    // Table
    const table = document.createElement('div');
    table.className = 'cipher-table';
    P7_TABLE.forEach(({ consonant, num }) => {
      const cell = document.createElement('div');
      cell.className = 'cipher-cell';
      cell.innerHTML = `<span class="cipher-key">${consonant}</span><span class="cipher-val">${num}</span>`;
      table.appendChild(cell);
    });
    w.appendChild(table);

    const hint = document.createElement('p');
    hint.className = 'puzzle-sub-hint';
    hint.textContent = P7_TABLE_HINT;
    w.appendChild(hint);

    const input = createTextInput('__', '해독된 단어를 입력하세요', async (v) => {
      if (await verifyAnswer(v, P7_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    });
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
    desc.textContent = '벽에 글자 격자판이 있다...';
    w.appendChild(desc);

    const grid = document.createElement('div');
    grid.className = 'coord-grid';
    P8_GRID.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        const el = document.createElement('div');
        el.className = 'grid-cell';
        el.textContent = cell;
        el.dataset.row = String(ri + 1);
        el.dataset.col = String(ci + 1);
        grid.appendChild(el);
      });
    });
    w.appendChild(grid);

    const coordHint = document.createElement('p');
    coordHint.className = 'puzzle-sub-hint coord-hint';
    coordHint.textContent = `좌표: ${P8_COORD_TEXT}`;
    w.appendChild(coordHint);

    const input = createTextInput('_', '해당 좌표의 글자를 입력하세요', async (v) => {
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
    desc.textContent = '마지막 문. 규칙을 찾아 빈칸을 채우세요.';
    w.appendChild(desc);

    const grid = document.createElement('div');
    grid.className = 'pattern-grid';
    P10_GRID.forEach(row => {
      row.forEach(cell => {
        const el = document.createElement('div');
        el.className = 'pattern-cell';
        if (cell === '?') {
          el.classList.add('pattern-blank');
          el.textContent = '?';
        } else {
          el.textContent = cell;
        }
        grid.appendChild(el);
      });
    });
    w.appendChild(grid);

    const hint = document.createElement('p');
    hint.className = 'puzzle-sub-hint';
    hint.textContent = '가로와 세로, 각각 어떤 규칙이 있을까요?';
    w.appendChild(hint);

    const input = createTextInput('_', '빈칸에 들어갈 글자를 입력하세요', async (v) => {
      if (await verifyAnswer(v, P10_HASHES)) { hapticFeedback(); this.onSolved(); }
      else showWrongFeedback(input);
    });
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
