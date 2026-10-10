import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SearchHero } from "@/components/search/SearchHero";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { mockResources } from "@/lib/data/resources";
import { 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Sparkles, 
  GraduationCap, 
  Upload, 
  ArrowRight,
  ShieldCheck,
  TrendingUp
} from "lucide-react";

export default function HomePage() {
  const popularResources = mockResources.slice(0, 4);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-8 sm:pt-20 sm:pb-12 border-b border-stone-200/60 dark:border-stone-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Kerala State Board Academic Archive</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 max-w-3xl">
            Everything you need to study smarter.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
            Find verified chapter notes, previous-year question papers, scoring keys, and practical records shared by teachers and students across Kerala.
          </p>

          {/* Functional Search Bar */}
          <div className="mt-8 w-full flex justify-center">
            <SearchHero />
          </div>

          {/* Quick Class Shortcuts */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-400">
            <span className="text-stone-400">Jump to class:</span>
            {siteConfig.supportedClasses.map((c) => (
              <Link
                key={c.id}
                href={`/class/${c.slug}`}
                className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 shadow-2xs hover:border-amber-500 hover:text-amber-600 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-amber-400 dark:hover:text-amber-400 transition"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Choose Your Class Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Browse by Curriculum & Class
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Select your academic year to view subject-wise syllabi and resources.
            </p>
          </div>
          <Link href="/classes" className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-1">
            All classes <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {siteConfig.supportedClasses.map((item) => (
            <Link
              key={item.id}
              href={`/class/${item.slug}`}
              className="flex flex-col items-center justify-center rounded-xl border border-stone-200 bg-white p-5 text-center shadow-2xs hover:border-amber-500 hover:shadow-sm dark:border-stone-800 dark:bg-stone-900 transition group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-700 group-hover:bg-amber-500/10 group-hover:text-amber-600 dark:bg-stone-800 dark:text-stone-300 transition mb-3">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                {item.name}
              </span>
              <span className="text-xs text-stone-400 mt-1">
                Notes & Papers
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Popular & Recently Added Resources */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Most Popular Learning Materials
              </h2>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Hand-reviewed by academic contributors and highly rated by students.
            </p>
          </div>

          <Link href="/explore" className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-1">
            View all resources <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularResources.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      </section>

      {/* 4. Core Features Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl border border-stone-200 bg-stone-100/70 p-8 sm:p-10 dark:border-stone-800 dark:bg-stone-900/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                In-Browser PDF Reader
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Preview documents instantly without forced downloads. Zoom, inspect, and evaluate notes in-page.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                Teacher-Verified Content
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Clear badges distinguish verified teacher contributions and official examination department papers.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                Zero Ads, Zero Spam
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                A calm, distraction-free environment built exclusively for serious academic revision and preparation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Teacher & Student Contribution CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-amber-200 bg-amber-500/5 p-8 dark:border-amber-900/40 dark:bg-amber-950/20">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Are you a teacher or high-scoring student?
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
              Share your handwritten summaries, question banks, or answer schemes. Get acknowledged, build academic reputation, and track how many students benefit from your materials.
            </p>
          </div>

          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-500 transition shrink-0"
          >
            <Upload className="h-4 w-4" />
            Contribute Notes to Repository
          </Link>
        </div>
      </section>
    </div>
  );
}
