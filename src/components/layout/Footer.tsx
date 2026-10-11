import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#D8CEBE] bg-[#F1E9DB] pb-20 md:pb-0 dark:border-[#1E2922] dark:bg-[#090A0B]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 md:col-span-1 space-y-2.5">
            <Link href="/">
              <Logo size="sm" showWordmark={true} />
            </Link>
            <p className="text-xs text-[#5C574F] dark:text-[#94A3B8]">
              Fast, ad-free Kerala State Board PDF repository (Classes 8–12).
            </p>
          </div>

          <div>
            <h4 className="text-2xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F4EEE2]">
              Classes
            </h4>
            <ul className="mt-2.5 space-y-2 text-xs text-[#5C574F] dark:text-[#94A3B8]">
              <li><Link href="/class/plus-two" className="hover:text-[#2FB617] transition">Plus Two (12)</Link></li>
              <li><Link href="/class/plus-one" className="hover:text-[#2FB617] transition">Plus One (11)</Link></li>
              <li><Link href="/class/class-10" className="hover:text-[#2FB617] transition">Class 10 (SSLC)</Link></li>
              <li><Link href="/class/class-9" className="hover:text-[#2FB617] transition">Class 9</Link></li>
              <li><Link href="/class/class-8" className="hover:text-[#2FB617] transition">Class 8</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-2xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F4EEE2]">
              Archive
            </h4>
            <ul className="mt-2.5 space-y-2 text-xs text-[#5C574F] dark:text-[#94A3B8]">
              <li><Link href="/explore?type=notes" className="hover:text-[#2FB617] transition">Revision Notes</Link></li>
              <li><Link href="/question-papers" className="hover:text-[#2FB617] transition">Question Papers</Link></li>
              <li><Link href="/study-planner" className="hover:text-[#2FB617] transition">Study Planner</Link></li>
              <li><Link href="/leaderboard" className="hover:text-[#2FB617] transition">Leaderboard</Link></li>
              <li><Link href="/upload" className="hover:text-[#2FB617] transition">Upload PDF</Link></li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-2xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F4EEE2]">
              Legal & Portal
            </h4>
            <ul className="mt-2.5 grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs text-[#5C574F] dark:text-[#94A3B8]">
              <li><Link href="/teacher/register" className="hover:text-[#2FB617] transition">Teacher Portal</Link></li>
              <li><Link href="/guidelines" className="hover:text-[#2FB617] transition">Guidelines</Link></li>
              <li><Link href="/privacy" className="hover:text-[#2FB617] transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-[#2FB617] transition">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#D8CEBE] dark:border-[#1E2922] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-[#5C574F] dark:text-[#94A3B8]">
          <p>© 2026 {siteConfig.name} • Open Kerala Academic Archive</p>

          <a
            href="https://heroxportfolio.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="clay-pill group inline-flex items-center gap-1.5 rounded-full border border-[#D8CEBE] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#090A0B] hover:-translate-y-0.5 hover:border-[#2FB617] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F4EEE2] dark:hover:border-[#2FB617] transition-all"
          >
            <span className="text-[#5C574F] dark:text-[#94A3B8] font-normal">Made by</span>
            <span className="font-extrabold text-[#259212] dark:text-[#2FB617]">Hero.X</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#2FB617] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  );
}
