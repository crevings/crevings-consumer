import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { sendMessageToOrderAI, checkOrderAIService } from "@/services/geminiService";
import { ChatMessage, Order } from "@/types";

interface OrderChatBotProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    progress: number;
    timeLeft: number;
}

export const OrderChatBot: React.FC<OrderChatBotProps> = ({ isOpen, onClose, order, progress, timeLeft }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hi! I can help you with questions about your current order. What do you need?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tie the header status indicator to real API health instead of assuming
  // "live" — probe on open and after every failed exchange.
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setServiceStatus('checking');
    checkOrderAIService().then((ok) => {
      if (active) setServiceStatus(ok ? 'online' : 'offline');
    });
    return () => { active = false; };
  }, [isOpen]);

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

    try {
      const responseText = await sendMessageToOrderAI(userMsg.text, order, progress, timeLeft);
      setServiceStatus('online');
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setServiceStatus('offline');
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I couldn't reach the support assistant right now. Please try again in a moment.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeInUp">
        <div className="w-full max-w-[350px] bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-100 overflow-hidden h-[600px] relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-base">Order Support AI</h3>
                    {serviceStatus === 'online' ? (
                        <p className="text-blue-100 text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            Live assistance
                        </p>
                    ) : serviceStatus === 'checking' ? (
                        <p className="text-blue-100 text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse"></span>
                            Connecting&hellip;
                        </p>
                    ) : (
                        <p className="text-blue-100 text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-300"></span>
                            Unavailable — retrying on next message
                        </p>
                    )}
                </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
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
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
             <div className="flex gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-300 transition-all">
                <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your order..."
                className="flex-1 bg-transparent text-slate-700 px-4 text-sm focus:outline-none"
                />
                <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                <Send className="w-4 h-4 ml-0.5" />
                </button>
             </div>
          </div>
        </div>
    </div>
  );
};
