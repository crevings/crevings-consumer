/**
 * speech/index.ts — backend selector.
 *
 * Priority:
 *   1. Capacitor native shell → OS recognizer (Android/iOS/macOS)
 *   2. Web Speech API (Chrome / Edge / Safari) — desktop + web
 *   3. Neither → `supported === false`, caller degrades to text search.
 */

import type { SpeechService, SpeechServiceCallbacks } from './SpeechService';
import { WebSpeechAdapter } from './WebSpeechAdapter';
import { CapacitorSpeechAdapter } from './CapacitorSpeechAdapter';

function isCapacitorNative(): boolean {
  if (typeof window === 'undefined') return false;
  const cap = (window as unknown as {
    Capacitor?: { isNativePlatform?: () => boolean };
  }).Capacitor;
  return Boolean(cap?.isNativePlatform?.());
}

export function createSpeechService(callbacks: SpeechServiceCallbacks): SpeechService {
  if (isCapacitorNative()) {
    return new CapacitorSpeechAdapter(callbacks);
  }
  return new WebSpeechAdapter(callbacks);
}

export * from './SpeechService';
