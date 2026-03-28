/**
 * Escape Room — Main (10 puzzles)
 */

import './styles/global.css';
import './styles/animations.css';
import './styles/rooms.css';

import { SceneManager } from './engine/scene-manager';
import { AudioManager } from './engine/audio-manager';
import * as SaveManager from './engine/save-manager';
import { Timer } from './ui/components';
import {
  IntroScene, TransitionScene, EscapeScene, ContinueDialog,
  Puzzle1Scene, Puzzle2Scene, Puzzle3Scene, Puzzle4Scene, Puzzle5Scene,
  Puzzle6Scene, Puzzle7Scene, Puzzle8Scene, Puzzle9Scene, Puzzle10Scene,
} from './rooms/room1/index';
import { TRANSITIONS } from './rooms/room1/puzzles';

const app = document.getElementById('app')!;

const orientWarn = document.createElement('div');
orientWarn.className = 'orientation-warning';
orientWarn.textContent = '세로 모드로 전환해주세요';
document.body.appendChild(orientWarn);

const sceneManager = new SceneManager(app);
const audioManager = new AudioManager();
const timer = new Timer();

const PUZZLE_ORDER = Array.from({ length: 10 }, (_, i) => `puzzle-${i + 1}`);

let completedPuzzles: string[] = [];
let gameStartedAt = Date.now();

function saveProgress(sceneId: string): void {
  SaveManager.save({
    currentScene: sceneId,
    completedPuzzles,
    startedAt: gameStartedAt,
    elapsedMs: timer.getElapsed(),
  });
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
  const idx = PUZZLE_ORDER.indexOf(puzzleId);
  const next = getNextPuzzle(completedPuzzles);

  if (next) {
    saveProgress(next);
    const transText = TRANSITIONS[idx] || '다음 단서가 보인다...';
    showTransition(transText, next);
  } else {
    const elapsed = timer.stop();
    SaveManager.clear();
    SaveManager.save({
      currentScene: 'escape',
      completedPuzzles,
      startedAt: gameStartedAt,
      elapsedMs: elapsed,
    });
    const escape = new EscapeScene(elapsed, startFresh);
    sceneManager.register(escape);
    sceneManager.transition('escape');
  }
}

function startFresh(): void {
  completedPuzzles = [];
  gameStartedAt = Date.now();
  SaveManager.clear();
  sceneManager.transition('intro');
}

function registerScenes(): void {
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

function init(): void {
  registerScenes();
  const saved = SaveManager.load();

  if (saved && saved.currentScene !== 'intro') {
    if (saved.currentScene === 'escape') {
      const escape = new EscapeScene(saved.elapsedMs, startFresh);
      sceneManager.register(escape);
      sceneManager.transition('escape');
      return;
    }

    const count = getCompletedCount(saved.completedPuzzles);
    const totalSec = Math.floor(saved.elapsedMs / 1000);
    const timeStr = `${Math.floor(totalSec / 60)}:${(totalSec % 60).toString().padStart(2, '0')}`;

    const dialog = new ContinueDialog(count + 1, timeStr, () => {
      completedPuzzles = saved.completedPuzzles;
      gameStartedAt = saved.startedAt;
      audioManager.init();
      audioManager.playAmbient('/ambient.mp3');
      timer.start();
      sceneManager.transition(saved.currentScene);
    }, startFresh);
    sceneManager.register(dialog);
    sceneManager.transition('continue-dialog');
  } else {
    sceneManager.transition('intro');
  }
}

init();
