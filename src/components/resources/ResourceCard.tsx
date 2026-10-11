import Link from "next/link";
import { Resource } from "@/types";
import { formatFileSize } from "@/lib/utils";
import { FileText, Star, CheckCircle2, User, ArrowUpRight, Sparkles } from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const avgRating = resource.ratings_count > 0 
    ? (resource.rating_sum / resource.ratings_count).toFixed(1)
    : null;

  const hasStudyInsights = Boolean(
    resource.quick_notes || resource.pyq_analysis || resource.exam_predictions
  );

  return (
    <div className="card-interactive group relative overflow-hidden flex flex-col justify-between rounded-2xl border border-[#D8CEBE] bg-white p-5 hover:border-[#2FB617]/60 dark:border-[#1E2922] dark:bg-[#0F1310] dark:hover:border-[#2FB617]/50">
      {/* Subtle top green accent bar on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#2FB617] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-lg bg-[#E5DEC9] px-2.5 py-0.5 text-2xs font-semibold text-[#090A0B] dark:bg-[#1E2922] dark:text-[#F4EEE2] capitalize">
              {resource.class_id.replace("-", " ")}
            </span>
            <span className="inline-flex items-center rounded-lg bg-[#2FB617]/10 px-2.5 py-0.5 text-2xs font-semibold text-[#259212] ring-1 ring-[#2FB617]/20 dark:bg-[#2FB617]/15 dark:text-[#2FB617] capitalize">
              {resource.resource_type_id.replace("-", " ")}
            </span>
            {resource.has_answer_key && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#2FB617]/10 px-2 py-0.5 text-2xs font-semibold text-[#259212] ring-1 ring-[#2FB617]/20 dark:bg-[#2FB617]/15 dark:text-[#2FB617]">
                <CheckCircle2 className="h-3 w-3" /> Key
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#E8DFCE]/80 px-2 py-0.5 text-2xs font-semibold text-[#090A0B] dark:bg-[#161F19] dark:text-[#F4EEE2]">
              <Sparkles className="h-2.5 w-2.5 text-[#2FB617]" />
              {hasStudyInsights ? "Notes + PYQ" : "Smart Notes"}
            </span>
          </div>

          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8DFCE]/70 text-[#5C574F] group-hover:bg-[#2FB617]/15 group-hover:text-[#2FB617] dark:bg-[#161F19] dark:text-[#94A3B8] transition-colors">
            <FileText className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm sm:text-base text-[#090A0B] group-hover:text-[#2FB617] dark:text-[#F4EEE2] dark:group-hover:text-[#2FB617] transition-colors line-clamp-2">
          <Link href={`/resource/${resource.slug}`} className="focus:outline-none">
            <span className="absolute inset-0 z-0" aria-hidden="true" />
            {resource.title}
          </Link>
        </h3>

        {/* Description snippet */}
        <p className="mt-2 text-xs text-[#5C574F] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
          {resource.description}
        </p>
      </div>

      <div className="mt-5 pt-3.5 border-t border-[#D8CEBE]/70 dark:border-[#1E2922]">
        {/* Contributor and Rating */}
        <div className="flex items-center justify-between text-xs text-[#5C574F] dark:text-[#94A3B8]">
          <div className="flex items-center gap-1.5 truncate max-w-[180px]">
            {resource.uploader?.avatar_url ? (
              <img
                src={resource.uploader.avatar_url}
                alt={resource.author_name || resource.uploader?.full_name || "Contributor"}
                className="h-4 w-4 rounded-full object-cover shrink-0 ring-1 ring-[#2FB617]/30"
              />
            ) : (
              <User className="h-3.5 w-3.5 shrink-0 text-[#8C8375]" />
            )}
            <span className="truncate font-medium">{resource.author_name || resource.uploader?.full_name || "Community"}</span>
            {resource.uploader?.verification_status === "verified" && (
              <span title="Verified Contributor">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#2FB617] shrink-0" />
              </span>
            )}
          </div>

          {avgRating && (
            <div className="flex items-center gap-1 font-semibold text-[#090A0B] dark:text-[#F4EEE2]">
              <Star className="h-3.5 w-3.5 fill-[#2FB617] text-[#2FB617]" />
              <span>{avgRating}</span>
              <span className="font-normal text-[#8C8375]">({resource.ratings_count})</span>
            </div>
          )}
        </div>

        {/* Footer Meta & Action */}
        <div className="mt-2.5 flex items-center justify-between text-2xs sm:text-xs text-[#8C8375]">
          <span className="font-mono">{resource.page_count}p • {formatFileSize(resource.file_size_bytes)}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-[#2FB617] group-hover:text-[#259212] transition-colors">
            Read PDF
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
}

