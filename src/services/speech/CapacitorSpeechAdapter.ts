/**
 * CapacitorSpeechAdapter — native backend for Android / iOS / macOS built on
 * `@capacitor-community/speech-recognition`.
 *
 * Android uses the OS SpeechRecognizer (VOICE_RECOGNITION audio source, which
 * applies noise suppression); iOS/macOS use SFSpeechRecognizer. This adapter
 * is only constructed inside a Capacitor native shell (see ./index.ts), and
 * the plugin module is imported dynamically so the web bundle never loads it.
 *
 * Session lifecycle notes (why this adapter is defensive):
 *   - The Android plugin rejects the `start()` promise on recognizer errors
 *     (no speech / no match / network / insufficient permissions) WITHOUT
 *     emitting a `listeningState` event — so the old code swallowed the
 *     rejection and the UI hung on "Listening..." forever. Every rejection is
 *     now mapped to a SpeechErrorCode and surfaced.
 *   - The plugin's `stop()` does not reliably emit `listeningState("stopped")`
 *     on Android, so a manual stop finalizes locally (with an `ended` guard so
 *     onEnd fires exactly once even if a late "stopped" event arrives).
 *   - A watchdog caps the session so silence that triggers neither an error
 *     nor an end-of-speech event can never leave the UI stuck.
 *   - dispose() always stops the native recognizer directly (the public
 *     stop() is guarded by the disposed flag), so closing the modal
 *     mid-listening never leaves the microphone hot.
 *
 * Native configuration required (one-time, in the native projects):
 *   - iOS/macOS Info.plist: NSSpeechRecognitionUsageDescription +
 *     NSMicrophoneUsageDescription
 *   - Android: RECORD_AUDIO is declared in the app's AndroidManifest.xml
 *     (the plugin also declares it via library-manifest merge)
 */

import type {
  SpeechErrorCode,
  SpeechPermissionStatus,
  SpeechService,
  SpeechServiceCallbacks,
} from './SpeechService';

type SpeechPlugin = typeof import('@capacitor-community/speech-recognition');

interface ListenerHandle {
  remove: () => Promise<void>;
}

/**
 * How long to wait for any recognizer activity (partial result, end-of-speech
 * or error) before forcing the session closed. Guards against devices where
 * silence produces neither an event nor a rejection.
 */
const SESSION_MAX_MS = 10000;

/** Map the plugin's rejection messages to the shared error taxonomy. */
function mapPluginError(raw: unknown): SpeechErrorCode {
  const msg = (raw instanceof Error ? raw.message : String(raw ?? '')).toLowerCase();
  if (msg.includes('permission')) return 'not-allowed';
  if (msg.includes('no speech') || msg.includes('no match')) return 'no-speech';
  if (msg.includes('network') || msg.includes('timeout')) return 'network';
  if (msg.includes('audio') || msg.includes('microphone')) return 'audio-capture';
  if (msg.includes('service') || msg.includes('available')) return 'service-not-allowed';
  if (msg.includes('language')) return 'language-not-supported';
  return 'unknown';
}

export class CapacitorSpeechAdapter implements SpeechService {
  readonly name = 'capacitor-speech-recognition';
  readonly supported: boolean;

  private callbacks: SpeechServiceCallbacks;
  private plugin: SpeechPlugin | null = null;
  private lastPartial = '';
  private started = false;
  /** True once a session has been finalized — onEnd must fire exactly once. */
  private ended = false;
  private disposed = false;
  private watchdog: ReturnType<typeof setTimeout> | null = null;
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

  private clearWatchdog(): void {
    if (this.watchdog) {
      clearTimeout(this.watchdog);
      this.watchdog = null;
    }
  }

  /** Finalize the session exactly once, handing the last partial to onEnd. */
  private finalize(finalText: string): void {
    if (this.ended || this.disposed) return;
    this.ended = true;
    this.started = false;
    this.clearWatchdog();
    this.callbacks.onEnd(finalText);
  }

  start(options?: { lang?: string }): void {
    if (this.disposed || this.started) return;
    const plugin = this.plugin;
    if (!plugin) return;

    this.started = true;
    this.ended = false;
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
      .catch((err) => {
        // Android rejects start() on recognizer errors (silence, no-match,
        // network, permissions) WITHOUT emitting listeningState. Surface the
        // mapped error instead of hanging the UI on "Listening...".
        if (this.disposed || this.ended) return;
        const code = mapPluginError(err);
        this.ended = true;
        this.started = false;
        this.clearWatchdog();
        this.callbacks.onError(code);
        this.callbacks.onEnd('');
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
          this.finalize(finalized);
        }
      )
    );

    // Watchdog: some Android devices end silence with a rejected start()
    // (handled above) or an end-of-speech event; others emit nothing at all.
    // Cap the session so the UI can never hang on "Listening...".
    this.clearWatchdog();
    this.watchdog = setTimeout(() => {
      if (!this.started || this.ended || this.disposed) return;
      void plugin.SpeechRecognition.stop().catch(() => {
        /* finalize below regardless */
      });
      this.finalize(this.lastPartial);
    }, SESSION_MAX_MS);
  }

  stop(): void {
    if (!this.plugin || !this.started || this.disposed) return;
    // The plugin's stop() does not reliably emit listeningState("stopped") on
    // Android — finalize locally with whatever we captured. A late "stopped"
    // event (or the watchdog) is a no-op thanks to the `ended` guard.
    const finalized = this.lastPartial;
    this.lastPartial = '';
    this.ended = true;
    this.started = false;
    this.clearWatchdog();
    void this.plugin.SpeechRecognition.stop().catch(() => {
      /* listener will finalize */
    });
    this.callbacks.onEnd(finalized);
  }

  abort(): void {
    this.stop();
  }

  dispose(): void {
    const wasStarted = this.started;
    this.disposed = true;
    this.clearWatchdog();
    // Stop the native recognizer DIRECTLY — the public stop() bails on
    // `disposed`, so without this the mic would stay hot after the modal
    // unmounts mid-session.
    if (this.plugin && wasStarted) {
      this.started = false;
      void this.plugin.SpeechRecognition.stop().catch(() => {
        /* unmounting — nothing to finalize */
      });
    }
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
