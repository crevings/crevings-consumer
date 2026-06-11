import React from 'react';
import { Search, Mic, SlidersHorizontal } from 'lucide-react';

interface RestaurantFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setIsVoiceSearchOpen: (open: boolean) => void;
  sortBy: string;
  setIsSortOpen: (open: boolean) => void;
  isFilterActive: (filter: string) => boolean;
  toggleFilter: (filter: string) => void;
}

export const RestaurantFilters: React.FC<RestaurantFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  setIsVoiceSearchOpen,
  sortBy,
  setIsSortOpen,
  isFilterActive,
  toggleFilter
}) => {
  return (
    <>
      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <div className="flex-1 flex items-center justify-between px-4 py-1.5 bg-white border border-slate-200 rounded-[1.25rem] transition-all focus-within:border-slate-300">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-slate-900 stroke-[2.5] shrink-0" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for dishes" 
              className="w-full py-2 bg-transparent text-slate-700 font-medium text-base focus:outline-none placeholder:text-slate-500"
            />
          </div>
          <button 
            onClick={() => setIsVoiceSearchOpen(true)}
            className="p-1 -mr-1 text-blue-600 hover:bg-blue-50 rounded-full transition-all active:scale-90"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 -mx-4 px-4 pb-1">
        <button 
          onClick={() => setIsSortOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shrink-0 ${
            sortBy !== 'default' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
          }`}
        >
          <SlidersHorizontal className={`w-4 h-4 ${sortBy !== 'default' ? 'text-blue-500' : 'text-gray-700'}`} />
          <span className={`text-[15px] font-medium ${sortBy !== 'default' ? 'text-blue-500' : 'text-gray-700'}`}>Sort</span>
        </button>
        
        <button 
          onClick={() => toggleFilter('Pure Veg')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shrink-0 ${
            isFilterActive('Pure Veg') ? 'border-[#00bd6f] bg-[#e6fcf1]' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="w-4 h-4 border border-green-600 flex items-center justify-center rounded-sm bg-white">
            <div className="w-2 h-2 bg-green-600 rounded-full" />
          </div>
          <span className={`text-[15px] font-medium ${isFilterActive('Pure Veg') ? 'text-[#00bd6f]' : 'text-gray-700'}`}>Pure Veg</span>
        </button>

        <button 
          onClick={() => toggleFilter('Non Veg')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shrink-0 ${
            isFilterActive('Non Veg') ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="w-4 h-4 border border-red-600 flex items-center justify-center rounded-sm bg-white">
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-red-600" />
          </div>
          <span className={`text-[15px] font-medium ${isFilterActive('Non Veg') ? 'text-red-500' : 'text-gray-700'}`}>Non Veg</span>
        </button>

        <button 
          onClick={() => toggleFilter('Egg')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shrink-0 ${
            isFilterActive('Egg') ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="w-4 h-4 border border-yellow-500 flex items-center justify-center rounded-sm bg-white">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
          </div>
          <span className={`text-[15px] font-medium ${isFilterActive('Egg') ? 'text-yellow-600' : 'text-gray-700'}`}>Egg</span>
        </button>

        <button 
          onClick={() => toggleFilter('Ratings 4.0+')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shrink-0 ${
            isFilterActive('Ratings 4.0+') ? 'border-black bg-gray-100' : 'border-gray-200 bg-white'
          }`}
        >
          <span className={`text-[15px] font-medium ${isFilterActive('Ratings 4.0+') ? 'text-black' : 'text-gray-700'}`}>Ratings 4.0+</span>
        </button>

        <button 
          onClick={() => toggleFilter('Buy 1 Get 1')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shrink-0 ${
            isFilterActive('Buy 1 Get 1') ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
          }`}
        >
          <span className={`text-[15px] font-medium ${isFilterActive('Buy 1 Get 1') ? 'text-blue-500' : 'text-gray-700'}`}>Buy 1 Get 1</span>
        </button>
      </div>
    </>
  );
};
