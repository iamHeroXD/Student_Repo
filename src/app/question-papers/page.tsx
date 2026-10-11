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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/25 bg-[#10B981]/10 px-3 py-1 text-2xs font-bold uppercase tracking-wider text-[#059669] dark:text-[#10B981] mb-3">
          <FileText className="h-3.5 w-3.5" /> Examination Archive
        </div>
        <h1 className="text-3xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC] tracking-tight">
          Previous Year Question Papers
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-1.5 max-w-2xl">
          Original Kerala State Board SSLC, Plus One, and Plus Two examination question papers paired with official step-wise scoring keys.
        </p>
      </div>

      {papers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D8CEBE] bg-white p-12 text-center dark:border-[#1E2922] dark:bg-[#0F1310]">
          <FileText className="h-10 w-10 text-[#10B981] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#090A0B] dark:text-[#F8FAFC]">
            No Question Papers Uploaded Yet
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 max-w-md mx-auto">
            Upload previous-year question papers, model papers, or answer keys as PDFs to make them available here.
          </p>
          <Link
            href="/upload"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#10B981] px-4 py-2 text-xs font-semibold text-white hover:bg-[#059669] transition"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Question Paper PDF
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((p) => (
            <ResourceCard key={p.id} resource={p} />
          ))}
        </div>
      )}
    </div>
  );
}
