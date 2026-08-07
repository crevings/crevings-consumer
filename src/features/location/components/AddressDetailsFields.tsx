import React from "react";

interface AddressDetailsFieldsProps {
  building: string;
  onBuildingChange: (value: string) => void;
  street: string;
  onStreetChange: (value: string) => void;
}

/** Controlled inputs for the address details (floor/house no + street/area). */
export const AddressDetailsFields: React.FC<AddressDetailsFieldsProps> = ({
  building,
  onBuildingChange,
  street,
  onStreetChange,
}) => {
  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Address details*"
          value={building}
          onChange={(e) => onBuildingChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#00bd6f] focus:bg-white transition-all"
        />
        <p className="text-[11px] text-slate-400 mt-1.5 px-1">E.g. Floor, House no.</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Apartment / Road / Area Name"
          value={street}
          onChange={(e) => onStreetChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#00bd6f] focus:bg-white transition-all"
        />
      </div>
    </>
  );
};
