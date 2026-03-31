/**
 * Room Select Scene — 플레이할 방 선택 화면
 */

import type { Scene } from '../engine/scene-manager';
import { isCompleted } from '../engine/save-manager';

export interface RoomMeta {
  id: string;
  name: string;
  description: string;
  puzzleCount: number;
  /** 이 룸을 해금하려면 완료해야 하는 룸 ID. null이면 처음부터 잠금 해제. */
  unlockedBy: string | null;
}

export class RoomSelectScene implements Scene {
  id = 'room-select';
  private rooms: RoomMeta[];
  private onSelect: (roomId: string) => void;

  constructor(rooms: RoomMeta[], onSelect: (roomId: string) => void) {
    this.rooms = rooms;
    this.onSelect = onSelect;
  }

  mount(container: HTMLElement): void {
    const screen = document.createElement('div');
    screen.className = 'room-select-screen';

    const title = document.createElement('div');
    title.className = 'room-select-title';
    title.textContent = '방을 선택하세요';
    screen.appendChild(title);

    const list = document.createElement('div');
    list.className = 'room-select-list';

    for (const room of this.rooms) {
      const unlocked = !room.unlockedBy || isCompleted(room.unlockedBy);
      const done = isCompleted(room.id);

      const card = document.createElement('div');
      card.className = [
        'room-card',
        !unlocked ? 'room-card-locked' : '',
        done ? 'room-card-done' : '',
      ].filter(Boolean).join(' ');

      const cardName = document.createElement('div');
      cardName.className = 'room-card-name';
      cardName.textContent = room.name;

      const cardDesc = document.createElement('div');
      cardDesc.className = 'room-card-desc';
      cardDesc.textContent = unlocked ? room.description : '???';

      const cardBadge = document.createElement('div');
      cardBadge.className = 'room-card-badge';
      if (!unlocked) cardBadge.textContent = '🔒';
      else if (done) cardBadge.textContent = '✓';

      card.appendChild(cardName);
      card.appendChild(cardBadge);
      card.appendChild(cardDesc);

      if (unlocked) {
        card.addEventListener('click', () => this.onSelect(room.id));
      }

      list.appendChild(card);
    }

    screen.appendChild(list);
    container.appendChild(screen);
  }

  teardown(): void {}
}
