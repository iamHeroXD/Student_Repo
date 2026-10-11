"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, X, ArrowRight } from "lucide-react";

interface SearchHeroProps {
  placeholder?: string;
}

export function SearchHero({ 
  placeholder = "Search Plus Two Physics, SSLC Maths, question papers..." 
}: SearchHeroProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA" &&
        document.activeElement?.tagName !== "SELECT"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
          <Search className="absolute left-3.5 sm:left-4.5 h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#5C574F] group-focus-within:text-[#2FB617] group-focus-within:scale-110 transition-all duration-200 pointer-events-none" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="clay-input w-full rounded-2xl border border-[#D8CEBE] bg-white py-3.5 sm:py-4 pl-10 sm:pl-12 pr-28 sm:pr-36 text-base sm:text-sm text-[#090A0B] placeholder:text-[#8C8375] hover:border-[#B8AC99] focus:border-[#2FB617] focus:outline-none focus:ring-4 focus:ring-emerald-500/12 dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F4EEE2] dark:placeholder:text-[#64748B] dark:hover:border-[#2C3D32] dark:focus:border-[#2FB617] dark:focus:ring-emerald-500/15 transition-all duration-200"
          />

          {!query && (
            <kbd className="hidden sm:inline-flex items-center justify-center absolute right-28 rounded-md border border-[#D8CEBE] bg-[#E8DFCE]/70 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#5C574F] pointer-events-none dark:border-[#1E2922] dark:bg-[#161F19] dark:text-[#94A3B8]">
              /
            </kbd>
          )}

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-22 sm:right-26 text-[#8C8375] hover:text-[#090A0B] dark:hover:text-[#F4EEE2] p-1 transition"
              aria-label="Clear search query"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            type="submit"
            className="clay-btn-dark absolute right-2 top-2 bottom-2 sm:right-2.5 sm:top-2.5 sm:bottom-2.5 inline-flex items-center gap-1.5 rounded-xl bg-[#090A0B] px-3.5 sm:px-4.5 text-xs font-semibold text-white hover:bg-[#2FB617] active:scale-96 dark:bg-[#2FB617] dark:text-[#090A0B] dark:hover:bg-[#259212] dark:hover:text-white transition-all duration-200"
          >
            <span>Search</span>
            <ArrowRight className="hidden sm:inline h-3.5 w-3.5" />
          </button>
        </div>
      </form>

      {/* Suggested quick chips */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-2xs text-[#5C574F] dark:text-[#94A3B8]">
        <span className="flex items-center gap-1 text-[#8C8375] mr-0.5">
          <Sparkles className="h-3 w-3 text-[#2FB617] animate-pulse-subtle" /> Quick:
        </span>
        {["Plus Two Physics", "SSLC Maths", "Biology Notes", "Question Papers"].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleQuickSuggestion(chip)}
            className="clay-pill rounded-full border border-[#D8CEBE] bg-white px-2.5 py-1 text-2xs font-medium text-[#090A0B] hover:-translate-y-0.5 hover:border-[#2FB617] hover:text-[#2FB617] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F4EEE2] dark:hover:border-[#2FB617] dark:hover:text-[#2FB617] transition-all duration-200 active:scale-95"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
