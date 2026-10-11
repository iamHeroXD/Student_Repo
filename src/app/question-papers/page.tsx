import { getApprovedResources } from "@/lib/supabase/persistence";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { FileText, Upload } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Previous Year Question Papers & Answer Keys",
  description: "Browse Kerala Higher Secondary and High School question papers with official scoring schemes.",
};

export default async function QuestionPapersPage() {
  const allApproved = await getApprovedResources();
  const papers = allApproved.filter(
    (r) =>
      r.resource_type_id === "question-paper" ||
      r.resource_type_id === "model-paper" ||
      r.resource_type_id === "answer-key"
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 animate-fade-up">
      <div className="mb-6">
        <div className="clay-pill inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/25 bg-white px-3 py-1 text-2xs font-bold uppercase tracking-wider text-[#059669] dark:bg-[#0F1310] dark:text-[#10B981] mb-2.5">
          <FileText className="h-3.5 w-3.5" /> Exam Archive
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#090A0B] dark:text-[#F4EEE2] tracking-tight">
          Question Papers & Keys
        </h1>
      </div>

      {papers.length === 0 ? (
        <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-9 text-center dark:border-[#1E2922] dark:bg-[#0F1310]">
          <div className="animate-float-slow clay-pill flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10B981]/12 text-[#10B981] mx-auto mb-2.5 ring-1 ring-[#10B981]/20">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-[#090A0B] dark:text-[#F4EEE2]">
            No Question Papers Yet
          </h3>
          <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-0.5">
            Upload previous papers, model papers, or answer keys.
          </p>
          <Link
            href="/upload"
            className="clay-btn mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-[#10B981] px-4 py-2 text-xs font-bold text-[#090A0B] hover:text-white transition-all active:scale-96"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Paper PDF
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {papers.map((p) => (
            <ResourceCard key={p.id} resource={p} />
          ))}
        </div>
      )}
    </div>
  );
}
