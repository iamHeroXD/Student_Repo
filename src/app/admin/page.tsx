import { getCurrentSession } from "@/lib/auth/session";
import {
  isAdminVaultUnlocked,
  lockAdminVaultAction,
  moderateResourceAction,
} from "@/lib/auth/actions";
import {
  loadPlatformState,
  getAllMergedResources,
} from "@/lib/supabase/persistence";
import { AdminVaultForm } from "./AdminVaultForm";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FolderLock,
  Lock,
  Activity,
  Users,
  Database,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Moderation & Security Console",
  description: "Multi-layer protected moderation and security audit console for Student_Repo.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const session = await getCurrentSession();

  // Layer 1: Strict Server-Side Role Guard
  if (!session || (session.role !== "admin" && session.role !== "moderator")) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 mx-auto mb-4 border border-rose-500/20">
          <FolderLock className="h-7 w-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-0.5 text-2xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
          403 • Restricted Zone
        </div>
        <h1 className="text-xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC]">
          Administrator Authorization Required
        </h1>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2 leading-relaxed">
          This console is protected by multi-layer server-side verification, brute-force lockouts, and step-up cryptographic authentication. Only verified Administrators can access this route.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-[#10B981] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#059669] transition"
          >
            Sign In with Admin Account
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-xs font-semibold text-[#090A0B] hover:bg-[#F8FAFC] dark:border-[#1E2922] dark:text-[#F8FAFC] dark:hover:bg-[#121713] transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Re-verify active status in backend state
  const state = await loadPlatformState();
  const dbAdmin = state.users.find(
    (u) => u.username_normalized === session.username.toLowerCase()
  );
  if (dbAdmin && !dbAdmin.is_active) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-lg font-bold text-rose-600">Account Suspended</h1>
        <p className="text-xs text-[#64748B] mt-2">
          This administrator account has been deactivated in the security registry.
        </p>
      </div>
    );
  }

  // Layer 2: Step-Up 2FA Admin Vault Check (Strict 30m HttpOnly Cookie)
  const unlocked = await isAdminVaultUnlocked();
  if (!unlocked) {
    return <AdminVaultForm username={session.username} />;
  }

  // Layer 3: Full Admin Moderation & Security Console
  const resources = await getAllMergedResources();
  const approvedResources = resources.filter((r) => r.status === "approved").length;
  const pendingResources = resources.filter((r) => r.status === "pending_review").length;
  const totalUsers = state.users.length;
  const recentAuditLogs = state.auditLogs.slice(0, 12);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6 dark:border-[#1E2922]">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC] tracking-tight">
                Security & Moderation Console
              </h1>
              <span className="rounded-full bg-[#10B981]/15 px-2.5 py-0.5 text-2xs font-bold text-[#059669] dark:text-[#10B981] uppercase">
                {session.role} • Vault Unlocked
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Operator: @{session.username} • Connected to Supabase (<code className="text-[#10B981]">qqiljphntcyvcyadskmc</code>)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <form action={lockAdminVaultAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400 transition"
            >
              <Lock className="h-3.5 w-3.5" />
              Lock Vault
            </button>
          </form>
          <Link
            href="/dashboard"
            className="rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#090A0B] hover:bg-[#F8FAFC] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F8FAFC] transition"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Approved Materials</span>
          <div className="text-2xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC] mt-1">
            {approvedResources}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Pending Moderation</span>
          <div className="text-2xl font-extrabold text-[#10B981] mt-1">
            {pendingResources}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Registered Accounts</span>
          <div className="text-2xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC] mt-1">
            {totalUsers}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Security Audit Events</span>
          <div className="text-2xl font-extrabold text-[#10B981] mt-1">
            {state.auditLogs.length}
          </div>
        </div>
      </div>

      {/* Resource Moderation Table */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3.5 dark:border-[#1E2922] dark:bg-[#121713]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F8FAFC]">
            Academic Submissions & Moderation Queue
          </span>
          <span className="text-2xs text-[#64748B] dark:text-[#94A3B8]">
            Server-enforced status controls
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E2E8F0] text-[#64748B] dark:border-[#1E2922] dark:text-[#94A3B8]">
              <tr>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Class / Subject</th>
                <th className="px-5 py-3 font-semibold">Contributor</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E2922]">
              {resources.map((res) => (
                <tr key={res.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#121713]/60 transition">
                  <td className="px-5 py-3.5 font-semibold text-[#090A0B] dark:text-[#F8FAFC] max-w-xs truncate">
                    <Link href={`/resource/${res.slug}`} className="hover:text-[#10B981] transition">
                      {res.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B] dark:text-[#94A3B8] capitalize">
                    {res.class_id} • {res.subject_id.replace("plus-two-", "").replace("class-10-", "")}
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B] dark:text-[#94A3B8]">
                    @{res.uploader?.username || "contributor"}
                  </td>
                  <td className="px-5 py-3.5">
                    {res.status === "approved" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981]/15 px-2.5 py-0.5 text-2xs font-bold text-[#059669] dark:text-[#10B981] capitalize">
                        <CheckCircle2 className="h-3 w-3" /> Approved
                      </span>
                    ) : res.status === "rejected" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-0.5 text-2xs font-bold text-rose-600 dark:text-rose-400 capitalize">
                        <XCircle className="h-3 w-3" /> Rejected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-2xs font-bold text-amber-600 dark:text-amber-400 capitalize">
                        Pending Review
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      {res.status !== "approved" && (
                        <form action={moderateResourceAction}>
                          <input type="hidden" name="resourceId" value={res.id} />
                          <input type="hidden" name="newStatus" value="approved" />
                          <button
                            type="submit"
                            className="rounded-lg bg-[#10B981] px-2.5 py-1 text-2xs font-semibold text-white hover:bg-[#059669] transition"
                          >
                            Approve
                          </button>
                        </form>
                      )}
                      {res.status !== "rejected" && (
                        <form action={moderateResourceAction}>
                          <input type="hidden" name="resourceId" value={res.id} />
                          <input type="hidden" name="newStatus" value="rejected" />
                          <button
                            type="submit"
                            className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-2xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400 transition"
                          >
                            Reject
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Log & Registered Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Immutable Security Audit Log */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3.5 dark:border-[#1E2922] dark:bg-[#121713]">
            <Activity className="h-4 w-4 text-[#10B981]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F8FAFC]">
              Security Audit Trail
            </span>
          </div>
          <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E2922] max-h-80 overflow-y-auto">
            {recentAuditLogs.map((log) => (
              <div key={log.id} className="px-5 py-3 text-xs flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#090A0B] dark:text-[#F8FAFC]">
                      {log.action}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-2xs font-bold uppercase ${
                        log.status === "success"
                          ? "bg-[#10B981]/15 text-[#059669] dark:text-[#10B981]"
                          : log.status === "blocked"
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                    {log.details} • Actor: <strong>@{log.actor_username}</strong> ({log.actor_role})
                  </p>
                </div>
                <span className="text-2xs text-[#94A3B8] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Registered Accounts Directory */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3.5 dark:border-[#1E2922] dark:bg-[#121713]">
            <Users className="h-4 w-4 text-[#10B981]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F8FAFC]">
              Registered Accounts ({state.users.length})
            </span>
          </div>
          <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E2922] max-h-80 overflow-y-auto">
            {state.users.map((u) => (
              <div key={u.id} className="px-5 py-3 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#090A0B] dark:text-[#F8FAFC]">
                    {u.full_name}
                  </span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] ml-1.5">
                    @{u.username}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-2xs font-semibold text-[#090A0B] dark:bg-[#1E2922] dark:text-[#F8FAFC] uppercase">
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
