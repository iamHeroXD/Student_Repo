import { Suspense } from "react";
import { getApprovedResources } from "@/lib/supabase/persistence";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ExploreFilters } from "@/components/resources/ExploreFilters";
import { SearchHero } from "@/components/search/SearchHero";
import { BookOpen, Upload } from "lucide-react";
import Link from "next/link";

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string;
    class?: string;
    stream?: string;
    type?: string;
    sort?: string;
  }>;
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Explore Learning Resources",
  description: "Browse chapter notes, model questions, and scoring keys across all classes and streams in Kerala State Board.",
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q?.toLowerCase() || "";
  const filterClass = resolvedParams.class || "all";
  const filterStream = resolvedParams.stream || "all";
  const filterType = resolvedParams.type || "all";
  const sort = resolvedParams.sort || "popular";

  const allApproved = await getApprovedResources();

  let resources = allApproved.filter((res) => {
    if (filterClass !== "all" && res.class_id !== filterClass) return false;
    if (filterStream !== "all" && res.stream_id !== filterStream) return false;
    if (filterType !== "all" && res.resource_type_id !== filterType) return false;
    if (query) {
      const matchTitle = res.title.toLowerCase().includes(query);
      const matchDesc = res.description.toLowerCase().includes(query);
      const matchAuthor = res.author_name?.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchAuthor) return false;
    }
    return true;
  });

  if (sort === "recent") {
    resources = [...resources].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (sort === "rating") {
    resources = [...resources].sort((a, b) => {
      const rA = a.ratings_count > 0 ? a.rating_sum / a.ratings_count : 0;
      const rB = b.ratings_count > 0 ? b.rating_sum / b.ratings_count : 0;
      return rB - rA;
    });
  } else if (sort === "downloads") {
    resources = [...resources].sort((a, b) => b.downloads_count - a.downloads_count);
  } else {
    resources = [...resources].sort((a, b) => b.views_count - a.views_count);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-up">
      <div className="mb-6 flex flex-col gap-3.5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#090A0B] dark:text-[#F4EEE2] tracking-tight">
            Explore Library
          </h1>
          <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-0.5">
            {allApproved.length} verified PDFs • Filter by class, stream, or type
          </p>
        </div>

        <SearchHero />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        <aside className="lg:col-span-1">
          <Suspense fallback={<div className="h-64 rounded-2xl bg-[#E5DEC9] dark:bg-[#0F1310] animate-pulse" />}>
            <ExploreFilters />
          </Suspense>
        </aside>

        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3.5 text-xs text-[#5C574F] dark:text-[#94A3B8]">
            <span>Showing <strong className="text-[#090A0B] dark:text-[#F4EEE2]">{resources.length}</strong> results</span>
          </div>

          {resources.length === 0 ? (
            <div className="clay-card flex flex-col items-center justify-center rounded-2xl border border-[#D8CEBE] bg-white p-9 text-center dark:border-[#1E2922] dark:bg-[#0F1310]">
              <div className="animate-float-slow clay-pill flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/12 text-[#10B981] mb-2.5 ring-1 ring-[#10B981]/20">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-[#090A0B] dark:text-[#F4EEE2] text-sm">
                {allApproved.length === 0 ? "No PDFs Uploaded Yet" : "No matching PDFs"}
              </h3>
              <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-0.5">
                {allApproved.length === 0
                  ? "Upload the first study note or question paper PDF."
                  : "Try clearing filters or searching another keyword."}
              </p>
              <Link
                href="/upload"
                className="clay-btn mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-[#10B981] px-4 py-2 text-xs font-bold text-[#090A0B] hover:text-white transition-all active:scale-96"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload PDF
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {resources.map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
