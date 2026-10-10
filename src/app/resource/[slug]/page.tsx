import { notFound } from "next/navigation";
import { mockResources } from "@/lib/data/resources";
import { DocumentPreview } from "@/components/resources/DocumentPreview";
import { formatFileSize, formatDate } from "@/lib/utils";
import { ResourceActions } from "@/components/resources/ResourceActions";
import Link from "next/link";
import { 
  Bookmark, 
  Share2, 
  Star, 
  FileText, 
  Calendar, 
  User, 
  CheckCircle2, 
  ShieldAlert, 
  Award,
  Layers,
  ArrowLeft
} from "lucide-react";

interface ResourceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return mockResources.map((r) => ({
    slug: r.slug,
  }));
}

export async function generateMetadata({ params }: ResourceDetailPageProps) {
  const resolved = await params;
  const resource = mockResources.find((r) => r.slug === resolved.slug);
  if (!resource) return { title: "Resource Not Found" };
  return {
    title: resource.title,
    description: resource.description,
  };
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const resolved = await params;
  const resource = mockResources.find((r) => r.slug === resolved.slug);

  if (!resource) {
    notFound();
  }

  const avgRating = resource.ratings_count > 0 
    ? (resource.rating_sum / resource.ratings_count).toFixed(1)
    : "Unrated";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to library
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Document Details & Reader */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-md bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-800 dark:bg-stone-800 dark:text-stone-200 capitalize">
                {resource.class_id.replace("-", " ")}
              </span>
              <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-400">
                {resource.resource_type_id.replace("-", " ")}
              </span>
              {resource.stream_id && (
                <span className="rounded-md bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-400 capitalize">
                  {resource.stream_id} Stream
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {resource.title}
            </h1>

            <p className="mt-3 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* Interactive Document Preview */}
          <DocumentPreview 
            title={resource.title}
            pageCount={resource.page_count}
            downloadAllowed={resource.download_allowed}
            samplePath={resource.storage_path}
          />

          {/* Attribution & Rights Statement */}
          <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Attribution & Rights Declaration
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {resource.rights_declaration}
            </p>
            {resource.school_or_institution && (
              <p className="text-xs text-stone-500 mt-2">
                Institution: <span className="font-medium text-stone-700 dark:text-stone-300">{resource.school_or_institution}</span>
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Information & Actions */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-4 dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <span className="text-xs font-semibold text-stone-500">Document Rating</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-sm text-stone-900 dark:text-stone-100">{avgRating}</span>
                <span className="text-xs text-stone-400">({resource.ratings_count} votes)</span>
              </div>
            </div>

            <ResourceActions />
          </div>

          {/* Contributor Card */}
          <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Contributor Profile
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                    {resource.author_name || resource.uploader?.full_name}
                  </span>
                  {resource.uploader?.verification_status === "verified" && (
                    <span title="Verified Contributor">
                      <CheckCircle2 className="h-4 w-4 text-amber-500" />
                    </span>
                  )}
                </div>
                <span className="text-xs text-stone-400">
                  {resource.uploader?.role === "teacher" ? "Verified Educator" : "Community Contributor"}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata Specs Card */}
          <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-3 dark:border-stone-800 dark:bg-stone-900 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-stone-500 mb-2">
              Document Specifications
            </h3>
            
            <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
              <span className="text-stone-500">Board / Curriculum</span>
              <span className="font-medium text-stone-800 dark:text-stone-200">Kerala SCERT / DHSE</span>
            </div>

            <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
              <span className="text-stone-500">Total Pages</span>
              <span className="font-medium text-stone-800 dark:text-stone-200">{resource.page_count} Pages</span>
            </div>

            <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
              <span className="text-stone-500">File Size</span>
              <span className="font-medium text-stone-800 dark:text-stone-200">{formatFileSize(resource.file_size_bytes)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
              <span className="text-stone-500">Language</span>
              <span className="font-medium text-stone-800 dark:text-stone-200">{resource.language}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-stone-500">Date Added</span>
              <span className="font-medium text-stone-800 dark:text-stone-200">{formatDate(resource.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
