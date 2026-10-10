import { Suspense } from "react";
import { mockResources } from "@/lib/data/resources";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ExploreFilters } from "@/components/resources/ExploreFilters";
import { SearchHero } from "@/components/search/SearchHero";
import { siteConfig } from "@/config/site";
import { BookOpen } from "lucide-react";

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

  // Filter resources
  let resources = mockResources.filter((res) => {
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

  // Sort resources
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
    // popular default
    resources = [...resources].sort((a, b) => b.views_count - a.views_count);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search Header */}
      <div className="mb-8 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            Academic Resource Library
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Search across {mockResources.length}+ verified notes, question papers, and study materials.
          </p>
        </div>

        <SearchHero />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-1">
          <Suspense fallback={<div className="h-64 rounded-xl bg-stone-100 animate-pulse" />}>
            <ExploreFilters />
          </Suspense>
        </aside>

        {/* Right Resource Grid */}
        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4 text-xs text-stone-500">
            <span>Showing <strong className="text-stone-800 dark:text-stone-200">{resources.length}</strong> resources</span>
          </div>

          {resources.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 p-12 text-center dark:border-stone-800">
              <BookOpen className="h-10 w-10 text-stone-400 mb-3" />
              <h3 className="font-semibold text-stone-800 dark:text-stone-200 text-sm">
                No matching resources found
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm">
                Try clearing active filters or searching with different keywords like &quot;Physics&quot; or &quot;Maths&quot;.
              </p>
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
