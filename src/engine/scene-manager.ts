/**
 * Scene Manager — 씬 전환 관리
 *
 * 씬 라이프사이클:
 *   [등록] → [전환 요청] → [현재 teardown] → [fade-out 0.5s]
 *   → [새 씬 mount] → [fade-in 0.5s] → [활성]
 */

export interface Scene {
  id: string;
  mount(container: HTMLElement): void;
  teardown(): void;
}

export class SceneManager {
  private scenes = new Map<string, Scene>();
  private currentScene: Scene | null = null;
  private container: HTMLElement;
  private transitioning = false;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  register(scene: Scene): void {
    this.scenes.set(scene.id, scene);
  }

  async transition(sceneId: string): Promise<void> {
    if (this.transitioning) return;

    const next = this.scenes.get(sceneId);
    if (!next) throw new Error(`Scene not found: ${sceneId}`);

    this.transitioning = true;

    // Fade out current
    if (this.currentScene) {
      this.container.style.opacity = '0';
      await wait(500);
      this.currentScene.teardown();
      this.container.innerHTML = '';
    }

    // Mount new scene
    next.mount(this.container);
    this.currentScene = next;

    // Fade in
    requestAnimationFrame(() => {
      this.container.style.opacity = '1';
    });
    await wait(500);

    this.transitioning = false;
  }

  getCurrentSceneId(): string | null {
    return this.currentScene?.id ?? null;
  }

  isTransitioning(): boolean {
    return this.transitioning;
  }
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
