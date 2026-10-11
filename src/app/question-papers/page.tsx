import { mockResources } from "@/lib/data/resources";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Previous Year Question Papers & Answer Keys",
  description: "Browse Kerala Higher Secondary and High School question papers with official scoring schemes.",
};

export default function QuestionPapersPage() {
  const papers = mockResources.filter((r) => r.resource_type_id === "question-paper" || r.resource_type_id === "model-paper");

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

      {/* Grid of question papers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {papers.map((p) => (
          <ResourceCard key={p.id} resource={p} />
        ))}
      </div>
    </div>
  );
}
