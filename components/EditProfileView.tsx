
import React, { useState, useRef } from 'react';
import { ArrowLeft, User, Mail, Phone, Calendar, Save, Camera, RotateCcw } from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileViewProps {
  initialData: UserProfile;
  onBack: () => void;
  onSave: (data: UserProfile) => void;
  onSelectRawImage: (imageUri: string) => void;
}

export const EditProfileView: React.FC<EditProfileViewProps> = ({ initialData, onBack, onSave, onSelectRawImage }) => {
  const [formData, setFormData] = useState<UserProfile>(initialData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave(formData);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onSelectRawImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 animate-[slideUp_0.3s_ease-out] flex flex-col">
      <div className="px-5 py-6 flex items-center gap-4 bg-white sticky top-0 z-10 border-b border-slate-100">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-xl text-slate-900">Edit Profile</h1>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 space-y-8">
            <div className="flex flex-col items-center">
                <div className="relative group">
                    <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center bg-slate-100">
                        {formData.image ? (
                            <img src={formData.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-12 h-12 text-slate-400" />
                        )}
                    </div>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform border-4 border-white"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" accept="image/*" />
                </div>
                <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tap camera to change photo</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-slate-300 focus-within:bg-white transition-colors">
                        <User className="w-5 h-5 text-slate-400" />
                        <input 
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="bg-transparent w-full text-sm font-bold text-slate-900 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-slate-300 focus-within:bg-white transition-colors">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <input 
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="bg-transparent w-full text-sm font-bold text-slate-900 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-slate-300 focus-within:bg-white transition-colors">
                        <Phone className="w-5 h-5 text-slate-400" />
                        <input 
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="+91 9876543210"
                            className="bg-transparent w-full text-sm font-bold text-slate-900 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Birthday</label>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-slate-300 focus-within:bg-white transition-colors">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <input 
                            type="date"
                            value={formData.dob}
                            onChange={(e) => setFormData({...formData, dob: e.target.value})}
                            className="bg-transparent w-full text-sm font-bold text-slate-900 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['Male', 'Female', 'Other'].map((g) => (
                            <button
                                key={g}
                                onClick={() => setFormData({...formData, gender: g})}
                                className={`py-3 rounded-xl text-sm font-bold transition-colors ${
                                    formData.gender === g 
                                    ? 'bg-slate-900 text-white' 
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="p-5 bg-white border-t border-slate-100 sticky bottom-0 z-10">
          <button 
            onClick={handleSave}
            className="w-full bg-[#00bd6f] text-white font-bold py-4 rounded-[20px] active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
              <Save className="w-5 h-5" />
              Save Changes
          </button>
      </div>
    </div>
  );
};
