import React, { useState } from 'react';
import { ChevronLeft, MapPin, Home, Briefcase, Map, GraduationCap, School } from 'lucide-react';
import { SavedAddress } from '@/types';

interface EditAddressViewProps {
  address: SavedAddress;
  setAddresses: React.Dispatch<React.SetStateAction<SavedAddress[]>>;
  onClose: () => void;
}

export const EditAddressView: React.FC<EditAddressViewProps> = ({ address, setAddresses, onClose }) => {
  const commaIdx = address.address.indexOf(',');
  const initialHouse = commaIdx !== -1 ? address.address.substring(0, commaIdx).trim() : address.address;
  const initialRoad = commaIdx !== -1 ? address.address.substring(commaIdx + 1).trim() : '';

  const [houseNo, setHouseNo] = useState(address.building || initialHouse);
  const [roadArea, setRoadArea] = useState(address.street || initialRoad);
  const [directions, setDirections] = useState('');
  const [saveAs, setSaveAs] = useState(address.type);

  const saveOptions = [
    { id: 'Home', icon: Home },
    { id: 'Work', icon: Briefcase },
    { id: 'Other', icon: Map },
  ];

  const handleSave = () => {
    const fullAddress = [houseNo, roadArea, directions].filter(Boolean).join(', ');
    
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === address.id
          ? {
              ...addr,
              type: saveAs,
              address: fullAddress,
              building: houseNo,
              street: roadArea,
              icon: saveAs === 'Home' ? Home : saveAs === 'Work' ? Briefcase : Map,
            }
          : addr
      )
    );
    onClose();
  };

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
            <h3 className="font-bold text-slate-900 mb-1">Current Address</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              {address.address}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">House / Flat / Block No.</label>
            <input 
              type="text" 
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Apartment / Road / Area</label>
            <input 
              type="text" 
              value={roadArea}
              onChange={(e) => setRoadArea(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Directions to reach (Optional)</label>
            <input 
              type="text" 
              value={directions}
              onChange={(e) => setDirections(e.target.value)}
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
          onClick={handleSave}
          className="w-full bg-[#00BD6F] text-white font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-all shadow-md"
        >
          Save Address
        </button>
      </div>
    </div>
  );
};
