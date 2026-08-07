import React, { useState } from 'react';
import { ChevronLeft, Star, MessageSquare, Send, CheckCircle2, AlertCircle, Sparkles, Heart, Zap, Bug, Layout } from 'lucide-react';

interface PlatformFeedbackViewProps {
  onBack: () => void;
}

export const PlatformFeedbackView: React.FC<PlatformFeedbackViewProps> = ({ onBack }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const tags = [
    { label: 'App Performance', icon: Zap },
    { label: 'User Interface', icon: Layout },
    { label: 'Delivery Speed', icon: Sparkles },
    { label: 'Customer Support', icon: Heart },
    { label: 'Bug Report', icon: Bug },
    { label: 'Restaurant Quality', icon: Star },
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    // TODO: wire to a real feedback endpoint once available. Submission is
    // client-only for now, so the success screen makes no server-receipt claim.
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 animate-[fadeInUp_0.4s_ease-out]">
        <div className="w-24 h-24 bg-[#00bd6f] rounded-[24px] flex items-center justify-center text-white mb-8 shadow-lg shadow-[#00bd6f]/20 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter text-center">THANK YOU!</h2>
        <p className="text-slate-500 text-sm font-medium text-center leading-relaxed max-w-[240px]">
          Your feedback helps us make Crevings better for everyone. Thank you!
        </p>
        <button
          onClick={onBack}
          className="mt-8 w-full max-w-[240px] bg-[#00bd6f] text-white font-bold py-3 rounded-[14px] active:scale-95 transition-transform"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex flex-col font-sans animate-[fadeInUp_0.3s_ease-out]">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 sticky top-0 z-30 shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 bg-white rounded-full active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Platform Feedback</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-32">
        {/* Rating Section */}
        <div className="bg-white rounded-[24px] p-8 text-center shadow-sm border border-slate-100">
          <p className="text-sm font-bold text-slate-900 mb-4">Overall App Experience</p>
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button 
                key={s}
                onClick={() => setRating(s)}
                className="active:scale-90 transition-transform"
              >
                <Star 
                  className={`w-10 h-10 transition-colors ${
                    s <= rating ? 'text-[#00bd6f] fill-[#00bd6f]' : 'text-slate-200 fill-slate-200'
                  }`} 
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
          <h2 className="text-base font-medium text-slate-600">
            {rating === 0 ? "Rate our Platform" : rating === 5 ? "We love you too! ❤️" : "How can we improve?"}
          </h2>
        </div>

        {/* Improvement Areas */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 px-1">What stands out?</h3>
          <div className="grid grid-cols-2 gap-3">
            {tags.map((tag) => (
              <button
                key={tag.label}
                onClick={() => toggleTag(tag.label)}
                className={`flex items-center gap-3 p-4 rounded-[16px] border transition-colors ${
                  selectedTags.includes(tag.label)
                  ? 'bg-[#00bd6f]/10 border-[#00bd6f] text-[#00bd6f]'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tag.icon className={`w-4 h-4 ${selectedTags.includes(tag.label) ? 'text-[#00bd6f]' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">{tag.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">Detailed Notes</h3>
          </div>
          <textarea 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you like or what's annoying you... we're all ears!"
            className="w-full h-40 bg-white rounded-[24px] p-6 text-sm font-medium text-slate-900 focus:outline-none border border-slate-200 focus:border-[#00bd6f] transition-colors resize-none placeholder:text-slate-400 shadow-sm"
          />
        </div>

        <div className="bg-blue-50 rounded-[16px] p-4 border border-blue-100 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
          <p className="text-xs text-blue-700 font-medium leading-relaxed">
            Your feedback goes directly to our product team. While we can't reply to every message, we read every single one to improve your experience.
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-white border-t border-slate-100 sticky bottom-0 z-30">
        <button 
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full bg-[#00bd6f] text-white font-bold py-4 rounded-[16px] active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
        >
          <span>Send Feedback</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};