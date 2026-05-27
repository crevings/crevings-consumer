import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import { motion } from 'motion/react';

interface SupportMessagingViewProps {
  onBack: () => void;
  orderId: string;
}

export const SupportMessagingView: React.FC<SupportMessagingViewProps> = ({ onBack, orderId }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', role: 'agent', text: `Hi there! I see you need help with order #${orderId}. How can I assist you today?`, time: '10:00 AM' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = { id: Date.now().toString(), role: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    
    // Simulate agent typing
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'agent', 
        text: 'An agent will be with you shortly. Thank you for your patience.', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 bg-slate-50 z-[100] flex flex-col"
    >
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 active:scale-95 transition-transform">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                CS
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">Customer Support</h1>
              <p className="text-xs text-slate-500">Typically replies in a few minutes</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-600 active:scale-95 transition-transform">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-600 active:scale-95 transition-transform">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center mb-6">
          <span className="bg-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Today</span>
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-white text-slate-800 rounded-bl-sm border border-slate-100'
              }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-3 border-t border-slate-100 shrink-0 pb-safe">
        <div className="flex items-end gap-2 bg-slate-100 rounded-2xl p-1.5 border border-slate-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <button className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 max-h-32 bg-transparent border-none focus:ring-0 resize-none py-2.5 px-2 text-[15px] text-slate-800 placeholder:text-slate-400 min-h-[44px]"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 bg-blue-600 text-white rounded-xl disabled:opacity-50 disabled:bg-slate-300 hover:bg-blue-700 active:scale-95 transition-all shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
