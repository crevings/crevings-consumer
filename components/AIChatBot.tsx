import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Paperclip, Image as ImageIcon } from 'lucide-react';
import { ACTIVE_ORDERS, PAST_ORDERS } from '../constants';
import { sendMessageToAI } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIChatBotProps {
    forceOpen?: boolean;
    onClose?: () => void;
}

export const AIChatBot: React.FC<AIChatBotProps> = ({ forceOpen = false, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hi! I can help you with your active orders or history. What do you need?' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (forceOpen) {
        setIsOpen(true);
    } else {
        setIsOpen(false);
    }
  }, [forceOpen]);

  const handleClose = () => {
      setIsOpen(false);
      if (onClose) onClose();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const allOrders = [...ACTIVE_ORDERS, ...PAST_ORDERS];
    const responseText = await sendMessageToAI(userMsg.text, allOrders);

    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const userMsg: ChatMessage = { 
        id: Date.now().toString(), 
        role: 'user', 
        text: `Shared a file: ${file.name}` 
      };
      setMessages(prev => [...prev, userMsg]);
      // In a real app, we would upload the file here
    }
  };

  // If forced open (from nav), show the overlay
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeInUp">
        <div className="w-full max-w-[350px] bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-100 overflow-hidden h-[600px] relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-base">Crevings AI</h3>
                    <p className="text-purple-100 text-xs flex items-center gap-1.5 opacity-80">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                        Always here to help
                    </p>
                </div>
            </div>
            <button onClick={handleClose} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-slate-800 text-white rounded-br-sm' 
                    : 'bg-white text-slate-700 rounded-bl-sm border border-slate-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
             <div className="flex gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-300 transition-all">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors shrink-0"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*,video/*" 
                  className="hidden" 
                />
                <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about orders, food..."
                className="flex-1 bg-transparent text-slate-700 px-2 text-sm focus:outline-none"
                />
                <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm shrink-0"
                >
                <Send className="w-4 h-4 ml-0.5" />
                </button>
             </div>
          </div>
        </div>
    </div>
  );
};