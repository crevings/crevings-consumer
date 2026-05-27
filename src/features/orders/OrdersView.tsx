import React, { useState, useMemo } from 'react';
import { Order, Review } from "@/types";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { PAST_ORDERS } from "@/data/orders";;
import { Search, ArrowLeft, ChevronDown } from 'lucide-react';
import { OrderSortBottomSheet } from "@/features/orders/components/OrderSortBottomSheet";
import { AnimatePresence } from 'framer-motion';

interface OrdersViewProps {
  reviews: Record<string, Review>;
  onRateClick: (order: Order) => void;
  onViewReviewClick: (order: Order) => void;
  onReorderClick: (order: Order) => void;
  onBack: () => void;
}

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export const OrdersView: React.FC<OrdersViewProps> = ({ reviews, onRateClick, onViewReviewClick, onReorderClick, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...PAST_ORDERS];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(o => o.restaurantName.toLowerCase().includes(query));
    }

    if (activeFilters.length > 0) {
      result = result.filter(o => {
        const matchesType = activeFilters.includes(o.type) || (o.type === 'Booking with Pre-order' && activeFilters.includes('Booking'));
        const matchesStatus = activeFilters.includes(o.status);
        
        // If both type and status filters are selected, it should match either (or we can do AND, but usually OR is better for these kinds of filters, wait, if I select Delivery and Completed, it should be AND. Let's do: if type filters exist, must match type. If status filters exist, must match status.)
        const typeFilters = activeFilters.filter(f => ['Delivery', 'Takeaway', 'Dine-in', 'Booking'].includes(f));
        const statusFilters = activeFilters.filter(f => ['Cancelled', 'Completed'].includes(f));
        
        let typeMatch = typeFilters.length === 0 || typeFilters.includes(o.type) || (o.type === 'Booking with Pre-order' && typeFilters.includes('Booking'));
        let statusMatch = statusFilters.length === 0 || statusFilters.includes(o.status);
        
        return typeMatch && statusMatch;
      });
    }

    result.sort((a, b) => {
      if (sortOption === 'date-desc' || sortOption === 'date-asc') {
        const dateA = new Date(a.orderDate).getTime();
        const dateB = new Date(b.orderDate).getTime();
        return sortOption === 'date-desc' ? dateB - dateA : dateA - dateB;
      } else {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return sortOption === 'amount-desc' ? priceB - priceA : priceA - priceB;
      }
    });

    return result;
  }, [searchQuery, sortOption]);

  return (
    <div className="px-4 pt-4 pb-24 animate-fadeInUp">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-800 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-black text-slate-900">Complete Orders</h2>
      </div>
      
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <div className="flex-1 flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-slate-900 stroke-[2.5] shrink-0" />
            <input 
              type="text" 
              placeholder="Search by restaurant..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-slate-700 font-medium text-base focus:outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 items-center mb-6">
          <button onClick={() => setIsSortOpen(true)} className="flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm bg-white border-slate-200 text-slate-700 hover:border-slate-300">
              <span className="text-sm font-medium">Sort By</span>
              <ChevronDown className="w-4 h-4 ml-1 text-slate-500" />
          </button>
          
          {['Delivery', 'Takeaway', 'Dine-in', 'Booking', 'Cancelled', 'Completed'].map(filter => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilters(prev => 
                  prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
                );
              }}
              className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${
                activeFilters.includes(filter) 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="text-sm font-medium">{filter}</span>
            </button>
          ))}
      </div>

      <AnimatePresence>
        {isSortOpen && (
          <OrderSortBottomSheet 
            onClose={() => setIsSortOpen(false)} 
            onSelect={(m) => { setSortOption(m as SortOption); setIsSortOpen(false); }} 
            currentSort={sortOption} 
          />
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {filteredAndSortedOrders.length > 0 ? (
          filteredAndSortedOrders.map(o => (
            <OrderCard 
              key={o.id} 
              order={o} 
              review={reviews[o.id]} 
              onRateClick={onRateClick} 
              onViewReviewClick={onViewReviewClick} 
              onReorderClick={onReorderClick}
            />
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-400 font-medium text-sm">No orders found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
