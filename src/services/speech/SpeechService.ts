/**
 * speech/SpeechService.ts — platform-agnostic speech-to-text contract.
 *
 * Three backends implement this interface:
 *   - WebSpeechAdapter        webkitSpeechRecognition (Chrome / Edge / Safari)
 *   - CapacitorSpeechAdapter  @capacitor-community/speech-recognition
 *                             (Android SpeechRecognizer / iOS+macOS SFSpeechRecognizer)
 *
 * A selector in ./index.ts picks the best backend for the current runtime, so
 * the rest of the app never cares which platform it is on.
 */

export type SpeechPermissionStatus =
  | 'granted'
  | 'denied'
  | 'prompt'
  | 'unknown'
  | 'unsupported';

export type SpeechErrorCode =
  | 'not-allowed' // microphone permission denied / revoked
  | 'no-speech' // silence detected
  | 'network' // STT service unreachable (Chrome/cloud send audio to a server)
  | 'audio-capture' // no microphone, or mic grabbed by another app
  | 'service-not-allowed'
  | 'language-not-supported'
  | 'aborted' // stopped programmatically — never surfaced as an error
  | 'unknown';

export interface SpeechServiceCallbacks {
  /** Interim or finalized transcript fragments as they arrive. */
  onResult: (text: string, isFinal: boolean) => void;
  onError: (code: SpeechErrorCode) => void;
  /** Fired once per session with the finalized transcript (may be ""). */
  onEnd: (finalText: string) => void;
}

export interface SpeechService {
  readonly name: string;
  readonly supported: boolean;
  /** Best-effort permission pre-check; may resolve 'unknown'/'unsupported'. */
  getPermissionStatus(): Promise<SpeechPermissionStatus>;
  /**
   * Trigger the platform permission prompt when possible (native shells). On
   * the web the prompt is implicit in `start()` — this just re-queries.
   */
  requestPermission(): Promise<SpeechPermissionStatus>;
  /** True when the device exposes a usable speech recognition service. */
  isAvailable(): Promise<boolean>;
  start(options?: { lang?: string }): void;
  stop(): void;
  abort(): void;
  dispose(): void;
}

/** Normalize raw Web Speech API error strings into the shared taxonomy. */
export function mapWebSpeechError(raw: string | undefined): SpeechErrorCode {
  switch (raw) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'not-allowed';
    case 'no-speech':
      return 'no-speech';
    case 'network':
      return 'network';
    case 'audio-capture':
      return 'audio-capture';
    case 'language-not-supported':
      return 'language-not-supported';
    case 'aborted':
      return 'aborted';
    default:
      return 'unknown';
  }
}
