import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Search, Crosshair, Home, Briefcase } from 'lucide-react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface PinOnMapViewProps {
  onBack: () => void;
  initialAddress?: string;
}

// Center tracker component
function MapCenterTracker({ onMapMove }: { onMapMove: (center: { lat: number; lng: number }) => void }) {
  const map = useMap();
  useEffect(() => {
    const handleMoveEnd = () => {
      onMapMove(map.getCenter());
    };
    map.on('moveend', handleMoveEnd);
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onMapMove]);
  return null;
}

export const PinOnMapView: React.FC<PinOnMapViewProps> = ({ onBack, initialAddress }) => {
  const [address, setAddress] = useState(initialAddress || '123 Culinary Street, Food District, Mumbai');
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  const [saveAs, setSaveAs] = useState<'home' | 'work' | 'other' | null>(null);
  
  // Default center at roughly Mumbai
  const [center, setCenter] = useState({ lat: 19.0760, lng: 72.8777 });

  const handleMapMove = (newCenter: { lat: number; lng: number }) => {
    setCenter(newCenter);
    // In a real app we'd reverse-geocode here
    setAddress(`Location nearby (${newCenter.lat.toFixed(4)}, ${newCenter.lng.toFixed(4)})`);
  };

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#FFFFFF] border-b border-slate-100 h-[56px] flex items-center px-4 shrink-0 z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[18px] font-semibold text-slate-900 ml-2">Pin Location</h1>
      </header>

      {/* Search Bar (Floating) */}
      <div className="absolute top-[72px] left-4 right-4 z-20">
        <div className="bg-[#FFFFFF] rounded-xl flex items-center px-4 h-12 border border-slate-200">
          <Search size={20} className="text-slate-400 mr-3" />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Search for area, street name..."
            className="flex-1 bg-transparent text-[15px] text-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-slate-200 overflow-hidden z-0">
        <MapContainer 
          center={[center.lat, center.lng]} 
          zoom={14} 
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapCenterTracker onMapMove={handleMapMove} />
        </MapContainer>

        {/* Center Pin Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-[400]">
          <div className="bg-slate-900 text-white text-[12px] font-medium px-3 py-1.5 rounded-lg shadow-lg mb-2 whitespace-nowrap">
            Order will be delivered here
          </div>
          <MapPin size={40} className="text-[#00bd6f] drop-shadow-md" fill="#00bd6f" color="white" />
          <div className="w-4 h-1 bg-black/20 rounded-[100%] mt-1 blur-[1px]"></div>
        </div>

        {/* Locate Me Button */}
        <button className="absolute bottom-6 right-4 w-12 h-12 bg-[#FFFFFF] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center text-slate-700 border border-slate-100 active:scale-95 transition-transform z-[400]">
          <Crosshair size={24} />
        </button>
      </div>

      {/* Bottom Sheet / Confirmation */}
      <div className="bg-[#FFFFFF] rounded-t-[24px] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-6 shrink-0 z-20 relative sm:max-w-md sm:mx-auto sm:w-full">
        <div className="flex items-start gap-3 mb-6">
          <div className="mt-1 shrink-0">
            <MapPin size={24} className="text-[#00bd6f]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[16px] font-bold text-slate-900 mb-1 truncate">Selected Location</h3>
            <p className="text-[14px] text-slate-500 leading-snug line-clamp-2">{address}</p>
          </div>
        </div>

        <button 
          onClick={() => setShowDetailsSheet(true)}
          className="w-full h-14 bg-[#00bd6f] text-white rounded-xl font-semibold text-[16px] active:scale-[0.98] transition-transform"
        >
          Confirm Location
        </button>
      </div>

      {/* Enter Address Details Modal Sheet */}
      {showDetailsSheet && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center transition-opacity" onClick={() => setShowDetailsSheet(false)}>
          <div 
            onClick={e => e.stopPropagation()} 
            className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-sm p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 flex flex-col max-h-[90vh]"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-1">Enter complete address</h3>
            <p className="text-sm text-slate-500 mb-5">Add details to help the delivery executive find you</p>
            
            <div className="overflow-y-auto flex-1 pb-4 no-scrollbar">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">House / Flat / Block No.</label>
                  <input type="text" className="w-full h-12 border border-slate-200 rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#00bd6f] focus:ring-1 focus:ring-[#00bd6f] bg-slate-50 focus:bg-[#FFFFFF] transition-colors" placeholder="e.g. Flat 101, Building A" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Apartment / Road / Area</label>
                  <input type="text" className="w-full h-12 border border-slate-200 rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#00bd6f] focus:ring-1 focus:ring-[#00bd6f] bg-slate-50 focus:bg-[#FFFFFF] transition-colors" placeholder="e.g. Main Street, Sector 4" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Landmark (Optional)</label>
                  <input type="text" className="w-full h-12 border border-slate-200 rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#00bd6f] focus:ring-1 focus:ring-[#00bd6f] bg-slate-50 focus:bg-[#FFFFFF] transition-colors" placeholder="e.g. Near Apollo Hospital" />
                </div>
                
                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-700 mb-2.5 block">Save as</label>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setSaveAs('home')}
                      className={`flex-1 h-[42px] border rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${saveAs === 'home' ? 'border-[#00bd6f] bg-green-50 text-[#00bd6f]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <Home size={16} /> Home
                    </button>
                    <button 
                      onClick={() => setSaveAs('work')}
                      className={`flex-1 h-[42px] border rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${saveAs === 'work' ? 'border-[#00bd6f] bg-green-50 text-[#00bd6f]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <Briefcase size={16} /> Work
                    </button>
                    <button 
                      onClick={() => setSaveAs('other')}
                      className={`flex-1 h-[42px] border rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${saveAs === 'other' ? 'border-[#00bd6f] bg-green-50 text-[#00bd6f]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <MapPin size={16} /> Other
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6 shrink-0">
              <button 
                onClick={() => setShowDetailsSheet(false)}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button 
                onClick={onBack}
                className="flex-1 py-3 px-4 bg-[#00bd6f] text-white font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

