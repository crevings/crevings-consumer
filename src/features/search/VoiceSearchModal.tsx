import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, MicOff, X } from 'lucide-react';
import { motion } from 'motion/react';
import { createSpeechService, type SpeechErrorCode, type SpeechService } from '@/services/speech';
import { cleanVoiceTranscript } from '@/utils/voiceQuery';

interface VoiceSearchModalProps {
  onClose: () => void;
  onResult: (text: string) => void;
}

type VoiceStatus =
  | 'checking' // permission/availability pre-flight
  | 'listening'
  | 'success'
  | 'denied' // mic permission blocked — needs user action outside the app
  | 'unsupported' // platform has no speech recognition at all
  | 'error'; // one of the mapped SpeechErrorCode values

interface ErrorCopy {
  title: string;
  body: string;
}

/**
 * Human-readable guidance per error code. Every distinct failure mode gets its
 * own actionable message instead of the old one-size "Didn't hear that".
 */
const ERROR_COPY: Record<SpeechErrorCode, ErrorCopy> = {
  'not-allowed': {
    title: 'Microphone access is blocked',
    body: 'Allow microphone access for this site in your browser or app settings, then tap the mic to try again.',
  },
  'no-speech': {
    title: "Didn't hear anything",
    body: 'Try saying a restaurant name or a dish, a little closer to the microphone.',
  },
  network: {
    title: 'Speech service unavailable',
    body: 'Voice recognition needs a connection to the speech service. Check your internet and try again.',
  },
  'audio-capture': {
    title: 'No microphone available',
    body: 'Connect a microphone, or close another app that is using it, then try again.',
  },
  'service-not-allowed': {
    title: 'Voice recognition is turned off',
    body: 'The speech service is disabled on this device or browser. Check your settings and try again.',
  },
  'language-not-supported': {
    title: 'Language not supported',
    body: 'The selected language is not supported by this device. Try English.',
  },
  aborted: {
    title: 'Stopped',
    body: 'Tap the mic to start again.',
  },
  unknown: {
    title: 'Something went wrong',
    body: 'Voice recognition hit an unexpected error. Tap the mic to try again.',
  },
};

/** Prefer the device locale when it is a language we know the recognizer
 * handles well (English variants + Hindi for Indian dish names); otherwise
 * fall back to en-US so the recognizer never rejects the language. */
