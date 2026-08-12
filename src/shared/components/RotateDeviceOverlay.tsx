import React from 'react';
import { RotateCw, Smartphone } from 'lucide-react';

/**
 * Overlay shown when device is held in landscape mode.
 * Blocks application interaction on landscape orientation and prompts the user to rotate back to portrait.
 */
export const RotateDeviceOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[999999] bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none hidden landscape:flex">
      <div className="w-20 h-20 bg-[#00bd6f]/10 border border-[#00bd6f]/20 rounded-full flex items-center justify-center mb-6 relative">
        <Smartphone className="w-10 h-10 text-[#00bd6f] animate-bounce" />
        <RotateCw className="w-6 h-6 text-white absolute -top-1 -right-1 animate-spin" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
        Please Rotate Your Device
      </h2>
      <p className="text-sm text-slate-400 max-w-xs leading-relaxed font-medium">
        Crevings is designed for portrait mode. Please turn your phone or tablet vertically to continue using the app.
      </p>
    </div>
  );
};
