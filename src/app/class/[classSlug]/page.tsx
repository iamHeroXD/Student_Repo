import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getApprovedResources } from "@/lib/supabase/persistence";
import { ResourceCard } from "@/components/resources/ResourceCard";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Upload } from "lucide-react";

export const dynamic = "force-dynamic";

interface ClassOverviewPageProps {
  params: Promise<{
    classSlug: string;
  }>;
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

  const allApproved = await getApprovedResources();
  const classResources = allApproved.filter((r) => r.class_id === targetClass.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/classes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#2FB617] dark:text-[#94A3B8] transition"
        >
          <ArrowLeft className="h-4 w-4" /> All Classes
        </Link>
      </div>

      <div className="mb-8 flex items-center gap-3.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2FB617]/10 text-[#2FB617] ring-1 ring-[#2FB617]/20">
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
          <Link href={`/explore?class=${targetClass.slug}`} className="font-semibold text-[#2FB617] hover:underline">
            Filter in Explore →
          </Link>
        </div>

        {classResources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D8CEBE] bg-white p-12 text-center text-xs text-[#64748B] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#94A3B8]">
            <p>No materials uploaded for {targetClass.name} yet.</p>
            <Link
              href="/upload"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#2FB617] px-4 py-2 text-xs font-semibold text-white hover:bg-[#259212] transition"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload PDF for {targetClass.name}
            </Link>
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