function pickSpeechLang(): string {
  if (typeof navigator === 'undefined') return 'en-US';
  const lang = navigator.language || 'en-US';
  const base = lang.toLowerCase();
  if (base.startsWith('en') || base.startsWith('hi')) return lang;
  return 'en-US';
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ onClose, onResult }) => {
  const [status, setStatus] = useState<VoiceStatus>('checking');
  const [transcript, setTranscript] = useState('');
  const [errorCode, setErrorCode] = useState<SpeechErrorCode | null>(null);

  const serviceRef = useRef<SpeechService | null>(null);
  const callbacksRef = useRef({ onClose, onResult });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const erroredRef = useRef(false);

  // Keep the latest props available to callbacks without re-creating the service.
  useEffect(() => {
    callbacksRef.current = { onClose, onResult };
  }, [onClose, onResult]);

  const stopAndSettle = useCallback((service: SpeechService) => {
    try {
      service.stop();
    } catch {
      /* noop */
    }
  }, []);

  const startListening = useCallback((service: SpeechService) => {
    setStatus('listening');
    setTranscript('');
    setErrorCode(null);
    erroredRef.current = false;
    service.start({ lang: pickSpeechLang() });
  }, []);

  // Permission + availability gate, then start. Only blocks when the
  // OS/browser has already denied the mic; otherwise start (web browsers show
  // their own prompt on start(); the Capacitor shell prompts via
  // requestPermission()). Re-runs on every retry so a mic enabled in settings
  // is picked up immediately.
  const beginSession = useCallback(
    async (service: SpeechService) => {
      const available = await service.isAvailable();
      if (!available) {
        setStatus('unsupported');
        return;
      }

      let permission = await service.getPermissionStatus();
      if (permission === 'prompt') {
        permission = await service.requestPermission();
      }
      if (permission === 'denied') {
        setStatus('denied');
        return;
      }

      startListening(service);
    },
    [startListening]
  );

  // Boot the platform-adaptive service once.
  useEffect(() => {
    let disposed = false;

    const service = createSpeechService({
      onResult: (text, _isFinal) => {
        if (disposed) return;
        setTranscript(text);
      },
      onError: (code) => {
        if (disposed || code === 'aborted') return;
        erroredRef.current = true;
        setErrorCode(code);
        setStatus('error');
      },
      onEnd: (finalText) => {
        if (disposed) return;
        // Strip filler words ("please show me..."), punctuation noise, and
        // expand common mishearings ("biriyani" → "biryani").
        const cleaned = cleanVoiceTranscript(finalText);
        if (cleaned) {
          setTranscript(cleaned);
          setStatus('success');
          timeoutRef.current = setTimeout(() => {
            callbacksRef.current.onResult(cleaned);
            callbacksRef.current.onClose();
          }, 1200);
        } else if (!erroredRef.current) {
          // Only claim "no speech" when the session ended without a mapped
          // error (e.g. silence timeout) — never overwrite network/denied.
          setErrorCode('no-speech');
          setStatus('error');
        }
      },
    });

    serviceRef.current = service;

    if (!service.supported) {
      setStatus('unsupported');
      return () => {
        disposed = true;
        service.dispose();
      };
    }

    void beginSession(service);

    return () => {
      disposed = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      service.dispose();
    };
  }, [beginSession]);

  const handleMicTap = () => {
    const service = serviceRef.current;
    if (!service) return;
    // Retry from any terminal state (error / denied / unsupported / idle).
    void beginSession(service);
  };

  const errorCopy = errorCode ? ERROR_COPY[errorCode] : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-[100]"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[110] overflow-hidden flex flex-col max-h-[60vh] w-full max-w-md mx-auto"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-slate-900">Voice Search</h2>
          <button
            onClick={onClose}
            className="p-2 bg-slate-50 rounded-full text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-8">
          {status === 'checking' && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-8">Getting microphone ready...</h2>
              <div className="w-20 h-20 rounded-full bg-[#00bd6f]/20 flex items-center justify-center">
                <Mic className="w-8 h-8 text-[#00bd6f] animate-pulse" />
              </div>
            </>
          )}

          {status === 'listening' && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-8 min-h-[28px]">{transcript || 'Listening...'}</h2>

              <div className="relative mb-8">
                {/* Pulsing animation */}
                <div className="absolute inset-0 bg-[#00bd6f] rounded-full opacity-20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                <div className="absolute inset-[-15px] bg-[#00bd6f] rounded-full opacity-10 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>

                {/* Large circular microphone button — tap to stop */}
                <button
                  onClick={() => stopAndSettle(serviceRef.current!)}
                  className="w-20 h-20 bg-[#00bd6f] rounded-full flex items-center justify-center shadow-lg shadow-[#00bd6f]/30 relative z-10"
                >
                  <Mic className="w-8 h-8 text-white" />
                </button>
              </div>

              <p className="text-gray-500 text-sm">
                Say a restaurant name or a dish
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-8">&quot;{transcript}&quot;</h2>

              <div className="relative mb-8">
                <button className="w-20 h-20 bg-[#00bd6f] rounded-full flex items-center justify-center shadow-lg shadow-[#00bd6f]/30 relative z-10 scale-110 transition-transform duration-300">
                  <Mic className="w-8 h-8 text-white" />
                </button>
              </div>

              <p className="text-gray-500 text-sm">
                Searching for &quot;{transcript}&quot;
              </p>
            </>
          )}

          {(status === 'error' || status === 'denied' || status === 'unsupported') && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {status === 'denied' ? ERROR_COPY['not-allowed'].title : status === 'unsupported' ? 'Voice search isn\u2019t supported here' : (errorCopy?.title ?? ERROR_COPY.unknown.title)}
              </h2>
              <p className="text-gray-500 text-sm mb-8 px-2">
                {status === 'unsupported'
                  ? 'This browser or device doesn\u2019t support speech recognition. Try Chrome, Edge, or Safari, or the Crevings mobile app — or just type your search.'
                  : (errorCopy?.body ?? ERROR_COPY.unknown.body)}
              </p>

              <div className="relative mb-8">
                <button
                  onClick={handleMicTap}
                  className="w-20 h-20 bg-[#00bd6f] rounded-full flex items-center justify-center shadow-lg shadow-[#00bd6f]/30 relative z-10 hover:scale-105 transition-transform"
                >
                  {status === 'denied' ? (
                    <MicOff className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </button>
              </div>

              <p className="text-gray-500 text-sm">
                {status === 'unsupported' ? 'Close this to keep searching by text' : 'Tap the microphone to try again'}
              </p>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
};
