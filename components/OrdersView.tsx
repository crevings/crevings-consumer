
import React, { useState, useRef, useEffect } from 'react';
import { 
  Clock, 
  User, 
  Package, 
  ChevronRight,
  Utensils,
  Search,
  Mic,
  SlidersHorizontal,
  Check,
  Filter,
  ShoppingBag,
  Globe,
  ChevronLast,
  Calendar,
  Phone
} from 'lucide-react';
import { OrderDetailView } from './OrderDetailView';
import { BookingDetailView } from './BookingDetailView';
import { VoiceSearchModal } from './VoiceSearchModal';
import { OrderCard } from './OrderCard';
import { Order, Booking } from '../types';

const MOCK_BOOKINGS: Booking[] = [
  { id: 'BKG-101', customer: 'Aryan Sharma', phone: '+91 9876543210', time: '19:30', date: '25 Oct', guests: 2, tableCount: 1, status: 'Confirmed', type: 'Table Booking', source: 'Zomato' },
  { id: 'BKG-102', customer: 'Priya Desai', phone: '+91 9876543211', time: '20:00', date: '25 Oct', guests: 4, tableCount: 1, status: 'Pending', type: 'Table Booking with Food', source: 'Crevings' },
  { id: 'BKG-103', customer: 'Karan Patel', phone: '+91 9876543212', time: '21:15', date: '25 Oct', guests: 8, tableCount: 2, status: 'Confirmed', type: 'Booking Package', source: 'Swiggy' },
  { id: 'BKG-104', customer: 'Riya Gupta', phone: '+91 9876543213', time: '18:00', date: '25 Oct', guests: 2, tableCount: 1, status: 'Cancelled', type: 'Table Booking', source: 'Internal' }
];

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string) => void;
  onUpdateOrder?: (order: Order) => void;
  onAddMoreItems?: (order: Order) => void;
  selectedOrder?: Order | null;
  setSelectedOrder?: (order: Order | null) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onUpdateOrderStatus, onUpdateOrder, onAddMoreItems, selectedOrder: externalSelectedOrder, setSelectedOrder: externalSetSelectedOrder }) => {
  const [activeOrderTab, setActiveOrderTab] = useState<string>('All');
  const [internalSelectedOrder, setInternalSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const selectedOrder = externalSelectedOrder !== undefined ? externalSelectedOrder : internalSelectedOrder;
  const setSelectedOrder = externalSetSelectedOrder || setInternalSelectedOrder;
  const [showFilters, setShowFilters] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [isBookingView, setIsBookingView] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesTab = activeOrderTab === 'All' 
      || o.type === activeOrderTab 
      || o.status === activeOrderTab
      || (activeOrderTab === 'Ready to hand over' && o.status === 'Ready');
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (selectedBooking) {
    return <BookingDetailView booking={selectedBooking} onBack={() => setSelectedBooking(null)} />;
  }

  if (selectedOrder) {
    return <OrderDetailView order={selectedOrder} onBack={() => setSelectedOrder(null)} onUpdateOrder={onUpdateOrder} onAddMoreItems={onAddMoreItems} onUpdateOrderStatus={onUpdateOrderStatus} />;
  }

  const orderTypes = isBookingView 
    ? ['All', 'Confirmed', 'Pending', 'Cancelled']
    : ['All', 'Delivery', 'Offline Orders', 'Dine-in', 'Preparing', 'Ready to hand over'];

  const filteredBookings = MOCK_BOOKINGS.filter(b => {
    const matchesTab = activeOrderTab === 'All' || b.status === activeOrderTab;
    const matchesSearch = b.id.toLowerCase().includes(searchQuery.toLowerCase()) || b.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="pb-32 px-6 pt-6 animate-in fade-in duration-500 bg-[#FFFFFF] font-sans lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-10">
      
           <div className="relative flex p-1 bg-[#F3F4F6] rounded-full mb-6">
              <div 
                className="absolute top-1 bottom-1 bg-[#FFFFFF] rounded-full shadow-sm transition-all duration-300 ease-out"
                style={{ 
                  left: '4px', 
                  width: 'calc((100% - 8px) / 2)',
                  transform: `translateX(${isBookingView ? 100 : 0}%)` 
                }}
              />
              <button 
                onClick={() => { setIsBookingView(false); setActiveOrderTab('All'); }}
                className={`relative z-10 flex-1 py-3 text-[14px] font-semibold transition-colors duration-300 ${
                  !isBookingView 
                  ? 'text-[#1E90FF]' 
                  : 'text-[#6B7280] hover:text-slate-900'
                }`}
              >
                Active
              </button>
              <button 
                onClick={() => { setIsBookingView(true); setActiveOrderTab('All'); }}
                className={`relative z-10 flex-1 py-3 text-[14px] font-semibold transition-colors duration-300 ${
                  isBookingView 
                  ? 'text-[#1E90FF]' 
                  : 'text-[#6B7280] hover:text-slate-900'
                }`}
              >
                Booking
              </button>
           </div>
      
           <div className="relative mb-6">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
             <input 
               type="text" 
               placeholder={isBookingView ? "Search Booking ID or Customer..." : "Search Order ID or Customer..."} 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full h-[52px] bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] py-4 pl-12 pr-12 rounded-[16px] focus:outline-none focus:border-[#1E90FF] text-[15px] font-medium transition-all"
             />
             <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
               <Mic 
                 className="text-[#1E90FF] cursor-pointer" 
                 size={20} 
                 onClick={() => setShowVoiceSearch(true)}
               />
             </div>
           </div>

           <VoiceSearchModal 
             isOpen={showVoiceSearch} 
             onClose={() => setShowVoiceSearch(false)} 
             onResult={(text) => setSearchQuery(text)}
           />

           {/* Category Filter Chips */}
           <div className="flex gap-[8px] overflow-x-auto no-scrollbar mb-6 -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap">
             {orderTypes.map(tab => (
               <button 
                 key={tab}
                 onClick={() => setActiveOrderTab(tab)}
                 className={`h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 font-sans ${
                   activeOrderTab === tab 
                     ? 'bg-[#EFF6FF] text-[#1E90FF]' 
                     : 'bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]'
                 }`}
               >
                 {tab}
               </button>
             ))}
           </div>

            <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4">
               {isBookingView ? (
                 filteredBookings.length > 0 ? (
                   filteredBookings.map((booking) => (
                     <div key={booking.id} className="bg-[#FFFFFF] p-4 rounded-[20px] shadow-sm border border-[#E5E7EB] active:scale-[0.98] transition-transform cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-2">
                             <span className="text-[15px] font-bold text-[#111827]">{booking.id}</span>
                             <span className="text-[12px] font-semibold text-[#6B7280] bg-slate-100 px-2 py-0.5 rounded-full">{booking.source}</span>
                           </div>
                           <div className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                             booking.status === 'Confirmed' ? 'bg-[#DCFCE7] text-[#15803D]' :
                             booking.status === 'Pending' ? 'bg-[#FEF3C7] text-[#B45309]' :
                             'bg-[#FEE2E2] text-[#B91C1C]'
                           }`}>
                             {booking.status}
                           </div>
                        </div>
                        <div className="flex justify-between items-center bg-[#F9FAFB] p-3 rounded-[12px]">
                           <div className="flex flex-col">
                              <span className="text-[14px] font-bold text-[#111827]">{booking.customer}</span>
                              <span className="text-[12px] font-medium text-[#6B7280] flex items-center gap-1.5 mt-1"><Phone size={12} /> {booking.phone}</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-[1px] bg-slate-200"></div>
                              <div className="flex flex-col items-start min-w-[100px]">
                                <span className="text-[13px] font-bold text-[#111827] flex items-center gap-1.5"><Calendar size={13} className="text-[#1E90FF]" /> {booking.date} at {booking.time}</span>
                                <span className="text-[12px] font-medium text-[#6B7280] mt-1 flex items-center gap-1.5"><User size={13} className="text-[#1E90FF]" /> {booking.guests} Guests • {booking.tableCount} Tbl</span>
                              </div>
                           </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                           <span className="text-[12px] font-semibold text-[#4B5563] bg-slate-100 px-2.5 py-1 rounded-[8px]">{booking.type}</span>
                           <button 
                             onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }} 
                             className="text-[12px] font-bold text-[#00bd6f] bg-[#DCFCE7] px-3 py-1.5 rounded-[8px]"
                           >
                             View Details
                           </button>
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="py-20 text-center bg-[#FFFFFF] rounded-[32px] border border-slate-100 border-dashed col-span-2">
                     <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                         <Calendar size={24} />
                     </div>
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No matching bookings</p>
                     <p className="text-[10px] font-medium text-slate-300 mt-1">Try adjusting your filters or search query</p>
                   </div>
                 )
               ) : (
                 filteredOrders.length > 0 ? (
                   filteredOrders.map((order) => (
                     <OrderCard 
                       key={order.id}
                       order={order}
                       onClick={() => setSelectedOrder(order)}
                       onUpdateStatus={(e) => { e.stopPropagation(); onUpdateOrderStatus(order.id); }}
                     />
                   ))
                 ) : (
                   <div className="py-20 text-center bg-[#FFFFFF] rounded-[32px] border border-slate-100 border-dashed col-span-2">
                     <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                         <ShoppingBag size={24} />
                     </div>
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No matching orders</p>
                     <p className="text-[10px] font-medium text-slate-300 mt-1">Try adjusting your filters or search query</p>
                   </div>
                 )
               )}
            </div>
    </div>
  );
};
