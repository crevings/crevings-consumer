import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  ShieldCheck,
  ChevronRight,
  Bike,
  Wallet,
  Package,
  Send,
  MoreVertical
} from 'lucide-react';

interface HelpSupportViewProps {
  onBack: () => void;
}

const TOPICS_DATA = [
  { id: 'delivery', icon: Bike, label: 'Ordering and Delivery' },
  { id: 'payments', icon: Wallet, label: 'Payments, Refunds and Coupons' },
  { id: 'changes', icon: Package, label: 'Order Changes and Customization' },
  { id: 'profile', icon: User, label: 'Account and Profile' },
  { id: 'safety', icon: ShieldCheck, label: 'Support and Safety' },
];

const TOPIC_FAQS: Record<string, {q: string, a: string}[]> = {
  'delivery': [
    { q: "How does 10 minute delivery work?", a: "We have partnered with nearby stores to ensure quick delivery." },
    { q: "What happens if my order is late?", a: "If your order is late, you can reach out to our support team for assistance." },
    { q: "Can I track my delivery in real time?", a: "Yes, you can track your delivery partner on the map once the order is picked up." },
    { q: "Why can't I place orders? [Kitchen unserviceable]", a: "The restaurant might be temporarily closed or not accepting orders at the moment." },
    { q: "Why can't I place another order?", a: "You can place multiple orders, but each will be delivered separately." },
    { q: "Do you deliver at night?", a: "Delivery hours depend on the restaurant's operating hours in your area." },
    { q: "Why is my area not serviceable?", a: "We are currently expanding our delivery radius and hope to reach you soon." }
  ],
  'payments': [
    { q: "My payment failed but money was deducted.", a: "This is a temporary bank hold. The amount is refunded within 5-7 business days." },
    { q: "How do I get a refund?", a: "Refunds for cancelled orders are processed automatically within 3-5 business days." },
    { q: "Can I pay with cash on delivery?", a: "Yes, cash on delivery is available for most restaurants up to a certain limit." },
    { q: "Why is my promo code not working?", a: "Promo codes may have minimum order limits, expire, or only apply to specific items or restaurants." }
  ],
  'changes': [
    { q: "Can I cancel my order?", a: "Yes, you can cancel within 1 minute of placing the order without charges." },
    { q: "How can I add to an existing order?", a: "Once an order is placed, you cannot add items. You will need to place a new separate order." },
    { q: "Can I change the delivery address after ordering?", a: "Address changes are not possible once the restaurant accepts the order. Please cancel and reorder." }
  ],
  'profile': [
    { q: "How do I change my delivery address?", a: "You can update it from the 'Address Book' in your profile or at checkout." },
    { q: "How do I update my phone number?", a: "Go to Profile -> Edit Profile. You will need SMS verification to confirm the change." },
    { q: "How do I change my name or email?", a: "Go to Profile -> Edit Profile to update your personal details." }
  ],
  'safety': [
    { q: "Is my payment information secure?", a: "We use AES-256 encryption. We do not store your full card details on our servers." },
    { q: "How can I delete my account?", a: "Request deletion from Profile -> Settings -> Privacy." }
  ]
};

