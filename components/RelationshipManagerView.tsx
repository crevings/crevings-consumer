import React from 'react';
import { ArrowLeft, Phone, Mail, MessageCircle, HelpCircle } from 'lucide-react';

interface RelationshipManagerViewProps {
  onBack: () => void;
}

export const RelationshipManagerView: React.FC<RelationshipManagerViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans animate-in fade-in duration-300">
      {/* Page Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-slate-100 h-[56px] flex items-center px-4">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-[18px] font-semibold text-slate-900 ml-2">Relationship Manager</h1>
      </header>

      <div className="p-4 pt-6">
        {/* Manager Profile Card */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-[#E5E7EB] shadow-sm flex flex-col items-center text-center">
          
          {/* Manager Photo */}
          <div className="w-[80px] h-[80px] rounded-full overflow-hidden mb-4 border-2 border-white shadow-sm bg-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" 
              alt="Rahul Sharma" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Manager Details */}
          <h2 className="text-[18px] font-semibold text-slate-900 mb-1">Rahul Sharma</h2>
          <p className="text-[13px] text-[#6B7280] mb-6">Relationship Manager</p>

          {/* Action Buttons */}
          <div className="w-full space-y-3 mb-6">
            <button className="w-full h-[44px] bg-[#1E90FF] text-white rounded-[12px] font-medium text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm">
              <Phone size={18} />
              Call
            </button>
            <button className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] text-slate-700 rounded-[12px] font-medium text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
              <Mail size={18} />
              Email
            </button>
            <button className="w-full h-[44px] bg-[#F3F4F6] text-slate-700 rounded-[12px] font-medium text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
              <MessageCircle size={18} />
              Chat
            </button>
          </div>

          {/* Availability Info */}
          <div className="flex items-center justify-center gap-1.5 text-[13px] text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Available • Mon–Sat • 10 AM – 7 PM</span>
          </div>
        </div>

        {/* Optional Section */}
        <div className="mt-6 text-center">
          <p className="text-[13px] text-slate-500 mb-3">If manager is not available:</p>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[14px] font-medium text-[#1E90FF] bg-blue-50 rounded-full active:scale-95 transition-transform">
            <HelpCircle size={16} />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
