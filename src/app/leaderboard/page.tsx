import { Award, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Academic Contributor Leaderboard",
  description: "Recognizing high-quality teacher and student contributors sharing notes across Kerala.",
};

interface Contributor {
  rank: number;
  name: string;
  username: string;
  role: string;
  verified: boolean;
  score: number;
  approvedNotes: number;
  institution: string;
}

const contributors: Contributor[] = [
  { rank: 1, name: "Dr. K. S. Radhakrishnan", username: "radhakrishnan_bio", role: "HSST Biology", verified: true, score: 950, approvedNotes: 18, institution: "Govt Model HSS, Kozhikode" },
  { rank: 2, name: "Mathews Varghese", username: "mathew_sir", role: "High School Teacher", verified: true, score: 740, approvedNotes: 14, institution: "St. Thomas HSS, Pala" },
  { rank: 3, name: "Amina Beevi", username: "amina_chem", role: "HSST Chemistry", verified: true, score: 610, approvedNotes: 11, institution: "GHSS Manjeri" },
  { rank: 4, name: "Arjun Nair", username: "arjun_plus_two", role: "Student Contributor", verified: false, score: 420, approvedNotes: 8, institution: "NSS HSS, Changanassery" },
  { rank: 5, name: "Devika Menon", username: "devika_sslc", role: "Student Contributor", verified: false, score: 380, approvedNotes: 6, institution: "Bhavans Vidya Mandir, Thrissur" },
];

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/25 bg-[#10B981]/10 px-3 py-1 text-2xs font-bold uppercase tracking-wider text-[#059669] dark:text-[#10B981] mb-3">
          <Award className="h-3.5 w-3.5" /> Quality Recognition System
        </div>
        <h1 className="text-3xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC] tracking-tight">
          Academic Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-1.5 max-w-2xl">
          Rewarding genuine educational contributions. Rankings are calculated based on peer ratings, helpfulness votes, and verified note quality rather than raw download volume.
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] dark:border-[#1E2922] dark:bg-[#121713] dark:text-[#94A3B8]">
              <tr>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Rank</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Contributor</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Institution</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-center">Approved Materials</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-right">Reputation Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E2922]">
              {contributors.map((c) => (
                <tr key={c.rank} className="hover:bg-[#F8FAFC] dark:hover:bg-[#121713]/60 transition">
                  <td className="px-5 py-4 font-bold text-[#090A0B] dark:text-[#F8FAFC]">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      c.rank === 1 ? "bg-[#10B981]/15 text-[#059669] dark:text-[#10B981] font-black" :
                      c.rank === 2 ? "bg-[#E2E8F0] text-[#090A0B] dark:bg-[#1E2922] dark:text-[#F8FAFC]" :
                      c.rank === 3 ? "bg-[#10B981]/10 text-[#059669] dark:text-[#10B981]" : "text-[#64748B]"
                    }`}>
                      {c.rank}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/u/${c.username}`} className="group inline-block">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#090A0B] group-hover:text-[#10B981] dark:text-[#F8FAFC] transition">{c.name}</span>
                        {c.verified && (
                          <span title="Verified Educator">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                          </span>
                        )}
                      </div>
                      <span className="text-2xs text-[#64748B] dark:text-[#94A3B8]">@{c.username} • {c.role}</span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
