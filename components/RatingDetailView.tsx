
import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Search, 
  Filter, 
  ChevronDown, 
  ArrowLeft,
  MoreVertical,
  Reply,
  Flag,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  orderId: string;
  tags: string[];
  images?: string[];
  response?: string;
  isVerified: boolean;
}

const mockReviews: Review[] = [
  {
    id: 'REV-001',
    customerName: 'Anjali Prakash',
    rating: 5,
    date: '2 hours ago',
    comment: 'The Paneer Pizza was exceptional! Perfectly baked crust and fresh toppings. Highly recommended for family dinners.',
    orderId: '#ORD-014',
    tags: ['Food Quality', 'Fast Delivery'],
    images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'],
    isVerified: true
  },
  {
    id: 'REV-002',
    customerName: 'Rahul Dravid',
    rating: 4,
    date: 'Yesterday',
    comment: 'Great taste and generous portions. The burger was a bit cold when it arrived but overall a very good experience.',
    orderId: '#ORD-012',
    tags: ['Portion Size', 'Packaging'],
    response: 'Thank you for your feedback, Rahul! We will work on improving the temperature of our delivery items.',
    isVerified: true
  },
  {
    id: 'REV-003',
    customerName: 'Sneha Kapur',
    rating: 3,
    date: '2 days ago',
    comment: 'Average experience. The wait time was a bit longer than expected for a dine-in.',
    orderId: '#ORD-009',
    tags: ['Service'],
    isVerified: false
  },
  {
    id: 'REV-004',
    customerName: 'Vikram Singh',
    rating: 5,
    date: '3 days ago',
    comment: 'Best gourmet burgers in the city. The truffle mayo is a game changer!',
    orderId: '#ORD-005',
    tags: ['Food Quality', 'Value'],
    isVerified: true
  }
];

const RatingBar: React.FC<{ stars: number; percentage: number; count: number }> = ({ stars, percentage, count }) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center gap-1 w-10">
      <span className="text-sm font-bold text-slate-600">{stars}</span>
      <Star size={14} className="fill-amber-400 text-amber-400" />
    </div>
    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
      <div 
        className="h-full bg-amber-400 rounded-full" 
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="text-xs font-medium text-slate-400 w-8">{count}</span>
  </div>
);

