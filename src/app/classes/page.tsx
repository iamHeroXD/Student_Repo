import Link from "next/link";
import { siteConfig } from "@/config/site";
import { GraduationCap, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Classes & Curriculum Selection",
  description: "Select your standard to browse Kerala State Board study materials.",
};

export default function ClassesIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/25 bg-[#10B981]/10 px-3 py-1 text-2xs font-bold uppercase tracking-wider text-[#059669] dark:text-[#10B981] mb-3">
          Kerala State Board • SCERT & DHSE
        </div>
        <h1 className="text-3xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC] tracking-tight">
          Select Your Class
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-2">
          Find syllabus-aligned notes, model question papers, and scoring keys structured by your academic standard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {siteConfig.supportedClasses.map((item) => (
          <Link
            key={item.id}
            href={`/class/${item.slug}`}
            className="flex flex-col justify-between rounded-2xl border border-[#D8CEBE] bg-white p-6 shadow-2xs hover:border-[#10B981] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 dark:border-[#1E2922] dark:bg-[#0F1310] dark:hover:border-[#10B981]/60 group"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981] mb-4 group-hover:bg-[#10B981] group-hover:text-white transition">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-[#090A0B] dark:text-[#F8FAFC] group-hover:text-[#10B981] transition">
                {item.name}
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2 leading-relaxed">
                Kerala Board SCERT / DHSE curriculum. Includes chapter-wise revision notes, model examination papers, and official question keys.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#D8CEBE] pt-4 text-xs font-semibold text-[#10B981] dark:border-[#1E2922]">
              <span>View Materials</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
