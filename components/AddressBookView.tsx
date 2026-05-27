import React, { useState } from 'react';
import { ArrowLeft, Plus, MapPin, Home, Briefcase, Map, MoreVertical, Edit2, CheckCircle, Trash2, Search } from 'lucide-react';
import { EditAddressView } from './EditAddressView';

interface AddressBookViewProps {
  onBack: () => void;
}

export const AddressBookView: React.FC<AddressBookViewProps> = ({ onBack }) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'Home',
      icon: Home,
      address: 'House No 37-C, 2nd Floor, Janta Flats, Block A, Phase 3, Ashok Vihar, Delhi',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Work',
      icon: Briefcase,
      address: 'Tech Park, Building 4, 5th Floor, Sector 62, Noida, Uttar Pradesh',
      isDefault: false,
    },
    {
      id: '3',
      type: 'Other',
      icon: Map,
      address: '12/4, Riverside Apartments, Near Metro Station, Mayur Vihar, Delhi',
      isDefault: false,
    }
  ]);

  const toggleMenu = (id: string) => {
    if (activeMenuId === id) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(id);
    }
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
    setActiveMenuId(null);
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
    setActiveMenuId(null);
  };

  const handleEdit = (id: string) => {
    setActiveMenuId(null);
    setShowEditAddress(true);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-50 flex flex-col animate-[slideInRight_0.3s_ease-out]">
      {/* Header */}
      <div className="h-[56px] bg-white px-4 flex items-center justify-between shadow-sm shrink-0 relative z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-800 active:scale-95 transition-transform">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900 absolute left-1/2 -translate-x-1/2">Address Book</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24">
        {/* Search Bar */}
        <div className="relative mb-6 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00BD6F] transition-colors">
            <Search className="w-5 h-5 stroke-[2]" />
          </div>
          <input 
            type="text" 
            placeholder="Search saved addresses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-[15px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00BD6F]/20 focus:border-[#00BD6F] transition-all font-medium placeholder:text-slate-400 text-slate-900"
          />
        </div>

        {/* Quick Location Option */}
        <button className="w-full min-h-[64px] py-3 h-auto bg-white rounded-[16px] shadow-sm border border-slate-100 flex items-center px-4 mb-8 active:scale-[0.98] transition-transform">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0 mr-3">
            <MapPin className="w-5 h-5 text-[#00BD6F]" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-[15px] font-bold text-slate-900">Use Current Location</h3>
            <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">Detect your current delivery location automatically.</p>
          </div>
        </button>

        {/* Saved Addresses */}
        <div>
          <h2 className="text-[15px] font-bold text-slate-800 mb-4">Saved Addresses</h2>
          
          <div className="space-y-[12px]">
            {addresses
              .filter(addr => 
                addr.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
                addr.address.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((addr) => {
              const Icon = addr.icon;
              return (
                <div key={addr.id} className="bg-white rounded-[16px] shadow-sm border border-slate-100 p-4 relative flex gap-3 h-[90px]">
                  <div className="mt-0.5 shrink-0">
                    <Icon className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[15px] font-bold text-slate-900">{addr.type}</h3>
                      {addr.isDefault && (
                        <span className="bg-[#00BD6F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-slate-500 leading-snug line-clamp-2">
                      {addr.address}
                    </p>
                  </div>
                  
                  <div className="absolute top-3 right-2">
                    <button 
                      onClick={() => toggleMenu(addr.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 active:bg-slate-50 rounded-full transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {activeMenuId === addr.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                        <div className="absolute right-4 top-10 w-48 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-20 animate-[fadeIn_0.2s_ease-out]">
                          <button 
                            onClick={() => handleEdit(addr.id)}
                            className="w-full px-4 py-2.5 text-left text-[14px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                          >
                            <Edit2 className="w-4 h-4 text-slate-400" />
                            Edit Address
                          </button>
                          {!addr.isDefault && (
                            <button 
                              onClick={() => handleSetDefault(addr.id)}
                              className="w-full px-4 py-2.5 text-left text-[14px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                            >
                              <CheckCircle className="w-4 h-4 text-slate-400" />
                              Set as Default
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(addr.id)}
                            className="w-full px-4 py-2.5 text-left text-[14px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-3"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                            Delete Address
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 pb-safe">
        <button className="w-full h-[54px] bg-[#00BD6F] text-white rounded-[20px] font-bold text-[16px] shadow-[0_4px_12px_rgba(0,189,111,0.25)] active:scale-[0.98] transition-transform">
          Add New Address
        </button>
      </div>

      {showEditAddress && (
        <EditAddressView onClose={() => setShowEditAddress(false)} />
      )}
    </div>
  );
};
