import { Award, CheckCircle2, Upload, Users, User } from "lucide-react";
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
        avatar_url: u.avatar_url || null,
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 animate-fade-up">
      <div className="mb-6">
        <div className="clay-pill inline-flex items-center gap-1.5 rounded-full border border-[#2FB617]/25 bg-white px-3 py-1 text-2xs font-bold uppercase tracking-wider text-[#259212] dark:bg-[#0F1310] dark:text-[#2FB617] mb-2.5">
          <Award className="h-3.5 w-3.5" /> Top Contributors
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#090A0B] dark:text-[#F4EEE2] tracking-tight">
          Leaderboard
        </h1>
        <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-0.5">
          Live rankings from approved PDF uploads (+50 pts) and ratings.
        </p>
      </div>

      {rankedContributors.length === 0 ? (
        <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-8 sm:p-10 text-center dark:border-[#1E2922] dark:bg-[#0F1310]">
          <div className="animate-float-slow clay-pill flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2FB617]/12 text-[#2FB617] mx-auto mb-2.5 ring-1 ring-[#2FB617]/20">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-[#090A0B] dark:text-[#F4EEE2]">
            No Contributors Yet
          </h3>
          <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-0.5">
            Upload your first PDF to claim the #1 spot.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2.5">
            <Link
              href="/register"
              className="clay-btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2FB617] px-4 py-2 text-xs font-bold text-[#090A0B] hover:text-white transition"
            >
              Create Account
            </Link>
            <Link
              href="/upload"
              className="clay-pill inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#D8CEBE] bg-white px-4 py-2 text-xs font-semibold text-[#090A0B] hover:border-[#2FB617] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2] transition"
            >
              <Upload className="h-3.5 w-3.5 text-[#2FB617]" />
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
                  className="clay-card flex items-center justify-between rounded-2xl border border-[#D8CEBE] bg-white p-4 dark:border-[#1E2922] dark:bg-[#0F1310]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        rank === 1
                          ? "bg-[#2FB617]/15 text-[#259212] dark:text-[#2FB617]"
                          : "bg-[#E5DEC9] text-[#090A0B] dark:bg-[#1E2922] dark:text-[#F8FAFC]"
                      }`}
                    >
                      #{rank}
                    </span>
                    {c.avatar_url ? (
                      <img
                        src={c.avatar_url}
                        alt={c.name}
                        className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-[#2FB617]/30"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2FB617]/10 text-[#2FB617]">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-[#090A0B] dark:text-[#F8FAFC] truncate">
                          {c.name}
                        </span>
                        {c.verified && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#2FB617] shrink-0" />
                        )}
                      </div>
                      <span className="block text-2xs text-[#64748B] dark:text-[#94A3B8] truncate">
                        @{c.username} • {c.approvedNotes} PDFs
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="block text-xs font-extrabold text-[#2FB617]">
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
          <div className="clay-card hidden sm:block rounded-2xl border border-[#D8CEBE] bg-white overflow-hidden dark:border-[#1E2922] dark:bg-[#0F1310]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#D8CEBE] bg-[#E8DFCE] text-[#64748B] dark:border-[#1E2922] dark:bg-[#121713] dark:text-[#94A3B8]">
                  <tr>
                    <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Rank</th>
                    <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Contributor</th>
                    <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Institution</th>
                    <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-center">Approved PDFs</th>
                    <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-right">Reputation Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8CEBE] dark:divide-[#1E2922]">
                  {rankedContributors.map((c, idx) => {
                    const rank = idx + 1;
                    return (
                      <tr key={c.username} className="hover:bg-[#E8DFCE] dark:hover:bg-[#121713]/60 transition">
                        <td className="px-5 py-4 font-bold text-[#090A0B] dark:text-[#F8FAFC]">
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                              rank === 1
                                ? "bg-[#2FB617]/15 text-[#259212] dark:text-[#2FB617] font-black"
                                : rank === 2
                                ? "bg-[#D8CEBE] text-[#090A0B] dark:bg-[#1E2922] dark:text-[#F8FAFC]"
                                : rank === 3
                                ? "bg-[#2FB617]/10 text-[#259212] dark:text-[#2FB617]"
                                : "text-[#64748B]"
                            }`}
                          >
                            {rank}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <Link href={`/u/${c.username}`} className="group inline-flex items-center gap-2.5">
                            {c.avatar_url ? (
                              <img
                                src={c.avatar_url}
                                alt={c.name}
                                className="h-8 w-8 rounded-full object-cover ring-1 ring-[#2FB617]/30 shrink-0"
                              />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2FB617]/10 text-[#2FB617] shrink-0">
                                <User className="h-4 w-4" />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-[#090A0B] group-hover:text-[#2FB617] dark:text-[#F8FAFC] transition">
                                  {c.name}
                                </span>
                                {c.verified && (
                                  <span title="Verified Educator">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-[#2FB617]" />
                                  </span>
                                )}
                              </div>
                              <span className="text-2xs text-[#64748B] dark:text-[#94A3B8]">
                                @{c.username} • {c.role}
                              </span>
                            </div>
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-[#475569] dark:text-[#94A3B8]">
                          {c.institution}
                        </td>
                        <td className="px-5 py-4 text-center font-medium text-[#090A0B] dark:text-[#F8FAFC]">
                          {c.approvedNotes}
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-[#259212] dark:text-[#2FB617]">
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

