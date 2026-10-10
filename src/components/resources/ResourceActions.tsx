"use client";

import { Bookmark, Share2 } from "lucide-react";

export function ResourceActions() {
  const handleSave = () => {
    alert("Saved to your personal library bookmark list!");
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Resource link copied to clipboard!");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <button 
        onClick={handleSave}
        className="flex items-center justify-center gap-1.5 rounded-lg border border-stone-200 py-2 font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 transition"
      >
        <Bookmark className="h-4 w-4" /> Save
      </button>
      <button 
        onClick={handleShare}
        className="flex items-center justify-center gap-1.5 rounded-lg border border-stone-200 py-2 font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 transition"
      >
        <Share2 className="h-4 w-4" /> Share
      </button>
    </div>
  );
}
