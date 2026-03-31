import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  save, load, clear,
  markCompleted, isCompleted,
  getCurrentRoom, setCurrentRoom, clearCurrentRoom,
} from '../save-manager';
import type { SaveData } from '../save-manager';

const validSave: SaveData = {
  currentScene: 'puzzle-2',
  completedPuzzles: ['puzzle-1'],
  startedAt: 1711600000000,
  elapsedMs: 120000,
};

beforeEach(() => {
  localStorage.clear();
});

// ============================================================
// save / load / clear
// ============================================================

describe('save', () => {
  it('saves data to localStorage under room-scoped key', () => {
    save(validSave, 'room1');
    const raw = localStorage.getItem('escape-room-room1-save');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual(validSave);
  });

  it('defaults to room1 when roomId is omitted', () => {
    save(validSave);
    expect(localStorage.getItem('escape-room-room1-save')).not.toBeNull();
  });

  it('saves to separate keys for different rooms', () => {
    save(validSave, 'room1');
    save({ ...validSave, currentScene: 'puzzle-3' }, 'room2');
    expect(JSON.parse(localStorage.getItem('escape-room-room1-save')!).currentScene).toBe('puzzle-2');
    expect(JSON.parse(localStorage.getItem('escape-room-room2-save')!).currentScene).toBe('puzzle-3');
  });

  it('does not throw when localStorage is unavailable', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });
    expect(() => save(validSave, 'room1')).not.toThrow();
    spy.mockRestore();
  });
});

describe('load', () => {
  it('returns SaveData when data exists for given room', () => {
    localStorage.setItem('escape-room-room1-save', JSON.stringify(validSave));
    const result = load('room1');
    expect(result).toEqual(validSave);
  });

  it('defaults to room1 when roomId is omitted', () => {
    localStorage.setItem('escape-room-room1-save', JSON.stringify(validSave));
    expect(load()).toEqual(validSave);
  });

  it('returns null when no data for given room', () => {
    expect(load('room1')).toBeNull();
  });

  it('returns null for corrupted JSON', () => {
    localStorage.setItem('escape-room-room1-save', '{broken json!!!');
    expect(load('room1')).toBeNull();
  });

  it('returns null for invalid schema', () => {
    localStorage.setItem('escape-room-room1-save', JSON.stringify({ foo: 'bar' }));
    expect(load('room1')).toBeNull();
  });

  it('does not return data for a different room', () => {
    localStorage.setItem('escape-room-room1-save', JSON.stringify(validSave));
    expect(load('room2')).toBeNull();
  });
});

describe('clear', () => {
  it('removes saved data for the given room', () => {
    localStorage.setItem('escape-room-room1-save', JSON.stringify(validSave));
    clear('room1');
    expect(localStorage.getItem('escape-room-room1-save')).toBeNull();
  });

  it('defaults to room1 when roomId is omitted', () => {
    localStorage.setItem('escape-room-room1-save', JSON.stringify(validSave));
    clear();
    expect(localStorage.getItem('escape-room-room1-save')).toBeNull();
  });

  it('does not affect saves for other rooms', () => {
    localStorage.setItem('escape-room-room1-save', JSON.stringify(validSave));
    localStorage.setItem('escape-room-room2-save', JSON.stringify(validSave));
    clear('room1');
    expect(localStorage.getItem('escape-room-room2-save')).not.toBeNull();
  });
});

// ============================================================
// markCompleted / isCompleted
// ============================================================

describe('markCompleted / isCompleted', () => {
  it('marks a room as completed', () => {
    markCompleted('room1');
    expect(isCompleted('room1')).toBe(true);
  });

  it('returns false for a room that has not been marked', () => {
    expect(isCompleted('room2')).toBe(false);
  });

  it('is room-scoped — completing room1 does not affect room2', () => {
    markCompleted('room1');
    expect(isCompleted('room2')).toBe(false);
  });

  it('does not throw when localStorage is unavailable', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });
    expect(() => markCompleted('room1')).not.toThrow();
    spy.mockRestore();
  });

  it('returns false when localStorage read throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(isCompleted('room1')).toBe(false);
    spy.mockRestore();
  });
});

// ============================================================
// getCurrentRoom / setCurrentRoom / clearCurrentRoom
// ============================================================

describe('getCurrentRoom / setCurrentRoom / clearCurrentRoom', () => {
  it('returns null when no current room is set', () => {
    expect(getCurrentRoom()).toBeNull();
  });

  it('returns the room after setCurrentRoom', () => {
    setCurrentRoom('room1');
    expect(getCurrentRoom()).toBe('room1');
  });

  it('returns null after clearCurrentRoom', () => {
    setCurrentRoom('room1');
    clearCurrentRoom();
    expect(getCurrentRoom()).toBeNull();
  });

  it('overwrites previous room on setCurrentRoom', () => {
    setCurrentRoom('room1');
    setCurrentRoom('room2');
    expect(getCurrentRoom()).toBe('room2');
  });
});
