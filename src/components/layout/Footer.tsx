import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E8E2D9] bg-[#FFF8EF] dark:border-[#172633] dark:bg-[#101C28]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-3">
            <Link href="/">
              <Logo size="sm" showWordmark={true} />
            </Link>
            <p className="text-xs text-[#687481] dark:text-[#A0AAB4] leading-relaxed">
              All your study materials in one place. A public academic resource library for Kerala State Board students and teachers.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#172633] dark:text-[#FFF8EF]">
              Classes
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-[#687481] dark:text-[#A0AAB4]">
              <li><Link href="/class/plus-two" className="hover:text-[#FF7A00] transition">Plus Two (Class 12)</Link></li>
              <li><Link href="/class/plus-one" className="hover:text-[#FF7A00] transition">Plus One (Class 11)</Link></li>
              <li><Link href="/class/class-10" className="hover:text-[#FF7A00] transition">Class 10 (SSLC)</Link></li>
              <li><Link href="/class/class-9" className="hover:text-[#FF7A00] transition">Class 9</Link></li>
              <li><Link href="/class/class-8" className="hover:text-[#FF7A00] transition">Class 8</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#172633] dark:text-[#FFF8EF]">
              Resources
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-[#687481] dark:text-[#A0AAB4]">
              <li><Link href="/explore?type=notes" className="hover:text-[#FF7A00] transition">Chapter Revision Notes</Link></li>
              <li><Link href="/question-papers" className="hover:text-[#FF7A00] transition">Previous Question Papers</Link></li>
              <li><Link href="/explore?type=model-paper" className="hover:text-[#FF7A00] transition">Model Papers</Link></li>
              <li><Link href="/explore?type=practical-manual" className="hover:text-[#FF7A00] transition">Lab Practical Manuals</Link></li>
              <li><Link href="/teacher/register" className="hover:text-[#FF7A00] transition">Teacher Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#172633] dark:text-[#FFF8EF]">
              Integrity & Trust
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-[#687481] dark:text-[#A0AAB4]">
              <li><Link href="/guidelines" className="hover:text-[#FF7A00] transition">Community Guidelines</Link></li>
              <li><Link href="/copyright" className="hover:text-[#FF7A00] transition">Copyright & Reporting</Link></li>
              <li><Link href="/privacy" className="hover:text-[#FF7A00] transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#FF7A00] transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#E8E2D9] dark:border-[#172633] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#687481] dark:text-[#A0AAB4]">
          <p>© 2026 {siteConfig.name}. All your study materials in one place.</p>
          <p>Public academic archive. Open access for students across Kerala.</p>
        </div>
      </div>
    </footer>
  );
}
