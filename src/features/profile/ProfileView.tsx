import React, { useRef, useState, useEffect } from 'react';
import { 
  User, MapPin, 
  ChevronRight, Camera,
  RotateCcw, Phone, FileText,
  ChevronLeft,
  Cake,
  LogOut,
  Headphones,
  Trash2,
  X,
  Mail,
  Clock,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Order, Review } from '@/types';
import { updateUserProfile, requestAccountDeletionApi, getPastOrders } from '@/api/user/index';
import { OrderCard } from '@/features/profile/components/OrderCard';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfileImage: (image: string) => void;
  onUpdateProfile?: (profile: UserProfile) => void;
  onEditProfileClick: () => void;
  onLogout: () => void;
  onHelpClick: () => void;
  onNotificationsClick: () => void;
  onRefundsClick: () => void;
  onPoliciesClick: () => void;
  onPrivacyClick: () => void;
  onLicensesClick: () => void;
  onGstClick: () => void;
  onAccessibilityClick: () => void;
  onAddressBookClick: () => void;
  onManageMembershipClick: () => void;
  onFeedbackClick: () => void;
  onBack: () => void;
  reviews: Record<string, Review>;
  onRateClick: (order: Order) => void;
  onReorderClick: (order: Order) => void;
  onViewDetailsClick: (order: Order) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfileImage,
  onUpdateProfile,
  onLogout,
  onHelpClick: _onHelpClick,
  onRefundsClick,
  onPoliciesClick,
  onPrivacyClick,
  onAddressBookClick,
  onBack,
  reviews,
  onRateClick,
  onReorderClick,
  onViewDetailsClick
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomSheetFileInputRef = useRef<HTMLInputElement>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(userProfile);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showDeletionScheduledModal, setShowDeletionScheduledModal] = useState(false);

  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const observerTargetRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const fetchOrders = async (currentCursor?: string) => {
    if (isFetchingRef.current || !hasMoreRef.current) return;
    isFetchingRef.current = true;
    setIsLoadingOrders(true);

    try {
      const res = await getPastOrders(5, currentCursor);
      if (res && Array.isArray(res.orders)) {
        setPastOrders(prev => currentCursor ? [...prev, ...res.orders] : res.orders);
        setCursor(res.nextCursor);
        const more = Boolean(res.hasMore && res.nextCursor);
        setHasMore(more);
        hasMoreRef.current = more;
      } else {
        setHasMore(false);
        hasMoreRef.current = false;
      }
    } catch (err) {
      console.error("Failed to load past orders:", err);
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      setIsLoadingOrders(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingRef.current && hasMoreRef.current) {
          fetchOrders(cursor);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => {
      observer.unobserve(target);
    };
  }, [cursor, hasMore]);

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


  const saveProfile = async () => {
    try {
      await updateUserProfile(editForm);
      if (onUpdateProfile) {
        onUpdateProfile(editForm);
      }
      setIsEditOpen(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update profile");
    }
  };

  const handleOpenEdit = () => {
    setEditForm(userProfile); // refresh from current state
    setIsEditOpen(true);
  };

  return (
    <div className="bg-white min-h-screen animate-fadeInUp pb-12 font-sans relative">
       {/* App Bar */}
       <div className="bg-white px-4 pt-safe-3 pb-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 bg-white rounded-full active:scale-95 transition-transform">
              <ChevronLeft className="w-6 h-6 text-slate-800" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">Account</h1>
          </div>
          <button onClick={onLogout} className="text-red-500 flex items-center gap-1.5 p-2 pr-0 font-semibold text-sm active:opacity-70 transition-opacity">
            <LogOut className="w-4 h-4" strokeWidth={2.5} />
            Logout
          </button>
       </div>
       
       <div className="px-4 pt-2 pb-6 space-y-6">
           {/* Profile Header Card */}
           <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100/60 relative overflow-hidden flex items-center gap-5">
              <div 
                className="w-20 h-20 rounded-[20px] bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer shrink-0 border border-slate-100"
                onClick={() => fileInputRef.current?.click()}
              >
                {userProfile.image ? (
                    <img loading="lazy" src={userProfile.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'} alt="Profile" className="w-full h-full object-cover" />
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

           {/* Metrics List */}
           <div className="flex flex-col gap-3">
               <button onClick={onAddressBookClick} className="bg-white rounded-[24px] p-4 flex items-center justify-between border border-slate-100/60 shadow-sm active:scale-[0.98] transition-all">
                   <div className="flex items-center gap-4">
                       <div className="w-[46px] h-[46px] rounded-[16px] bg-[#00BD6F]/10 text-[#00BD6F] flex items-center justify-center shrink-0">
                           <MapPin className="w-5 h-5" strokeWidth={2.5} />
                       </div>
                       <div className="flex flex-col items-start gap-0.5">
                           <span className="text-[15px] font-bold text-slate-900">Saved Addresses</span>
                           <span className="text-[12px] font-medium text-slate-500">Manage locations</span>
                       </div>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                       <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                   </div>
               </button>
           </div>

           {/* Info & Support */}
           <div className="pt-2">
               <h3 className="text-[17px] font-bold text-slate-900 tracking-tight mb-3 px-1">Info & Support</h3>
               <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden divide-y divide-slate-100">
                   <button onClick={onPoliciesClick} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left">
                       <div className="flex items-center gap-3.5">
                           <div className="text-[#00bd6f] px-1">
                               <FileText className="w-[22px] h-[22px]" strokeWidth={1.5} />
                           </div>
                           <div className="flex flex-col gap-0.5">
                               <span className="text-[15px] font-semibold text-slate-900">Terms and Conditions</span>
                               <span className="text-[12px] text-slate-500">Rules and guidelines for using our app</span>
                           </div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-300" strokeWidth={2} />
                   </button>
                   <button onClick={onPrivacyClick} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left">
                       <div className="flex items-center gap-3.5">
                           <div className="text-[#00bd6f] px-1">
                               <Lock className="w-[22px] h-[22px]" strokeWidth={1.5} />
                           </div>
                           <div className="flex flex-col gap-0.5">
                               <span className="text-[15px] font-semibold text-slate-900">Privacy Policy</span>
                               <span className="text-[12px] text-slate-500">Learn how we protect your privacy</span>
                           </div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-300" strokeWidth={2} />
                   </button>
                   <button onClick={onRefundsClick} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left">
                       <div className="flex items-center gap-3.5">
                           <div className="text-[#00bd6f] px-1">
                               <RotateCcw className="w-[22px] h-[22px]" strokeWidth={1.5} />
                           </div>
                           <div className="flex flex-col gap-0.5">
                               <span className="text-[15px] font-semibold text-slate-900">Refund Policy</span>
                               <span className="text-[12px] text-slate-500">Our cancellation and refund policies</span>
                           </div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-300" strokeWidth={2} />
                   </button>
                    <a href="mailto:support@crevings.com" className="w-full flex items-center justify-between p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left">
                        <div className="flex items-center gap-3.5">
                            <div className="text-[#00bd6f] px-1">
                                <Headphones className="w-[22px] h-[22px]" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[15px] font-semibold text-slate-900">Support</span>
                                <span className="text-[12px] text-slate-500">Get help with your orders and account</span>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300" strokeWidth={2} />
                    </a>
               </div>
           </div>

           {/* Account & Details */}
           <div className="pt-2">
               <h3 className="text-[17px] font-bold text-slate-900 tracking-tight mb-3 px-1">Account & Details</h3>
               <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden divide-y divide-slate-100">
                   <button onClick={() => setShowDeleteAccount(true)} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left">
                       <div className="flex items-center gap-3.5">
                           <div className="text-[#00bd6f] px-1">
                               <Trash2 className="w-[22px] h-[22px]" strokeWidth={1.5} />
                           </div>
                           <div className="flex flex-col gap-0.5">
                               <span className="text-[15px] font-semibold text-slate-900">Request Account Deletion</span>
                               <span className="text-[12px] text-slate-500">Permanently delete your account and data</span>
                           </div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-300" strokeWidth={2} />
                   </button>
                </div>
            </div>

            {/* Past Orders Section */}
            {pastOrders.length > 0 ? (
              <div className="pt-2">
                  <h3 className="text-[17px] font-bold text-slate-900 tracking-tight mb-3 px-1">Past Orders</h3>
                  <div className="space-y-4">
                      {pastOrders.map(order => (
                          <OrderCard 
                              key={order.id} 
                              order={order} 
                              review={reviews[order.id]}
                              onRateClick={onRateClick}
                              onReorderClick={onReorderClick}
                              onViewDetailsClick={onViewDetailsClick}
                          />
                      ))}
                  </div>
              </div>
            ) : (
              !isLoadingOrders && (
                <div className="pt-6 flex flex-col items-center justify-center text-center px-4 animate-fadeIn">
                    <img loading="lazy" src="/zero_orders.svg" alt="No orders yet" className="w-48 h-48 mb-2" />
                    <h3 className="text-base font-bold text-slate-800">No Orders Placed Yet</h3>
                    <p className="text-xs text-slate-500 max-w-[260px] mt-1">
                        Your past orders will appear here once you place them.
                    </p>
                </div>
              )
            )}

           {/* Infinite Scroll Loader Target */}
           {hasMore && (
             <div ref={observerTargetRef} className="flex justify-center py-4">
               <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
             </div>
           )}

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
               className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 w-full"
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
                                 <img loading="lazy" src={editForm.image} alt="Profile" className="w-full h-full object-cover" />
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
               className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm"
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
                 <p className="text-[14px] font-medium text-slate-500 text-center mb-6 px-2 leading-relaxed">
                   Initiating deletion will schedule your account for permanent deletion in <strong className="text-slate-800">48 hours</strong>.
                   <br /><br />
                   Logging back into your account within the 48-hour period will automatically cancel the deletion request and retain your account.
                 </p>
                 
                 <div className="w-full flex gap-3 pb-4">
                   <button 
                     onClick={() => setShowDeleteAccount(false)}
                     className="flex-1 bg-slate-100 text-slate-700 font-bold py-4 rounded-[16px] active:scale-95 transition-all text-[15px]"
                   >
                     Cancel
                   </button>
                   <button 
                      onClick={async () => {
                        try {
                          await requestAccountDeletionApi();
                          setShowDeleteAccount(false);
                          setShowDeletionScheduledModal(true);
                        } catch (err) {
                          alert(err instanceof Error ? err.message : "Failed to schedule account deletion");
                        }
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

       {/* Custom Account Deletion Scheduled Modal */}
       <AnimatePresence>
         {showDeletionScheduledModal && (
           <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-slate-900/60 z-[110] backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
               className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-[32px] z-[120] p-6 max-w-sm mx-auto shadow-2xl flex flex-col items-center text-center border border-slate-100"
             >
               <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4 border border-amber-100/60 shadow-sm">
                 <Clock className="w-8 h-8" strokeWidth={2.2} />
               </div>
               
               <h3 className="text-xl font-bold text-slate-900 mb-2">Account Deletion Scheduled</h3>
               <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
                 Your account is scheduled for permanent deletion in <strong className="text-slate-800">48 hours</strong>.
                 <br /><br />
                 If you change your mind, simply log back into your account within 48 hours to retain it.
               </p>

               <button
                 onClick={() => {
                   setShowDeletionScheduledModal(false);
                   onLogout();
                 }}
                 className="w-full py-4 bg-slate-900 text-white font-bold rounded-[16px] text-[15px] shadow-lg shadow-slate-900/20 active:scale-95 transition-transform"
               >
                 Understood, Log Out
               </button>
             </motion.div>
           </>
         )}
       </AnimatePresence>
    </div>
  );
};