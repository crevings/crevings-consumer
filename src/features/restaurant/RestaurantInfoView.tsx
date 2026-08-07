import React from 'react';
import { ArrowLeft, MapPin, Phone, Clock, Info, Shield, Navigation } from 'lucide-react';
import { Restaurant } from "@/types";
import { getRestaurantAddress } from "@/utils/restaurantUtils";

interface RestaurantInfoViewProps {
  restaurant: Restaurant;
  onBack: () => void;
}

export const RestaurantInfoView: React.FC<RestaurantInfoViewProps> = ({ restaurant, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-10 animate-fadeInUp">
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-800 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">About {restaurant.name}</h1>
            <p className="text-xs text-slate-500 font-medium">Detailed Information</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Address & Navigation */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Address</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {getRestaurantAddress(restaurant) || 'Address not available yet'}
              </p>
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold active:scale-95 transition-transform shadow-sm shadow-blue-600/20">
                <Navigation className="w-4 h-4" />
                Navigate to Restaurant
              </button>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Contact Details</h3>
              <p className="text-sm text-slate-600 mb-2">Call us for any queries or reservations.</p>
              {restaurant.phone ? (
                <a href={`tel:${restaurant.phone}`} className="inline-flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-lg">
                  {restaurant.phone}
                </a>
              ) : (
                <p className="text-sm font-bold text-slate-400">Phone number not available yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Opening Hours</h3>
              {restaurant.openingHours ? (
                <p className="text-sm font-bold text-slate-900">{restaurant.openingHours}</p>
              ) : (
                <p className="text-sm font-bold text-slate-400">Opening hours not available yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Facilities</h3>
              {restaurant.facilities && restaurant.facilities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {restaurant.facilities.map((facility, index) => (
                    <span key={index} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-700">
                      {facility}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-bold text-slate-400">Facilities not listed yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Legal Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Legal Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">FSSAI License No.</p>
                  <p className="text-sm font-bold text-slate-900">{restaurant.fssaiNo || 'Not available yet'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">GSTIN</p>
                  <p className="text-sm font-bold text-slate-900">{restaurant.gstin || 'Not available yet'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Registered Entity Name</p>
                  <p className="text-sm font-bold text-slate-900">{restaurant.registeredName || 'Not available yet'}</p>
                  <p className="text-xs text-slate-400 mt-1">Registered entity details shown once verified by the restaurant.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
