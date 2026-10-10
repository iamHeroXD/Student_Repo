"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchHeroProps {
  placeholder?: string;
}

export function SearchHero({ placeholder = "Search Plus Two Physics notes, Class 10 Maths previous questions..." }: SearchHeroProps) {
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

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-stone-300 bg-white py-3.5 pl-11 pr-28 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 transition"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 rounded-lg bg-stone-900 px-4 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-500 transition"
        >
          Search
        </button>
      </div>
    </form>
  );
}
