import Link from "next/link";
import { siteConfig } from "@/config/site";
import { GraduationCap, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Classes & Curriculum Selection",
  description: "Select your standard to browse Kerala State Board study materials.",
};

export default function ClassesIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12 sm:px-6 lg:px-8 animate-fade-up">
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <div className="clay-pill inline-flex items-center gap-1.5 rounded-full border border-[#2FB617]/25 bg-white px-3 py-1 text-2xs font-bold uppercase tracking-wider text-[#259212] dark:bg-[#0F1310] dark:text-[#2FB617] mb-2.5">
          SCERT & DHSE • Classes 8–12
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#090A0B] dark:text-[#F4EEE2] tracking-tight">
          Select Your Class
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {siteConfig.supportedClasses.map((item, idx) => (
          <Link
            key={item.id}
            href={`/class/${item.slug}`}
            className="card-interactive flex flex-col justify-between rounded-2xl border border-[#D8CEBE] bg-white p-5 sm:p-6 hover:border-[#2FB617] dark:border-[#1E2922] dark:bg-[#0F1310] dark:hover:border-[#2FB617]/60 group"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="clay-pill flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8DFCE] text-[#090A0B] group-hover:bg-[#2FB617] group-hover:text-white dark:bg-[#161F19] dark:text-[#2FB617] dark:group-hover:bg-[#2FB617] dark:group-hover:text-[#090A0B] transition-colors">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs font-bold text-[#8C8375] group-hover:text-[#2FB617] transition-colors">
                  0{idx + 1}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#090A0B] dark:text-[#F4EEE2] group-hover:text-[#259212] dark:group-hover:text-[#2FB617] transition-colors">
                {item.name}
              </h2>
              <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-1">
                Notes • Question Papers • Answer Keys
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#D8CEBE]/70 pt-3.5 text-xs font-semibold text-[#259212] dark:text-[#2FB617] dark:border-[#1E2922]">
              <span>Open Archive</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
