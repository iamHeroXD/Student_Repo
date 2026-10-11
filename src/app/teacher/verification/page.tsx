import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { loadPlatformState } from "@/lib/supabase/persistence";
import { submitTeacherVerificationAction } from "@/lib/auth/actions";
import { Award, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Teacher Verification",
  description: "Request official educator verification status on Student_Repo.",
};

export default async function TeacherVerificationPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/teacher/login");
  }

  const state = await loadPlatformState();
  const userRecord = state.users.find(
    (u) => u.username_normalized === session.username.toLowerCase()
  );
  const currentStatus =
    userRecord?.verification_status || session.verificationStatus;

  const existingReq = state.verificationRequests.find(
    (v) => v.username.toLowerCase() === session.username.toLowerCase()
  );

  async function handleFormSubmit(formData: FormData) {
    "use server";
    await submitTeacherVerificationAction(formData);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="text-center mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2FB617]/15 text-[#2FB617] mx-auto mb-3">
          <Award className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC] tracking-tight">
          Educator Verification
        </h1>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 max-w-md mx-auto">
          Verified teacher status distinguishes authorized educators and gives students confidence in your notes and scoring schemes.
        </p>
      </div>

      <div className="rounded-2xl border border-[#D8CEBE] bg-white p-6 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310] space-y-5">
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#E8DFCE] border border-[#D8CEBE] text-xs text-[#090A0B] dark:bg-[#0A0D0B] dark:border-[#1E2922] dark:text-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            {currentStatus === "verified" ? (
              <CheckCircle2 className="h-5 w-5 text-[#2FB617] shrink-0" />
            ) : (
              <Clock className="h-5 w-5 text-[#2FB617] shrink-0" />
            )}
            <div>
              <strong>Current Status: </strong>
              <span className="capitalize font-semibold text-[#2FB617]">
                {currentStatus === "none"
                  ? "Unverified (Standard Contributor)"
                  : currentStatus}
              </span>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="text-2xs font-semibold text-[#64748B] hover:text-[#2FB617]"
          >
            Dashboard →
          </Link>
        </div>

        {currentStatus === "verified" ? (
          <div className="rounded-xl border border-[#2FB617]/30 bg-[#2FB617]/10 p-5 text-center">
            <h3 className="text-sm font-bold text-[#259212] dark:text-[#2FB617]">
              Your Educator Account is Verified!
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
              All your uploaded notes and question papers automatically display the Verified Educator badge.
            </p>
          </div>
        ) : (
          <form action={handleFormSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F8FAFC]">
                Institution / School Name
              </label>
              <input
                type="text"
                name="schoolName"
                defaultValue={existingReq?.school_name || userRecord?.institution_name || ""}
                placeholder="e.g. Govt Higher Secondary School, Kozhikode"
                required
                className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F8FAFC]">
                Subject Specialization
              </label>
              <input
                type="text"
                name="specialization"
                defaultValue={existingReq?.subject_specialization || ""}
                placeholder="e.g. Higher Secondary Physics / Mathematics"
                required
                className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F8FAFC]">
                Teaching Experience (Years)
              </label>
              <input
                type="number"
                name="experienceYears"
                defaultValue={existingReq?.experience_years || 3}
                min={1}
                required
                className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
              />
            </div>

            <div className="rounded-xl bg-[#E8DFCE] p-3.5 border border-[#D8CEBE] text-2xs text-[#64748B] dark:bg-[#0A0D0B] dark:border-[#1E2922] dark:text-[#94A3B8]">
              {existingReq && existingReq.status === "pending"
                ? "Your verification request has been submitted and is currently in the Administrator Review Queue. You can update your details below if needed."
                : "Verification requests are reviewed in the Admin Console. Once approved, your profile receives the Verified Educator badge (+100 reputation points)."}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#2FB617] py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#259212] transition"
            >
              {existingReq?.status === "pending"
                ? "Update Verification Request"
                : "Submit Verification Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
