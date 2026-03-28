import { describe, it, expect, beforeEach, vi } from 'vitest';
import { save, load, clear } from '../save-manager';
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

describe('save', () => {
  it('saves data to localStorage', () => {
    save(validSave);
    const raw = localStorage.getItem('escape-room-save');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual(validSave);
  });

  it('does not throw when localStorage is unavailable', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });
    expect(() => save(validSave)).not.toThrow();
    spy.mockRestore();
  });
});

describe('load', () => {
  it('returns SaveData when data exists', () => {
    localStorage.setItem('escape-room-save', JSON.stringify(validSave));
    const result = load();
    expect(result).toEqual(validSave);
  });

  it('returns null when no data', () => {
    expect(load()).toBeNull();
  });

  it('returns null for corrupted JSON', () => {
    localStorage.setItem('escape-room-save', '{broken json!!!');
    expect(load()).toBeNull();
  });

  it('returns null for invalid schema', () => {
    localStorage.setItem('escape-room-save', JSON.stringify({ foo: 'bar' }));
    expect(load()).toBeNull();
  });
});

describe('clear', () => {
  it('removes saved data', () => {
    localStorage.setItem('escape-room-save', JSON.stringify(validSave));
    clear();
    expect(localStorage.getItem('escape-room-save')).toBeNull();
  });
});
