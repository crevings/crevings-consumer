import React from "react";

export const HomeSkeleton: React.FC = () => {
  return (
    <div className="pb-8 space-y-10">
      {/* Spotlight Skeleton */}
      <div className="pl-4">
        <div className="h-6 w-40 bg-slate-100 rounded-lg animate-pulse mb-6" />
        <div className="flex gap-4 overflow-hidden pr-4">
          <div className="min-w-[300px] h-44 bg-slate-100 rounded-[1.5rem] animate-pulse" />
          <div className="min-w-[300px] h-44 bg-slate-100 rounded-[1.5rem] animate-pulse" />
        </div>
      </div>

      {/* Trending Skeleton */}
      <div className="px-4">
        <div className="h-6 w-36 bg-slate-100 rounded-lg animate-pulse mb-6" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="min-w-[280px] bg-white rounded-[1.5rem] p-3 flex items-center gap-4 border border-slate-100"
            >
              <div className="w-20 h-20 rounded-xl bg-slate-100 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-slate-100 rounded animate-pulse mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New on Crevings Skeleton */}
      <div className="px-4 mt-10">
        <div className="h-6 w-48 bg-slate-100 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[240px] h-[200px] rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col"
            >
              <div className="h-[130px] bg-slate-100 animate-pulse rounded-t-2xl" />
              <div className="p-3 space-y-2">
                <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="px-4 text-center">
        <div className="h-6 w-48 bg-slate-100 rounded-lg animate-pulse mb-4 text-left" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-slate-100 animate-pulse" />
              <div className="h-3 w-12 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Restaurant List Skeleton */}
      <div className="px-4 space-y-8">
        <div className="flex justify-between items-center">
          <div className="h-6 w-44 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
        </div>
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="h-60 bg-slate-100 animate-pulse" />
            <div className="p-7 space-y-4">
              <div className="h-6 w-2/3 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
              <div className="flex gap-3 pt-2">
                <div className="h-6 w-20 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-6 w-24 bg-slate-100 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
