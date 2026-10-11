"use client";

import { useState, useEffect } from "react";
import { Bookmark, Share2, Check, Star } from "lucide-react";
import { rateResourceAction } from "@/lib/auth/actions";

interface ResourceActionsProps {
  resourceId: string;
  slug: string;
}

export function ResourceActions({ resourceId, slug }: ResourceActionsProps) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedStar, setSelectedStar] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem("sr_bookmarks") || "[]") as string[];
      setSaved(list.includes(slug));
      const ratedMap = JSON.parse(localStorage.getItem("sr_ratings") || "{}") as Record<string, number>;
      if (ratedMap[resourceId]) {
        setSelectedStar(ratedMap[resourceId]);
        setRatingSubmitted(true);
      }
    } catch {
      // ignore storage errors
    }
  }, [slug, resourceId]);

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

  const handleRate = async (stars: number) => {
    if (ratingSubmitted) return;
    setSelectedStar(stars);
    setRatingSubmitted(true);
    try {
      const ratedMap = JSON.parse(localStorage.getItem("sr_ratings") || "{}") as Record<string, number>;
      ratedMap[resourceId] = stars;
      localStorage.setItem("sr_ratings", JSON.stringify(ratedMap));
    } catch {
      // ignore
    }
    await rateResourceAction(resourceId, stars);
  };

  return (
    <div className="space-y-4">
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

      {/* Interactive 1-5 Star Rating */}
      <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-center dark:border-[#1E2922] dark:bg-[#0A0D0B]">
        <span className="block text-2xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-1.5">
          {ratingSubmitted ? "Thanks for rating this material!" : "Rate this material"}
        </span>
        <div className="flex items-center justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={ratingSubmitted}
              onClick={() => handleRate(star)}
              aria-label={`Rate ${star} stars`}
              className="p-1 transition hover:scale-110 disabled:cursor-default"
            >
              <Star
                className={`h-5 w-5 ${
                  star <= selectedStar
                    ? "fill-[#10B981] text-[#10B981]"
                    : "text-[#94A3B8] hover:text-[#10B981]"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
