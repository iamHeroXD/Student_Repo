import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { Award, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Teacher Verification",
  description: "Request official educator verification status on Student_Repo.",
};

export default async function TeacherVerificationPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/teacher/login");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="text-center mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981]/15 text-[#10B981] mx-auto mb-3">
          <Award className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC] tracking-tight">
          Educator Verification
        </h1>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 max-w-md mx-auto">
          Verified teacher status distinguishes authorized educators and gives students confidence in your notes and scoring schemes.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310] space-y-5">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#090A0B] dark:bg-[#0A0D0B] dark:border-[#1E2922] dark:text-[#F8FAFC]">
          <CheckCircle2 className="h-5 w-5 text-[#10B981] shrink-0" />
          <div>
            <strong>Current Status: </strong>
            <span className="capitalize">{session.verificationStatus === "none" ? "Unverified (Standard Contributor)" : session.verificationStatus}</span>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F8FAFC]">Institution / School Name</label>
            <input
              type="text"
              placeholder="e.g. Govt Higher Secondary School, Calicut"
              required
              className="w-full mt-1 rounded-xl border border-[#E2E8F0] p-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F8FAFC]">Subject Specialization</label>
            <input
              type="text"
              placeholder="e.g. Higher Secondary Zoology / Botany"
              required
              className="w-full mt-1 rounded-xl border border-[#E2E8F0] p-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F8FAFC]">Teaching Experience (Years)</label>
            <input
              type="number"
              placeholder="5"
              min={1}
              required
              className="w-full mt-1 rounded-xl border border-[#E2E8F0] p-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            />
          </div>

          <div className="rounded-xl bg-[#F8FAFC] p-3.5 border border-[#E2E8F0] text-2xs text-[#64748B] dark:bg-[#0A0D0B] dark:border-[#1E2922] dark:text-[#94A3B8]">
            Verification requests are reviewed manually by platform administrators. No private documents or certificates are exposed publicly.
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-[#10B981] py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] transition"
          >
            Submit Verification Request
          </button>
        </form>
      </div>
    </div>
  );
}
