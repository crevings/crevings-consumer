import React, { useEffect, useState } from 'react';
import { Mic, X } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult?: (text: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ isOpen, onClose, onResult }) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsListening(true);
      // Simulate listening for 3 seconds
      const timer = setTimeout(() => {
        setIsListening(false);
        if (onResult) {
          onResult('Simulated voice input');
        }
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, onResult]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] w-full max-w-sm rounded-[32px] p-8 flex flex-col items-center relative shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
        
        <div className="mb-6 relative">
          <div className={`absolute inset-0 bg-blue-500 rounded-full opacity-20 ${isListening ? 'animate-ping' : ''}`}></div>
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center relative z-10 border-4 border-white shadow-sm">
            <Mic size={40} className="text-blue-600" />
          </div>
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          {isListening ? 'Listening...' : 'Processing...'}
        </h3>
        <p className="text-slate-500 text-center text-sm font-medium">
          {isListening ? 'Speak now, we are listening to your command.' : 'Please wait a moment.'}
        </p>
      </div>
    </div>
  );
};
