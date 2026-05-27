
import React from 'react';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Quote, 
  Bike, 
  Utensils, 
  Calendar,
  CheckCircle2,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Award
} from 'lucide-react';
import { Order, Review } from '../types';

interface ViewReviewDetailsViewProps {
  order: Order;
  review: Review;
  onBack: () => void;
}

export const ViewReviewDetailsView: React.FC<ViewReviewDetailsViewProps> = ({ order, review, onBack }) => {
  const foodItems = order.items.split(',').map(item => item.trim());

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans animate-fadeInUp">
      <div className="px-6 py-8 flex items-center justify-between sticky top-0 z-30 bg-white/80 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-[1.25rem] bg-slate-900 flex items-center justify-center text-white shadow-xl active:scale-90 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-1">Feedback Log</p>
          <h1 className="font-black text-xs text-slate-900 uppercase tracking-widest">{order.id}92-REF</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar">
        <div className="mb-12 pt-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-blue-500"></div>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Verified Experience</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-4">
                {order.restaurantName}
            </h2>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{review.date}</span>
                </div>
            </div>
        </div>

        <div className="relative mb-12">
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-12 z-10">
                <Award className="w-6 h-6" />
            </div>
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-[2rem] border-4 border-blue-500/30 overflow-hidden mb-6 bg-slate-800">
                        <img 
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80" 
                            alt="Driver" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <h3 className="text-xl font-black tracking-tight mb-1">Ramesh Kumar</h3>
                    <div className="flex gap-2 mb-8">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                                key={star} 
                                className={`w-8 h-8 ${star <= review.deliveryRating ? 'text-blue-400 fill-blue-400' : 'text-slate-800 fill-slate-800'}`} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                    <Utensils className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Culinaries Feedback</h3>
            </div>
            <div className="space-y-10 relative pl-4">
                <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-100" />
                {foodItems.map((item, index) => (
                    <div key={index} className="relative group">
                        <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors" />
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{item}</h4>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <div 
                                            key={star} 
                                            className={`w-2 h-2 rounded-full ${star <= (review.itemsRating[item] || 0) ? 'bg-blue-500' : 'bg-slate-100'}`} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0 z-30 flex gap-3">
          <button 
            onClick={onBack}
            className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.25em]"
          >
             Done Viewing
             <CheckCircle2 className="w-4 h-4" />
          </button>
      </div>
    </div>
  );
};
