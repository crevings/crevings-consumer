import React from "react";
import { Outlet } from "react-router-dom";

export const BlankLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto shadow-2xl relative">
      <Outlet />
    </div>
  );
};
