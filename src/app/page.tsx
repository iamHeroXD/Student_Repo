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
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  FolderOpen,
  BookOpen,
  Layers,
  CheckCircle2
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const approvedResources = await getApprovedResources();
  const popularResources = approvedResources.slice(0, 6);

  return (
    <div className="flex flex-col gap-10 sm:gap-16 pb-12 sm:pb-16">
      {/* 1. Minimalist Architectural Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-8 sm:pt-16 sm:pb-14 border-b border-[#D8CEBE] dark:border-[#1E2922]">
        {/* Subtle Architectural Dot Grid & Ambient Glow */}
        <div
          className="pointer-events-none absolute inset-0 bg-minimal-grid opacity-75"
          style={{
            maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
          }}
        />
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[28rem] sm:w-[40rem] rounded-full bg-[#10B981]/8 blur-3xl dark:bg-[#10B981]/10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-[#10B981]/25 bg-white/80 backdrop-blur-xs px-3.5 py-1 text-2xs sm:text-xs font-semibold text-[#059669] shadow-2xs dark:border-[#10B981]/30 dark:bg-[#0F1310]/90 dark:text-[#10B981] mb-4 sm:mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse-subtle" />
            <span>Kerala State Board Academic Archive</span>
          </div>

          <h1 className="animate-fade-up delay-75 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-[#090A0B] dark:text-[#F4EEE2] max-w-3xl">
            All your study materials,{" "}
            <span className="text-[#059669] dark:text-[#10B981]">
              distilled & organized.
            </span>
          </h1>

          <p className="animate-fade-up delay-150 mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-[#5C574F] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
            Discover verified chapter notes, previous-year question papers, scoring keys, and practical manuals shared by students and educators across Kerala.
          </p>

          <div className="animate-fade-up delay-225 mt-6 sm:mt-8 w-full flex justify-center">
            <SearchHero />
          </div>

          <div className="animate-fade-up delay-300 mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs font-medium text-[#5C574F] dark:text-[#94A3B8]">
            <span className="text-[#8C8375] w-full sm:w-auto mb-1 sm:mb-0">Jump to standard:</span>
            {siteConfig.supportedClasses.map((c) => (
              <Link
                key={c.id}
                href={`/class/${c.slug}`}
                className="group inline-flex items-center gap-1 rounded-xl border border-[#D8CEBE] bg-white px-3 py-1.5 text-xs font-medium text-[#090A0B] shadow-2xs hover:-translate-y-0.5 hover:border-[#10B981] hover:text-[#059669] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F4EEE2] dark:hover:border-[#10B981] dark:hover:text-[#10B981] transition-all duration-200 active:scale-95"
              >
                <span>{c.name}</span>
                <ArrowUpRight className="h-3 w-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
            ))}
          </div>

          {/* Minimalist Live Metrics Strip */}
          <div className="animate-fade-up delay-300 mt-8 sm:mt-10 pt-6 border-t border-[#D8CEBE]/70 dark:border-[#1E2922] w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-left">
            <div className="flex items-center gap-2.5 rounded-xl bg-white/60 dark:bg-[#0F1310]/60 px-3 py-2 border border-[#D8CEBE]/60 dark:border-[#1E2922]">
              <Layers className="h-4 w-4 text-[#10B981] shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-[#090A0B] dark:text-[#F4EEE2]">Classes 8–12</div>
                <div className="text-[11px] text-[#5C574F] dark:text-[#94A3B8]">SCERT & DHSE</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-white/60 dark:bg-[#0F1310]/60 px-3 py-2 border border-[#D8CEBE]/60 dark:border-[#1E2922]">
              <BookOpen className="h-4 w-4 text-[#10B981] shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-[#090A0B] dark:text-[#F4EEE2]">{approvedResources.length} Published</div>
                <div className="text-[11px] text-[#5C574F] dark:text-[#94A3B8]">Verified PDFs</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-white/60 dark:bg-[#0F1310]/60 px-3 py-2 border border-[#D8CEBE]/60 dark:border-[#1E2922]">
              <FileText className="h-4 w-4 text-[#10B981] shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-[#090A0B] dark:text-[#F4EEE2]">Instant Reader</div>
                <div className="text-[11px] text-[#5C574F] dark:text-[#94A3B8]">In-Browser PDF</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-white/60 dark:bg-[#0F1310]/60 px-3 py-2 border border-[#D8CEBE]/60 dark:border-[#1E2922]">
              <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-[#090A0B] dark:text-[#F4EEE2]">100% Ad-Free</div>
                <div className="text-[11px] text-[#5C574F] dark:text-[#94A3B8]">Minimalist UI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Choose Your Class Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#090A0B] dark:text-[#F4EEE2]">
              Browse by Standard & Class
            </h2>
            <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-0.5">
              Select your class to view curriculum-aligned resources.
            </p>
          </div>
          <Link href="/classes" className="group text-xs font-semibold text-[#059669] dark:text-[#10B981] hover:underline flex items-center gap-1 shrink-0">
            <span>All classes</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {siteConfig.supportedClasses.map((item, idx) => (
            <Link
              key={item.id}
              href={`/class/${item.slug}`}
              className="card-interactive last:col-span-2 sm:last:col-span-1 relative overflow-hidden flex flex-col justify-between rounded-2xl border border-[#D8CEBE] bg-white p-4 sm:p-5 text-left hover:border-[#10B981] dark:border-[#1E2922] dark:bg-[#0F1310] dark:hover:border-[#10B981]/60 group active:scale-[0.99]"
            >
              <div className="flex items-center justify-between w-full mb-3 sm:mb-4">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#E8DFCE] text-[#090A0B] group-hover:bg-[#10B981] group-hover:text-white dark:bg-[#161F19] dark:text-[#F4EEE2] dark:group-hover:bg-[#10B981] dark:group-hover:text-[#090A0B] transition-colors duration-200">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="font-mono text-2xs font-bold text-[#8C8375] group-hover:text-[#10B981] transition-colors">
                  0{idx + 1}
                </span>
              </div>

              <div>
                <span className="block font-bold text-xs sm:text-sm text-[#090A0B] group-hover:text-[#059669] dark:text-[#F4EEE2] dark:group-hover:text-[#10B981] transition-colors">
                  {item.name}
                </span>
                <div className="mt-1 flex items-center justify-between text-2xs text-[#5C574F] dark:text-[#94A3B8]">
                  <span>Notes & Papers</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 group-hover:text-[#10B981] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
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
              <h2 className="text-lg sm:text-xl font-bold text-[#090A0B] dark:text-[#F4EEE2]">
                Published Learning Materials
              </h2>
            </div>
            <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-0.5">
              Verified PDF study materials uploaded by educators and students.
            </p>
          </div>

          <Link href="/explore" className="group text-xs font-semibold text-[#059669] dark:text-[#10B981] hover:underline flex items-center gap-1 shrink-0">
            <span>Explore archive</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {popularResources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D8CEBE] bg-white p-8 sm:p-12 text-center dark:border-[#1E2922] dark:bg-[#0F1310]">
            <div className="animate-float-slow flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981]/12 text-[#10B981] mx-auto mb-3 ring-1 ring-[#10B981]/20">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-[#090A0B] dark:text-[#F4EEE2]">
              No PDFs Published Yet
            </h3>
            <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-1 max-w-md mx-auto leading-relaxed">
              The repository is clean and ready for real academic contributions. Upload your first chapter note or question paper PDF to publish it here.
            </p>
            <Link
              href="/upload"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#090A0B] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#10B981] dark:bg-[#10B981] dark:text-[#090A0B] dark:hover:bg-[#059669] dark:hover:text-white transition-all active:scale-96"
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

      {/* 4. Minimalist Bento Features Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div className="card-interactive group rounded-2xl border border-[#D8CEBE] bg-white p-6 dark:border-[#1E2922] dark:bg-[#0F1310]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8DFCE] text-[#090A0B] group-hover:bg-[#10B981] group-hover:text-white dark:bg-[#161F19] dark:text-[#10B981] dark:group-hover:bg-[#10B981] dark:group-hover:text-[#090A0B] transition-colors mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-[#090A0B] dark:text-[#F4EEE2]">
              In-Browser PDF Reader
            </h3>
            <p className="mt-1.5 text-xs text-[#5C574F] dark:text-[#94A3B8] leading-relaxed">
              Preview documents instantly without forced downloads. Read and download full PDFs directly from Supabase Storage.
            </p>
          </div>

          <div className="card-interactive group rounded-2xl border border-[#D8CEBE] bg-white p-6 dark:border-[#1E2922] dark:bg-[#0F1310]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8DFCE] text-[#090A0B] group-hover:bg-[#10B981] group-hover:text-white dark:bg-[#161F19] dark:text-[#10B981] dark:group-hover:bg-[#10B981] dark:group-hover:text-[#090A0B] transition-colors mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-[#090A0B] dark:text-[#F4EEE2]">
              Verified Educator Status
            </h3>
            <p className="mt-1.5 text-xs text-[#5C574F] dark:text-[#94A3B8] leading-relaxed">
              Clear badges distinguish verified teacher contributions and official examination department papers.
            </p>
          </div>

          <div className="card-interactive group rounded-2xl border border-[#D8CEBE] bg-white p-6 dark:border-[#1E2922] dark:bg-[#0F1310]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8DFCE] text-[#090A0B] group-hover:bg-[#10B981] group-hover:text-white dark:bg-[#161F19] dark:text-[#10B981] dark:group-hover:bg-[#10B981] dark:group-hover:text-[#090A0B] transition-colors mb-4">
              <FolderOpen className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-[#090A0B] dark:text-[#F4EEE2]">
              Paper-Warm Minimalism
            </h3>
            <p className="mt-1.5 text-xs text-[#5C574F] dark:text-[#94A3B8] leading-relaxed">
              Designed with a warm parchment surface and zero popups to eliminate eye strain during late-night exam revision.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Teacher & Student Contribution CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-2xl border border-[#090A0B]/15 bg-[#090A0B] p-6 sm:p-8 text-white dark:border-[#1E2922] dark:bg-[#0F1310]">
          <div className="pointer-events-none absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-[#10B981]/15 blur-2xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-[#10B981] mb-1.5">
              <Sparkles className="h-3 w-3" /> Open Community Archive
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#F4EEE2]">
              Are you an educator or student contributor?
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-xl leading-relaxed">
              Share handwritten summaries, question banks, or answer schemes. Build an academic reputation and help peers across Kerala.
            </p>
          </div>

          <Link
            href="/upload"
            className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#10B981] px-5 py-3 sm:py-2.5 text-xs font-bold text-[#090A0B] shadow-2xs hover:bg-[#059669] hover:text-white transition-all shrink-0 active:scale-96"
          >
            <Upload className="h-4 w-4" />
            Contribute PDF
          </Link>
        </div>
      </section>
    </div>
  );
}
