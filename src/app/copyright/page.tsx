import { siteConfig } from "@/config/site";
import { ShieldAlert, Mail, FileWarning } from "lucide-react";

export const metadata = {
  title: "Copyright & Takedown Policy",
  description: "Intellectual property and copyright reporting guidelines for Student_Repo.",
};

export default function CopyrightPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-[#10B981] mb-3">
        <ShieldAlert className="h-3.5 w-3.5" /> Intellectual Property Protection
      </div>
      <h1 className="text-3xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC]">
        Copyright & Takedown Policy
      </h1>
      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2">
        {siteConfig.name} Academic Repository • Last Updated: October 2026
      </p>

      <div className="mt-8 space-y-6 text-xs sm:text-sm text-[#090A0B] dark:text-[#F8FAFC] leading-relaxed">
        <section className="space-y-2 rounded-2xl border border-[#D8CEBE] bg-white p-6 dark:border-[#1E2922] dark:bg-[#0F1310]">
          <h2 className="text-base font-bold text-[#090A0B] dark:text-[#F8FAFC]">
            1. Respect for Educator & Publisher Rights
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8]">
            {siteConfig.name} strictly prohibits the unauthorized distribution of commercial textbooks, proprietary coaching material, or copyrighted publications without the author&apos;s consent. All contributors are required to sign an explicit distribution declaration before uploading.
          </p>
        </section>

        <section className="space-y-2 rounded-2xl border border-[#D8CEBE] bg-white p-6 dark:border-[#1E2922] dark:bg-[#0F1310]">
          <h2 className="text-base font-bold text-[#090A0B] dark:text-[#F8FAFC]">
            2. Reporting Copyright Concerns
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8]">
            If you are an educator, author, or institution and believe your work has been uploaded to {siteConfig.name} without permission, please use the Report button on the specific resource page or notify our moderation team with the URL of the document and proof of authorship.
          </p>
        </section>

        <section className="space-y-2 rounded-2xl border border-[#D8CEBE] bg-white p-6 dark:border-[#1E2922] dark:bg-[#0F1310]">
          <h2 className="text-base font-bold text-[#090A0B] dark:text-[#F8FAFC]">
            3. Expedited Removal Process
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8]">
            Upon receiving a valid takedown notice, our administrators immediately hide the document from public view, revoke signed download links, and record the resolution in the audit log.
          </p>
        </section>
      </div>
    </div>
  );
}
