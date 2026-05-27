import React, { useEffect, useState, useRef } from 'react';
import { Mic, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceSearchModalProps {
  onClose: () => void;
  onResult: (text: string) => void;
}

type VoiceStatus = 'listening' | 'error' | 'success' | 'idle';

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ onClose, onResult }) => {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setStatus('listening');
        setTranscript('');
      };

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setStatus('error');
      };

      recognitionRef.current.onend = () => {
        if (recognitionRef.current.successTranscript) {
          setStatus('success');
          setTimeout(() => {
            onResult(recognitionRef.current.successTranscript);
            onClose();
          }, 1000);
        } else {
          setStatus('error');
        }
      };
    } else {
      setStatus('error'); // Not supported
    }

    startListening();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onClose, onResult]);

  // Keep the latest transcript accessible for onend
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.successTranscript = transcript;
    }
  }, [transcript]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already started
      }
    }
  };

  const handleMicClick = () => {
    if (status === 'error' || status === 'idle') {
      startListening();
    }
  };

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
          
          {status === 'listening' && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-8">{transcript || 'Listening...'}</h2>
              
              <div className="relative mb-8">
                {/* Pulsing animation */}
                <div className="absolute inset-0 bg-[#00bd6f] rounded-full opacity-20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                <div className="absolute inset-[-15px] bg-[#00bd6f] rounded-full opacity-10 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
                
                {/* Large circular microphone button */}
                <button 
                  onClick={() => recognitionRef.current?.stop()}
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

          {(status === 'error' || status === 'idle') && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sorry! Didn't hear that</h2>
              <p className="text-gray-500 text-sm mb-8">
                Try saying a restaurant name or a dish
              </p>
              
              <div className="relative mb-8">
                {/* Large circular microphone button */}
                <button 
                  onClick={handleMicClick}
                  className="w-20 h-20 bg-[#00bd6f] rounded-full flex items-center justify-center shadow-lg shadow-[#00bd6f]/30 relative z-10 hover:scale-105 transition-transform"
                >
                  <Mic className="w-8 h-8 text-white" />
                </button>
              </div>
              
              <p className="text-gray-500 text-sm">
                Tap the microphone to try again
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-8">"{transcript}"</h2>
              
              <div className="relative mb-8">
                <button className="w-20 h-20 bg-[#00bd6f] rounded-full flex items-center justify-center shadow-lg shadow-[#00bd6f]/30 relative z-10 scale-110 transition-transform duration-300">
                  <Mic className="w-8 h-8 text-white" />
                </button>
              </div>
              
              <p className="text-gray-500 text-sm opacity-0">
                Placeholder
              </p>
            </>
          )}

        </div>
      </motion.div>
    </>
  );
};