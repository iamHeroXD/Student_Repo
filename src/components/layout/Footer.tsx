import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E2E8F0] bg-[#FFFFFF] dark:border-[#1E2922] dark:bg-[#090A0B]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-3">
            <Link href="/">
              <Logo size="sm" showWordmark={true} />
            </Link>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              All your study materials in one place. An open academic resource repository for Kerala State Board students and teachers.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#090A0B] dark:text-[#F8FAFC]">
              Classes
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
              <li><Link href="/class/plus-two" className="hover:text-[#10B981] transition">Plus Two (Class 12)</Link></li>
              <li><Link href="/class/plus-one" className="hover:text-[#10B981] transition">Plus One (Class 11)</Link></li>
              <li><Link href="/class/class-10" className="hover:text-[#10B981] transition">Class 10 (SSLC)</Link></li>
              <li><Link href="/class/class-9" className="hover:text-[#10B981] transition">Class 9</Link></li>
              <li><Link href="/class/class-8" className="hover:text-[#10B981] transition">Class 8</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#090A0B] dark:text-[#F8FAFC]">
              Resources
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
              <li><Link href="/explore?type=notes" className="hover:text-[#10B981] transition">Chapter Revision Notes</Link></li>
              <li><Link href="/question-papers" className="hover:text-[#10B981] transition">Previous Question Papers</Link></li>
              <li><Link href="/explore?type=model-paper" className="hover:text-[#10B981] transition">Model Papers</Link></li>
              <li><Link href="/explore?type=practical-manual" className="hover:text-[#10B981] transition">Lab Practical Manuals</Link></li>
              <li><Link href="/teacher/register" className="hover:text-[#10B981] transition">Teacher Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#090A0B] dark:text-[#F8FAFC]">
              Integrity & Trust
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
              <li><Link href="/guidelines" className="hover:text-[#10B981] transition">Community Guidelines</Link></li>
              <li><Link href="/copyright" className="hover:text-[#10B981] transition">Copyright & Reporting</Link></li>
              <li><Link href="/privacy" className="hover:text-[#10B981] transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#10B981] transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#E2E8F0] dark:border-[#1E2922] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B] dark:text-[#94A3B8]">
          <p>© 2026 {siteConfig.name}. All your study materials in one place.</p>
          <p>Public academic archive. Open access for students across Kerala.</p>
        </div>
      </div>
    </footer>
  );
}
