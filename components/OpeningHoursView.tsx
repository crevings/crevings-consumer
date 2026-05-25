import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface OpeningHoursViewProps {
  onBack: () => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const OpeningHoursView: React.FC<OpeningHoursViewProps> = ({ onBack }) => {
  const [hours, setHours] = useState(
    DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { isOpen: true, open: '10:00', close: '23:00' }
    }), {} as Record<string, { isOpen: boolean; open: string; close: string }>)
  );

  const [autoOnline, setAutoOnline] = useState(false);

  const toggleDay = (day: string) => {
    setHours({ ...hours, [day]: { ...hours[day], isOpen: !hours[day].isOpen } });
  };

  const updateTime = (day: string, type: 'open' | 'close', time: string) => {
    setHours({ ...hours, [day]: { ...hours[day], [type]: time } });
  };

  // Helper to format 24h to 12h for display if needed, but <input type="time"> handles 12h based on locale.
  // We will just use <input type="time" /> which natively supports AM/PM on mobile devices.

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-32 font-sans animate-in fade-in duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-slate-100 h-[56px] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">Opening Hours</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Weekly Schedule Section */}
        <div className="space-y-3">
          {DAYS.map(day => (
            <div key={day} className="bg-[#FFFFFF] rounded-[14px] p-4 border border-[#E5E7EB] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-semibold text-slate-900">{day}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-[13px] font-medium ${hours[day].isOpen ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {hours[day].isOpen ? 'Open' : 'Closed'}
                  </span>
                  <button 
                    onClick={() => toggleDay(day)}
                    className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out ${hours[day].isOpen ? 'bg-[#1E90FF]' : 'bg-slate-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-[#FFFFFF] shadow-sm transform transition-transform duration-300 ease-in-out ${hours[day].isOpen ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
              
              {hours[day].isOpen ? (
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1">
                    <input 
                      type="time" 
                      value={hours[day].open}
                      onChange={(e) => updateTime(day, 'open', e.target.value)}
                      className="w-full h-[44px] px-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium text-slate-900 focus:outline-none focus:border-[#1E90FF] focus:bg-[#FFFFFF] transition-colors appearance-none"
                    />
                  </div>
                  <span className="text-slate-400 font-medium">–</span>
                  <div className="flex-1">
                    <input 
                      type="time" 
                      value={hours[day].close}
                      onChange={(e) => updateTime(day, 'close', e.target.value)}
                      className="w-full h-[44px] px-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium text-slate-900 focus:outline-none focus:border-[#1E90FF] focus:bg-[#FFFFFF] transition-colors appearance-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 h-[44px] bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                  <span className="text-[14px] font-medium text-slate-500">Closed</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Automatic Online Feature */}
        <div className="bg-[#FFFFFF] rounded-[14px] p-4 border border-[#E5E7EB] shadow-sm mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[16px] font-bold text-slate-900">Auto Online Mode</h3>
            <button 
              onClick={() => setAutoOnline(!autoOnline)}
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out ${autoOnline ? 'bg-[#1E90FF]' : 'bg-slate-200'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-[#FFFFFF] shadow-sm transform transition-transform duration-300 ease-in-out ${autoOnline ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          <p className="text-[13px] text-slate-600 mb-3">
            Your restaurant will automatically switch online/offline based on selected timings.
          </p>
          {autoOnline && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-[12px] text-blue-800 font-medium">
                Manual Override: You can still go offline manually even if auto mode is enabled.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-[72px] left-0 right-0 p-4 bg-[#FFFFFF] border-t border-slate-100 z-40">
        <button className="w-full h-[52px] bg-[#1E90FF] text-white rounded-[14px] font-semibold text-[16px] active:scale-[0.98] transition-all shadow-sm">
          Save Schedule
        </button>
      </div>
    </div>
  );
};
