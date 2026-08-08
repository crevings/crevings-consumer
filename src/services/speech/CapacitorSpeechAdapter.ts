/**
 * CapacitorSpeechAdapter — native backend for Android / iOS / macOS built on
 * `@capacitor-community/speech-recognition`.
 *
 * Android uses the OS SpeechRecognizer (VOICE_RECOGNITION audio source, which
 * applies noise suppression); iOS/macOS use SFSpeechRecognizer. This adapter
 * is only constructed inside a Capacitor native shell (see ./index.ts), and
 * the plugin module is imported dynamically so the web bundle never loads it.
 *
 * Native configuration required (one-time, in the native projects):
 *   - iOS/macOS Info.plist: NSSpeechRecognitionUsageDescription +
 *     NSMicrophoneUsageDescription
 *   - Android: RECORD_AUDIO is declared by the plugin automatically
 */

import type {
  SpeechPermissionStatus,
  SpeechService,
  SpeechServiceCallbacks,
} from './SpeechService';

type SpeechPlugin = typeof import('@capacitor-community/speech-recognition');

interface ListenerHandle {
  remove: () => Promise<void>;
}

export class CapacitorSpeechAdapter implements SpeechService {
  readonly name = 'capacitor-speech-recognition';
  readonly supported: boolean;

  private callbacks: SpeechServiceCallbacks;
  private plugin: SpeechPlugin | null = null;
  private lastPartial = '';
  private started = false;
  private disposed = false;
  private listenerCleanup: Array<Promise<ListenerHandle>> = [];

  constructor(callbacks: SpeechServiceCallbacks) {
    this.callbacks = callbacks;
    // Refined asynchronously via available()/getPermissionStatus().
    this.supported = true;
  }

  /** Resolve the plugin module once (dynamic import → not in the web bundle). */
  private async loadPlugin(): Promise<SpeechPlugin | null> {
    if (this.plugin) return this.plugin;
    if (this.disposed) return null;
    try {
      this.plugin = await import('@capacitor-community/speech-recognition');
      return this.plugin;
    } catch {
      this.plugin = null;
      return null;
    }
  }

  /** True when the device exposes a speech recognition service. */
  async isAvailable(): Promise<boolean> {
    const plugin = await this.loadPlugin();
    if (!plugin) return false;
    try {
      const { available } = await plugin.SpeechRecognition.available();
      return available;
    } catch {
      return false;
    }
  }

  async getPermissionStatus(): Promise<SpeechPermissionStatus> {
    const plugin = await this.loadPlugin();
    if (!plugin) return 'unsupported';
    try {
      const status = await plugin.SpeechRecognition.checkPermissions();
      const state = status.speechRecognition;
      if (state === 'granted') return 'granted';
      if (state === 'denied') return 'denied';
      return 'prompt';
    } catch {
      return 'unknown';
    }
  }

  /** Trigger the OS permission prompt (RECORD_AUDIO / SFSpeechRecognizer). */
  async requestPermission(): Promise<SpeechPermissionStatus> {
    const plugin = await this.loadPlugin();
    if (!plugin) return 'unsupported';
    try {
      const status = await plugin.SpeechRecognition.requestPermissions();
      const state = status.speechRecognition;
      if (state === 'granted') return 'granted';
      if (state === 'denied') return 'denied';
      return 'prompt';
    } catch {
      return 'unknown';
    }
  }

  start(options?: { lang?: string }): void {
    if (this.disposed || this.started) return;
    const plugin = this.plugin;
    if (!plugin) return;

    this.started = true;
    this.lastPartial = '';

    // `popup: false` is required on Android for partialResults to stream.
    void plugin.SpeechRecognition.start({
      language: options?.lang ?? 'en-US',
      maxResults: 1,
      partialResults: true,
      popup: false,
    })
      .then((res) => {
        // Some platforms resolve the promise with the final matches.
        const match = res?.matches?.[0];
        if (match && !this.disposed) {
          this.lastPartial = match;
          this.callbacks.onResult(match, false);
        }
      })
      .catch(() => {
        /* surfaced through listeners/state below */
      });

    this.listenerCleanup.push(
      plugin.SpeechRecognition.addListener('partialResults', (data: { matches?: string[] }) => {
        if (this.disposed) return;
        const match = data?.matches?.[0] ?? '';
        if (match) {
          this.lastPartial = match;
          this.callbacks.onResult(match, false);
        }
      })
    );

    this.listenerCleanup.push(
      plugin.SpeechRecognition.addListener(
        'listeningState',
        (data: { status?: 'started' | 'stopped' }) => {
          if (this.disposed || data?.status !== 'stopped') return;
          const finalized = this.lastPartial;
          this.lastPartial = '';
          this.started = false;
          this.callbacks.onEnd(finalized);
        }
      )
    );
  }

  stop(): void {
    if (!this.plugin || !this.started || this.disposed) return;
    void this.plugin.SpeechRecognition.stop().catch(() => {
      /* listener will finalize */
    });
  }

  abort(): void {
    this.stop();
  }

  dispose(): void {
    this.disposed = true;
    this.stop();
    const cleanup = this.listenerCleanup;
    this.listenerCleanup = [];
    void Promise.all(
      cleanup.map(async (handlePromise) => {
        try {
          const handle = await handlePromise;
          await handle.remove();
        } catch {
          /* already removed */
        }
      })
    );
  }
}
