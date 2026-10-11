import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { mockResources } from "@/lib/data/resources";
import { ResourceCard } from "@/components/resources/ResourceCard";
import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";

interface ClassOverviewPageProps {
  params: Promise<{
    classSlug: string;
  }>;
}

export function generateStaticParams() {
  return siteConfig.supportedClasses.map((c) => ({
    classSlug: c.slug,
  }));
}

export async function generateMetadata({ params }: ClassOverviewPageProps) {
  const resolved = await params;
  const targetClass = siteConfig.supportedClasses.find((c) => c.slug === resolved.classSlug);
  if (!targetClass) return { title: "Class Not Found" };
  return {
    title: `${targetClass.name} Resources & Notes`,
    description: `Academic materials, question papers, and chapter summaries for ${targetClass.name} Kerala State Board.`,
  };
}

export default async function ClassOverviewPage({ params }: ClassOverviewPageProps) {
  const resolved = await params;
  const targetClass = siteConfig.supportedClasses.find((c) => c.slug === resolved.classSlug);

  if (!targetClass) {
    notFound();
  }

  const classResources = mockResources.filter((r) => r.class_id === targetClass.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/classes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#10B981] dark:text-[#94A3B8] transition"
        >
          <ArrowLeft className="h-4 w-4" /> All Classes
        </Link>
      </div>

      <div className="mb-8 flex items-center gap-3.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981] ring-1 ring-[#10B981]/20">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC] tracking-tight">
            {targetClass.name}
          </h1>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
            Kerala State Board Curriculum • SCERT / DHSE
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
          <span>Available learning materials ({classResources.length})</span>
          <Link href={`/explore?class=${targetClass.slug}`} className="font-semibold text-[#10B981] hover:underline">
            Filter by subject in Explore →
          </Link>
        </div>

        {classResources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E2E8F0] p-12 text-center text-xs text-[#64748B] dark:border-[#1E2922] dark:text-[#94A3B8]">
            No materials uploaded for this class yet. Be the first teacher or student to contribute!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classResources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
