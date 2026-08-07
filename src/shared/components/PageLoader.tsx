import React from "react";

interface PageLoaderProps {
  label?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ label = "Loading..." }) => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
    <div className="w-10 h-10 border-2 border-slate-200 border-t-[#00bd6f] rounded-full animate-spin mb-3" />
    <p className="text-slate-500 font-bold text-sm">{label}</p>
  </div>
);
