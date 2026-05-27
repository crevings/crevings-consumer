import React, { useState } from 'react';
import { ChevronLeft, Building2, ShieldCheck, Search, Info, Scale, Fingerprint, FileText } from 'lucide-react';

interface AboutViewProps {
  onBack: () => void;
}

const GST_LIST = [
  { state: 'Andhra Pradesh', gstin: '37AAAAA0000A1Z5' },
  { state: 'Assam', gstin: '18AAAAA0000A1Z5' },
  { state: 'Bihar', gstin: '10AAAAA0000A1Z5' },
  { state: 'Chhattisgarh', gstin: '22AAAAA0000A1Z5' },
  { state: 'Delhi', gstin: '07AAAAA0000A1Z5' },
  { state: 'Goa', gstin: '30AAAAA0000A1Z5' },
  { state: 'Gujarat', gstin: '24AAAAA0000A1Z5' },
  { state: 'Haryana', gstin: '06AAAAA0000A1Z5' },
  { state: 'Himachal Pradesh', gstin: '02AAAAA0000A1Z5' },
  { state: 'Jharkhand', gstin: '20AAAAA0000A1Z5' },
  { state: 'Karnataka', gstin: '29AAAAA0000A1Z5' },
  { state: 'Kerala', gstin: '32AAAAA0000A1Z5' },
  { state: 'Madhya Pradesh', gstin: '23AAAAA0000A1Z5' },
  { state: 'Maharashtra', gstin: '27AAAAA0000A1Z5' },
  { state: 'Odisha', gstin: '21AAAAA0000A1Z5' },
  { state: 'Punjab', gstin: '03AAAAA0000A1Z5' },
  { state: 'Rajasthan', gstin: '08AAAAA0000A1Z5' },
  { state: 'Tamil Nadu', gstin: '33AAAAA0000A1Z5' },
  { state: 'Telangana', gstin: '36AAAAA0000A1Z5' },
  { state: 'Uttar Pradesh', gstin: '09AAAAA0000A1Z5' },
  { state: 'West Bengal', gstin: '19AAAAA0000A1Z5' },
];

export const AboutView: React.FC<AboutViewProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGst = GST_LIST.filter(item => 
    item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.gstin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex flex-col font-sans animate-[fadeInUp_0.3s_ease-out] select-none">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 bg-white rounded-full active:scale-95 transition-transform">
          <ChevronLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">About Platform</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        {/* Core Identity Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#00bd6f] rounded-[16px] flex items-center justify-center text-white shadow-sm">
                <span className="text-2xl font-bold italic">c.</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-none mb-1.5">Crevings App</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Version 2.5.0 Premium</p>
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-none mb-1.5">Legal Entity Name</p>
                <p className="text-sm font-medium text-slate-900">Crevings Delivery Services Private Limited</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Fingerprint className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-none mb-1.5">Trademark Information</p>
                <p className="text-sm font-medium text-slate-900 leading-relaxed">Crevings™ and the 'c.' logo are registered trademarks of Crevings Inc. in India and other territories.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-4 px-1">Certifications & Compliance</h3>
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-[16px] border border-slate-100">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#00bd6f] border border-slate-200 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-none mb-1.5">FSSAI License No.</p>
              <p className="text-base font-bold text-slate-900 tracking-tight">12345678901234</p>
            </div>
          </div>
        </div>

        {/* Searchable GST Section */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900">State-wise GST Details</h3>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text"
              placeholder="Search by state name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-[16px] py-3 pl-10 pr-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#00bd6f] focus:bg-white transition-colors placeholder:text-slate-400"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-2 pr-1">
            {filteredGst.length > 0 ? (
              filteredGst.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-[16px] border border-slate-100">
                  <span className="text-sm font-medium text-slate-900">{item.state}</span>
                  <span className="text-[11px] font-bold font-mono text-slate-500 tracking-wider uppercase">{item.gstin}</span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <Info className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="px-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
            Corporate Identification Number (CIN): U55204KA2024PTC123456<br/>
            Registered Office: Prestige Cyber Towers, Electronic City Phase 1, Bangalore, KA - 560100
          </p>
        </div>
      </div>
    </div>
  );
};