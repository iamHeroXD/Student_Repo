import { notFound } from "next/navigation";
import { mockResources } from "@/lib/data/resources";
import { DocumentPreview } from "@/components/resources/DocumentPreview";
import { formatFileSize, formatDate } from "@/lib/utils";
import { ResourceActions } from "@/components/resources/ResourceActions";
import Link from "next/link";
import { 
  Star, 
  User, 
  CheckCircle2, 
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

  const contributorUsername = resource.uploader?.username || "radhakrishnan_bio";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#10B981] dark:text-[#94A3B8] transition"
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
              <span className="rounded-lg bg-[#F1F5F9] px-2.5 py-1 text-xs font-semibold text-[#090A0B] dark:bg-[#1E2922] dark:text-[#F8FAFC] capitalize">
                {resource.class_id.replace("-", " ")}
              </span>
              <span className="rounded-lg bg-[#10B981]/10 px-2.5 py-1 text-xs font-semibold text-[#059669] ring-1 ring-[#10B981]/20 dark:text-[#10B981] capitalize">
                {resource.resource_type_id.replace("-", " ")}
              </span>
              {resource.stream_id && (
                <span className="rounded-lg bg-[#F1F5F9] px-2.5 py-1 text-xs font-medium text-[#64748B] dark:bg-[#1E2922] dark:text-[#94A3B8] capitalize">
                  {resource.stream_id} Stream
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC] tracking-tight">
              {resource.title}
            </h1>

            <p className="mt-3 text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
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
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 dark:border-[#1E2922] dark:bg-[#0F1310]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2">
              Attribution & Rights Declaration
            </h3>
            <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              {resource.rights_declaration}
            </p>
            {resource.school_or_institution && (
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2">
                Institution: <span className="font-semibold text-[#090A0B] dark:text-[#F8FAFC]">{resource.school_or_institution}</span>
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Information & Actions */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-4 dark:border-[#1E2922] dark:bg-[#0F1310]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1E2922]">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">Document Rating</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#10B981] text-[#10B981]" />
                <span className="font-bold text-sm text-[#090A0B] dark:text-[#F8FAFC]">{avgRating}</span>
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">({resource.ratings_count} votes)</span>
              </div>
            </div>

            <ResourceActions slug={resource.slug} />
          </div>

          {/* Contributor Card */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 dark:border-[#1E2922] dark:bg-[#0F1310]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-3">
              Contributor Profile
            </h3>
            <Link href={`/u/${contributorUsername}`} className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981]/10 text-[#10B981]">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-[#090A0B] group-hover:text-[#10B981] dark:text-[#F8FAFC] transition">
                    {resource.author_name || resource.uploader?.full_name}
                  </span>
                  {resource.uploader?.verification_status === "verified" && (
                    <span title="Verified Contributor">
                      <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  {resource.uploader?.role === "teacher" ? "Verified Educator" : "Community Contributor"}
                </span>
              </div>
            </Link>
          </div>

          {/* Metadata Specs Card */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-3 dark:border-[#1E2922] dark:bg-[#0F1310] text-xs">
            <h3 className="font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2">
              Document Specifications
            </h3>
            
            <div className="flex justify-between py-1.5 border-b border-[#E2E8F0] dark:border-[#1E2922]">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Board / Curriculum</span>
              <span className="font-semibold text-[#090A0B] dark:text-[#F8FAFC]">Kerala SCERT / DHSE</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#E2E8F0] dark:border-[#1E2922]">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Total Pages</span>
              <span className="font-semibold text-[#090A0B] dark:text-[#F8FAFC]">{resource.page_count} Pages</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#E2E8F0] dark:border-[#1E2922]">
              <span className="text-[#64748B] dark:text-[#94A3B8]">File Size</span>
              <span className="font-semibold text-[#090A0B] dark:text-[#F8FAFC]">{formatFileSize(resource.file_size_bytes)}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#E2E8F0] dark:border-[#1E2922]">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Language</span>
              <span className="font-semibold text-[#090A0B] dark:text-[#F8FAFC]">{resource.language}</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Date Added</span>
              <span className="font-semibold text-[#090A0B] dark:text-[#F8FAFC]">{formatDate(resource.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
