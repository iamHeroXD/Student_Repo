import Link from "next/link";
import { Resource } from "@/types";
import { formatFileSize, formatDate } from "@/lib/utils";
import { FileText, Download, Bookmark, Star, CheckCircle2, User } from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const avgRating = resource.ratings_count > 0 
    ? (resource.rating_sum / resource.ratings_count).toFixed(1)
    : null;

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-xs transition hover:border-stone-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <span className="inline-flex items-center rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300 capitalize">
            {resource.class_id.replace("-", " ")}
          </span>
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-400">
            {resource.resource_type_id.replace("-", " ")}
          </span>
          {resource.has_answer_key && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Answer Key
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base text-stone-900 group-hover:text-amber-600 dark:text-stone-100 dark:group-hover:text-amber-400 transition line-clamp-2">
          <Link href={`/resource/${resource.slug}`}>
            {resource.title}
          </Link>
        </h3>

        {/* Description snippet */}
        <p className="mt-2 text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800/80">
        {/* Contributor and Rating */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5 truncate max-w-[180px]">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{resource.author_name || resource.uploader?.full_name || "Community Member"}</span>
            {resource.uploader?.verification_status === "verified" && (
              <span title="Verified Contributor">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              </span>
            )}
          </div>

          {avgRating && (
            <div className="flex items-center gap-1 font-semibold text-stone-700 dark:text-stone-300">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{avgRating}</span>
              <span className="font-normal text-stone-400">({resource.ratings_count})</span>
            </div>
          )}
        </div>

        {/* Footer Meta & Action */}
        <div className="mt-3 flex items-center justify-between text-xs text-stone-400">
          <span>{resource.page_count} pages • {formatFileSize(resource.file_size_bytes)}</span>
          <Link
            href={`/resource/${resource.slug}`}
            className="font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
          >
            Preview Document →
          </Link>
        </div>
      </div>
    </div>
  );
}
