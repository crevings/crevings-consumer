/**
 * WebSpeechAdapter — webkitSpeechRecognition backend (Chrome / Edge / Safari).
 *
 * Fixes two accuracy bugs that plagued the original VoiceSearchModal:
 *  1. Transcript capture now iterates EVERY result bucket (final + interim)
 *     instead of reading only the last one, so multi-part utterances are
 *     never truncated.
 *  2. The finalized text is accumulated synchronously inside `onresult` and
 *     handed to `onEnd` from `onend` — no React effect round-trip, which
 *     previously raced short utterances and lost the transcript entirely.
 */

import type {
  SpeechErrorCode,
  SpeechPermissionStatus,
  SpeechService,
  SpeechServiceCallbacks,
} from './SpeechService';
import { mapWebSpeechError } from './SpeechService';

// The Web Speech API is not part of lib.dom — declare the surface we use.
interface SpeechRecognitionBucket {
  isFinal?: boolean;
  [index: number]: { transcript?: string };
}

interface SpeechRecognitionEventLike {
  resultIndex?: number;
  results?: {
    length: number;
    [index: number]: SpeechRecognitionBucket;
  };
}

interface SpeechRecognitionErrorEventLike {
  error?: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export class WebSpeechAdapter implements SpeechService {
  readonly name = 'web-speech-api';
  readonly supported: boolean;

  private recognition: SpeechRecognitionLike | null;
  private callbacks: SpeechServiceCallbacks;
  private finalText = '';
  private started = false;

  constructor(callbacks: SpeechServiceCallbacks) {
    this.callbacks = callbacks;

    const Ctor = getSpeechRecognitionConstructor();
    if (!Ctor) {
      this.supported = false;
      this.recognition = null;
      return;
    }

    this.supported = true;
    const recognition = new Ctor();
    this.recognition = recognition;

    recognition.continuous = false; // one utterance, ends shortly after speech
    recognition.interimResults = true; // show live transcript while speaking
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      // Listening — the UI reflects state via callbacks.
    };

    recognition.onresult = (event) => {
      const results = event.results;
      if (!results) return;

      let final = '';
      let interim = '';
      const startIndex = event.resultIndex ?? 0;

      for (let i = startIndex; i < results.length; i++) {
        const bucket = results[i];
        const transcript = bucket?.[0]?.transcript;
        if (!transcript) continue;
        if (bucket.isFinal) {
          final += `${transcript} `;
        } else {
          interim += `${transcript} `;
        }
      }

      if (final.trim()) {
        // Accumulate across buckets so long/multi-part utterances survive.
        this.finalText = `${this.finalText} ${final}`.trim();
        this.callbacks.onResult(this.finalText, true);
      } else if (interim.trim()) {
        this.callbacks.onResult(interim.trim(), false);
      }
    };

    recognition.onerror = (event) => {
      const code: SpeechErrorCode = mapWebSpeechError(event.error);
      if (code === 'aborted') return; // intentional stop — never an error
      this.callbacks.onError(code);
    };

    recognition.onend = () => {
      const finalized = this.finalText;
      this.finalText = '';
      this.started = false;
      this.callbacks.onEnd(finalized);
    };
  }

  async getPermissionStatus(): Promise<SpeechPermissionStatus> {
    if (!this.supported) return 'unsupported';
    try {
      if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
        const result = await navigator.permissions.query({
          name: 'microphone',
        } as PermissionDescriptor);
        if (result.state === 'granted') return 'granted';
        if (result.state === 'denied') return 'denied';
        return 'prompt';
      }
    } catch {
      // Safari / unsupported permission name — treat as unknown and let the
      // recognizer's own not-allowed error be authoritative.
    }
    return 'unknown';
  }

  async requestPermission(): Promise<SpeechPermissionStatus> {
    // The browser shows its own mic prompt when start() is called; there is no
    // programmatic way to trigger it earlier. Re-query so the caller sees the
    // freshest state before deciding to start.
    return this.getPermissionStatus();
  }

  async isAvailable(): Promise<boolean> {
    return this.supported;
  }

  start(options?: { lang?: string }): void {
    if (!this.recognition || this.started) return;
    if (options?.lang) this.recognition.lang = options.lang;
    try {
      this.recognition.start();
      this.started = true;
    } catch {
      // "already started" — safe to ignore.
    }
  }

  stop(): void {
    try {
      this.recognition?.stop();
    } catch {
      /* noop */
    }
  }

  abort(): void {
    try {
      this.recognition?.abort();
    } catch {
      /* noop */
    }
  }

  dispose(): void {
    this.stop();
    this.recognition = null;
  }
}
