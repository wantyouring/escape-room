/**
 * Escape Room — Main
 *
 * 룸 선택 → 룸별 게임 시작/재개 → 탈출/방 선택 복귀
 */

import './styles/global.css';
import './styles/animations.css';
import './styles/rooms.css';

import { SceneManager } from './engine/scene-manager';
import { AudioManager } from './engine/audio-manager';
import * as SaveManager from './engine/save-manager';
import type { SaveData } from './engine/save-manager';
import { Timer } from './ui/components';
import {
  IntroScene, TransitionScene, EscapeScene, ContinueDialog,
  Puzzle1Scene, Puzzle2Scene, Puzzle3Scene, Puzzle4Scene, Puzzle5Scene,
  Puzzle6Scene, Puzzle7Scene, Puzzle8Scene, Puzzle9Scene, Puzzle10Scene,
  setGameState,
} from './rooms/room1/index';
import { TRANSITIONS } from './rooms/room1/puzzles';
import { Room2PlaceholderScene } from './rooms/room2/index';
import { RoomSelectScene } from './scenes/room-select';
import type { RoomMeta } from './scenes/room-select';

// ============================================================
// 앱 초기화
// ============================================================

const app = document.getElementById('app')!;

const orientWarn = document.createElement('div');
orientWarn.className = 'orientation-warning';
orientWarn.textContent = '세로 모드로 전환해주세요';
document.body.appendChild(orientWarn);

const sceneManager = new SceneManager(app);
const audioManager = new AudioManager();
const timer = new Timer();

// ============================================================
// 룸 메타데이터
// ============================================================

const ROOMS: RoomMeta[] = [
  {
    id: 'room1',
    name: '어두운 서재',
    description: '낡은 책들로 가득 찬 어두운 서재. 탈출구를 찾아라.',
    puzzleCount: 10,
    unlockedBy: null,
  },
  {
    id: 'room2',
    name: '???',
    description: '???',
    puzzleCount: 0,
    unlockedBy: 'room1',
  },
];

// ============================================================
// Room 1 상태
// ============================================================

const PUZZLE_ORDER = Array.from({ length: 10 }, (_, i) => `puzzle-${i + 1}`);

let completedPuzzles: string[] = [];
let gameStartedAt = Date.now();
let currentRoomId = 'room1';

function saveProgress(sceneId: string): void {
  SaveManager.save({
    currentScene: sceneId,
    completedPuzzles,
    startedAt: gameStartedAt,
    elapsedMs: timer.getElapsed(),
  }, currentRoomId);
}

function getNextPuzzle(completed: string[]): string | null {
  for (const p of PUZZLE_ORDER) {
    if (!completed.includes(p)) return p;
  }
  return null;
}

function getCompletedCount(puzzles: string[]): number {
  return puzzles.filter(p => PUZZLE_ORDER.includes(p)).length;
}

async function showTransition(text: string, nextId: string): Promise<void> {
  const tId = `trans-${nextId}`;
  const scene = new TransitionScene(tId, text, () => sceneManager.transition(nextId));
  sceneManager.register(scene);
  await sceneManager.transition(tId);
}

function onPuzzleSolved(puzzleId: string): void {
  completedPuzzles.push(puzzleId);
  updateGameState();
  const idx = PUZZLE_ORDER.indexOf(puzzleId);

  // 퍼즐 10 클리어 → 탈출
  if (puzzleId === 'puzzle-10') {
    const elapsed = timer.stop();
    SaveManager.markCompleted(currentRoomId);
    SaveManager.clear(currentRoomId);
    SaveManager.save({
      currentScene: 'escape',
      completedPuzzles,
      startedAt: gameStartedAt,
      elapsedMs: elapsed,
    }, currentRoomId);
    const escape = new EscapeScene(elapsed, startFresh, goToRoomSelect);
    sceneManager.register(escape);
    sceneManager.transition('escape');
    return;
  }

  const nextIdx = idx + 1;
  const transText = TRANSITIONS[idx] || '다음 단서가 보인다...';

  if (nextIdx < 9) {
    const next = PUZZLE_ORDER[nextIdx];
    saveProgress(next);
    showTransition(transText, next);
  } else if (nextIdx === 9) {
    const all9Solved = PUZZLE_ORDER.slice(0, 9).every(p => completedPuzzles.includes(p));
    if (all9Solved) {
      saveProgress('puzzle-10');
      showTransition('모든 단서가 모였다... 마지막 문이 열린다.', 'puzzle-10');
    } else {
      const nextUnsolved = PUZZLE_ORDER.slice(0, 9).find(p => !completedPuzzles.includes(p))!;
      saveProgress(nextUnsolved);
      showTransition(transText, nextUnsolved);
    }
  }
}

