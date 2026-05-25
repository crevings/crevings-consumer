import React, { useState } from 'react';
import { 
  ArrowLeft, Phone, Clock, Calendar, 
  User, Check, X, FileText, ChevronRight, Hash, Users, Globe, Building2, Ticket
} from 'lucide-react';
import { Booking } from '../types';

interface BookingDetailViewProps {
  booking: Booking;
  onBack: () => void;
}

export const BookingDetailView: React.FC<BookingDetailViewProps> = ({ booking, onBack }) => {
  return (
    <div className="fixed inset-0 z-[150] bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto pb-24">
      {/* Dev Toggle space for alignment with OrderDetailView */}
      <div className="bg-slate-800 p-2 flex gap-2 overflow-x-auto text-xs shrink-0 h-[36px]">
        {/* Placeholder to match other view's header spacing exactly */}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#FFFFFF] border-b border-slate-100 sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-600 active:bg-slate-50 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[18px] font-semibold text-slate-900">{booking.id}</h1>
            <div className="flex items-center gap-2 text-xs mt-0.5">
              <span className={`px-2 py-0.5 rounded-md font-medium ${
                booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' :
                booking.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                'bg-rose-50 text-rose-600'
              }`}>
                {booking.status}
              </span>
              <span className="text-slate-500">{booking.date} {booking.time}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-[14px]">
        {/* Customer Info Card */}
        <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">{booking.customer}</h2>
              <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-medium rounded mt-1">
                {booking.source === 'Internal' ? 'Direct Booking' : 'Partner Booking'}
              </span>
            </div>
            <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Channel</p>
              <p className="font-medium text-slate-900">{booking.source}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Booking Type</p>
              <p className="font-medium text-slate-900">{booking.type}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Booking Date</p>
              <p className="font-medium text-slate-900">{booking.date}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Booking Time</p>
              <p className="font-medium text-slate-900">{booking.time}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
               <Users size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Guests</p>
              <p className="text-[16px] font-bold text-slate-900">{booking.guests} People</p>
            </div>
          </div>
          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
               <Building2 size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Tables</p>
              <p className="text-[16px] font-bold text-slate-900">{booking.tableCount} Unit(s)</p>
            </div>
          </div>
        </div>

        {/* Booking Details Card (if has items or packages) */}
        {(booking.preOrderItems || booking.packageInfo) && (
          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm">
            <h2 className="text-[15px] font-bold text-slate-900 mb-3">Booking Details</h2>
            
            {booking.packageInfo && (
               <div className="mb-4 bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex gap-3">
                 <div className="mt-0.5">
                   <Ticket size={16} className="text-indigo-600" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-indigo-900">{booking.packageInfo}</p>
                   <p className="text-xs font-medium text-indigo-700 mt-0.5">Package applied to this booking</p>
                 </div>
               </div>
            )}

            {booking.preOrderItems && booking.preOrderItems.length > 0 && (
              <div className="space-y-3">
                {booking.preOrderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border border-green-600 flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-green-600"></div>
                        </div>
                        <p className="text-[15px] font-medium text-slate-900">
                          {item.quantity} × {item.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Area for Pending specific actions */}
      {booking.status === 'Pending' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#FFFFFF] border-t border-slate-100 pb-8 flex gap-3 z-50 max-w-md mx-auto">
          <button 
            className="flex-1 h-[56px] rounded-[16px] bg-[#FFFFFF] border border-rose-200 text-rose-600 font-bold text-[16px] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <X size={20} />
            Reject
          </button>
          <button 
            className="flex-1 h-[56px] rounded-[16px] bg-[#00bd6f] text-white font-bold text-[16px] shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};
