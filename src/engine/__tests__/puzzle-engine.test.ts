import { describe, it, expect } from 'vitest';
import { hashString, verifyAnswer } from '../puzzle-engine';

describe('hashString', () => {
  it('produces consistent SHA-256 hex string', async () => {
    const hash = await hashString('test');
    // SHA-256 of "test"
    expect(hash).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
  });

  it('normalizes with trim and toLowerCase', async () => {
    const h1 = await hashString('Test');
    const h2 = await hashString(' test ');
    const h3 = await hashString('TEST');
    expect(h1).toBe(h2);
    expect(h2).toBe(h3);
  });
});

describe('verifyAnswer', () => {
  it('returns true for correct answer', async () => {
    const hash = await hashString('7392');
    const result = await verifyAnswer('7392', [hash]);
    expect(result).toBe(true);
  });

  it('returns false for wrong answer', async () => {
    const hash = await hashString('7392');
    const result = await verifyAnswer('1234', [hash]);
    expect(result).toBe(false);
  });

  it('returns false for empty string', async () => {
    const hash = await hashString('7392');
    const result = await verifyAnswer('', [hash]);
    expect(result).toBe(false);
  });

  it('matches secondary answer hash', async () => {
    const primaryHash = await hashString('물');
    const secondaryHash = await hashString('ㅁㅜㄹ');
    const result = await verifyAnswer('ㅁㅜㄹ', [primaryHash, secondaryHash]);
    expect(result).toBe(true);
  });
});
