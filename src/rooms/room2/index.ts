/**
 * Room 2 — (준비 중)
 */

import type { Scene } from '../../engine/scene-manager';

export class Room2PlaceholderScene implements Scene {
  id = 'room2-intro';
  private onBack: () => void;

  constructor(onBack: () => void) { this.onBack = onBack; }

  mount(container: HTMLElement): void {
    const screen = document.createElement('div');
    screen.className = 'room2-placeholder-screen';

    const inner = document.createElement('div');
    inner.className = 'room2-placeholder-inner';

    const icon = document.createElement('div');
    icon.className = 'room2-placeholder-icon';
    icon.textContent = '🔧';

    const title = document.createElement('div');
    title.className = 'room2-placeholder-title';
    title.textContent = '준비 중';

    const desc = document.createElement('div');
    desc.className = 'room2-placeholder-desc';
    desc.textContent = '새로운 방이 곧 열립니다.';

    const backBtn = document.createElement('button');
    backBtn.className = 'room2-placeholder-back';
    backBtn.textContent = '← 방 선택으로';
    backBtn.addEventListener('click', this.onBack);

    inner.appendChild(icon);
    inner.appendChild(title);
    inner.appendChild(desc);
    inner.appendChild(backBtn);
    screen.appendChild(inner);
    container.appendChild(screen);
  }

  teardown(): void {}
}
