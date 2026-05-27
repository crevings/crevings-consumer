
import React, { useState } from 'react';
import { ChevronLeft, Accessibility, Ear, Eye, Check } from 'lucide-react';

interface AccessibilityViewProps {
  onBack: () => void;
}

export const AccessibilityView: React.FC<AccessibilityViewProps> = ({ onBack }) => {
  const [hearing, setHearing] = useState('none');
  const [vision, setVision] = useState('none');
  const [mobility, setMobility] = useState('none');

  const handleSave = () => {
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex flex-col font-sans animate-[fadeInUp_0.3s_ease-out]">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 bg-white rounded-full active:scale-95 transition-transform">
          <ChevronLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Accessibility Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        <div className="bg-[#00bd6f] rounded-[24px] p-6 text-white relative overflow-hidden shadow-sm">
            <div className="relative z-10">
                <h2 className="font-bold text-lg mb-1.5">Tailored for You</h2>
                <p className="text-white/90 text-sm leading-relaxed max-w-[85%] font-medium">Customize the app experience to match your specific needs.</p>
            </div>
            <div className="absolute bottom-0 right-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md translate-y-4">
                <Accessibility className="w-8 h-8 text-white" />
            </div>
        </div>

        <Section title="Hearing" desc="Audio assistance & subtitles" icon={<Ear className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-50">
            <SelectableOption label="I'm deaf" selected={hearing === 'deaf'} onClick={() => setHearing('deaf')} />
            <SelectableOption label="I'm hard of hearing" selected={hearing === 'hard_hearing'} onClick={() => setHearing('hard_hearing')} />
            <SelectableOption label="No hearing impairment" selected={hearing === 'none'} onClick={() => setHearing('none')} />
        </Section>

        <Section title="Vision" desc="Screen reader & high contrast" icon={<Eye className="w-5 h-5 text-purple-600" />} iconBg="bg-purple-50">
            <SelectableOption label="I'm blind" selected={vision === 'blind'} onClick={() => setVision('blind')} />
            <SelectableOption label="I have a visual impairment" selected={vision === 'visual_impairment'} onClick={() => setVision('visual_impairment')} />
            <SelectableOption label="No vision impairment" selected={vision === 'none'} onClick={() => setVision('none')} />
        </Section>
      </div>

      <div className="p-4 bg-white border-t border-slate-100 sticky bottom-0 z-10">
          <button onClick={handleSave} className="w-full bg-[#00bd6f] text-white font-bold py-4 rounded-[16px] active:scale-95 transition-transform flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Save Preferences
          </button>
      </div>
    </div>
  );
};

const Section = ({ title, desc, icon, iconBg, children }: any) => (
    <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center ${iconBg}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-base font-bold text-slate-900 leading-none mb-1.5">{title}</h3>
                <p className="text-xs text-slate-500 font-medium">{desc}</p>
            </div>
        </div>
        <div className="space-y-3">{children}</div>
    </div>
);

const SelectableOption = ({ label, selected, onClick }: any) => (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-4 rounded-[16px] border-2 transition-colors ${selected ? 'border-[#00bd6f] bg-[#00bd6f]/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
        <span className={`text-sm font-bold ${selected ? 'text-slate-900' : 'text-slate-700'}`}>{label}</span>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? 'border-[#00bd6f]' : 'border-slate-300'}`}>
            {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#00bd6f]" />}
        </div>
    </button>
);