function startFresh(): void {
  completedPuzzles = [];
  gameStartedAt = Date.now();
  SaveManager.clear(currentRoomId);
  registerRoom1Scenes();
  updateGameState();
  sceneManager.transition('intro');
}

function updateGameState(): void {
  const next = getNextPuzzle(completedPuzzles);
  setGameState({
    completedPuzzles,
    currentPuzzle: next ?? '',
    goToPuzzle: (id: string) => sceneManager.transition(id),
    goToRoomSelect,
  });
}

// ============================================================
// 씬 등록
// ============================================================

function registerRoom1Scenes(): void {
  const intro = new IntroScene(() => {
    audioManager.init();
    audioManager.playAmbient('/ambient.mp3');
    timer.start();
    gameStartedAt = Date.now();
    sceneManager.transition('puzzle-1');
  });

  const p1 = new Puzzle1Scene(() => onPuzzleSolved('puzzle-1'), timer);
  const p2 = new Puzzle2Scene(() => onPuzzleSolved('puzzle-2'), timer);
  const p3 = new Puzzle3Scene(() => onPuzzleSolved('puzzle-3'), timer);
  const p4 = new Puzzle4Scene(() => onPuzzleSolved('puzzle-4'), timer);
  const p5 = new Puzzle5Scene(() => onPuzzleSolved('puzzle-5'), timer);
  const p6 = new Puzzle6Scene(() => onPuzzleSolved('puzzle-6'), timer);
  const p7 = new Puzzle7Scene(() => onPuzzleSolved('puzzle-7'), timer);
  const p8 = new Puzzle8Scene(() => onPuzzleSolved('puzzle-8'), timer);
  const p9 = new Puzzle9Scene(() => onPuzzleSolved('puzzle-9'), timer);
  const p10 = new Puzzle10Scene(() => onPuzzleSolved('puzzle-10'), timer);

  [intro, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10].forEach(s => sceneManager.register(s));
}

function registerRoom2Scenes(): void {
  const placeholder = new Room2PlaceholderScene(goToRoomSelect);
  sceneManager.register(placeholder);
}

// ============================================================
// 룸 선택 / 전환
// ============================================================

function goToRoomSelect(): void {
  timer.stop();
  completedPuzzles = [];
  SaveManager.clearCurrentRoom();

  const roomSelect = new RoomSelectScene(ROOMS, (roomId) => {
    const saved = SaveManager.load(roomId);
    if (saved && saved.currentScene !== 'intro') {
      showContinueDialogForRoom(roomId, saved);
    } else {
      startRoom(roomId);
    }
  });
  sceneManager.register(roomSelect);
  sceneManager.transition('room-select');
}

function showContinueDialogForRoom(roomId: string, saved: SaveData): void {
  const count = getCompletedCount(saved.completedPuzzles);
  const totalSec = Math.floor(saved.elapsedMs / 1000);
  const timeStr = `${Math.floor(totalSec / 60)}:${(totalSec % 60).toString().padStart(2, '0')}`;

  const dialog = new ContinueDialog(
    count + 1,
    timeStr,
    () => {
      // 이어하기
      completedPuzzles = saved.completedPuzzles;
      gameStartedAt = saved.startedAt;
      currentRoomId = roomId;
      SaveManager.setCurrentRoom(roomId);
      if (roomId === 'room1') {
        registerRoom1Scenes();
        updateGameState();
      } else {
        registerRoom2Scenes();
      }
      audioManager.init();
      audioManager.playAmbient('/ambient.mp3');
      timer.start();
      sceneManager.transition(saved.currentScene);
    },
    () => {
      // 처음부터 (현재 룸 재시작)
      SaveManager.clear(roomId);
      startRoom(roomId);
    },
    goToRoomSelect,
  );

  sceneManager.register(dialog);
  sceneManager.transition('continue-dialog');
}

function startRoom(roomId: string): void {
  currentRoomId = roomId;
  completedPuzzles = [];
  gameStartedAt = Date.now();
  SaveManager.setCurrentRoom(roomId);

  if (roomId === 'room1') {
    registerRoom1Scenes();
    updateGameState();
    sceneManager.transition('intro');
  } else {
    registerRoom2Scenes();
    sceneManager.transition('room2-intro');
  }
}

// ============================================================
// 초기화
// ============================================================

function init(): void {
  const currentRoom = SaveManager.getCurrentRoom();

  if (currentRoom) {
    const saved = SaveManager.load(currentRoom);
    if (saved) {
      if (saved.currentScene === 'escape') {
        currentRoomId = currentRoom;
        const escape = new EscapeScene(saved.elapsedMs, startFresh, goToRoomSelect);
        sceneManager.register(escape);
        sceneManager.transition('escape');
        return;
      }
      showContinueDialogForRoom(currentRoom, saved);
    } else {
      startRoom(currentRoom);
    }
  } else {
    goToRoomSelect();
  }
}

init();
