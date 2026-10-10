"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Filter, X } from "lucide-react";

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
    <div className="flex flex-col gap-5 rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-stone-100">
          <Filter className="h-4 w-4 text-amber-600" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </button>
        )}
      </div>

      {/* Class Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
          Academic Class
        </label>
        <select
          value={currentClass}
          onChange={(e) => updateParam("class", e.target.value)}
          aria-label="Filter by Academic Class"
          className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
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
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
          Subject Stream
        </label>
        <select
          value={currentStream}
          onChange={(e) => updateParam("stream", e.target.value)}
          aria-label="Filter by Subject Stream"
          className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
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
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
          Resource Type
        </label>
        <select
          value={currentType}
          onChange={(e) => updateParam("type", e.target.value)}
          aria-label="Filter by Resource Type"
          className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
        >
          <option value="all">All Types</option>
          {siteConfig.resourceTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
          Sort Results
        </label>
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          aria-label="Sort Results"
          className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
        >
          <option value="popular">Most Popular</option>
          <option value="recent">Recently Added</option>
          <option value="rating">Highest Rated</option>
          <option value="downloads">Most Downloaded</option>
        </select>
      </div>
    </div>
  );
}
