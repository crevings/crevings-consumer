import React from 'react';
import { ChevronLeft, Scale } from 'lucide-react';

interface LicensesViewProps {
  onBack: () => void;
}

export const LicensesView: React.FC<LicensesViewProps> = ({ onBack }) => {
  const libraries = [
    { name: 'React', license: 'MIT License', version: '18.2.0' },
    { name: 'Lucide React', license: 'ISC License', version: '0.263.1' },
    { name: 'Tailwind CSS', license: 'MIT License', version: '3.3.3' },
    { name: 'Google Generative AI', license: 'Apache 2.0', version: '0.1.0' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7] font-sans animate-[fadeInUp_0.3s_ease-out]">
      {/* Header */}
      <div className="bg-white px-4 pt-safe-3 pb-3 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 bg-white rounded-full active:scale-95 transition-transform">
          <ChevronLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Open Source Licenses</h1>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="w-12 h-12 bg-[#00bd6f] rounded-[16px] flex items-center justify-center text-white mb-4 shadow-sm">
                    <Scale className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-lg text-slate-900">Crevings App Platform</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">
                    Copyright © 2024 Crevings Inc. All rights reserved.
                </p>
            </div>
            <div className="divide-y divide-slate-100">
                {libraries.map((lib, i) => (
                    <div key={i} className="p-5 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-1.5">
                            <h3 className="font-bold text-slate-900 text-sm">{lib.name}</h3>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-mono font-bold">{lib.version}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500">{lib.license}</p>
                    </div>
                ))}
            </div>
            <div className="p-5 bg-slate-50 text-center border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    This software includes open source software.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};