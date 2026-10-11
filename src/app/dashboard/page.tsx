import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { getAllMergedResources, loadPlatformState } from "@/lib/supabase/persistence";
import { ResourceCard } from "@/components/resources/ResourceCard";
import Link from "next/link";
import { Upload, LogOut, ShieldCheck, Award } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Personal Dashboard",
  description: "Personal academic overview, study planner, and uploaded materials.",
};

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const state = await loadPlatformState();
  const userRecord = state.users.find(
    (u) => u.username_normalized === session.username.toLowerCase()
  );

  const allResources = await getAllMergedResources();
  const myResources = allResources.filter(
    (r) =>
      r.uploader_id === session.userId ||
      r.uploader?.username.toLowerCase() === session.username.toLowerCase()
  );

  const effectiveRole = userRecord?.role || session.role;
  const effectiveVerification =
    userRecord?.verification_status || session.verificationStatus;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6 dark:border-[#1E2922]">
        <div>
          <span className="text-xs font-semibold text-[#10B981] uppercase tracking-wider">
            {effectiveRole === "admin"
              ? "Administrator Account"
              : effectiveRole === "teacher"
              ? "Educator Dashboard"
              : "Student Dashboard"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC] tracking-tight">
            Welcome, {userRecord?.full_name || session.fullName}!
          </h1>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
            Logged in as @{session.username} • Reputation:{" "}
            <strong className="text-[#10B981]">
              {userRecord?.reputation_score || 0} pts
            </strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {(effectiveRole === "admin" || effectiveRole === "moderator") && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#10B981]/30 bg-[#10B981]/10 px-4 py-2 text-xs font-semibold text-[#059669] dark:text-[#10B981] hover:bg-[#10B981]/20 transition"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Console
            </Link>
          )}

          {effectiveRole === "teacher" && effectiveVerification !== "verified" && (
            <Link
              href="/teacher/verification"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#090A0B] hover:border-[#10B981] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F8FAFC] transition"
            >
              <Award className="h-3.5 w-3.5 text-[#10B981]" />
              Verify Teacher Badge ({effectiveVerification})
            </Link>
          )}

          <Link
            href="/upload"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#10B981] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] transition"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload PDF Material
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#090A0B] hover:bg-[#F8FAFC] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F8FAFC] dark:hover:bg-[#121713] transition"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-500" />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-8">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            My Uploaded PDFs
          </span>
          <div className="text-2xl font-bold text-[#090A0B] dark:text-[#F8FAFC] mt-1">
            {myResources.length}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            Study Planner
          </span>
          <div className="text-lg font-bold text-[#090A0B] dark:text-[#F8FAFC] mt-1">
            <Link
              href="/study-planner"
              className="hover:text-[#10B981] transition"
            >
              Open Study Planner →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            Public Profile
          </span>
          <div className="text-lg font-bold text-[#090A0B] dark:text-[#F8FAFC] mt-1">
            <Link
              href={`/u/${session.username}`}
              className="hover:text-[#10B981] transition"
            >
              View Public Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* My Uploads */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-[#090A0B] dark:text-[#F8FAFC] mb-4">
          My Uploaded Resources ({myResources.length})
        </h2>

        {myResources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E2E8F0] p-10 text-center text-xs text-[#64748B] dark:border-[#1E2922] dark:text-[#94A3B8]">
            <p>You haven&apos;t uploaded any PDF notes or question papers yet.</p>
            <Link
              href="/upload"
              className="mt-3 inline-block font-semibold text-[#10B981] hover:underline"
            >
              Upload your first PDF document →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myResources.map((res) => (
              <div key={res.id} className="relative">
                <div className="mb-2 flex items-center justify-between text-2xs">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-bold uppercase ${
                      res.status === "approved"
                        ? "bg-[#10B981]/15 text-[#059669] dark:text-[#10B981]"
                        : res.status === "rejected"
                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {res.status.replace("_", " ")}
                  </span>
                </div>
                <ResourceCard resource={res} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