export const HelpSupportView: React.FC<HelpSupportViewProps> = ({ onBack }) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return <SupportChatScreen onBack={() => setShowChat(false)} />;
  }

  if (selectedTopic) {
    return (
      <TopicFaqsScreen 
        topicId={selectedTopic} 
        onBack={() => setSelectedTopic(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative">
      {/* Header */}
      <div className="bg-white pt-safe pb-4 px-4 sticky top-0 z-20">
        <div className="flex items-center gap-4 mt-4">
          <button onClick={onBack} className="p-2 -ml-2 active:scale-95 transition-transform" aria-label="Go back">
            <ArrowLeft className="w-[22px] h-[22px] text-slate-800" strokeWidth={2.5} />
          </button>
          <h1 className="text-[18px] font-bold text-slate-900">Help</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="px-5 pt-2 pb-8">
           <h3 className="text-[17px] font-bold text-slate-900 mb-4 tracking-tight">All Help Topics</h3>
           
           <div className="divide-y divide-slate-100">
               {TOPICS_DATA.map(topic => (
                   <button 
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                      className="w-full py-4 flex items-center justify-between active:bg-slate-50 transition-all text-left"
                   >
                      <div className="flex items-center gap-4">
                         <div className="text-[#00BD6F]">
                            <topic.icon className="w-[22px] h-[22px]" strokeWidth={2} />
                         </div>
                         <h4 className="text-[15px] font-semibold text-slate-800 leading-snug">{topic.label}</h4>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" strokeWidth={2.5} />
                   </button>
               ))}
           </div>
         </div>
       </div>
     </div>
   );
};

const TopicFaqsScreen: React.FC<{topicId: string, onBack: () => void}> = ({ topicId, onBack }) => {
  const [selectedFaq, setSelectedFaq] = useState<{q: string, a: string} | null>(null);
  const topic = TOPICS_DATA.find(t => t.id === topicId)!;
  const faqs = TOPIC_FAQS[topicId] || [];

  if (selectedFaq) {
      return (
          <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-[slideInRight_0.3s_ease-out]">
              <div className="bg-white pt-safe pb-4 px-4 sticky top-0 z-20">
                  <div className="flex items-center gap-4 mt-4">
                      <button onClick={() => setSelectedFaq(null)} className="p-2 -ml-2 active:scale-95 transition-transform" aria-label="Go back">
                          <ArrowLeft className="w-[22px] h-[22px] text-slate-800" strokeWidth={2.5} />
                      </button>
                      <div className="flex-1">
                          <h1 className="text-[18px] font-bold text-slate-900 line-clamp-1">{topic.label}</h1>
                      </div>
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pt-2 pb-10">
                  <h2 className="text-[20px] font-black text-slate-900 mb-4 leading-snug">{selectedFaq.q}</h2>
                  <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{selectedFaq.a}</p>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-[slideInRight_0.3s_ease-out]">
        {/* Header */}
        <div className="bg-white pt-safe pb-4 px-4 sticky top-0 z-20">
            <div className="flex items-center gap-4 mt-4">
                <button onClick={onBack} className="p-2 -ml-2 active:scale-95 transition-transform" aria-label="Go back">
                    <ArrowLeft className="w-[22px] h-[22px] text-slate-800" strokeWidth={2.5} />
                </button>
                <div className="flex-1">
                    <h1 className="text-[18px] font-bold text-slate-900">{topic.label}</h1>
                </div>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-5 pt-2 pb-10">
            <div className="divide-y divide-slate-100">
                {faqs.map((faq, i) => (
                    <button 
                        key={i} 
                        onClick={() => setSelectedFaq(faq)}
                        className="w-full py-4 flex items-center justify-between active:bg-slate-50 transition-all text-left"
                    >
                        <span className="text-[15px] font-semibold text-slate-800 pr-4 leading-snug">
                            {faq.q}
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" strokeWidth={2.5} />
                    </button>
                ))}
                {faqs.length === 0 && (
                    <div className="py-8 text-center text-[15px] text-slate-500 font-medium">
                        No FAQs available for this topic yet.
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

const SupportChatScreen = ({ onBack }: { onBack: () => void }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Sarah from Support. How can I assist you today?", sender: 'agent', time: '10:30 AM' },
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
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="bg-white pt-safe pb-4 px-4 sticky top-0 z-20 shadow-sm border-b border-slate-100">
            <div className="flex items-center gap-3 mt-4">
                <button onClick={onBack} className="p-2 -ml-2 active:scale-95 transition-transform" aria-label="Go back">
                    <ArrowLeft className="w-[22px] h-[22px] text-slate-800" strokeWidth={2.5} />
                </button>
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                        <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80" alt="Sarah" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-[14px] h-[14px] bg-[#00BD6F] border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-[15px] text-slate-900 leading-none mb-1">Sarah Support</h3>
                        <p className="text-[#00BD6F] text-[12px] font-bold">Online</p>
                    </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 active:scale-95 transition-transform">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6">
            <div className="text-center text-[12px] font-bold text-slate-400 uppercase tracking-wider my-4">
                Today, 10:30 AM
            </div>
            {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-[20px] text-[14px] font-medium leading-relaxed shadow-sm border ${
                        msg.sender === 'user' 
                        ? 'bg-[#00BD6F] border-[#00BD6F] text-white rounded-br-none' 
                        : 'bg-[#F4F4F8] border-slate-100 text-slate-800 rounded-bl-none'
                    }`}>
                        {msg.text}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 font-medium px-1">{msg.time}</span>
                </div>
            ))}
        </div>

        <div className="p-4 bg-white border-t border-slate-100 pt-3 pb-safe-bottom">
            <div className="flex items-center gap-3 bg-[#F4F4F8] p-1.5 pl-4 rounded-[24px] border border-transparent focus-within:border-slate-200 focus-within:bg-white transition-all">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-[15px] font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        input.trim() ? 'bg-[#00BD6F] text-white shadow-md' : 'bg-slate-200 text-slate-400'
                    }`}
                >
                    <Send className="w-[18px] h-[18px] ml-0.5" />
                </button>
            </div>
        </div>
    </div>
  );
};