export const RatingDetailView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-32 lg:bg-transparent lg:pb-10">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-slate-100 px-4 py-4 flex items-center justify-between lg:px-0 lg:bg-transparent lg:border-none lg:static">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-all">
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none lg:text-3xl lg:mb-2">Customer Ratings</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 lg:text-[13px]">Real feedback from your guests</p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 active:scale-95 transition-transform border border-slate-100 lg:w-12 lg:h-12 lg:rounded-2xl">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="px-4 pt-6 space-y-8 lg:px-0">
        {/* Summary Card */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 bg-[#FFFFFF] rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="relative mb-4">
              <div className="text-6xl font-black text-slate-900 tracking-tighter">4.6</div>
              <div className="absolute -top-2 -right-4 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">+0.2</div>
            </div>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4].map(i => <Star key={i} size={20} className="fill-amber-400 text-amber-400" />)}
              <Star size={20} className="fill-amber-400/30 text-amber-400/30" />
            </div>
            <p className="text-sm font-bold text-slate-400">Based on 1,240 reviews</p>
            <div className="mt-6 w-full pt-6 border-t border-slate-50 flex justify-between">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Response Rate</p>
                <p className="text-lg font-black text-slate-900">92%</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Response</p>
                <p className="text-lg font-black text-slate-900">4h</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-[#FFFFFF] rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Rating Breakdown</h3>
            <div className="space-y-4">
              <RatingBar stars={5} percentage={70} count={868} />
              <RatingBar stars={4} percentage={20} count={248} />
              <RatingBar stars={3} percentage={5} count={62} />
              <RatingBar stars={2} percentage={3} count={37} />
              <RatingBar stars={1} percentage={2} count={25} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-50 lg:grid-cols-4">
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Food</p>
                 <div className="flex items-center gap-1.5 font-black text-slate-900">
                    4.8 <Star size={12} className="fill-emerald-500 text-emerald-500" />
                 </div>
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service</p>
                 <div className="flex items-center gap-1.5 font-black text-slate-900">
                    4.2 <Star size={12} className="fill-amber-500 text-amber-500" />
                 </div>
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Value</p>
                 <div className="flex items-center gap-1.5 font-black text-slate-900">
                    4.5 <Star size={12} className="fill-emerald-500 text-emerald-500" />
                 </div>
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ambiance</p>
                 <div className="flex items-center gap-1.5 font-black text-slate-900">
                    4.6 <Star size={12} className="fill-emerald-500 text-emerald-500" />
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pt-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {['All', '5 Star', 'Critical', 'With Media', 'Replied'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-shrink-0 px-5 py-2 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all border ${
                  activeFilter === filter 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                    : 'bg-[#FFFFFF] border-slate-100 text-slate-400 hover:border-slate-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search in reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-[300px] h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-[18px] text-sm focus:outline-none focus:border-blue-500 focus:bg-[#FFFFFF] transition-all"
            />
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[12px] font-black text-slate-900 tracking-widest uppercase">Latest Reviews</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Sort by: <span className="text-slate-900 flex items-center gap-1 cursor-pointer hover:text-blue-500">Newest <ChevronDown size={14} /></span>
            </div>
          </div>

          <div className="space-y-4">
            {mockReviews.map((review) => (
              <div key={review.id} className="bg-[#FFFFFF] rounded-[32px] p-6 border border-slate-100 shadow-sm hover:border-blue-100 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden relative group">
                      <span className="font-black text-lg">{review.customerName.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[14px] font-black text-slate-900 leading-none">{review.customerName}</h4>
                        {review.isVerified && (
                          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                            <CheckCircle2 size={10} strokeWidth={3} /> Verified
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star 
                              key={s} 
                              size={12} 
                              className={s <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-100'} 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                           <Calendar size={10} /> {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
                    {review.comment}
                  </p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2">
                      {review.images.map((img, i) => (
                        <div key={i} className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 cursor-pointer hover:opacity-90 active:scale-95 transition-all">
                           <img src={img} alt="review" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {review.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-slate-50 text-slate-500 rounded-full border border-slate-100">
                        {tag}
                      </span>
                    ))}
                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-blue-50 text-blue-500 rounded-full border border-blue-100">
                      Order {review.orderId}
                    </span>
                  </div>

                  {review.response ? (
                    <div className="bg-slate-50 rounded-[24px] p-5 space-y-2 border border-slate-100">
                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                             <Reply size={12} /> Your Response
                          </p>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Just now</span>
                       </div>
                       <p className="text-[13px] text-slate-500 leading-relaxed font-medium italic">
                         "{review.response}"
                       </p>
                    </div>
                  ) : (
                    <div className="pt-4 flex items-center gap-3">
                       <button className="flex-1 h-11 bg-slate-900 text-white rounded-xl text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm">
                          <Reply size={16} /> Reply to Review
                       </button>
                       <button className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-[0.98]">
                          <Flag size={18} />
                       </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-6 text-center group">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-blue-500 transition-colors">Load more reviews</span>
            <div className="mt-4 flex justify-center">
              <ChevronDown size={20} className="text-slate-200 group-hover:text-blue-300 animate-bounce" />
            </div>
          </button>
        </div>

        {/* AI Insight Section */}
        <section className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[44px] p-10 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-[20px] flex items-center justify-center text-blue-400 border border-white/10">
                     <TrendingUp size={28} />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-2xl tracking-tight leading-none uppercase italic">Sentiment Analysis</h4>
                    <p className="text-indigo-300/60 text-[10px] font-black uppercase tracking-widest mt-2 px-1">Powered by Gemini AI</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
               <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                  <h5 className="text-[12px] font-black text-emerald-400 uppercase tracking-widest">Strength Clusters</h5>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white/80 shrink-0">Packaging Integrity</span>
                        <div className="flex-1 mx-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-400 rounded-full w-[85%]"></div>
                        </div>
                        <span className="text-xs font-black text-emerald-400">85%</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white/80 shrink-0">Ingredient Freshness</span>
                        <div className="flex-1 mx-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-400 rounded-full w-[92%]"></div>
                        </div>
                        <span className="text-xs font-black text-emerald-400">92%</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                  <h5 className="text-[12px] font-black text-amber-400 uppercase tracking-widest">Improvement Areas</h5>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white/80 shrink-0">Delivery Latency</span>
                        <div className="flex-1 mx-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-amber-400 rounded-full w-[24%]"></div>
                        </div>
                        <span className="text-xs font-black text-amber-400">24%</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white/80 shrink-0">Wait Times (Dine)</span>
                        <div className="flex-1 mx-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-amber-400 rounded-full w-[15%]"></div>
                        </div>
                        <span className="text-xs font-black text-amber-400">15%</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-blue-600/20 border border-blue-500/20 rounded-3xl p-6 flex gap-4">
               <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0 text-white shadow-lg shadow-blue-500/20">
                  <CheckCircle2 size={24} />
               </div>
               <p className="text-sm font-medium text-blue-100 leading-relaxed italic">
                 "Customers are frequently mentioning your <span className="text-white font-black">Truffle Mayo</span> as a highlight. Consider featuring it in your 'Chef Choice' menu section to boost premium burger sales."
               </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
