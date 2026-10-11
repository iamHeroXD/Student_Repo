import { siteConfig } from "@/config/site";
import { Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "Minimal data collection and student privacy protection on Student_Repo.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-[#10B981] mb-3">
        <Lock className="h-3.5 w-3.5" /> Student Privacy First
      </div>
      <h1 className="text-3xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC]">
        Privacy Policy
      </h1>
      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2">
        {siteConfig.name} • Last Updated: October 2026
      </p>

      <div className="mt-8 space-y-6 text-xs sm:text-sm text-[#090A0B] dark:text-[#F8FAFC] leading-relaxed">
        <section className="space-y-2 rounded-2xl border border-[#E2E8F0] bg-white p-6 dark:border-[#1E2922] dark:bg-[#0F1310]">
          <h2 className="text-base font-bold text-[#090A0B] dark:text-[#F8FAFC]">
            1. Zero Email or Phone Number Required
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8]">
            Students and teachers can browse all public educational resources anonymously. When creating an account to save tasks or upload notes, we require only a username and password. We do not collect phone numbers, home addresses, or mandatory email addresses.
          </p>
        </section>

        <section className="space-y-2 rounded-2xl border border-[#E2E8F0] bg-white p-6 dark:border-[#1E2922] dark:bg-[#0F1310]">
          <h2 className="text-base font-bold text-[#090A0B] dark:text-[#F8FAFC]">
            2. Password & Session Security
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8]">
            Passwords are encrypted using industry-standard bcrypt cryptographic hashing and stored in an isolated database table protected by Row Level Security. Session cookies are strictly HTTP-only.
          </p>
        </section>

        <section className="space-y-2 rounded-2xl border border-[#E2E8F0] bg-white p-6 dark:border-[#1E2922] dark:bg-[#0F1310]">
          <h2 className="text-base font-bold text-[#090A0B] dark:text-[#F8FAFC]">
            3. Zero Third-Party Ad Tracking
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8]">
            We do not run intrusive ad networks, popups, or behavioral trackers. Your reading history and study planner tasks remain strictly private to your account.
          </p>
        </section>
      </div>
    </div>
  );
}
