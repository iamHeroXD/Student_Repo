import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { getAllMergedResources, loadPlatformState } from "@/lib/supabase/persistence";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ProfileAvatarEditor } from "@/components/profile/ProfileAvatarEditor";
import Link from "next/link";
import { Upload, LogOut, ShieldCheck, Award } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Personal Dashboard",
  description: "Personal academic overview, profile picture setup, and uploaded materials.",
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-up">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8CEBE] pb-5 mb-6 dark:border-[#1E2922]">
        <div>
          <span className="text-2xs font-bold text-[#2FB617] uppercase tracking-wider">
            {effectiveRole === "admin"
              ? "Administrator"
              : effectiveRole === "teacher"
              ? "Educator Account"
              : "Student Account"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#090A0B] dark:text-[#F4EEE2] tracking-tight">
            Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(effectiveRole === "admin" || effectiveRole === "moderator") && (
            <Link
              href="/admin"
              className="clay-pill inline-flex items-center gap-1.5 rounded-xl border border-[#2FB617]/30 bg-[#2FB617]/10 px-3.5 py-2 text-xs font-semibold text-[#259212] dark:text-[#2FB617] hover:bg-[#2FB617]/20 transition"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Console
            </Link>
          )}

          {effectiveRole === "teacher" && effectiveVerification !== "verified" && (
            <Link
              href="/teacher/verification"
              className="clay-pill inline-flex items-center gap-1.5 rounded-xl border border-[#D8CEBE] bg-white px-3.5 py-2 text-xs font-semibold text-[#090A0B] hover:border-[#2FB617] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F4EEE2] transition"
            >
              <Award className="h-3.5 w-3.5 text-[#2FB617]" />
              Verify Educator ({effectiveVerification})
            </Link>
          )}

          <Link
            href="/upload"
            className="clay-btn inline-flex items-center gap-1.5 rounded-xl bg-[#2FB617] px-4 py-2 text-xs font-bold text-[#090A0B] hover:text-white transition"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload PDF
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="clay-pill inline-flex items-center gap-1.5 rounded-xl border border-[#D8CEBE] bg-white px-3.5 py-2 text-xs font-semibold text-[#090A0B] hover:bg-[#E8DFCE] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F4EEE2] transition"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-500" />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* PFP & Profile Customizer */}
      <div className="mb-6">
        <ProfileAvatarEditor
          username={session.username}
          initialFullName={userRecord?.full_name || session.fullName}
          initialAvatarUrl={userRecord?.avatar_url || null}
          initialBio={userRecord?.bio || null}
        />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 my-6">
        <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-5 dark:border-[#1E2922] dark:bg-[#0F1310]">
          <span className="text-xs text-[#5C574F] dark:text-[#94A3B8]">
            My Uploaded PDFs
          </span>
          <div className="text-2xl font-bold text-[#090A0B] dark:text-[#F4EEE2] mt-1">
            {myResources.length}
          </div>
        </div>

        <div className="rounded-2xl border border-[#D8CEBE] bg-white p-5 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            Study Planner
          </span>
          <div className="text-lg font-bold text-[#090A0B] dark:text-[#F8FAFC] mt-1">
            <Link
              href="/study-planner"
              className="hover:text-[#2FB617] transition"
            >
              Open Study Planner →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D8CEBE] bg-white p-5 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            Public Profile
          </span>
          <div className="text-lg font-bold text-[#090A0B] dark:text-[#F8FAFC] mt-1">
            <Link
              href={`/u/${session.username}`}
              className="hover:text-[#2FB617] transition"
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
          <div className="rounded-2xl border border-dashed border-[#D8CEBE] p-10 text-center text-xs text-[#64748B] dark:border-[#1E2922] dark:text-[#94A3B8]">
            <p>You haven&apos;t uploaded any PDF notes or question papers yet.</p>
            <Link
              href="/upload"
              className="mt-3 inline-block font-semibold text-[#2FB617] hover:underline"
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
                        ? "bg-[#2FB617]/15 text-[#259212] dark:text-[#2FB617]"
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
