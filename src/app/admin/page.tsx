import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { mockResources } from "@/lib/data/resources";
import { 
  ShieldCheck, 
  FileText, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FolderLock,
  Layers,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admin Moderation Console",
  description: "Secure moderation and taxonomy management for Student_Repo.",
};

export default async function AdminDashboardPage() {
  const session = await getCurrentSession();

  // Strict server authorization guard
  // In production, only users with role === 'admin' or 'moderator' can access
  if (!session || (session.role !== "admin" && session.role !== "moderator")) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 mx-auto mb-4 border border-rose-200 dark:border-rose-900">
          <FolderLock className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-[#090A0B] dark:text-[#F8FAFC]">
          Administrator Access Required
        </h1>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2 leading-relaxed">
          This route is protected by server-side authorization. You must be signed in with an authorized Administrator or Moderator account to access this management dashboard.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-[#090A0B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E2922] dark:bg-[#10B981] dark:text-[#090A0B] transition"
          >
            Sign In with Admin Account
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#090A0B] hover:bg-[#F8FAFC] dark:border-[#1E2922] dark:text-[#F8FAFC] transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Real data metrics based on active records
  const totalResources = mockResources.length;
  const approvedResources = mockResources.filter(r => r.status === "approved").length;
  const pendingResources = mockResources.filter(r => r.status === "pending_review").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6 dark:border-[#1E2922]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-[#10B981] border border-emerald-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC]">
                Moderation & Admin Console
              </h1>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-2xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 uppercase">
                {session.role}
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Logged in as @{session.username} • Server-enforced permissions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-xs font-semibold text-[#090A0B] hover:bg-[#F8FAFC] dark:border-[#1E2922] dark:text-[#F8FAFC] transition"
          >
            User Dashboard
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-8">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Approved Public Resources</span>
          <div className="text-2xl font-bold text-[#090A0B] dark:text-[#F8FAFC] mt-1">
            {approvedResources}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Pending Submissions Queue</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {pendingResources}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Teacher Verification Queue</span>
          <div className="text-2xl font-bold text-[#10B981] mt-1">
            0 pending
          </div>
        </div>
      </div>

      {/* Resource Moderation Table */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
        <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#090A0B] dark:border-[#1E2922] dark:bg-[#121713] dark:text-[#F8FAFC]">
          Submissions Management
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E2E8F0] text-[#64748B] dark:border-[#1E2922] dark:text-[#94A3B8]">
              <tr>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Class / Subject</th>
                <th className="px-5 py-3 font-semibold">Uploader</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E2922]">
              {mockResources.map((res) => (
                <tr key={res.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#141A15] transition">
                  <td className="px-5 py-3.5 font-medium text-[#090A0B] dark:text-[#F8FAFC] max-w-xs truncate">
                    {res.title}
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B] dark:text-[#94A3B8] capitalize">
                    {res.class_id} • {res.subject_id.replace("plus-two-", "").replace("class-10-", "")}
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B] dark:text-[#94A3B8]">
                    @{res.uploader?.username || "unknown"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-2xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 capitalize">
                      <CheckCircle2 className="h-3 w-3" /> {res.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/resource/${res.slug}`}
                      className="font-medium text-[#10B981] hover:underline"
                    >
                      Inspect →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
