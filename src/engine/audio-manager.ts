/**
 * Audio Manager — Web Audio API 기반 앰비언트 사운드
 * 사용자 제스처 후에만 활성화 가능
 */

export class AudioManager {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;

  /** 사용자 제스처 핸들러 내에서 호출해야 함 */
  init(): void {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.3;
    this.gainNode.connect(this.ctx.destination);
  }

  async playAmbient(url: string): Promise<void> {
    if (!this.ctx || !this.gainNode) return;
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);

      this.ambientSource = this.ctx.createBufferSource();
      this.ambientSource.buffer = audioBuffer;
      this.ambientSource.loop = true;
      this.ambientSource.connect(this.gainNode);
      this.ambientSource.start();
    } catch {
      // 사운드 로드 실패 — 무음으로 진행
    }
  }

  async playSfx(url: string): Promise<void> {
    if (!this.ctx || !this.gainNode) return;
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);

      const source = this.ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.gainNode);
      source.start();
    } catch {
      // 무시
    }
  }

  stopAmbient(): void {
    this.ambientSource?.stop();
    this.ambientSource = null;
  }

  destroy(): void {
    this.stopAmbient();
    this.ctx?.close();
    this.ctx = null;
  }
}
