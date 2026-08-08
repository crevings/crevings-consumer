import React from "react";
import { CheckCircle2 } from "lucide-react";
import { OrderType, DeliveryPartner } from "@/types";

interface OrderStatusTimelineProps {
  orderType: OrderType;
  progress: number;
  assignedPartner: DeliveryPartner | null;
}

interface TimelineStepProps {
  active: boolean;
  title: string;
  subtitle: string;
}

/** Single timeline row — green filled circle when active, muted when pending. */
const TimelineStep: React.FC<TimelineStepProps> = ({ active, title, subtitle }) => (
  <div className="flex gap-4">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors ${active ? "bg-[#00bd6f]" : "bg-white border-2 border-slate-200"}`}>
      {active && <CheckCircle2 className="w-5 h-5 text-white" />}
    </div>
    <div className="pt-1">
      <h3 className={`text-sm font-bold ${active ? "text-slate-900" : "text-slate-500"}`}>{title}</h3>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  </div>
);

/** Presentational order-status timeline with progress rail. */
export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  orderType,
  progress,
  assignedPartner,
}) => {
  const isDelivery = orderType === "Delivery";

  // Progress thresholds mirror the status→progress mapping in useOrderLiveUpdates:
  // PREPARING=30 · READY/READY_FOR_PICKUP=45 · DRIVER_ASSIGNED=55 · DRIVER_ARRIVED=60
  // OUT FOR DELIVERY=75 · REACHED_CUSTOMER/ARRIVING_SOON=90 · DELIVERED=100
  const preparing = progress >= 20;
  const readyForPickup = progress >= 45;
  const driverAssigned = progress >= 55;
  const arrivedAtRestaurant = progress >= 60;
  const outForDelivery = progress >= 75;
  const reachedCustomer = progress >= 90;
  const delivered = progress >= 100;

  const readySubtitle = !readyForPickup
    ? "Waiting for the kitchen to finish"
    : isDelivery
      ? (assignedPartner ? "Driver is on the way to collect" : "Finding a nearby driver")
      : "Your order is ready to be collected";

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          {isDelivery ? "Delivery Status" : "Order Status"}
        </h2>
      </div>

      <div className="relative pl-3">
        <div className="absolute left-[27px] top-3 bottom-3 w-0.5 bg-slate-100" />
        <div className="absolute left-[27px] top-3 w-0.5 bg-[#00bd6f] transition-all duration-1000" style={{ height: `${progress}%` }} />

        <div className="space-y-6 relative">
          <TimelineStep active title="Order Confirmed" subtitle="Your order has been received" />
          <TimelineStep active={preparing} title="Preparing" subtitle="The restaurant is preparing your food" />

          {/* Ready for Pickup — turns green when the backend starts searching for a driver */}
          <TimelineStep active={readyForPickup} title="Ready for Pickup" subtitle={readySubtitle} />

          {isDelivery && (
            <>
              <TimelineStep
                active={driverAssigned}
                title="Driver Assigned"
                subtitle="Driver is heading to restaurant"
              />
              <TimelineStep
                active={arrivedAtRestaurant}
                title="Driver arrived at restaurant"
                subtitle="Driver has arrived at the restaurant"
              />
              <TimelineStep
                active={outForDelivery}
                title="Out for Delivery"
                subtitle="Driver has picked up your order"
              />
              <TimelineStep
                active={reachedCustomer}
                title="Reached your location"
                subtitle="Driver has reached your location"
              />
              <TimelineStep active={delivered} title="Delivered" subtitle="Enjoy your meal!" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
