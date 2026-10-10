import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { Award, CheckCircle2, FileText, School, AlertCircle } from "lucide-react";

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
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF7A00]/15 text-[#FF7A00] mx-auto mb-3">
          <Award className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#172633] dark:text-[#FFF8EF]">
          Educator Verification
        </h1>
        <p className="text-xs text-[#687481] dark:text-[#A0AAB4] mt-1 max-w-md mx-auto">
          Verified teacher status distinguishes authorized educators and gives students confidence in your notes and scoring schemes.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E8E2D9] bg-white p-6 shadow-xs dark:border-[#223344] dark:bg-[#172633] space-y-5">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FFF8EF] border border-[#E8E2D9] text-xs text-[#172633] dark:bg-[#101C28] dark:border-[#223344] dark:text-[#FFF8EF]">
          <CheckCircle2 className="h-5 w-5 text-[#FF7A00] shrink-0" />
          <div>
            <strong>Current Status: </strong>
            <span className="capitalize">{session.verificationStatus === "none" ? "Unverified (Standard Contributor)" : session.verificationStatus}</span>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#172633] dark:text-[#FFF8EF]">Institution / School Name</label>
            <input
              type="text"
              placeholder="e.g. Govt Higher Secondary School, Calicut"
              required
              className="w-full mt-1 rounded-xl border border-[#E8E2D9] p-2.5 text-xs text-[#172633] dark:border-[#223344] dark:bg-[#101C28] dark:text-[#FFF8EF]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172633] dark:text-[#FFF8EF]">Subject Specialization</label>
            <input
              type="text"
              placeholder="e.g. Higher Secondary Zoology / Botany"
              required
              className="w-full mt-1 rounded-xl border border-[#E8E2D9] p-2.5 text-xs text-[#172633] dark:border-[#223344] dark:bg-[#101C28] dark:text-[#FFF8EF]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172633] dark:text-[#FFF8EF]">Teaching Experience (Years)</label>
            <input
              type="number"
              placeholder="5"
              min={1}
              required
              className="w-full mt-1 rounded-xl border border-[#E8E2D9] p-2.5 text-xs text-[#172633] dark:border-[#223344] dark:bg-[#101C28] dark:text-[#FFF8EF]"
            />
          </div>

          <div className="rounded-xl bg-stone-50 p-3.5 border border-[#E8E2D9] text-2xs text-[#687481] dark:bg-[#101C28] dark:border-[#223344]">
            Verification requests are reviewed manually by platform administrators. No private documents or certificates are exposed publicly.
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-[#FF7A00] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#E66E00] transition"
          >
            Submit Verification Request
          </button>
        </form>
      </div>
    </div>
  );
}
