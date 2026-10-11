import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SearchHero } from "@/components/search/SearchHero";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { getApprovedResources } from "@/lib/supabase/persistence";
import { 
  FileText, 
  Sparkles, 
  GraduationCap, 
  Upload, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FolderOpen
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const approvedResources = await getApprovedResources();
  const popularResources = approvedResources.slice(0, 6);

  return (
    <div className="flex flex-col gap-10 sm:gap-16 pb-12 sm:pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-8 sm:pt-16 sm:pb-14 border-b border-[#E2E8F0] dark:border-[#1E2922]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-2xs sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-4 sm:mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Kerala State Board Academic Archive</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-[#090A0B] dark:text-[#F8FAFC] max-w-3xl">
            All your study materials in one place.
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-[#64748B] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
            Discover verified chapter notes, previous-year question papers, scoring keys, and practical manuals shared by students and educators across Kerala.
          </p>

          <div className="mt-6 sm:mt-8 w-full flex justify-center">
            <SearchHero />
          </div>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
            <span className="text-[#94A3B8] w-full sm:w-auto mb-1 sm:mb-0">Jump to class:</span>
            {siteConfig.supportedClasses.map((c) => (
              <Link
                key={c.id}
                href={`/class/${c.slug}`}
                className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs shadow-2xs hover:border-[#10B981] hover:text-[#10B981] dark:border-[#1E2922] dark:bg-[#0F1310] dark:hover:border-[#10B981] dark:hover:text-[#10B981] transition active:scale-95"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Choose Your Class Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#090A0B] dark:text-[#F8FAFC]">
              Browse by Standard & Class
            </h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Select your class to view curriculum-aligned resources.
            </p>
          </div>
          <Link href="/classes" className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1 shrink-0">
            All classes <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
          {siteConfig.supportedClasses.map((item) => (
            <Link
              key={item.id}
              href={`/class/${item.slug}`}
              className="last:col-span-2 sm:last:col-span-1 flex flex-col items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5 text-center shadow-2xs hover:border-[#10B981] hover:shadow-sm dark:border-[#1E2922] dark:bg-[#0F1310] transition group active:scale-[0.99]"
            >
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#F1F5F9] text-[#090A0B] group-hover:bg-emerald-500/10 group-hover:text-[#10B981] dark:bg-[#1E2922] dark:text-[#F8FAFC] transition mb-2.5 sm:mb-3">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="font-semibold text-xs sm:text-sm text-[#090A0B] dark:text-[#F8FAFC]">
                {item.name}
              </span>
              <span className="text-2xs sm:text-xs text-[#94A3B8] mt-0.5">
                Notes & Papers
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Learning Materials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#10B981]" />
              <h2 className="text-lg sm:text-xl font-bold text-[#090A0B] dark:text-[#F8FAFC]">
                Published Learning Materials
              </h2>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Verified PDF study materials uploaded by educators and students.
            </p>
          </div>

          <Link href="/explore" className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1 shrink-0">
            Explore <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {popularResources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E2E8F0] bg-white p-8 sm:p-12 text-center dark:border-[#1E2922] dark:bg-[#0F1310]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#10B981] mx-auto mb-3">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-[#090A0B] dark:text-[#F8FAFC]">
              No PDFs Published Yet
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 max-w-md mx-auto">
              The repository is clean and ready for real academic contributions. Upload your first chapter note or question paper PDF to publish it here.
            </p>
            <Link
              href="/upload"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#10B981] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#059669] transition"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload First PDF
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {popularResources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Core Features Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:p-10 dark:border-[#1E2922] dark:bg-[#0A0D0B]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-[#10B981] ring-1 ring-emerald-500/20">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-[#090A0B] dark:text-[#F8FAFC]">
                In-Browser PDF Reader
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Preview documents instantly without forced downloads. Read and download full PDFs directly from Supabase Storage.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-[#10B981] ring-1 ring-emerald-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-[#090A0B] dark:text-[#F8FAFC]">
                Verified Educator Status
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Clear badges distinguish verified teacher contributions and official examination department papers.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-[#10B981] ring-1 ring-emerald-500/20">
                <FolderOpen className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-[#090A0B] dark:text-[#F8FAFC]">
                No Clutter, No Popups
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                A calm, distraction-free environment built exclusively for serious academic revision and preparation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Teacher & Student Contribution CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8 dark:border-emerald-950 dark:bg-emerald-950/20">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#090A0B] dark:text-[#F8FAFC]">
              Are you an educator or student contributor?
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 max-w-xl">
              Share handwritten summaries, question banks, or answer schemes. Build an academic reputation and track how your materials help peers across Kerala.
            </p>
          </div>

          <Link
            href="/upload"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#10B981] px-5 py-3 sm:py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] transition shrink-0"
          >
            <Upload className="h-4 w-4" />
            Contribute to Repository
          </Link>
        </div>
      </section>
    </div>
  );
}
