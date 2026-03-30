/**
 * UI Components — 입력 필드, 타이머, 피드백
 */

/** 코드 입력 필드 (숫자) */
export function createCodeInput(
  maxLength: number,
  onSubmit: (value: string) => void
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-input-area';

  const input = document.createElement('input');
  input.className = 'code-input';
  input.type = 'text';
  input.inputMode = 'numeric';
  input.maxLength = maxLength;
  input.placeholder = '_'.repeat(maxLength);
  input.autocomplete = 'off';

  const label = document.createElement('div');
  label.className = 'code-label';
  label.textContent = 'CODE';

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.length > 0) {
      onSubmit(input.value);
    }
  });

  input.addEventListener('input', () => {
    if (input.value.length === maxLength) {
      onSubmit(input.value);
    }
  });

  input.addEventListener('blur', () => {
    if (input.value.length === maxLength) {
      onSubmit(input.value);
    }
  });

  wrapper.appendChild(input);
  wrapper.appendChild(label);
  return wrapper;
}

/** 텍스트 입력 필드 (한글) */
export function createTextInput(
  placeholder: string,
  hint: string,
  onSubmit: (value: string) => void,
  maxLength = 10
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'word-input-area';

  const charCount = placeholder.length;
  const input = document.createElement('input');
  input.className = 'word-input';
  input.type = 'text';
  input.maxLength = maxLength;
  input.placeholder = placeholder;
  input.autocomplete = 'off';
  // 글자수에 맞게 너비 조정 (1자=60px, 2자=100px, 3자+=140px)
  input.style.width = `${Math.max(60, charCount * 48 + 12)}px`;

  const hintEl = document.createElement('div');
  hintEl.className = 'word-hint';
  hintEl.textContent = hint;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.length > 0) {
      onSubmit(input.value);
    }
  });

  input.addEventListener('blur', () => {
    if (input.value.length === charCount) {
      onSubmit(input.value);
    }
  });

  wrapper.appendChild(input);
  wrapper.appendChild(hintEl);
  return wrapper;
}

/** 오답 피드백 (흔들림 + 메시지) */
export function showWrongFeedback(inputEl: HTMLElement): void {
  inputEl.classList.add('shake');
  const msg = document.createElement('div');
  msg.className = 'wrong-msg';
  msg.textContent = '틀렸습니다';
  inputEl.parentElement?.appendChild(msg);

  setTimeout(() => {
    inputEl.classList.remove('shake');
    msg.remove();
    const input = inputEl.querySelector('input');
    if (input) input.value = '';
  }, 500);
}

/** 경과 타이머 */
export class Timer {
  private el: HTMLElement;
  private startTime: number;
  private elapsed: number;
  private interval: number | null = null;

  constructor(initialElapsed = 0) {
    this.el = document.createElement('div');
    this.el.className = 'timer';
    this.startTime = Date.now();
    this.elapsed = initialElapsed;
    this.update();
  }

  start(): void {
    this.startTime = Date.now() - this.elapsed;
    this.interval = window.setInterval(() => this.update(), 1000);
  }

  stop(): number {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.elapsed = Date.now() - this.startTime;
    return this.elapsed;
  }

  getElapsed(): number {
    return Date.now() - this.startTime;
  }

  getElement(): HTMLElement {
    return this.el;
  }

  private update(): void {
    const ms = Date.now() - this.startTime;
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const sec = (totalSec % 60).toString().padStart(2, '0');
    this.el.textContent = `${min}:${sec}`;
  }
}

/** 타자기 효과 */
export function typewriter(el: HTMLElement, text: string, speed = 40): Promise<void> {
  return new Promise(resolve => {
    el.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

/** 진동 피드백 (Android) 또는 화면 플래시 (iOS) */
export function hapticFeedback(): void {
  if (navigator.vibrate) {
    navigator.vibrate(200);
  } else {
    // iOS 대체: 화면 플래시
    const flash = document.createElement('div');
    flash.className = 'screen-flash';
    document.getElementById('app')?.appendChild(flash);
    setTimeout(() => flash.remove(), 100);
  }
}
