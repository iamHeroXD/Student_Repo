import { siteConfig } from "@/config/site";
import { FileCheck } from "lucide-react";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of use for accessing and contributing to Student_Repo.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-[#10B981] mb-3">
        <FileCheck className="h-3.5 w-3.5" /> Platform Terms
      </div>
      <h1 className="text-3xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC]">
        Terms of Service
      </h1>
      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2">
        {siteConfig.name} • Last Updated: October 2026
      </p>

      <div className="mt-8 space-y-6 text-xs sm:text-sm text-[#090A0B] dark:text-[#F8FAFC] leading-relaxed">
        <section className="space-y-2 rounded-2xl border border-[#E2E8F0] bg-white p-6 dark:border-[#1E2922] dark:bg-[#0F1310]">
          <h2 className="text-base font-bold text-[#090A0B] dark:text-[#F8FAFC]">
            1. Educational Non-Commercial Purpose
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8]">
            {siteConfig.name} is an open academic resource library created for students and teachers. All notes, question papers, and scoring schemes are provided strictly for personal study, revision, and classroom preparation.
          </p>
        </section>

        <section className="space-y-2 rounded-2xl border border-[#E2E8F0] bg-white p-6 dark:border-[#1E2922] dark:bg-[#0F1310]">
          <h2 className="text-base font-bold text-[#090A0B] dark:text-[#F8FAFC]">
            2. Contributor Responsibilities
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8]">
            Users who upload materials retain ownership of their original notes and grant {siteConfig.name} a license to display and allow students to preview/download the material. Uploading spam, misleading exam keys, or unauthorized third-party material will result in account suspension.
          </p>
        </section>

        <section className="space-y-2 rounded-2xl border border-[#E2E8F0] bg-white p-6 dark:border-[#1E2922] dark:bg-[#0F1310]">
          <h2 className="text-base font-bold text-[#090A0B] dark:text-[#F8FAFC]">
            3. Disclaimer
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8]">
            {siteConfig.name} is an independent educational repository and is not officially affiliated with SCERT or DHSE Kerala. Always cross-verify syllabus updates with official board announcements.
          </p>
        </section>
      </div>
    </div>
  );
}
