import React, { useState } from 'react';
import { ArrowLeft, Store, Users, MapPin, Phone, Receipt, ShieldCheck, ChevronRight, Plus, Building2, UserPlus, Settings2, Banknote } from 'lucide-react';
import { OutletManagementView } from './OutletManagementView';
import { StaffManagementView } from './StaffManagementView';
import { ManageBillingView } from './ManageBillingView';

export const StoreAndStaffManagementView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeView, setActiveView] = useState<'hub' | 'outlets' | 'staff' | 'billing' | 'customCharges'>('hub');

  if (activeView === 'outlets') {
    return <OutletManagementView onBack={() => setActiveView('hub')} isEmbedded={false} />;
  }
  
  if (activeView === 'staff') {
    return <StaffManagementView onBack={() => setActiveView('hub')} isEmbedded={false} />;
  }

  if (activeView === 'billing') {
    return <ManageBillingView onBack={() => setActiveView('hub')} viewType="details" />;
  }

  if (activeView === 'customCharges') {
    return <ManageBillingView onBack={() => setActiveView('hub')} viewType="charges" />;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#F8FAFC] flex flex-col font-sans animate-in slide-in-from-right duration-300">
      <header className="bg-white px-4 pt-6 pb-4 shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-2">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-600 hover:bg-slate-50 active:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-[22px] font-bold text-slate-900 tracking-tight leading-tight">Business Setup</h1>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        
        {/* Hub Concept Hero Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 mt-2">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase">
                  Pro Plan
                </span>
              </div>
              <h2 className="text-[20px] font-bold text-slate-900 leading-tight">Gourmet Kitchen Group</h2>
              <p className="text-slate-500 text-[13px] font-medium mt-1">ID: BIZ-84920</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shrink-0">
              <Building2 className="text-slate-700" size={24} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
            <div>
              <div className="text-slate-400 text-[11px] font-semibold mb-1 uppercase tracking-wider">Total Outlets</div>
              <div className="text-slate-900 text-[28px] font-light tracking-tight">2</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px] font-semibold mb-1 uppercase tracking-wider">Active Staff</div>
              <div className="text-slate-900 text-[28px] font-light tracking-tight">4</div>
            </div>
          </div>
        </div>

        {/* Vertical Action Modules */}
        <div>
          <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-4">Configuration</h3>
          
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-sm">
            {/* Outlets Module */}
            <button 
              onClick={() => setActiveView('outlets')}
              className="w-full p-4 flex gap-4 items-center group hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                <Store className="text-slate-700" size={22} />
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-semibold text-slate-900 leading-tight mb-0.5">Outlets & Locations</h4>
                <p className="text-[13px] text-slate-500 leading-snug">Manage branches & operating hours</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-slate-600 transition-colors" size={20} />
            </button>

            {/* Staff Module */}
            <button 
              onClick={() => setActiveView('staff')}
              className="w-full p-4 flex gap-4 items-center group hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                <Users className="text-slate-700" size={22} />
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-semibold text-slate-900 leading-tight mb-0.5">Staff & Permissions</h4>
                <p className="text-[13px] text-slate-500 leading-snug">Add team members and roles</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-slate-600 transition-colors" size={20} />
            </button>
            
            {/* Billing Details Module */}
            <button 
              onClick={() => setActiveView('billing')}
              className="w-full p-4 flex gap-4 items-center group hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                <Receipt className="text-slate-700" size={22} />
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-semibold text-slate-900 leading-tight mb-0.5">Billing Details</h4>
                <p className="text-[13px] text-slate-500 leading-snug">Update restaurant info on receipts</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-slate-600 transition-colors" size={20} />
            </button>

            {/* Custom Charges Module */}
            <button 
              onClick={() => setActiveView('customCharges')}
              className="w-full p-4 flex gap-4 items-center group hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                <Banknote className="text-slate-700" size={22} />
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-semibold text-slate-900 leading-tight mb-0.5">Custom Charges</h4>
                <p className="text-[13px] text-slate-500 leading-snug">Configure extra service fees</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-slate-600 transition-colors" size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
