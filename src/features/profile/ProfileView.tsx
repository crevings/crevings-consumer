import React, { useRef, useState } from 'react';
import { 
  User, MapPin, Heart, Settings, 
  ChevronRight, Camera,
  ShoppingBag, EyeOff, Wallet,
  RotateCcw, Gift, Phone, FileText,
  ChevronLeft,
  Cake,
  LogOut,
  Headphones,
  Trash2,
  X,
  Mail,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '@/types';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfileImage: (image: string) => void;
  onUpdateProfile?: (profile: UserProfile) => void;
  onEditProfileClick: () => void;
  onWalletClick: () => void;
  onOrdersClick: () => void;
  onLogout: () => void;
  onSettingsClick: () => void;
  onHelpClick: () => void;
  onNotificationsClick: () => void;
  onRefundsClick: () => void;
  onReferClick: () => void;
  onPoliciesClick: () => void;
  onLicensesClick: () => void;
  onGstClick: () => void;
  onAccessibilityClick: () => void;
  onAddressBookClick: () => void;
  onManageMembershipClick: () => void;
  onAboutClick: () => void;
  onFeedbackClick: () => void;
  onBack: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfileImage,
  onUpdateProfile,
  onEditProfileClick, // keeping this just in case, though we handle it internally now
  onWalletClick,
  onOrdersClick,
  onLogout,
  onSettingsClick,
  onHelpClick,
  onNotificationsClick,
  onRefundsClick,
  onReferClick,
  onPoliciesClick,
  onLicensesClick,
  onGstClick,
  onAccessibilityClick,
  onAddressBookClick,
  onManageMembershipClick,
  onAboutClick,
  onFeedbackClick,
  onBack
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomSheetFileInputRef = useRef<HTMLInputElement>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(userProfile);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfileImage(reader.result as string);
        setEditForm(prev => ({...prev, image: reader.result as string}));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBottomSheetImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({...prev, image: reader.result as string}));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNavigate = (view: string) => {
    navigate(`/${view}`);
  };

  const saveProfile = () => {
    if (onUpdateProfile) {
      onUpdateProfile(editForm);
    }
    setIsEditOpen(false);
  };

  const handleOpenEdit = () => {
    setEditForm(userProfile); // refresh from current state
    setIsEditOpen(true);
  };

  return (
    <div className="bg-white min-h-screen animate-fadeInUp pb-12 font-sans relative">
       {/* App Bar */}
       <div className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-40 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 bg-white rounded-full active:scale-95 transition-transform">
              <ChevronLeft className="w-6 h-6 text-slate-800" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">Account</h1>
          </div>
       </div>
       
       <div className="px-4 pt-2 pb-6 space-y-6">
           {/* Profile Header Card */}
           <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100/60 relative overflow-hidden flex items-center gap-5">
              <div 
                className="w-20 h-20 rounded-[20px] bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer shrink-0 border border-slate-100"
                onClick={() => fileInputRef.current?.click()}
              >
                {userProfile.image ? (
                    <img src={userProfile.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <User className="w-8 h-8 text-slate-400 flex-shrink-0" strokeWidth={2} />
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
              <div className="flex flex-col flex-1">
                  <h2 className="text-[20px] font-bold text-slate-900 tracking-tight leading-tight mb-1">
                      {userProfile.name}
                  </h2>
                  <p className="text-slate-500 text-[14px] font-medium mb-3 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {userProfile.phone}
                  </p>
                  <button 
                    onClick={handleOpenEdit}
                    className="flex items-center gap-1.5 text-[#00bd6f] text-[14px] font-bold active:opacity-70 transition-opacity w-fit bg-emerald-50 px-3 py-1.5 rounded-lg"
                  >
                      Edit Profile <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
              </div>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-3 gap-3">
               <button onClick={onOrdersClick} className="bg-white rounded-[20px] p-4 flex flex-col items-center justify-center gap-3 border border-slate-100/60 active:scale-[0.97] transition-all group">
                   <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-700 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                       <ShoppingBag className="w-5 h-5" strokeWidth={2} />
                   </div>
                   <span className="text-[13px] font-bold text-slate-700 text-center leading-tight">Your<br/>Orders</span>
               </button>
               
               <button onClick={onWalletClick} className="bg-white rounded-[20px] p-4 flex flex-col items-center justify-center gap-3 border border-slate-100/60 active:scale-[0.97] transition-all group">
                   <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-700 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                       <Wallet className="w-5 h-5" strokeWidth={2} />
                   </div>
                   <span className="text-[13px] font-bold text-slate-700 text-center leading-tight">Wallet<br/>Balance</span>
               </button>
               
               <button onClick={onAddressBookClick} className="bg-white rounded-[20px] p-4 flex flex-col items-center justify-center gap-3 border border-slate-100/60 active:scale-[0.97] transition-all group">
                   <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-700 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                       <MapPin className="w-5 h-5" strokeWidth={2} />
                   </div>
                   <span className="text-[13px] font-bold text-slate-700 text-center leading-tight">Saved<br/>Address</span>
               </button>
           </div>

           {/* Refer & earn (temporarily disabled) */}
           {/* <button onClick={onReferClick} className="w-full bg-[#E8F8F5] rounded-[24px] p-5 flex items-center justify-between border border-[#A3E4D7]/50 active:scale-[0.98] transition-all">
               <div className="flex items-center gap-4">
                   <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm text-[#00bd6f] shrink-0">
                       <Gift className="w-5 h-5" strokeWidth={2.5} />
                   </div>
                   <div className="flex flex-col items-start gap-0.5">
                       <span className="text-[16px] font-bold text-[#0E6655] tracking-tight">Refer & Earn</span>
                       <span className="text-[13px] font-medium text-[#117A65]">Invite friends & get rewards</span>
                   </div>
               </div>
               <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#117A65]">
                   <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
               </div>
           </button> */}

           {/* Personalize */}
           <div className="bg-white rounded-[24px] border border-slate-100/60 overflow-hidden">
               <div className="px-5 pt-5 pb-2">
                   <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">Personalize</h3>
               </div>
               <div className="divide-y divide-slate-50">
                   <button onClick={() => handleNavigate('favourites')} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                       <div className="flex items-center gap-4">
                           <div className="text-[#00bd6f] bg-[#00bd6f]/10 p-2.5 rounded-[12px]">
                               <Heart className="w-5 h-5" strokeWidth={2} />
                           </div>
                           <span className="text-[15px] font-semibold text-slate-700">Saved Restaurants</span>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-300" />
                   </button>
                   <button onClick={() => handleNavigate('hidden-restaurants')} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                       <div className="flex items-center gap-4">
                           <div className="text-[#00bd6f] bg-[#00bd6f]/10 p-2.5 rounded-[12px]">
                               <EyeOff className="w-5 h-5" strokeWidth={2} />
                           </div>
                           <span className="text-[15px] font-semibold text-slate-700">Hide Restaurants</span>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-300" />
                   </button>
               </div>
           </div>

           {/* Info & Support */}
           <div className="bg-white rounded-[24px] border border-slate-100/60 overflow-hidden">
               <div className="px-5 pt-5 pb-2">
                   <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">Info & Support</h3>
               </div>
               <div className="divide-y divide-slate-50">
                   <button onClick={onAboutClick} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                       <div className="flex items-center gap-4">
                           <div className="text-[#00bd6f] bg-[#00bd6f]/10 p-2.5 rounded-[12px]">
                               <Info className="w-5 h-5" strokeWidth={2} />
                           </div>
                           <span className="text-[15px] font-semibold text-slate-700">About Us</span>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-300" />
                   </button>
                   <button onClick={onPoliciesClick} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                       <div className="flex items-center gap-4">
                           <div className="text-[#00bd6f] bg-[#00bd6f]/10 p-2.5 rounded-[12px]">
                               <FileText className="w-5 h-5" strokeWidth={2} />
                           </div>
                           <span className="text-[15px] font-semibold text-slate-700">Terms and Conditions</span>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-300" />
                   </button>
                   <button onClick={onHelpClick} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                       <div className="flex items-center gap-4">
                           <div className="text-[#00bd6f] bg-[#00bd6f]/10 p-2.5 rounded-[12px]">
                               <Headphones className="w-5 h-5" strokeWidth={2} />
                           </div>
                           <span className="text-[15px] font-semibold text-slate-700">Support</span>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-300" />
                   </button>
                   <button onClick={onRefundsClick} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                       <div className="flex items-center gap-4">
                           <div className="text-[#00bd6f] bg-[#00bd6f]/10 p-2.5 rounded-[12px]">
                               <RotateCcw className="w-5 h-5" strokeWidth={2} />
                           </div>
                           <span className="text-[15px] font-semibold text-slate-700">Refund Policy</span>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-300" />
                   </button>
               </div>
           </div>

           {/* Account Settings */}
           <div className="bg-white rounded-[24px] border border-slate-100/60 overflow-hidden">
               <div className="px-5 pt-5 pb-2">
                   <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">Account</h3>
               </div>
               <div className="divide-y divide-slate-50">
                   <button onClick={onSettingsClick} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                       <div className="flex items-center gap-4">
                           <div className="text-[#00bd6f] bg-[#00bd6f]/10 p-2.5 rounded-[12px]">
                               <Settings className="w-5 h-5" strokeWidth={2} />
                           </div>
                           <span className="text-[15px] font-semibold text-slate-700">Settings</span>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-300" />
                   </button>
                   <button onClick={() => setShowDeleteAccount(true)} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                       <div className="flex items-center gap-4">
                           <div className="text-red-600 bg-red-50 p-2.5 rounded-[12px]">
                               <Trash2 className="w-5 h-5" strokeWidth={2} />
                           </div>
                           <span className="text-[15px] font-semibold text-slate-700">Request Account Deletion</span>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-300" />
                   </button>
                   <button onClick={onLogout} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                       <div className="flex items-center gap-4">
                           <div className="text-red-400">
                               <LogOut className="w-5 h-5" strokeWidth={2} />
                           </div>
                           <span className="text-[15px] font-semibold text-red-600">Log Out</span>
                       </div>
                   </button>
               </div>
           </div>

           {/* Version Footer */}
           <div className="text-center pt-4 pb-8 opacity-60">
               <p className="text-[11px] font-bold text-slate-400 tracking-wider">VERSION 2.0.1</p>
           </div>
       </div>

       {/* Edit Profile Bottom Sheet */}
       <AnimatePresence>
         {isEditOpen && (
           <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in duration-200"
               onClick={() => setIsEditOpen(false)}
             />
             <motion.div
               initial={{ y: "100%" }}
               animate={{ y: 0 }}
               exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-50 h-[85vh] flex flex-col overflow-hidden shadow-2xl w-full max-w-md mx-auto"
             >
               {/* Sheet Handle */}
               <div className="flex justify-center pt-3 pb-1 shrink-0 bg-white z-10 w-full relative">
                 <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                 <button 
                   onClick={() => setIsEditOpen(false)}
                   className="absolute right-4 top-3 p-2 bg-slate-50 rounded-full text-slate-500 active:scale-95 transition-transform"
                 >
                   <X className="w-5 h-5" />
                 </button>
               </div>
               
               {/* Sheet Header */}
               <div className="px-6 py-2 pb-4 bg-white z-10 shrink-0 border-b border-slate-100">
                 <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
                 <p className="text-[13px] text-slate-500 mt-1 placeholder-text">Add your birthday for exclusive discounts!</p>
               </div>

               {/* Sheet scrollable content */}
               <div className="p-6 flex-1 overflow-y-auto">
                 <div className="flex flex-col items-center mb-8">
                     <div className="relative group">
                         <div className="w-24 h-24 rounded-[24px] overflow-hidden flex items-center justify-center bg-slate-100 border-2 border-slate-100 shadow-sm">
                             {editForm.image ? (
                                 <img src={editForm.image} alt="Profile" className="w-full h-full object-cover" />
                             ) : (
                                 <User className="w-10 h-10 text-slate-400" />
                             )}
                         </div>
                         <button 
                             onClick={() => bottomSheetFileInputRef.current?.click()}
                             className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-[#00bd6f] border border-slate-100 active:scale-95 transition-transform"
                         >
                             <Camera className="w-5 h-5" />
                         </button>
                         <input type="file" ref={bottomSheetFileInputRef} onChange={handleBottomSheetImageUpload} className="hidden" accept="image/*" />
                     </div>
                 </div>

                 <div className="space-y-5">
                   <div className="space-y-1.5">
                       <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider pl-1">Full Name</label>
                       <div className="flex items-center gap-3 bg-slate-50 rounded-[16px] px-4 py-3.5 border border-slate-100 focus-within:border-[#00bd6f] focus-within:bg-white transition-colors">
                           <User className="w-5 h-5 text-slate-400" />
                           <input 
                               type="text"
                               value={editForm.name}
                               onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                               placeholder="Your name"
                               className="bg-transparent w-full text-[15px] font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
                           />
                       </div>
                   </div>

                   <div className="space-y-1.5">
                       <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider pl-1">Phone Number</label>
                       <div className="flex items-center gap-3 bg-slate-50 rounded-[16px] px-4 py-3.5 border border-slate-100 focus-within:border-[#00bd6f] focus-within:bg-white transition-colors">
                           <Phone className="w-5 h-5 text-slate-400" />
                           <input 
                               type="tel"
                               value={editForm.phone}
                               onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                               placeholder="+91 9876543210"
                               className="bg-transparent w-full text-[15px] font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
                           />
                       </div>
                   </div>
                   
                   <div className="space-y-1.5">
                       <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider pl-1">Email Address</label>
                       <div className="flex items-center gap-3 bg-slate-50 rounded-[16px] px-4 py-3.5 border border-slate-100 focus-within:border-[#00bd6f] focus-within:bg-white transition-colors">
                           <Mail className="w-5 h-5 text-slate-400" />
                           <input 
                               type="email"
                               value={editForm.email}
                               onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                               placeholder="your@email.com"
                               className="bg-transparent w-full text-[15px] font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
                           />
                       </div>
                   </div>

                   <div className="space-y-1.5">
                       <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider pl-1 flex items-center justify-between">
                         <span>Birthday</span>
                         <span className="text-[#00bd6f] text-[10px] bg-[#00bd6f]/10 px-2 rounded-full py-0.5">For discounts</span>
                       </label>
                       <div className="flex items-center gap-3 bg-slate-50 rounded-[16px] px-4 py-3.5 border border-slate-100 focus-within:border-[#00bd6f] focus-within:bg-white transition-colors">
                           <Cake className="w-5 h-5 text-slate-400" />
                           <input 
                               type="date"
                               value={editForm.dob || ''}
                               onChange={(e) => setEditForm({...editForm, dob: e.target.value})}
                               className="bg-transparent w-full text-[15px] font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
                           />
                       </div>
                   </div>
                   
                   <div className="pb-10"></div>
                 </div>
               </div>
               
               {/* Fixed bottom save button */}
               <div className="p-4 bg-white border-t border-slate-100 shrink-0 mb-4 pb-8 sm:pb-4">
                 <button 
                   onClick={saveProfile}
                   className="w-full bg-[#00bd6f] text-white font-bold py-4 rounded-[16px] active:scale-[0.98] transition-transform text-[15px] shadow-lg shadow-[#00bd6f]/20"
                 >
                   Save Profile
                 </button>
               </div>
             </motion.div>
           </>
         )}
       </AnimatePresence>
       
       {/* Account Deletion Bottom Sheet */}
       <AnimatePresence>
         {showDeleteAccount && (
           <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowDeleteAccount(false)}
               className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm animate-in fade-in duration-200"
             />
             <motion.div 
               initial={{ y: '100%' }}
               animate={{ y: 0 }}
               exit={{ y: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
               className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[100] pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.12)] w-full max-w-md mx-auto"
             >
               <div className="flex flex-col items-center pt-3 pb-6 px-6">
                 <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-8"></div>
                 
                 <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 shrink-0 border border-red-100">
                   <Trash2 className="w-8 h-8" strokeWidth={2} />
                 </div>
                 
                 <h3 className="text-[20px] font-black text-slate-900 tracking-tight text-center mb-3">
                   Request Account Deletion
                 </h3>
                 <p className="text-[15px] font-medium text-slate-500 text-center mb-8 px-2 leading-relaxed">
                   Are you sure you want to delete your account? This action cannot be undone. You will lose access to all your saved addresses and order history.
                 </p>
                 
                 <div className="w-full flex gap-3 pb-4">
                   <button 
                     onClick={() => setShowDeleteAccount(false)}
                     className="flex-1 bg-slate-100 text-slate-700 font-bold py-4 rounded-[16px] active:scale-95 transition-all text-[15px]"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={() => {
                       setShowDeleteAccount(false);
                       // Add deletion logic here
                     }}
                     className="flex-1 bg-red-600 text-white font-bold py-4 rounded-[16px] active:scale-95 transition-all text-[15px] shadow-lg shadow-red-600/20"
                   >
                     Delete Account
                   </button>
                 </div>
               </div>
             </motion.div>
           </>
         )}
       </AnimatePresence>
    </div>
  );
};