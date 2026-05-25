import React from 'react';
import { 
  ArrowLeft, 
  Check, 
  ShoppingBag, 
  Tag, 
  ChevronRight, 
  Clock,
  Package,
  BadgeCheck,
  Percent,
  Star,
  TrendingUp,
  AlertCircle,
  Wallet,
  Zap
} from 'lucide-react';

interface NotificationsViewProps {
  onBack: () => void;
}

interface NotificationItem {
  id: string;
  type: 'order' | 'promo' | 'system' | 'finance' | 'performance';
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  image?: string;
  isNew?: boolean;
}

const TODAY_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 't1',
    type: 'order',
    icon: Check,
    title: 'Your order has been verified',
    description: 'We have successfully verified your order for your "Playstation 5 Pro" purchase.',
    time: '1h ago',
    isNew: true
  },
  {
    id: 't2',
    type: 'promo',
    icon: ShoppingBag,
    title: 'Summer Fashion Sale Is Here!',
    description: 'Summer fashion sale is here! Enjoy -50% OFF ALL PURCHASES!',
    time: '2h ago',
    image: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=800&auto=format&fit=crop',
    isNew: true
  },
  {
    id: 't3',
    type: 'finance',
    icon: Wallet,
    title: 'Payout Processed Successfully',
    description: 'Your weekly payout of ₹12,450.00 has been sent to your registered bank account.',
    time: '4h ago',
    isNew: false
  },
  {
    id: 't4',
    type: 'system',
    icon: AlertCircle,
    title: 'Low Stock Alert: Packaging Tape',
    description: 'You are running low on Branded Sealing Tape. Restock now to avoid disruptions.',
    time: '6h ago',
    isNew: true
  }
];

const YESTERDAY_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'y1',
    type: 'performance',
    icon: TrendingUp,
    title: 'Weekly Performance Milestone',
    description: 'Great job! Your outlet achieved a 15% increase in repeat customers this week.',
    time: 'Yesterday',
    isNew: false
  },
  {
    id: 'y2',
    type: 'system',
    icon: Star,
    title: 'New 5-Star Review Received',
    description: '"The food was exceptional and the packaging was top-notch. Highly recommended!"',
    time: 'Yesterday',
    isNew: false
  },
  {
    id: 'y3',
    type: 'promo',
    icon: Tag,
    title: 'Campaign Ended: Early Bird',
    description: 'Your "Early Bird 20" campaign has concluded with 84 redemptions.',
    time: 'Yesterday',
    isNew: false
  },
  {
    id: 'y4',
    type: 'system',
    icon: BadgeCheck,
    title: 'New Feature: AI Insights',
    description: 'Check out our new AI-powered business insights to help you grow your restaurant.',
    time: 'Yesterday',
    isNew: false
  }
];

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onBack }) => {
  const renderNotification = (notif: NotificationItem) => (
    <div 
      key={notif.id}
      className={`relative bg-[#FFFFFF] rounded-[24px] p-4 border border-slate-100 transition-all active:scale-[0.99] ${notif.isNew ? 'ring-1 ring-slate-100/50 shadow-sm' : ''}`}
    >
      <div className="flex gap-3.5">
        {/* Icon Container */}
        <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 border border-slate-100/50 ${
          notif.type === 'promo' ? 'bg-indigo-50 text-indigo-500' : 
          notif.type === 'finance' ? 'bg-emerald-50 text-emerald-500' :
          notif.type === 'order' ? 'bg-blue-50 text-blue-500' :
          'bg-slate-50 text-slate-600'
        }`}>
          <notif.icon size={18} />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-0.5">
            <h3 className="text-[13px] font-bold text-slate-900 leading-snug pr-2">
              {notif.title}
            </h3>
            <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap pt-0.5 uppercase tracking-tighter">
              {notif.time}
            </span>
          </div>
          <p className="text-[12px] font-medium text-slate-500 leading-relaxed mb-2.5">
            {notif.description}
          </p>

          {/* Optional Image */}
          {notif.image && (
            <div className="rounded-[18px] overflow-hidden aspect-[16/8] w-full border border-slate-100 mb-1">
              <img 
                src={notif.image} 
                alt="Notification detail" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {notif.isNew && (
            <div className="absolute top-4 right-4 flex items-center">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF] animate-in slide-in-from-right duration-300 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF] px-4 py-4 border-b border-slate-50 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90 transition-all border border-slate-100"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-base font-bold text-slate-900 tracking-tight">Notifications</h1>
        <div className="w-9"></div>
      </header>

      {/* Content */}
      <div className="px-4 py-5 space-y-8">
        {/* Today Section */}
        <div>
          <div className="flex items-center justify-between mb-3 ml-1">
            <h2 className="text-[15px] font-bold text-slate-900">Today</h2>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{TODAY_NOTIFICATIONS.filter(n => n.isNew).length} NEW</span>
          </div>
          <div className="space-y-2.5">
            {TODAY_NOTIFICATIONS.map(renderNotification)}
          </div>
        </div>

        {/* Yesterday Section */}
        <div>
          <h2 className="text-[15px] font-bold text-slate-900 mb-3 ml-1">Yesterday</h2>
          <div className="space-y-2.5">
            {YESTERDAY_NOTIFICATIONS.map(renderNotification)}
          </div>
        </div>
      </div>

      <footer className="text-center py-6 opacity-20">
         <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">Crevings Platform Hub</p>
      </footer>
    </div>
  );
};