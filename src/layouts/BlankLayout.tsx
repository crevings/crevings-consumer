import React from "react";
import { Outlet } from "react-router-dom";

export const BlankLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col app-container shadow-2xl relative">
      <Outlet />
    </div>
  );
};
