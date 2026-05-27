import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  MessageCircle, 
  Search, 
  ShoppingBag, 
  CreditCard, 
  User, 
  Headphones, 
  Mail, 
  Phone,
  MessageSquare,
  LifeBuoy,
  ChevronRight,
  ShieldCheck,
  Zap,
  Play,
  Send,
  X,
  Paperclip,
  Smile,
  MoreVertical,
  CheckCheck
} from 'lucide-react';

interface HelpSupportViewProps {
  onBack: () => void;
}

export const HelpSupportView: React.FC<HelpSupportViewProps> = ({ onBack }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);

  const categories = [
    { icon: ShoppingBag, label: 'Orders', color: 'text-orange-500', bg: 'bg-orange-50' },
    { icon: CreditCard, label: 'Payments', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: User, label: 'Account', color: 'text-sky-500', bg: 'bg-sky-50' },
    { icon: ShieldCheck, label: 'Privacy', color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const videos = [
    { id: 1, title: 'How to track your order live', duration: '1:45', thumbnail: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=400&h=225&fit=crop&q=80', views: '2.4k' },
    { id: 2, title: 'Applying coupons & DineCash', duration: '2:10', thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=225&fit=crop&q=80', views: '1.8k' },
    { id: 3, title: 'Managing refunds easily', duration: '1:15', thumbnail: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=225&fit=crop&q=80', views: '3.1k' },
  ];

  const faqs = [
    { q: "How do I track my order?", a: "Go to the 'Orders' tab and select your active order to view the live tracking map. You'll see real-time updates of your delivery partner's location." },
    { q: "Can I cancel my order?", a: "Yes, you can cancel within 1 minute of placing the order without charges. After that, a cancellation fee may apply depending on the restaurant's preparation status." },
    { q: "My payment failed but money was deducted.", a: "Don't worry! This is usually a temporary hold by your bank. The amount is automatically refunded within 5-7 business days." },
    { q: "How do I change my delivery address?", a: "You can change your address on the checkout page or from the 'Address Book' in your profile before placing an order." },
  ];

  if (showChat) {
    return <SupportChatScreen onBack={() => setShowChat(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-x-hidden pb-12 animate-fadeInUp">
      <div className="relative bg-gradient-to-br from-[#041c2d] to-[#010e14] pt-8 pb-24 px-6 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10 flex justify-between items-center mb-8">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/20">
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">24/7 Priority Support</span>
          </div>
        </div>
        <div className="relative z-10 text-center mb-8">
           <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Support Center</h1>
           <p className="text-blue-100/60 text-sm font-medium">How can we help you today?</p>
        </div>
        <div className="relative z-20 -mb-6 max-w-md mx-auto">
            <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Search className="w-5 h-5 stroke-[2.5]" />
                </div>
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search issues, orders, payments..."
                    className="w-full bg-white border-none rounded-[2rem] py-5 pl-14 pr-6 text-sm font-bold shadow-2xl shadow-slate-900/10 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
                />
            </div>
        </div>
      </div>

      <div className="px-5 pt-12 space-y-10">
        <div className="grid grid-cols-4 gap-4">
            {categories.map((cat, i) => (
                <button key={i} className="flex flex-col items-center gap-2 group">
                    <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center ${cat.color} shadow-sm group-hover:scale-110 transition-all`}>
                        <cat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{cat.label}</span>
                </button>
            ))}
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Play className="w-4 h-4 text-blue-500 fill-blue-500" /> Video Tutorials
                </h3>
                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest">View All</button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5">
                {videos.map((video) => (
                    <div key={video.id} className="min-w-[260px] bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm group cursor-pointer hover:shadow-md transition-all">
                        <div className="relative h-36">
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white">
                                    <Play className="w-5 h-5 fill-current ml-1" />
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="text-sm font-bold text-slate-800 line-clamp-1 mb-1">{video.title}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{video.views} views</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" /> Frequent Questions
            </h3>
            <div className="space-y-3">
                {faqs.map((faq, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all">
                        <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left group">
                            <span className={`text-sm font-bold ${openIndex === i ? 'text-blue-600' : 'text-slate-700'}`}>{faq.q}</span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === i ? 'bg-blue-500 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </button>
                        {openIndex === i && (
                            <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed font-medium">
                                <div className="h-px bg-slate-50 w-full mb-4"></div>
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-[#051722] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/10">
            <div className="relative z-10">
                <h4 className="text-xl font-black mb-1">Still need help?</h4>
                <p className="text-blue-100/60 text-xs font-medium mb-8 max-w-[200px]">Connect with our support team for instant resolution.</p>
                <div className="grid grid-cols-1 gap-3">
                    <button onClick={() => setShowChat(true)} className="w-full bg-blue-500 hover:bg-blue-400 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20">
                        <MessageCircle className="w-5 h-5" /> Live Chat Now
                    </button>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

const SupportChatScreen = ({ onBack }: { onBack: () => void }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Sarah from Crevings Support. How can I assist you today?", sender: 'agent', time: '10:30 AM' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), text: input, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages([...messages, newMsg]);
    setInput('');
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: "I'm looking into this right now. Please stay on the line.",
            sender: 'agent',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="bg-[#051722] pt-12 pb-6 px-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white/10 rounded-full active:scale-90 transition-all">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-white rounded-2xl overflow-hidden border-2 border-blue-500/30">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80" alt="Sarah" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-[#051722] rounded-full"></div>
                        </div>
                        <div>
                            <h3 className="font-black text-base tracking-tight leading-none mb-1">Agent Sarah</h3>
                            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Online</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium shadow-sm leading-relaxed ${
                        msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-slate-50 text-slate-700 rounded-bl-none border border-slate-100'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
        </div>
        <div className="p-6 bg-white border-t border-slate-50">
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-[2rem] border border-slate-200 focus-within:border-blue-500/50">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe your issue..."
                    className="flex-1 bg-transparent px-4 text-sm font-bold text-slate-800 focus:outline-none"
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg disabled:opacity-30"
                >
                    <Send className="w-5 h-5 ml-0.5" />
                </button>
            </div>
        </div>
    </div>
  );
};