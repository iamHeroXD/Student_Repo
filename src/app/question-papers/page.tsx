import { mockResources } from "@/lib/data/resources";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { siteConfig } from "@/config/site";
import { FileText, CheckCircle2, Award } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Previous Year Question Papers & Answer Keys",
  description: "Browse Kerala Higher Secondary and High School question papers with official scoring schemes.",
};

export default function QuestionPapersPage() {
  const papers = mockResources.filter((r) => r.resource_type_id === "question-paper" || r.resource_type_id === "model-paper");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
          <FileText className="h-3.5 w-3.5" /> Examination Archive
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          Previous Year Question Papers
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
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
