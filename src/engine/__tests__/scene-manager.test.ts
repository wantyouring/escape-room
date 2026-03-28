import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SceneManager } from '../scene-manager';
import type { Scene } from '../scene-manager';

function createMockScene(id: string): Scene {
  return {
    id,
    mount: vi.fn() as unknown as (container: HTMLElement) => void,
    teardown: vi.fn() as unknown as () => void,
  };
}

describe('SceneManager', () => {
  let container: HTMLDivElement;
  let manager: SceneManager;

  beforeEach(() => {
    container = document.createElement('div');
    manager = new SceneManager(container);
  });

  it('registers and transitions to a scene', async () => {
    const scene = createMockScene('test');
    manager.register(scene);
    await manager.transition('test');
    expect(scene.mount).toHaveBeenCalledWith(container);
    expect(manager.getCurrentSceneId()).toBe('test');
  });

  it('tears down current scene before mounting new one', async () => {
    const scene1 = createMockScene('scene-1');
    const scene2 = createMockScene('scene-2');
    manager.register(scene1);
    manager.register(scene2);

    await manager.transition('scene-1');
    await manager.transition('scene-2');

    expect(scene1.teardown).toHaveBeenCalled();
    expect(scene2.mount).toHaveBeenCalled();
  });

  it('ignores duplicate transition requests during transition', async () => {
    const scene1 = createMockScene('scene-1');
    const scene2 = createMockScene('scene-2');
    manager.register(scene1);
    manager.register(scene2);

    // Start first transition
    const p1 = manager.transition('scene-1');
    // Immediately request another
    const p2 = manager.transition('scene-2');

    await p1;
    await p2;

    // scene-2 should not have been mounted since scene-1 was still transitioning
    expect(scene1.mount).toHaveBeenCalledTimes(1);
    expect(scene2.mount).toHaveBeenCalledTimes(0);
  });

  it('throws for unknown scene', async () => {
    await expect(manager.transition('nonexistent')).rejects.toThrow('Scene not found');
  });
});
