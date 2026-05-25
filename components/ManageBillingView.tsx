import React, { useState } from 'react';
import { ArrowLeft, Receipt, CheckCircle2, Trash2, Plus, Info, Banknote } from 'lucide-react';

interface ManageBillingViewProps {
  onBack: () => void;
  viewType: 'details' | 'charges';
}

interface Charge {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: string;
  isActive: boolean;
}

export const ManageBillingView: React.FC<ManageBillingViewProps> = ({ onBack, viewType }) => {
  // Billing Details State
  const [restaurantName, setRestaurantName] = useState('Crevings Restaurant');
  const [address, setAddress] = useState('123 Food Street, Culinary District, City - 100001');
  const [phone, setPhone] = useState('+91 9876543210');
  const [gstin, setGstin] = useState('22AAAAA0000A1Z5');
  const [fssai, setFssai] = useState('10012011000001');
  const [footerMessage, setFooterMessage] = useState('Thank you for dining with us! Visit again.');

  // Custom Charges State
  const [charges, setCharges] = useState<Charge[]>([
    { id: '1', name: 'Packaging Charge', type: 'fixed', value: '20', isActive: true },
    { id: '2', name: 'Service Charge', type: 'percentage', value: '5', isActive: false },
  ]);

  const handleAddCharge = () => {
    setCharges([...charges, { id: Date.now().toString(), name: '', type: 'fixed', value: '', isActive: true }]);
  };

  const handleRemoveCharge = (id: string) => {
    setCharges(charges.filter(c => c.id !== id));
  };

  const handleUpdateCharge = (id: string, field: keyof Charge, value: any) => {
    setCharges(charges.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  return (
    <div className="flex-1 flex flex-col h-[100dvh] bg-[#FFFFFF] overflow-hidden animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-[#FFFFFF] px-4 pt-4 pb-4 border-b border-slate-100 shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-600 active:bg-slate-50 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-[20px] font-bold text-slate-900 leading-tight">
              {viewType === 'details' ? 'Billing Details' : 'Custom Charges'}
            </h1>
            <p className="text-[12px] font-medium text-slate-500">
              {viewType === 'details' ? 'Manage receipt information' : 'Configure offline order charges'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {viewType === 'details' ? (
          <div className="animate-in fade-in duration-300 space-y-5 max-w-lg mx-auto">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                <Receipt size={20} />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">Receipt Information</h3>
                <p className="text-[13px] text-slate-500">Details printed on customer bills</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700">Restaurant Name</label>
                <input 
                  type="text" 
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] transition-all"
                  placeholder="Enter restaurant name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700">Address</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] transition-all resize-none h-24"
                  placeholder="Enter complete address"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700">Phone Number</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] transition-all"
                  placeholder="Enter contact number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-700">GSTIN (Optional)</label>
                  <input 
                    type="text" 
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] transition-all uppercase"
                    placeholder="Enter GSTIN"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-700">FSSAI No. (Optional)</label>
                  <input 
                    type="text" 
                    value={fssai}
                    onChange={(e) => setFssai(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] transition-all"
                    placeholder="Enter FSSAI number"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700">Footer Message</label>
                <input 
                  type="text" 
                  value={footerMessage}
                  onChange={(e) => setFooterMessage(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] transition-all"
                  placeholder="E.g. Thank you! Visit again."
                />
              </div>
            </div>
            
            <button className="mt-8 w-full h-[52px] bg-[#1E90FF] text-white rounded-2xl font-bold text-[15px] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
              <CheckCircle2 size={18} />
              Save Details
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300 max-w-lg mx-auto">
            <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <Info size={18} className="text-purple-600 mt-0.5 shrink-0" />
              <p className="text-sm text-purple-700 font-medium leading-snug">
                These custom charges will be applied automatically to all offline orders (Dine-in & Takeaway).
              </p>
            </div>

            <div className="space-y-4">
              {charges.map((charge, index) => (
                <div key={charge.id} className="bg-white rounded-[20px] p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Banknote size={16} className="text-slate-500" />
                      </div>
                      <h3 className="font-bold text-slate-900">Charge #{index + 1}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleUpdateCharge(charge.id, 'isActive', !charge.isActive)}
                        className={`w-[36px] h-[20px] rounded-full p-[2px] transition-colors duration-300 relative shrink-0 ${charge.isActive ? 'bg-purple-600' : 'bg-slate-200'}`}
                      >
                        <div className={`w-[16px] h-[16px] bg-[#FFFFFF] rounded-full transform transition-transform duration-300 shadow-sm ${charge.isActive ? 'translate-x-[16px]' : 'translate-x-0'}`} />
                      </button>
                      <button onClick={() => handleRemoveCharge(charge.id)} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg active:scale-95 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[12px] font-bold text-slate-700 mb-1.5 block uppercase tracking-wide">Charge Name</label>
                      <input 
                        type="text" 
                        value={charge.name}
                        onChange={(e) => handleUpdateCharge(charge.id, 'name', e.target.value)}
                        placeholder="e.g. Packaging, Service Charge"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none text-[14px] bg-slate-50 font-medium transition-all"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-[12px] font-bold text-slate-700 mb-1.5 block uppercase tracking-wide">Value Type</label>
                        <select 
                          value={charge.type}
                          onChange={(e) => handleUpdateCharge(charge.id, 'type', e.target.value)}
                          className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-none text-[14px] font-medium bg-slate-50 transition-all"
                        >
                          <option value="fixed">Fixed (₹)</option>
                          <option value="percentage">Percentage (%)</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-[12px] font-bold text-slate-700 mb-1.5 block uppercase tracking-wide">Amount/Value</label>
                        <input 
                          type="number" 
                          value={charge.value}
                          onChange={(e) => handleUpdateCharge(charge.id, 'value', e.target.value)}
                          placeholder="e.g. 5"
                          className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none text-[14px] bg-slate-50 font-medium transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleAddCharge}
              className="mt-6 w-full h-[52px] rounded-2xl border-2 border-dashed border-slate-200 text-slate-600 font-bold text-[15px] flex items-center justify-center gap-2 active:bg-slate-50 hover:bg-slate-50/50 hover:border-slate-300 transition-all"
            >
              <Plus size={18} />
              Add New Charge
            </button>
            <div className="mt-8">
              <button className="w-full h-[52px] bg-purple-600 text-white rounded-2xl font-bold text-[15px] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20">
                <CheckCircle2 size={18} />
                Save Custom Charges
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

