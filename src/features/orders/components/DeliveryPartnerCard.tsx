import React from "react";
import { Phone, MessageSquare } from "lucide-react";
import { DeliveryPartner } from "@/types";

interface DeliveryPartnerCardProps {
  partner: DeliveryPartner | null;
}

/** Presentational card showing the assigned delivery partner with call/chat actions. */
export const DeliveryPartnerCard: React.FC<DeliveryPartnerCardProps> = ({ partner }) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
      <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 shrink-0 border-2 border-white shadow-sm">
        <img loading="lazy" src={partner?.photo || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop&q=80"} alt="Delivery Partner" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <h3 className="text-base font-bold text-slate-900">{partner?.name || 'Assigned Delivery Partner'}</h3>
        <p className="text-xs font-medium text-slate-500 mt-0.5">Delivery Partner • {partner?.rating ?? '—'} ★</p>
      </div>
      <div className="flex gap-2 shrink-0">
        {partner?.phone ? (
          <a href={`tel:${partner.phone}`} className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center active:scale-95 transition-transform">
            <Phone className="w-4 h-4" />
          </a>
        ) : (
          <span className="w-10 h-10 bg-green-50/50 text-green-600/50 rounded-full flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </span>
        )}
        <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center active:scale-95 transition-transform">
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
