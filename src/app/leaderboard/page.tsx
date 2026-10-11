import { Award, CheckCircle2, Upload, Users } from "lucide-react";
import Link from "next/link";
import { loadPlatformState } from "@/lib/supabase/persistence";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Academic Contributor Leaderboard",
  description: "Recognizing teacher and student contributors sharing verified study materials across Kerala.",
};

export default async function LeaderboardPage() {
  const state = await loadPlatformState();
  const approvedResources = state.customResources.filter(
    (r) => (state.resourceStatusOverrides[r.id] || r.status) === "approved"
  );

  const rankedContributors = state.users
    .filter((u) => u.is_active && u.username_normalized !== "studentrepo_admin")
    .map((u) => {
      const approvedCount = approvedResources.filter(
        (r) =>
          r.uploader_id === u.id ||
          r.uploader?.username.toLowerCase() === u.username_normalized
      ).length;

      return {
        username: u.username,
        name: u.full_name,
        role:
          u.role === "teacher"
            ? "Educator"
            : u.role === "moderator"
            ? "Moderator"
            : "Student Contributor",
        verified: u.verification_status === "verified",
        score: u.reputation_score || 0,
        approvedNotes: approvedCount,
        institution: u.institution_name || "Kerala State Board",
      };
    })
    .sort((a, b) => b.score - a.score || b.approvedNotes - a.approvedNotes);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/25 bg-[#10B981]/10 px-3 py-1 text-2xs font-bold uppercase tracking-wider text-[#059669] dark:text-[#10B981] mb-3">
          <Award className="h-3.5 w-3.5" /> Quality Recognition System
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC] tracking-tight">
          Academic Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-1.5 max-w-2xl">
          Rankings are calculated dynamically from real contributor accounts, approved PDF study materials (+50 pts), and student star ratings.
        </p>
      </div>

      {rankedContributors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E8F0] bg-white p-8 sm:p-12 text-center dark:border-[#1E2922] dark:bg-[#0F1310]">
          <Users className="h-10 w-10 text-[#10B981] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#090A0B] dark:text-[#F8FAFC]">
            No Contributor Rankings Yet
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 max-w-md mx-auto">
            Create a student or teacher account and upload verified study materials to appear on the official leaderboard.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#10B981] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#059669] transition"
            >
              Create Account
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-semibold text-[#090A0B] hover:bg-[#F8FAFC] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC] transition"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload PDF
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Stacked Cards (Phone View) */}
          <div className="space-y-3 sm:hidden">
            {rankedContributors.map((c, idx) => {
              const rank = idx + 1;
              return (
                <Link
                  key={c.username}
                  href={`/u/${c.username}`}
                  className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        rank === 1
                          ? "bg-[#10B981]/15 text-[#059669] dark:text-[#10B981]"
                          : "bg-[#F1F5F9] text-[#090A0B] dark:bg-[#1E2922] dark:text-[#F8FAFC]"
                      }`}
                    >
                      #{rank}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-[#090A0B] dark:text-[#F8FAFC] truncate">
                          {c.name}
                        </span>
                        {c.verified && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
                        )}
                      </div>
                      <span className="block text-2xs text-[#64748B] dark:text-[#94A3B8] truncate">
                        @{c.username} • {c.approvedNotes} PDFs
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="block text-xs font-extrabold text-[#10B981]">
                      {c.score} pts
                    </span>
                    <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                      {c.role}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Tablet & Desktop Table View */}
          <div className="hidden sm:block rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] dark:border-[#1E2922] dark:bg-[#121713] dark:text-[#94A3B8]">
                  <tr>
                    <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Rank</th>
                    <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Contributor</th>
                    <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Institution</th>
                    <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-center">Approved PDFs</th>
                    <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-right">Reputation Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E2922]">
                  {rankedContributors.map((c, idx) => {
                    const rank = idx + 1;
                    return (
                      <tr key={c.username} className="hover:bg-[#F8FAFC] dark:hover:bg-[#121713]/60 transition">
                        <td className="px-5 py-4 font-bold text-[#090A0B] dark:text-[#F8FAFC]">
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                              rank === 1
                                ? "bg-[#10B981]/15 text-[#059669] dark:text-[#10B981] font-black"
                                : rank === 2
                                ? "bg-[#E2E8F0] text-[#090A0B] dark:bg-[#1E2922] dark:text-[#F8FAFC]"
                                : rank === 3
                                ? "bg-[#10B981]/10 text-[#059669] dark:text-[#10B981]"
                                : "text-[#64748B]"
                            }`}
                          >
                            {rank}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <Link href={`/u/${c.username}`} className="group inline-block">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-[#090A0B] group-hover:text-[#10B981] dark:text-[#F8FAFC] transition">
                                {c.name}
                              </span>
                              {c.verified && (
                                <span title="Verified Educator">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                                </span>
                              )}
                            </div>
                            <span className="text-2xs text-[#64748B] dark:text-[#94A3B8]">
                              @{c.username} • {c.role}
                            </span>
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-[#475569] dark:text-[#94A3B8]">
                          {c.institution}
                        </td>
                        <td className="px-5 py-4 text-center font-medium text-[#090A0B] dark:text-[#F8FAFC]">
                          {c.approvedNotes}
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-[#059669] dark:text-[#10B981]">
                          {c.score} pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
