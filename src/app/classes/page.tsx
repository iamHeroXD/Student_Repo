import Link from "next/link";
import { siteConfig } from "@/config/site";
import { GraduationCap, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Classes & Curriculum Selection",
  description: "Select your standard to browse Kerala State Board study materials.",
};

export default function ClassesIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14 sm:px-6 lg:px-8 animate-fade-up">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/25 bg-white px-3 py-1 text-2xs font-bold uppercase tracking-wider text-[#059669] shadow-2xs dark:bg-[#0F1310] dark:text-[#10B981] mb-3">
          Kerala State Board • SCERT & DHSE
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#090A0B] dark:text-[#F4EEE2] tracking-tight">
          Select Your Class
        </h1>
        <p className="text-xs sm:text-sm text-[#5C574F] dark:text-[#94A3B8] mt-2">
          Find syllabus-aligned notes, model question papers, and scoring keys structured by your academic standard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {siteConfig.supportedClasses.map((item, idx) => (
          <Link
            key={item.id}
            href={`/class/${item.slug}`}
            className="card-interactive flex flex-col justify-between rounded-2xl border border-[#D8CEBE] bg-white p-6 hover:border-[#10B981] dark:border-[#1E2922] dark:bg-[#0F1310] dark:hover:border-[#10B981]/60 group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8DFCE] text-[#090A0B] group-hover:bg-[#10B981] group-hover:text-white dark:bg-[#161F19] dark:text-[#10B981] dark:group-hover:bg-[#10B981] dark:group-hover:text-[#090A0B] transition-colors">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="font-mono text-xs font-bold text-[#8C8375] group-hover:text-[#10B981] transition-colors">
                  0{idx + 1}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#090A0B] dark:text-[#F4EEE2] group-hover:text-[#059669] dark:group-hover:text-[#10B981] transition-colors">
                {item.name}
              </h2>
              <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-2 leading-relaxed">
                Kerala Board SCERT / DHSE curriculum. Includes chapter-wise revision notes, model examination papers, and official question keys.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#D8CEBE]/70 pt-4 text-xs font-semibold text-[#059669] dark:text-[#10B981] dark:border-[#1E2922]">
              <span>View Materials</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
