"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, X } from "lucide-react";

interface SearchHeroProps {
  placeholder?: string;
}

export function SearchHero({ 
  placeholder = "Search Plus Two Physics, SSLC Maths, question papers..." 
}: SearchHeroProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/explore");
    }
  };

  const handleQuickSuggestion = (tag: string) => {
    setQuery(tag);
    router.push(`/explore?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <form onSubmit={handleSearch} className="w-full relative group">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 sm:left-4.5 h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#64748B] group-focus-within:text-[#10B981] transition duration-150 pointer-events-none" />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-[#E2E8F0] bg-white py-3.5 sm:py-4 pl-10 sm:pl-12 pr-24 sm:pr-32 text-base sm:text-sm text-[#090A0B] placeholder:text-[#94A3B8] shadow-xs focus:border-[#10B981] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F8FAFC] dark:placeholder:text-[#64748B] dark:focus:border-[#10B981] dark:focus:ring-emerald-500/15 transition duration-150"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-20 sm:right-24 text-[#94A3B8] hover:text-[#090A0B] dark:hover:text-[#F8FAFC] p-1 transition"
              aria-label="Clear search query"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 sm:right-2.5 sm:top-2.5 sm:bottom-2.5 rounded-xl bg-[#0A0D0B] px-3.5 sm:px-5 text-xs font-semibold text-white shadow-2xs hover:bg-[#1E2922] active:scale-98 dark:bg-[#10B981] dark:text-[#0A0D0B] dark:hover:bg-[#059669] transition duration-150"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggested quick chips */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-2xs text-[#64748B] dark:text-[#94A3B8]">
        <span className="flex items-center gap-1 text-[#94A3B8]">
          <Sparkles className="h-3 w-3 text-[#10B981]" /> Quick filter:
        </span>
        {["Plus Two Physics", "SSLC Maths", "Biology Notes", "Question Papers"].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleQuickSuggestion(chip)}
            className="rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-2xs text-[#090A0B] hover:border-[#10B981] hover:text-[#10B981] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F8FAFC] dark:hover:border-[#10B981] dark:hover:text-[#10B981] transition duration-150 active:scale-95"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
