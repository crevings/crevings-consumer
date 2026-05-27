import React, { useRef } from 'react';
import { 
  User, MapPin, CreditCard, Heart, Settings, 
  HelpCircle, ChevronRight, Edit2, Camera,
  ShoppingBag, Crown, EyeOff,
  RotateCcw, Gift, Phone, FileText, Scale, Building2, Accessibility,
  ArrowLeft,
  Cake,
  Star,
  Zap,
  CheckCircle2,
  Info,
  MessageSquareHeart,
  LogOut
} from 'lucide-react';
import { UserProfile } from "@/types";

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfileImage: (image: string) => void;
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
  onManageMembershipClick: () => void;
  onAboutClick: () => void;
  onFeedbackClick: () => void;
  onBack: () => void;
  onAddressBookClick: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
    userProfile,
    onUpdateProfileImage,
    onEditProfileClick,
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
    onManageMembershipClick,
    onAboutClick,
    onFeedbackClick,
    onBack,
    onAddressBookClick
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { 
      group: 'Food & Preferences',
      items: [
        { 
            icon: ShoppingBag, 
            label: 'Your Orders', 
            sub: 'Track, view & reorder', 
            onClick: onOrdersClick,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        },
        { 
             icon: Heart, 
             label: 'Favorites', 
             sub: 'Your loved restaurants',
             onClick: () => {
                window.dispatchEvent(new CustomEvent('navigate', { detail: 'favourites' }));
             },
             color: 'text-rose-600',
             bg: 'bg-rose-50'
         },
        { 
            icon: EyeOff, 
            label: 'Hidden Restaurants', 
            sub: 'Manage blocked places',
            onClick: () => {
                window.dispatchEvent(new CustomEvent('navigate', { detail: 'hidden-restaurants' }));
            },
            color: 'text-slate-600',
            bg: 'bg-slate-50'
        },
      ]
    },
    {
      group: 'Payments & Refunds',
      items: [
        { 
            icon: CreditCard, 
            label: 'Money & Payments', 
            sub: 'Wallet balance: ₹320.00', 
            onClick: onWalletClick,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        { 
            icon: RotateCcw, 
            label: 'Refunds', 
            sub: 'Track active refunds',
            onClick: onRefundsClick,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        { 
            icon: MapPin, 
            label: 'Address Book', 
            sub: 'Manage delivery addresses',
            onClick: onAddressBookClick,
            color: 'text-teal-600',
            bg: 'bg-teal-50'
        },
      ]
    },
    {
        group: 'App Settings',
        items: [
            { 
                icon: Settings, 
                label: 'Settings', 
                sub: 'App preferences',
                onClick: onSettingsClick,
                color: 'text-slate-600',
                bg: 'bg-slate-50'
            },
            { 
                icon: HelpCircle, 
                label: 'Help & Support', 
                sub: 'FAQs & Chat',
                onClick: onHelpClick,
                color: 'text-cyan-600',
                bg: 'bg-cyan-50'
            },
            { 
                icon: Scale, 
                label: 'Licence', 
                sub: 'Legal information',
                onClick: onLicensesClick,
                color: 'text-gray-600',
                bg: 'bg-gray-50'
            },
        ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 animate-fadeInUp">
       <div className="bg-white pt-12 pb-8 px-5 rounded-b-[32px] border-b border-slate-100 relative">
          <button 
            onClick={onBack}
            className="absolute top-6 left-5 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-900 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={onEditProfileClick}
            className="absolute top-6 right-5 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-900 active:scale-95 transition-all"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center mt-4">
              <div 
                className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer mb-4"
                onClick={() => fileInputRef.current?.click()}
              >
                {userProfile.image ? (
                    <img src={userProfile.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <User className="w-12 h-12 text-slate-400" />
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
              <h2 className="text-2xl font-black text-slate-900 mb-1">
                  {userProfile.name}
              </h2>
              <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4" />
                      <span>{userProfile.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                      <Cake className="w-4 h-4" />
                      <span>{userProfile.dob ? new Date(userProfile.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '15 Sep 1999'}</span>
                  </div>
              </div>
          </div>
       </div>

       <div className="px-5 mt-6 space-y-6">
           <div onClick={onReferClick} className="bg-[#00bd6f] rounded-[24px] p-5 flex items-center justify-between cursor-pointer active:scale-95 transition-transform text-white">
                <div>
                    <div className="inline-block bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2">
                        Invite Friends
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-1">Get ₹500 Free</h3>
                    <p className="text-green-50 text-xs font-medium">When your friend orders first time.</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                </div>
           </div>

           {menuItems.map((group, groupIndex) => (
               <div key={groupIndex} className="bg-white rounded-[24px] border border-slate-100 overflow-hidden">
                   <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                       <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{group.group}</h3>
                   </div>
                   <div className="divide-y divide-slate-100">
                       {group.items.map((item, itemIndex) => (
                           <button 
                              key={itemIndex}
                              onClick={item.onClick}
                              className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left"
                           >
                               <div className={`w-10 h-10 rounded-full ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                                   <item.icon className="w-5 h-5" />
                               </div>
                               <div className="flex-1">
                                   <h4 className="text-sm font-bold text-slate-900">{item.label}</h4>
                                   {item.sub && <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>}
                               </div>
                               <ChevronRight className="w-5 h-5 text-slate-300" />
                           </button>
                       ))}
                   </div>
               </div>
           ))}
           
           <button 
               onClick={onLogout}
               className="w-full flex items-center justify-center gap-2 p-4 bg-white text-red-600 rounded-[24px] border border-red-100 font-bold active:scale-95 transition-transform"
           >
               <LogOut className="w-5 h-5" />
               <span>Log Out</span>
           </button>

           <div className="text-center pt-4 pb-8">
               <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4"></div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Crevings App v2.5.0</p>
           </div>
       </div>
    </div>
  );
};