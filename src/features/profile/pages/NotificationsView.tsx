
import React from 'react';
import { ArrowLeft, Check, Percent, ShoppingBag, Truck } from 'lucide-react';

interface NotificationsViewProps {
  onBack: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onBack }) => {
  const notifications = [
    {
      id: 1,
      icon: Truck,
      title: 'Order Delivered',
      body: 'Your order from Biryani Blues has been delivered. Enjoy your meal!',
      time: '2 mins ago',
      color: 'bg-blue-100 text-blue-600',
      isUnread: true
    },
    {
      id: 2,
      icon: Percent,
      title: '50% Off on Pizza',
      body: 'Lightning deal! Get flat 50% off on all pizzas from Pizza Hut. Valid for 1 hour.',
      time: '1 hour ago',
      color: 'bg-orange-100 text-orange-600',
      isUnread: true
    },
    {
      id: 3,
      icon: ShoppingBag,
      title: 'Order Confirmed',
      body: 'The restaurant has accepted your order. It is being prepared now.',
      time: '45 mins ago',
      color: 'bg-sky-100 text-blue-600',
      isUnread: false
    },
    {
      id: 4,
      icon: Check,
      title: 'Refund Processed',
      body: '₹120 has been refunded to your wallet for the missing item.',
      time: 'Yesterday',
      color: 'bg-purple-100 text-purple-600',
      isUnread: false
    }
  ];

  return (
    <div className="min-h-screen bg-white animate-[slideUp_0.3s_ease-out]">
      <div className="px-5 py-6 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-xl text-slate-900">Notifications</h1>
        </div>
        <button className="text-blue-600 text-xs font-bold hover:text-blue-700">Mark all read</button>
      </div>

      <div className="divide-y divide-slate-50">
          {notifications.map(notif => (
              <div key={notif.id} className={`p-5 flex gap-4 ${notif.isUnread ? 'bg-blue-50/30' : ''}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${notif.color}`}>
                      <notif.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-bold ${notif.isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                              {notif.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">{notif.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                          {notif.body}
                      </p>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};
