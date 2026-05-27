import { Star } from "lucide-react";
import { useState } from "react";

const StarIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const VegIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <rect x="1" y="1" width="14" height="14" rx="2" fill="none" stroke="#22c55e" strokeWidth="1.5"/>
    <circle cx="8" cy="8" r="3.5" fill="#22c55e"/>
  </svg>
);

const NonVegIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <rect x="1" y="1" width="14" height="14" rx="2" fill="none" stroke="#ef4444" strokeWidth="1.5"/>
    <polygon points="8,4.5 11.5,11.5 4.5,11.5" fill="#ef4444"/>
  </svg>
);

const EggIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <rect x="1" y="1" width="14" height="14" rx="2" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
    <ellipse cx="8" cy="9" rx="3.5" ry="4" fill="#f59e0b"/>
  </svg>
);

const dietaryIcons = { Veg: <VegIcon />, "Non-veg": <NonVegIcon />, Egg: <EggIcon /> };

export  function FilterBottomSheet({
  onClose = () => {},
  onApply = () => {},
  initialFilters = { minRating: null, maxDistance: 3, dietary: "all", offersOnly: false, sortBy: "default", maxTime: 60, priceRange: [0, 1000] },
}) {
  const [draftRating, setDraftRating] = useState(initialFilters.minRating);
  const [draftDistance, setDraftDistance] = useState(initialFilters.maxDistance);
  const [draftDietary, setDraftDietary] = useState(
    initialFilters.dietary === "all" ? [] : [initialFilters.dietary]
  );
  const [draftOffersOnly, setDraftOffersOnly] = useState(initialFilters.offersOnly);
  const [draftSort, setDraftSort] = useState(initialFilters.sortBy);

  const resetFilters = () => {
    setDraftRating(null);
    setDraftDistance(3);
    setDraftDietary([]);
    setDraftOffersOnly(false);
    setDraftSort("default");
  };

  const toggleDietary = (val) => {
    setDraftDietary((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const applyFilters = () => {
    onApply({
      minRating: draftRating || 1,
      maxDistance: draftDistance,
      dietary: draftDietary.length ? draftDietary[0] : "all",
      offersOnly: draftOffersOnly,
      sortBy: draftSort,
      maxTime: initialFilters.maxTime,
      priceRange: initialFilters.priceRange,
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.45)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 420,
          backgroundColor: "#fff",
          borderRadius: "20px 20px 0 0",
          padding: "24px 20px 20px",
          display: "flex", flexDirection: "column",
          maxHeight: "92vh",
          fontFamily: "'DM Sans', 'Nunito', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Filters</span>
          <button
            onClick={resetFilters}
            style={{ fontSize: 14, fontWeight: 600, color: "#00bd6f", background: "none", border: "none", cursor: "pointer" }}
          >
            Reset
          </button>
        </div>

        <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Rating */}
          <div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-3">Rating</h3>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star}
                      onClick={() => setDraftRating(star === draftRating ? null : star)}
                      className={`h-[40px] px-4 rounded-xl flex items-center gap-1.5 flex-shrink-0 border transition-all ${
                        draftRating === star 
                          ? 'bg-amber-50 border-amber-200 text-amber-700' 
                          : 'bg-[#FFFFFF] border-slate-200 text-slate-600'
                      }`}
                    >
                      <Star size={16} className={draftRating === star ? 'fill-amber-500 text-amber-500' : 'text-slate-400'} />
                      <span className="font-medium text-[14px]">{star} Star</span>
                    </button>
                  ))}
                </div>
              </div>

          {/* Distance */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Distance</p>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#00bd6f" }}>
                Up to {draftDistance} km
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type="range" min="0" max="7" step="0.5"
                value={draftDistance}
                onChange={(e) => setDraftDistance(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "#00bd6f", height: 4, cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>0 km</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>7 km</span>
              </div>
            </div>
          </div>

          {/* Dietary */}
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Dietary Preferences</p>
            <div style={{ display: "flex", gap: 8 }}>
              {["Veg", "Non-veg", "Egg"].map((item) => (
                <button
                  key={item}
                  onClick={() => toggleDietary(item)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 12,
                    border: draftDietary.includes(item)
                      ? item === "Veg" ? "1.5px solid #22c55e"
                        : item === "Non-veg" ? "1.5px solid #ef4444"
                        : "1.5px solid #f59e0b"
                      : "1.5px solid #e2e8f0",
                    background: draftDietary.includes(item)
                      ? item === "Veg" ? "#f0fdf4"
                        : item === "Non-veg" ? "#fef2f2"
                        : "#fffbeb"
                      : "#fff",
                    fontSize: 13, fontWeight: 500, color: "#334155",
                    display: "flex", alignItems: "center", gap: 6,
                    cursor: "pointer",
                  }}
                >
                  {dietaryIcons[item]}
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Offers */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>Offers &amp; Discounts</p>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>Show only places with deals</p>
            </div>
            <button
              onClick={() => setDraftOffersOnly(!draftOffersOnly)}
              style={{
                width: 46, height: 26, borderRadius: 13,
                background: draftOffersOnly ? "#00bd6f" : "#cbd5e1",
                border: "none", cursor: "pointer",
                position: "relative", transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute",
                top: 3, left: draftOffersOnly ? 23 : 3,
                width: 20, height: 20, borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </button>
          </div>

          {/* Sort by Price */}
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Sort by Price</p>
            {[
              { value: "low_to_high", label: "Low to High" },
              { value: "high_to_low", label: "High to Low" },
            ].map(({ value, label }) => (
              <label
                key={value}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  marginBottom: 12, cursor: "pointer",
                  fontSize: 14, color: "#334155",
                }}
              >
                <span
                  onClick={() => setDraftSort(value)}
                  style={{
                    width: 20, height: 20, borderRadius: "50%",
                    border: draftSort === value ? "6px solid #00bd6f" : "2px solid #cbd5e1",
                    display: "inline-block", flexShrink: 0,
                    transition: "border 0.15s",
                    cursor: "pointer",
                  }}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "14px 0",
              borderRadius: 14,
              background: "#f1f5f9", border: "none",
              fontSize: 15, fontWeight: 600, color: "#334155",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={applyFilters}
            style={{
              flex: 1, padding: "14px 0",
              borderRadius: 14,
              background: "#00bd6f", border: "none",
              fontSize: 15, fontWeight: 700, color: "#fff",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}