"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Filter, X, SlidersHorizontal } from "lucide-react";

export function ExploreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentClass = searchParams.get("class") || "all";
  const currentStream = searchParams.get("stream") || "all";
  const currentType = searchParams.get("type") || "all";
  const currentSort = searchParams.get("sort") || "popular";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/explore?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/explore");
  };

  const hasActiveFilters = currentClass !== "all" || currentStream !== "all" || currentType !== "all" || searchParams.has("q");

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-[#E2E8F0] bg-white p-5 dark:border-[#1E2922] dark:bg-[#0F1310] shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1E2922]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F8FAFC]">
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#10B981]" />
          <span>Filter Library</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-2xs font-semibold text-[#10B981] hover:underline"
          >
            <X className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* Class Filter */}
      <div className="space-y-1.5">
        <label className="text-2xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
          Academic Class
        </label>
        <select
          value={currentClass}
          onChange={(e) => updateParam("class", e.target.value)}
          aria-label="Filter by Academic Class"
          className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
        >
          <option value="all">All Classes</option>
          {siteConfig.supportedClasses.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stream Filter */}
      <div className="space-y-1.5">
        <label className="text-2xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
          Curriculum Stream
        </label>
        <select
          value={currentStream}
          onChange={(e) => updateParam("stream", e.target.value)}
          aria-label="Filter by Subject Stream"
          className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
        >
          <option value="all">All Streams</option>
          {siteConfig.streams.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Resource Type */}
      <div className="space-y-1.5">
        <label className="text-2xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
          Resource Type
        </label>
        <select
          value={currentType}
          onChange={(e) => updateParam("type", e.target.value)}
          aria-label="Filter by Resource Type"
          className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
        >
          <option value="all">All Material Types</option>
          {siteConfig.resourceTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div className="space-y-1.5">
        <label className="text-2xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
          Sort By
        </label>
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          aria-label="Sort Results"
          className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
        >
          <option value="popular">Most Relevant & Popular</option>
          <option value="recent">Recently Added</option>
          <option value="rating">Highest Rated</option>
          <option value="downloads">Most Downloaded</option>
        </select>
      </div>
    </div>
  );
}
