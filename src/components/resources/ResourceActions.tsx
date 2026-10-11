"use client";

import { useState, useEffect } from "react";
import { Bookmark, Share2, Check } from "lucide-react";

interface ResourceActionsProps {
  slug?: string;
}

export function ResourceActions({ slug = "default" }: ResourceActionsProps) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem("sr_bookmarks") || "[]") as string[];
      setSaved(list.includes(slug));
    } catch {
      // ignore storage errors
    }
  }, [slug]);

  const handleSave = () => {
    try {
      const list = JSON.parse(localStorage.getItem("sr_bookmarks") || "[]") as string[];
      const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
      localStorage.setItem("sr_bookmarks", JSON.stringify(next));
      setSaved(next.includes(slug));
    } catch {
      setSaved(!saved);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2.5 text-xs">
      <button
        onClick={handleSave}
        className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 font-semibold transition active:scale-[0.98] ${
          saved
            ? "border-[#10B981] bg-[#10B981]/10 text-[#059669] dark:text-[#10B981]"
            : "border-[#E2E8F0] bg-white text-[#090A0B] hover:border-[#10B981]/50 hover:bg-[#F8FAFC] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC] dark:hover:bg-[#121713]"
        }`}
      >
        <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        {saved ? "Saved" : "Save"}
      </button>
      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white py-2.5 font-semibold text-[#090A0B] hover:border-[#10B981]/50 hover:bg-[#F8FAFC] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC] dark:hover:bg-[#121713] transition active:scale-[0.98]"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-[#10B981]" />
            <span className="text-[#10B981]">Copied Link</span>
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" /> Share
          </>
        )}
      </button>
    </div>
  );
}
