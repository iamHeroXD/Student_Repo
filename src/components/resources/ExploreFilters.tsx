"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

export function ExploreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const hasActiveFilters =
    currentClass !== "all" ||
    currentStream !== "all" ||
    currentType !== "all" ||
    searchParams.has("q");

  const activeCount = [
    currentClass !== "all",
    currentStream !== "all",
    currentType !== "all",
  ].filter(Boolean).length;

  return (
    <div className="clay-card flex flex-col rounded-2xl border border-[#D8CEBE] bg-white p-4 sm:p-5 dark:border-[#1E2922] dark:bg-[#0F1310]">
      {/* Header bar — clickable on mobile/tablet to collapse/expand */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-1 items-center justify-between lg:cursor-default text-left"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F8FAFC]">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#10B981]" />
            <span>Filter Library</span>
            {activeCount > 0 && (
              <span className="rounded-full bg-[#10B981] px-2 py-0.5 text-2xs font-bold text-white">
                {activeCount}
              </span>
            )}
          </div>
          <span className="lg:hidden text-[#64748B] dark:text-[#94A3B8] p-1">
            {mobileOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="ml-3 flex items-center gap-1 text-2xs font-semibold text-[#10B981] hover:underline"
          >
            <X className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* Filter Controls: Collapsible on phone, 2-col grid on tablet, vertical stack on desktop */}
      <div
        className={`${
          mobileOpen ? "grid" : "hidden lg:grid"
        } grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-4 mt-3 border-t border-[#D8CEBE] dark:border-[#1E2922]`}
      >
        {/* Class Filter */}
        <div className="space-y-1.5">
          <label className="text-2xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
            Academic Class
          </label>
          <select
            value={currentClass}
            onChange={(e) => updateParam("class", e.target.value)}
            aria-label="Filter by Academic Class"
            className="w-full rounded-xl border border-[#D8CEBE] bg-white px-3 py-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
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
            className="w-full rounded-xl border border-[#D8CEBE] bg-white px-3 py-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
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
            className="w-full rounded-xl border border-[#D8CEBE] bg-white px-3 py-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
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
            className="w-full rounded-xl border border-[#D8CEBE] bg-white px-3 py-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
          >
            <option value="popular">Most Relevant & Popular</option>
            <option value="recent">Recently Added</option>
            <option value="rating">Highest Rated</option>
            <option value="downloads">Most Downloaded</option>
          </select>
        </div>
      </div>
    </div>
  );
}
