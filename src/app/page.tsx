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
  Zap,
  Calendar,
  EyeOff,
  CheckCircle2
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const approvedResources = await getApprovedResources();
  const popularResources = approvedResources.slice(0, 6);

  return (
    <div className="flex flex-col gap-8 sm:gap-12 pb-12 sm:pb-16">
      {/* 1. Minimalist Claymorphic Hero */}
      <section className="relative overflow-hidden pt-7 pb-7 sm:pt-12 sm:pb-11 border-b border-[#D8CEBE] dark:border-[#1E2922]">
        <div
          className="pointer-events-none absolute inset-0 bg-minimal-grid opacity-75"
          style={{
            maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
          }}
        />
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-[26rem] sm:w-[36rem] rounded-full bg-[#10B981]/8 blur-3xl dark:bg-[#10B981]/10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="animate-fade-up clay-pill inline-flex items-center gap-2 rounded-full border border-[#10B981]/25 bg-white px-3.5 py-1 text-2xs sm:text-xs font-semibold text-[#059669] dark:border-[#10B981]/30 dark:bg-[#0F1310] dark:text-[#10B981] mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse-subtle" />
            <span>Kerala State Board • Classes 8–12</span>
          </div>

          <h1 className="animate-fade-up delay-75 text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.12] text-[#090A0B] dark:text-[#F4EEE2] max-w-2xl">
            Study materials,{" "}
            <span className="text-[#059669] dark:text-[#10B981]">
              without the clutter.
            </span>
          </h1>

          <p className="animate-fade-up delay-150 mt-2.5 text-xs sm:text-sm text-[#5C574F] dark:text-[#94A3B8] max-w-md">
            Notes, previous question papers, and answer keys—instant PDF preview.
          </p>

          <div className="animate-fade-up delay-225 mt-5 sm:mt-6 w-full flex justify-center">
            <SearchHero />
          </div>

          {/* Quick Action Dock */}
          <div className="animate-fade-up delay-300 mt-5 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/explore"
              className="clay-btn inline-flex items-center gap-1.5 rounded-xl bg-[#10B981] px-4 py-2 text-xs font-bold text-[#090A0B] hover:text-white transition-all active:scale-96"
            >
              <FileText className="h-3.5 w-3.5" />
              Browse Library ({approvedResources.length})
            </Link>
            <Link
              href="/upload"
              className="clay-pill inline-flex items-center gap-1.5 rounded-xl border border-[#D8CEBE] bg-white px-4 py-2 text-xs font-semibold text-[#090A0B] hover:border-[#10B981] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F4EEE2] transition-all active:scale-96"
            >
              <Upload className="h-3.5 w-3.5 text-[#10B981]" />
              Upload PDF
            </Link>
            <Link
              href="/study-planner"
              className="clay-pill inline-flex items-center gap-1.5 rounded-xl border border-[#D8CEBE] bg-white px-4 py-2 text-xs font-semibold text-[#090A0B] hover:border-[#10B981] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F4EEE2] transition-all active:scale-96"
            >
              <Calendar className="h-3.5 w-3.5 text-[#10B981]" />
              Planner
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Choose Your Class Cards (Claymorphic) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <h2 className="text-base sm:text-lg font-bold text-[#090A0B] dark:text-[#F4EEE2]">
            Select Class
          </h2>
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
              className="card-interactive last:col-span-2 sm:last:col-span-1 relative overflow-hidden flex flex-col justify-between rounded-2xl border border-[#D8CEBE] bg-white p-4 sm:p-5 text-left hover:border-[#10B981] dark:border-[#1E2922] dark:bg-[#0F1310] dark:hover:border-[#10B981]/60 group active:scale-[0.98]"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="clay-pill flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8DFCE] text-[#090A0B] group-hover:bg-[#10B981] group-hover:text-white dark:bg-[#161F19] dark:text-[#F4EEE2] dark:group-hover:bg-[#10B981] dark:group-hover:text-[#090A0B] transition-colors duration-200">
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

      {/* 3. Published PDFs */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#10B981]" />
            <h2 className="text-base sm:text-lg font-bold text-[#090A0B] dark:text-[#F4EEE2]">
              Published PDFs
            </h2>
          </div>

          <Link href="/explore" className="group text-xs font-semibold text-[#059669] dark:text-[#10B981] hover:underline flex items-center gap-1 shrink-0">
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {popularResources.length === 0 ? (
          <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-7 sm:p-9 text-center dark:border-[#1E2922] dark:bg-[#0F1310]">
            <div className="animate-float-slow clay-pill flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/12 text-[#10B981] mx-auto mb-2.5 ring-1 ring-[#10B981]/20">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#090A0B] dark:text-[#F4EEE2]">
              No PDFs Uploaded Yet
            </h3>
            <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-0.5">
              Upload the first chapter note or question paper PDF.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {popularResources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Concise Comparison: Built Better Than HSSLive & Cluttered Blogs */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-5 sm:p-6 dark:border-[#1E2922] dark:bg-[#0F1310]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#D8CEBE]/70 dark:border-[#1E2922]">
            <div className="flex items-center gap-2">
              <span className="clay-pill inline-flex items-center gap-1 rounded-full bg-[#10B981]/15 px-2.5 py-0.5 text-2xs font-bold text-[#059669] dark:text-[#10B981]">
                <Sparkles className="h-3 w-3" /> Why Student_Repo
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-[#090A0B] dark:text-[#F4EEE2]">
                Built better than HSSLive & old study blogs
              </h3>
            </div>
            <span className="text-2xs font-medium text-[#5C574F] dark:text-[#94A3B8]">
              Pure utility • Zero distractions
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-start gap-2.5 rounded-xl bg-[#E8DFCE]/55 p-3 dark:bg-[#161F19]/60">
              <EyeOff className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#090A0B] dark:text-[#F4EEE2]">Zero Ads & Popups</div>
                <div className="text-[11px] text-[#5C574F] dark:text-[#94A3B8]">No fake download buttons</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl bg-[#E8DFCE]/55 p-3 dark:bg-[#161F19]/60">
              <Zap className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#090A0B] dark:text-[#F4EEE2]">1-Click PDF Reader</div>
                <div className="text-[11px] text-[#5C574F] dark:text-[#94A3B8]">Instant preview & download</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl bg-[#E8DFCE]/55 p-3 dark:bg-[#161F19]/60">
              <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#090A0B] dark:text-[#F4EEE2]">Sorted by Class</div>
                <div className="text-[11px] text-[#5C574F] dark:text-[#94A3B8]">No messy forum threads</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl bg-[#E8DFCE]/55 p-3 dark:bg-[#161F19]/60">
              <ShieldCheck className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#090A0B] dark:text-[#F4EEE2]">Eye-Safe Warm UI</div>
                <div className="text-[11px] text-[#5C574F] dark:text-[#94A3B8]">Paper cream & dark mode</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
