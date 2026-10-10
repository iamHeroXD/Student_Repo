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
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          Select Your Class
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2">
          Find syllabus-aligned notes, model question papers, and scoring keys structured by your academic standard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {siteConfig.supportedClasses.map((item) => (
          <Link
            key={item.id}
            href={`/class/${item.slug}`}
            className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-6 shadow-2xs hover:border-amber-500 hover:shadow-md transition dark:border-stone-800 dark:bg-stone-900 group"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 mb-4 group-hover:bg-amber-500/20 transition">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition">
                {item.name}
              </h2>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Kerala Board SCERT / DHSE curriculum. Includes chapter-wise revision notes, model examination papers, and official question keys.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4 text-xs font-semibold text-amber-600 dark:border-stone-800">
              <span>View Materials</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
