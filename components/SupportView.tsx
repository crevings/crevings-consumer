import React, { useState } from 'react';
import { ArrowLeft, Search, Phone, MessageSquare, ExternalLink, HelpCircle, FileText, PlayCircle, ChevronRight, Mail, BookOpen, MessageCircle, Paperclip, Send, Clock, CheckCircle2, Ticket, X, Plus, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SupportViewProps {
  onBack: () => void;
}

export const SupportView: React.FC<SupportViewProps> = ({ onBack }) => {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Hi there! How can we help you today with your restaurant?', sender: 'agent', time: '10:00 AM' }
  ]);

  const faqs = [
    { question: 'How do I onboard my restaurant?', answer: 'Learn the step-by-step process to get your restaurant up and running by navigating to the Profile section and tapping "Add Outlet". Fill in all physical location details and attach required business documents.', category: 'Getting Started' },
    { question: 'What are the payment settlement times?', answer: 'Payments are settled within 24-48 business hours to your verified bank account. Ensure your KYC status is approved in the Business Documents tab.', category: 'Finance' },
    { question: 'How to manage staff permissions?', answer: 'Go to Staff Management in the menu to add new roles. You can invite your team using their phone numbers and grant specific dashboard access like purely inventory or finance.', category: 'Team' },
    { question: 'How do I temporarily pause orders?', answer: 'Use the prominent toggle control at the top right of your main dashboard. This lets you pause incoming online orders for specific durations when the kitchen is overwhelmed.', category: 'Operations' },
  ];

  const tickets = [
    { id: '#TCK-8890', title: 'Payment settlement delayed', date: 'Today, 09:30 AM', status: 'In Progress' },
    { id: '#TCK-8842', title: 'Need help updating GST details', date: 'Yesterday, 02:15 PM', status: 'Resolved' },
  ];

  const suggestions = [
    "Where is my payout?",
    "How to pause orders?",
    "Update bank details",
    "Onboarding help"
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    setChatMessages([...chatMessages, { id: Date.now(), text, sender: 'user', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setMessage('');
    
    // Simulate auto reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now(), text: 'Thank you for reaching out. An agent will connect with you shortly. Your ticket number is #TCK-8891.', sender: 'agent', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    if (status === 'Resolved') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (status === 'In Progress') return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  if (showChat) {
    return (
      <div className="fixed inset-0 z-[700] bg-[#F4F7FB] flex flex-col font-sans animate-in slide-in-from-bottom-2 duration-300">
        {/* Chat Header */}
        <div className="bg-[#FFFFFF] pt-6 pb-4 px-4 flex items-center justify-between shrink-0 shadow-sm relative z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowChat(false)}
              className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors active:scale-95"
            >
              <ArrowLeft size={22} className="text-slate-700" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                  <span className="text-blue-600 font-bold text-[15px]">ST</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-[16px] font-bold text-slate-900 tracking-tight leading-none mb-1">Support Team</h1>
                <p className="text-[12px] font-medium text-slate-500">Typically replies in 5 mins</p>
              </div>
            </div>
          </div>
          <button className="w-10 h-10 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors">
            <Phone size={20} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Today</span>
          </div>
          {chatMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex flex-col max-w-[80%]">
                <div className={`rounded-[20px] px-4 py-3 shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-[#007FFF] text-white rounded-tr-[4px]' 
                    : 'bg-[#FFFFFF] text-slate-800 border border-slate-100 rounded-tl-[4px]'
                }`}>
                  <p className="text-[15px] leading-relaxed">{msg.text}</p>
                </div>
                <p className={`text-[10px] mt-1.5 font-medium ${msg.sender === 'user' ? 'text-right text-slate-400' : 'text-slate-400 pl-2'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions & Input Area */}
        <div className="bg-[#FFFFFF] border-t border-slate-100 shrink-0 pb-6 lg:pb-4">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="px-4 py-3 overflow-x-auto no-scrollbar flex gap-2 border-b border-slate-50 bg-slate-50/50">
              {suggestions.map((sug, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  className="shrink-0 bg-[#FFFFFF] border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-[#007FFF] px-4 py-2 rounded-[12px] text-[13px] font-semibold active:scale-95 transition-all shadow-sm"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          <div className="p-4 flex items-end gap-3">
            <button className="w-11 h-11 shrink-0 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors active:scale-95">
              <Paperclip size={20} />
            </button>
            
            <div className="flex-1 bg-slate-100 rounded-[24px] border border-slate-200/50 flex items-center pr-1.5 relative overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
               <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-transparent py-3 pl-4 pr-2 text-[15px] text-slate-900 focus:outline-none resize-none max-h-32 min-h-[44px] font-medium placeholder:text-slate-400 leading-snug"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(message);
                    }
                  }}
               />
               <button 
                  onClick={() => handleSendMessage(message)}
                  disabled={!message.trim()}
                  className={`w-[36px] h-[36px] shrink-0 rounded-full flex items-center justify-center ml-1 transition-all duration-300 ${
                    message.trim() ? 'bg-[#007FFF] text-white shadow-md shadow-blue-500/20 scale-100' : 'bg-slate-200 text-slate-400 scale-95'
                  }`}
               >
                  <Send size={16} className={`${message.trim() ? 'translate-x-[1px] -translate-y-[1px]' : ''}`} />
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[600] bg-[#F4F7FB] flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-[#FFFFFF] px-4 pt-6 pb-4 shrink-0 relative z-10 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors active:scale-95"
          >
            <ArrowLeft size={22} className="text-slate-700" />
          </button>
          <h1 className="text-[19px] font-bold text-slate-900 tracking-tight">Help & Support</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-32">
        {/* Top Banner Area */}
        <div className="bg-[#007FFF] px-6 py-8 relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-white/5 opacity-50"></div>
          <h2 className="text-[26px] font-black text-white leading-tight mb-2 tracking-tight relative z-10">How can we help?</h2>
          <p className="text-[14px] font-medium text-white/80 mb-6 relative z-10 max-w-xs">Ask a question or find tips below.</p>
          
          <div className="relative w-full max-w-sm z-10">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
             <input 
               type="text" 
               placeholder="Search guides or FAQs..." 
               className="w-full h-[52px] bg-white text-slate-900 py-4 pl-12 pr-4 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-white/50 text-[15px] font-medium shadow-md transition-all placeholder:text-slate-400"
             />
          </div>
        </div>

        <div className="px-4 py-6 space-y-8">
          
          {/* Quick Contact Options */}
          <section>
            <h3 className="text-[15px] font-bold text-slate-900 mb-4 px-2 tracking-tight">Need direct help?</h3>
            <div className="flex flex-col gap-3 px-2">
               <button 
                 onClick={() => setShowChat(true)}
                 className="flex items-center gap-4 p-4 rounded-[20px] bg-[#FFFFFF] border border-slate-200/80 hover:border-blue-200 transition-all active:scale-[0.98] group"
               >
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-[#007FFF] flex items-center justify-center group-hover:bg-[#007FFF] group-hover:text-white transition-all shrink-0">
                      <MessageSquare size={22} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-left flex-1">
                      <h4 className="text-[15px] font-bold text-slate-900 mb-0.5">Live Chat Support</h4>
                      <p className="text-[13px] font-medium text-slate-500">Typically replies in 5 mins</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-[#007FFF] transition-colors" />
               </button>
               
               <button 
                 onClick={() => window.open('https://wa.me/917493871759', '_blank')}
                 className="flex items-center gap-4 p-4 rounded-[20px] bg-[#FFFFFF] border border-slate-200/80 hover:border-emerald-200 transition-all active:scale-[0.98] group"
               >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0">
                      <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-left flex-1">
                      <h4 className="text-[15px] font-bold text-slate-900 mb-0.5">WhatsApp</h4>
                      <p className="text-[13px] font-medium text-slate-500">Chat with us directly</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
               </button>

               <button 
                 onClick={() => window.location.href = 'mailto:legal@crevings.com'}
                 className="flex items-center gap-4 p-4 rounded-[20px] bg-[#FFFFFF] border border-slate-200/80 hover:border-purple-200 transition-all active:scale-[0.98] group"
               >
                  <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all shrink-0">
                      <Mail size={22} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-left flex-1">
                      <h4 className="text-[15px] font-bold text-slate-900 mb-0.5">Email Support</h4>
                      <p className="text-[13px] font-medium text-slate-500">legal@crevings.com</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-purple-500 transition-colors" />
               </button>
            </div>
          </section>

          {/* Recent Tickets Section */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Recent Tickets</h3>
              <button 
                onClick={() => setShowChat(true)}
                className="text-[#007FFF] font-bold text-[13px] flex items-center gap-1 hover:underline active:opacity-80"
              >
                View all <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="flex overflow-x-auto no-scrollbar -mx-4 px-4 pb-2 space-x-4">
                {tickets.map((ticket, idx) => (
                  <div key={idx} className="bg-[#FFFFFF] border border-slate-200/80 rounded-[20px] p-5 shadow-sm min-w-[280px] shrink-0 active:scale-[0.98] transition-transform">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                          <Ticket size={14} />
                          <span className="font-mono text-[12px] font-bold">{ticket.id}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-[15px] leading-tight mb-2 truncate">{ticket.title}</h4>
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={12} />
                        <span className="text-[12px] font-medium">{ticket.date}</span>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* FAQs */}
          <section className="px-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h3>
            </div>
            <div className="bg-[#FFFFFF] border border-slate-200/80 rounded-[24px] shadow-sm overflow-hidden">
              {faqs.map((faq, idx) => (
                <div key={idx} className={`transition-colors ${idx !== faqs.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <button 
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full text-left p-5 flex items-start gap-4 justify-between active:bg-slate-50/50 hover:bg-slate-50/30 transition-colors"
                  >
                    <div className="flex-1 pr-2 pt-0.5">
                        <h4 className="text-[15px] font-bold text-slate-900 leading-snug">{faq.question}</h4>
                    </div>
                    <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-transform duration-300 ${expandedFaq === idx ? 'bg-blue-50 text-[#007FFF] rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6 pt-1">
                          <span className="text-[11px] font-bold text-[#007FFF] mb-3 inline-block bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">{faq.category}</span>
                          <p className="text-[14px] text-slate-600 leading-relaxed font-medium">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};


