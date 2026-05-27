import React, { useState } from 'react';
import { ChevronLeft, MapPin, Home, Briefcase, Map, GraduationCap, School } from 'lucide-react';

interface EditAddressViewProps {
  onClose: () => void;
}

export const EditAddressView: React.FC<EditAddressViewProps> = ({ onClose }) => {
  const [saveAs, setSaveAs] = useState('Home');

  const saveOptions = [
    { id: 'Home', icon: Home },
    { id: 'Work', icon: Briefcase },
    { id: 'Other', icon: Map },
    { id: 'College', icon: GraduationCap },
    { id: 'School', icon: School },
  ];

  return (
    <div className="fixed inset-0 z-[120] bg-white flex flex-col animate-[slideInRight_0.3s_ease-out]">
      <div className="flex items-center gap-4 px-4 py-4 border-b border-slate-100 shadow-sm">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-700 active:scale-95 transition-transform">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold text-slate-900">Edit Address</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex gap-3 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="mt-1">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Home</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              Amanat Prakash, Blue gate, ground floor, Netajee Subhash Colony, Ekauna Part
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">House / Flat / Block No.</label>
            <input 
              type="text" 
              defaultValue="Blue gate, ground floor"
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Apartment / Road / Area</label>
            <input 
              type="text" 
              defaultValue="Netajee Subhash Colony, Ekauna Part"
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Directions to reach (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. Ring the bell on the red gate"
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium placeholder:text-slate-400 text-slate-900"
            />
          </div>
          
          <div className="pt-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Save As</label>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5">
              {saveOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = saveAs === option.id;
                return (
                  <button 
                    key={option.id}
                    onClick={() => setSaveAs(option.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm shrink-0 transition-colors ${
                      isSelected 
                        ? 'border-2 border-green-500 bg-green-50 text-green-700' 
                        : 'border border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {option.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 border-t border-slate-100 bg-white">
        <button 
          onClick={onClose}
          className="w-full bg-green-600 text-white font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-all shadow-md"
        >
          Save Address
        </button>
      </div>
    </div>
  );
};
