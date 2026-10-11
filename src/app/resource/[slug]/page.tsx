import { notFound } from "next/navigation";
import { getResourceBySlug } from "@/lib/supabase/persistence";
import { getCurrentSession } from "@/lib/auth/session";
import { DocumentPreview } from "@/components/resources/DocumentPreview";
import { ResourceStudyCompanion } from "@/components/resources/ResourceStudyCompanion";
import { formatFileSize, formatDate } from "@/lib/utils";
import { ResourceActions } from "@/components/resources/ResourceActions";
import Link from "next/link";
import { 
  Star, 
  User, 
  CheckCircle2, 
  ArrowLeft
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ResourceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ResourceDetailPageProps) {
  const resolved = await params;
  const resource = await getResourceBySlug(resolved.slug);
  if (!resource) return { title: "Resource Not Found" };
  return {
    title: resource.title,
    description: resource.description,
  };
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const resolved = await params;
  const [resource, sessionUser] = await Promise.all([
    getResourceBySlug(resolved.slug),
    getCurrentSession(),
  ]);

  if (!resource) {
    notFound();
  }

  const avgRating = resource.ratings_count > 0 
    ? (resource.rating_sum / resource.ratings_count).toFixed(1)
    : "Unrated";

  const contributorUsername = resource.uploader?.username || "studentrepo_admin";
  const showStreamBadge =
    (resource.class_id === "plus-one" || resource.class_id === "plus-two") &&
    Boolean(resource.stream_id);

  const canEditInsights = Boolean(sessionUser);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-up">
      <div className="mb-6">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#2FB617] dark:text-[#94A3B8] transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to library
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Document Details & Reader */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-lg bg-[#E5DEC9] px-2.5 py-1 text-xs font-semibold text-[#090A0B] dark:bg-[#1E2922] dark:text-[#F8FAFC] capitalize">
                {resource.class_id.replace("-", " ")}
              </span>
              <span className="rounded-lg bg-[#2FB617]/10 px-2.5 py-1 text-xs font-semibold text-[#259212] ring-1 ring-[#2FB617]/20 dark:text-[#2FB617] capitalize">
                {resource.resource_type_id.replace("-", " ")}
              </span>
              {showStreamBadge && (
                <span className="rounded-lg bg-[#E5DEC9] px-2.5 py-1 text-xs font-medium text-[#64748B] dark:bg-[#1E2922] dark:text-[#94A3B8] capitalize">
                  {resource.stream_id} Stream
                </span>
              )}
              {resource.status !== "approved" && (
                <span className="rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                  {resource.status.replace("_", " ")}
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

          {/* Real Embedded PDF Preview */}
          <DocumentPreview 
            resourceId={resource.id}
            title={resource.title}
            pageCount={resource.page_count}
            downloadAllowed={resource.download_allowed}
          />

          {/* Quick Notes, Previous Year (PYQ) Analysis & Exam Predictions */}
          <ResourceStudyCompanion
            resourceId={resource.id}
            slug={resource.slug}
            title={resource.title}
            classId={resource.class_id}
            subjectId={resource.subject_id}
            resourceTypeId={resource.resource_type_id}
            quickNotes={resource.quick_notes}
            pyqAnalysis={resource.pyq_analysis}
            examPredictions={resource.exam_predictions}
            canEdit={canEditInsights}
          />

          {/* Attribution & Rights Statement */}
          <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-5 dark:border-[#1E2922] dark:bg-[#0F1310]">
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
          <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-5 space-y-4 dark:border-[#1E2922] dark:bg-[#0F1310]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8CEBE] dark:border-[#1E2922]">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">Document Rating</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#2FB617] text-[#2FB617]" />
                <span className="font-bold text-sm text-[#090A0B] dark:text-[#F8FAFC]">{avgRating}</span>
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">({resource.ratings_count} votes)</span>
              </div>
            </div>

            <ResourceActions resourceId={resource.id} slug={resource.slug} />
          </div>

          {/* Contributor Card */}
          <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-5 dark:border-[#1E2922] dark:bg-[#0F1310]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-3">
              Contributor Profile
            </h3>
            <Link href={`/u/${contributorUsername}`} className="flex items-center gap-3 group">
              {resource.uploader?.avatar_url ? (
                <img
                  src={resource.uploader.avatar_url}
                  alt={resource.author_name || resource.uploader?.full_name || contributorUsername}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-[#2FB617]/30 shrink-0"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2FB617]/10 text-[#2FB617] shrink-0">
                  <User className="h-5 w-5" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-[#090A0B] group-hover:text-[#2FB617] dark:text-[#F8FAFC] transition">
                    {resource.author_name || resource.uploader?.full_name}
                  </span>
                  {resource.uploader?.verification_status === "verified" && (
                    <span title="Verified Contributor">
                      <CheckCircle2 className="h-4 w-4 text-[#2FB617]" />
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  @{contributorUsername} • {resource.uploader?.role === "teacher" ? "Verified Educator" : "Contributor"}
                </span>
              </div>
            </Link>
          </div>

          {/* Metadata Specs Card */}
          <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-5 space-y-3 dark:border-[#1E2922] dark:bg-[#0F1310] text-xs">
            <h3 className="font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2">
              Document Specifications
            </h3>
            
            <div className="flex justify-between py-1.5 border-b border-[#D8CEBE] dark:border-[#1E2922]">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Board / Curriculum</span>
              <span className="font-semibold text-[#090A0B] dark:text-[#F8FAFC]">Kerala SCERT / DHSE</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#D8CEBE] dark:border-[#1E2922]">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Total Pages</span>
              <span className="font-semibold text-[#090A0B] dark:text-[#F8FAFC]">{resource.page_count} Pages</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#D8CEBE] dark:border-[#1E2922]">
              <span className="text-[#64748B] dark:text-[#94A3B8]">File Size</span>
              <span className="font-semibold text-[#090A0B] dark:text-[#F8FAFC]">{formatFileSize(resource.file_size_bytes)}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#D8CEBE] dark:border-[#1E2922]">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Language</span>
              <span className="font-semibold text-[#090A0B] dark:text-[#F8FAFC]">{resource.language}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#D8CEBE] dark:border-[#1E2922]">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Downloads</span>
              <span className="font-semibold text-[#090A0B] dark:text-[#F8FAFC]">{resource.downloads_count || 0}</span>
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

