import React, { useState } from 'react';
import { ArrowLeft, Plus, Store, Copy, MapPin, Search, Check, ChevronRight, X, LayoutTemplate, Trash2 } from 'lucide-react';
import { Tab } from '../types';

interface OutletManagementViewProps {
  onBack: () => void;
  isEmbedded?: boolean;
}

export const OutletManagementView: React.FC<OutletManagementViewProps> = ({ onBack, isEmbedded }) => {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [addFlowStep, setAddFlowStep] = useState<'options' | 'copy_features' | 'location' | null>(null);

  const [copyOptions, setCopyOptions] = useState({
    menu: true,
    tables: true,
    payout: false,
    openingHours: true,
    facilities: true,
  });

  const [locationObj, setLocationObj] = useState({
    address: '',
    pinCode: '',
  });

  const mockOutlets = [
    { id: '1', outletId: 'OUT-1001', name: 'Gourmet Kitchen', address: 'Civil Lines, Prayagraj', status: 'Active' },
    { id: '2', outletId: 'OUT-1002', name: 'Gourmet Kitchen Express', address: 'Alampur, Prayagraj', status: 'Setting up' }
  ];

  const handleAddOutlet = () => {
    setShowAddSheet(true);
    setAddFlowStep('options');
  };

  const handleSelectAddSame = () => {
    setAddFlowStep('copy_features');
  };

  const handleSelectAddNew = () => {
    setAddFlowStep('location');
  };

  const toggleCopy = (key: keyof typeof copyOptions) => {
    setCopyOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Wrapper = isEmbedded ? 'div' : 'div';
  const wrapperClass = isEmbedded ? "flex-1 flex flex-col h-full overflow-hidden" : "fixed inset-0 z-[100] bg-[#FFFFFF] flex flex-col font-sans animate-in slide-in-from-right duration-300";

  return (
    <Wrapper className={wrapperClass}>
      {!isEmbedded && (
        <header className="h-[56px] bg-[#FFFFFF] border-b border-slate-100 flex items-center px-4 shrink-0 shadow-sm relative z-10">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900 ml-2">Manage Outlets</h1>
        </header>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockOutlets.map((outlet, idx) => (
          <div key={idx} className="bg-[#FFFFFF] rounded-[16px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-[48px] h-[48px] rounded-[12px] bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                    <Store size={24} className="text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-slate-900 leading-tight mb-0.5">{outlet.name}</h3>
                    <p className="text-[12px] text-slate-500 font-medium tracking-wide">ID: {outlet.outletId}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  outlet.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {outlet.status}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-4 bg-slate-50 p-2.5 rounded-[10px] border border-slate-100">
                  <MapPin size={16} className="text-slate-400 shrink-0" />
                  <span className="text-[13px] text-slate-600 line-clamp-1">{outlet.address}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="flex-1 h-[36px] bg-[#1E90FF] text-white rounded-[10px] text-[13px] font-semibold active:scale-95 transition-transform flex items-center justify-center">
                  Manage
                </button>
                <button className="flex-1 h-[36px] bg-slate-100 text-slate-700 rounded-[10px] text-[13px] font-semibold active:scale-95 transition-transform hover:bg-slate-200 flex items-center justify-center">
                  Edit
                </button>
                <button className="w-[36px] h-[36px] bg-rose-50 text-rose-600 rounded-[10px] flex items-center justify-center active:scale-95 transition-transform hover:bg-rose-100 shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="h-20" /> {/* Spacer for fab */}
      </div>

      <div className="absolute bottom-6 right-4 left-4">
        <button 
          onClick={handleAddOutlet}
          className="w-full h-[52px] bg-[#1E90FF] text-white rounded-[16px] font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform"
        >
          <Plus size={20} />
          Add Outlet
        </button>
      </div>

      {/* Add Outlet Bottom Sheet Flow */}
      {showAddSheet && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-t-[24px] w-full max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-300">
            
            {/* Header */}
            <div className="h-[60px] px-5 flex items-center justify-between border-b border-slate-100 shrink-0">
              <h2 className="text-[18px] font-bold text-slate-900">
                {addFlowStep === 'options' ? 'Add Outlet' : 
                 addFlowStep === 'copy_features' ? 'Copy Settings' : 'Location Details'}
              </h2>
              <button 
                onClick={() => setShowAddSheet(false)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full active:scale-95 transition-transform"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {addFlowStep === 'options' && (
                <div className="p-4 space-y-3 pb-8">
                  <p className="text-[14px] text-slate-500 mb-2">Choose how you want to add your new outlet.</p>
                  
                  <button 
                    onClick={handleSelectAddSame}
                    className="w-full p-4 rounded-[20px] border border-slate-100 bg-[#FFFFFF] shadow-sm flex items-start gap-4 active:scale-[0.98] transition-all hover:border-[#1E90FF] group text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#1E90FF] shrink-0 group-hover:bg-[#1E90FF] group-hover:text-white transition-colors">
                      <Copy size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[16px] font-bold text-slate-900 mb-1">Add same restaurant outlet</h3>
                      <p className="text-[13px] text-slate-500 leading-snug">Quickly clone your menu, opening hours, and settings for a new branch.</p>
                    </div>
                    <ChevronRight size={20} className="text-slate-400 mt-2" />
                  </button>

                  <button 
                    onClick={handleSelectAddNew}
                    className="w-full p-4 rounded-[20px] border border-slate-100 bg-[#FFFFFF] shadow-sm flex items-start gap-4 active:scale-[0.98] transition-all hover:border-[#1E90FF] group text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <LayoutTemplate size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[16px] font-bold text-slate-900 mb-1">Add new restaurant</h3>
                      <p className="text-[13px] text-slate-500 leading-snug">Start fresh with a brand new restaurant profile and menu setup.</p>
                    </div>
                    <ChevronRight size={20} className="text-slate-400 mt-2" />
                  </button>
                </div>
              )}

              {addFlowStep === 'copy_features' && (
                <div className="p-4 flex flex-col min-h-full">
                  <div className="flex-1">
                    <p className="text-[14px] text-slate-500 mb-4">Select the features you want to copy to the new branch.</p>
                    <div className="bg-[#FFFFFF] rounded-[16px] border border-slate-200 overflow-hidden">
                      {[
                        { id: 'menu', label: 'Menu & Pricing', desc: 'All categories, items, and prices' },
                        { id: 'tables', label: 'Table Layout', desc: 'Dine-in table configurations' },
                        { id: 'payout', label: 'Payout Details', desc: 'Bank accounts for settlements' },
                        { id: 'openingHours', label: 'Opening Hours', desc: 'Weekly schedule and timings' },
                        { id: 'facilities', label: 'Facilities', desc: 'Restaurant amenities' },
                      ].map((feature, i) => (
                        <label key={feature.id} className={`flex items-center justify-between p-4 cursor-pointer active:bg-slate-50 ${i !== 0 ? 'border-t border-slate-100' : ''}`}>
                          <div className="pr-4">
                            <span className="block text-[14px] font-bold text-slate-900">{feature.label}</span>
                            <span className="block text-[12px] text-slate-500 mt-0.5">{feature.desc}</span>
                          </div>
                          <div className="relative flex items-center justify-center shrink-0">
                            <input 
                              type="checkbox"
                              checked={copyOptions[feature.id as keyof typeof copyOptions]}
                              onChange={() => toggleCopy(feature.id as keyof typeof copyOptions)}
                              className="peer sr-only"
                            />
                            <div className="w-6 h-6 border-2 border-slate-300 rounded-md peer-checked:bg-[#1E90FF] peer-checked:border-[#1E90FF] transition-colors" />
                            <Check size={16} className="absolute text-white scale-0 peer-checked:scale-100 transition-transform" strokeWidth={3} />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 pb-2">
                    <button 
                      onClick={() => setAddFlowStep('location')}
                      className="w-full h-[52px] bg-[#1E90FF] text-white rounded-[16px] font-bold text-[16px] active:scale-[0.98] transition-transform"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {addFlowStep === 'location' && (
                <div className="p-4 flex flex-col min-h-full">
                  <div className="flex-1 space-y-5">
                    <p className="text-[14px] text-slate-500">Where is the new outlet located?</p>
                    
                    <div className="space-y-4">
                      {/* Search / Pin */}
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500">
                          <MapPin size={20} />
                        </div>
                        <input 
                          type="text" 
                          value={locationObj.address}
                          onChange={(e) => setLocationObj({...locationObj, address: e.target.value})}
                          placeholder="Search or pin on map"
                          className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] font-medium outline-none transition-all"
                        />
                      </div>
                      
                      {/* Map Preview */}
                      <div className="h-40 bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden border border-slate-200 shadow-sm">
                        <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=20.5937,78.9629&zoom=4&size=400x200&sensor=false')] bg-cover bg-center opacity-50" />
                        <button className="relative z-10 px-5 py-2.5 bg-[#FFFFFF] rounded-full shadow-sm font-bold flex items-center gap-2 text-[14px] text-slate-800 border border-slate-200 active:scale-95 transition-transform">
                          <MapPin size={18} className="text-rose-500" /> Choose on map
                        </button>
                      </div>

                      {/* Manual Address Card */}
                      <div className="bg-slate-50 rounded-[16px] p-4 border border-slate-200 space-y-3">
                        <h4 className="text-[14px] font-bold text-slate-800">Complete Address</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            placeholder="Building / Flat Name"
                            className="w-full h-11 px-3 rounded-[10px] border border-slate-200 text-[13px] outline-none focus:border-[#1E90FF]"
                          />
                          <input 
                            type="text" 
                            placeholder="Landmark"
                            className="w-full h-11 px-3 rounded-[10px] border border-slate-200 text-[13px] outline-none focus:border-[#1E90FF]"
                          />
                        </div>
                        <input 
                          type="text" 
                          value={locationObj.pinCode}
                          onChange={(e) => setLocationObj({...locationObj, pinCode: e.target.value})}
                          placeholder="Pincode"
                          className="w-full h-11 px-3 rounded-[10px] border border-slate-200 text-[13px] outline-none focus:border-[#1E90FF]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 pb-2">
                    <button 
                      onClick={() => setShowAddSheet(false)}
                      className="w-full h-[52px] bg-[#1E90FF] text-white rounded-[16px] font-bold text-[16px] active:scale-[0.98] transition-transform"
                    >
                      Create Outlet
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </Wrapper>
  );
};
