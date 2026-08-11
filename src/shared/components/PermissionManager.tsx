import { useState, useEffect } from 'react';
import { X, MapPin, Bell, Settings } from 'lucide-react';
import {
  requestLocationAndGetPosition,
  openDeviceLocationSettings,
} from '@/services/geolocation';
import { isCapacitorNative } from '@/services/permissions';

interface PermissionDef {
  id: 'location' | 'notification';
  title: string;
  desc: string;
  icon: React.ReactNode;
  bgColor: string;
}

export const PermissionManager = () => {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  // Non-null when location or notification request failed
  const [deniedError, setDeniedError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isGpsOff, setIsGpsOff] = useState(false);

  const permissions: PermissionDef[] = [
    {
      id: 'location',
      title: 'Where are you?',
      desc: 'Allow location access to discover the best restaurants and fastest delivery options in your area.',
      icon: <MapPin className="w-10 h-10 text-[#00bd6f]" />,
      bgColor: 'bg-[#00bd6f]/10'
    },
    {
      id: 'notification',
      title: 'Stay in the loop',
      desc: 'Turn on notifications to track your order in real-time and get exclusive deals.',
      icon: <Bell className="w-10 h-10 text-blue-600" />,
      bgColor: 'bg-blue-50'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
        if (!isCompleted) setShow(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [isCompleted]);

  /** Hide the current card, then advance to the next step (or finish). */
  const advance = () => {
    setDeniedError(null);
    setShow(false);
    setTimeout(() => {
      if (step < permissions.length - 1) {
        setStep(s => s + 1);
      } else {
        setIsCompleted(true);
      }
      setShow(true);
    }, 400);
  };

  /** Request the current permission. Resolves only when we may move on. */
  const requestCurrentPermission = async (): Promise<void> => {
    const current = permissions[step];
    if (!current) return;
    if (current.id === 'location') {
      // Rejects with LocationError(code 1) when the user denies access.
      await requestLocationAndGetPosition();
    } else if (current.id === 'notification') {
      if ('Notification' in window) {
        await Notification.requestPermission();
      }
    }
  };

  const handleAllow = async () => {
    setDeniedError(null);
    setIsRequesting(true);
    try {
      await requestCurrentPermission();
      advance();
    } catch (e) {
      const err = e as { code?: number } | null;
      if (err?.code === 1) {
        setIsGpsOff(false);
        setDeniedError(
          'Location access is required to see restaurants near you. Please allow location access.'
        );
      } else {
        setIsGpsOff(true);
        setDeniedError(
          'Your device\'s location service (GPS) is turned off. Please turn on GPS to discover nearby restaurants.'
        );
      }
      setShow(true);
    } finally {
      setIsRequesting(false);
    }
  };

  if (isCompleted) return null;

  const current = permissions[step];
  if (!current) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => (deniedError ? setDeniedError(null) : advance())}
      />

      {/* Centered Card */}
      <div className={`relative bg-white w-full max-w-sm mx-auto rounded-[24px] flex flex-col overflow-hidden shadow-2xl transition-all duration-500 ease-out ${show ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>

        <button
          onClick={() => (deniedError ? setDeniedError(null) : advance())}
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 active:scale-95 transition-all z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center relative">
            <div className={`w-24 h-24 rounded-full ${deniedError ? (isGpsOff ? 'bg-amber-50' : 'bg-rose-50') : current.bgColor} flex items-center justify-center mb-6`}>
              {deniedError ? <MapPin className={`w-10 h-10 ${isGpsOff ? 'text-amber-500' : 'text-rose-500'}`} /> : current.icon}
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {deniedError ? (isGpsOff ? 'Turn on Location' : 'Location access needed') : current.title}
            </h3>
            <p className="text-slate-500 text-[15px] mb-8 leading-relaxed">
              {deniedError ?? current.desc}
            </p>

            {deniedError ? (
              <div className="flex flex-col gap-3 w-full">
                {isCapacitorNative() && isGpsOff && (
                  <button
                    onClick={async () => {
                      try {
                        await openDeviceLocationSettings();
                        void handleAllow();
                      } catch {
                        // User dismissed in-app dialog
                      }
                    }}
                    className="w-full py-4 rounded-2xl font-bold text-white text-[15px] transition-transform active:scale-[0.98] bg-[#00bd6f] flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Turn on GPS
                  </button>
                )}
                <button
                    onClick={() => void handleAllow()}
                    disabled={isRequesting}
                    className={`w-full py-4 rounded-2xl font-bold text-[15px] transition-transform active:scale-[0.98] disabled:opacity-60 ${
                      isCapacitorNative() && isGpsOff
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-[#00bd6f] text-white'
                    }`}
                >
                    {isRequesting ? 'Requesting...' : (isGpsOff ? 'Try Again' : 'Allow Access')}
                </button>
                <button
                    onClick={advance}
                    className="w-full py-2 text-slate-400 text-[13px] font-semibold"
                >
                    Skip for now
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                  <button
                      onClick={() => void handleAllow()}
                      disabled={isRequesting}
                      className="w-full py-4 rounded-2xl font-bold text-white text-[15px] transition-transform active:scale-[0.98] bg-[#00bd6f] disabled:opacity-60"
                  >
                      {isRequesting ? 'Requesting...' : 'Allow Access'}
                  </button>
                  <button
                      onClick={advance}
                      className="w-full py-4 rounded-2xl font-bold text-slate-500 text-[15px] transition-colors hover:bg-slate-50 active:bg-slate-100"
                  >
                      Not Now
                  </button>
              </div>
            )}

            {/* Pagination Dots */}
            <div className="flex gap-1.5 mt-6">
                {permissions.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-[#00bd6f]' : 'w-1.5 bg-slate-200'}`}
                    />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
