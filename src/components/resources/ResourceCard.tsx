import Link from "next/link";
import { Resource } from "@/types";
import { formatFileSize, formatDate } from "@/lib/utils";
import { FileText, Star, CheckCircle2, User } from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const avgRating = resource.ratings_count > 0 
    ? (resource.rating_sum / resource.ratings_count).toFixed(1)
    : null;

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-2xs hover:border-[#10B981]/50 hover:shadow-md dark:border-[#1E2922] dark:bg-[#0F1310] dark:hover:border-[#10B981]/40 transition">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center rounded-md bg-[#F1F5F9] px-2 py-0.5 text-xs font-medium text-[#090A0B] dark:bg-[#1E2922] dark:text-[#F8FAFC] capitalize">
            {resource.class_id.replace("-", " ")}
          </span>
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-400">
            {resource.resource_type_id.replace("-", " ")}
          </span>
          {resource.has_answer_key && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Answer Key
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm sm:text-base text-[#090A0B] group-hover:text-[#10B981] dark:text-[#F8FAFC] dark:group-hover:text-[#10B981] transition line-clamp-2">
          <Link href={`/resource/${resource.slug}`}>
            {resource.title}
          </Link>
        </h3>

        {/* Description snippet */}
        <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
          {resource.description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-[#F1F5F9] dark:border-[#1E2922]">
        {/* Contributor and Rating */}
        <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
          <div className="flex items-center gap-1.5 truncate max-w-[180px]">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{resource.author_name || resource.uploader?.full_name || "Community"}</span>
            {resource.uploader?.verification_status === "verified" && (
              <span title="Verified Contributor">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
              </span>
            )}
          </div>

          {avgRating && (
            <div className="flex items-center gap-1 font-semibold text-[#090A0B] dark:text-[#F8FAFC]">
              <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
              <span>{avgRating}</span>
              <span className="font-normal text-[#94A3B8]">({resource.ratings_count})</span>
            </div>
          )}
        </div>

        {/* Footer Meta & Action */}
        <div className="mt-3 flex items-center justify-between text-xs text-[#94A3B8]">
          <span>{resource.page_count} pages • {formatFileSize(resource.file_size_bytes)}</span>
          <Link
            href={`/resource/${resource.slug}`}
            className="font-medium text-[#10B981] hover:text-[#059669] transition"
          >
            Preview Document →
          </Link>
        </div>
      </div>
    </div>
  );
}
