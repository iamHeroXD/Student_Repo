import { siteConfig } from "@/config/site";
import { Award, CheckCircle2, Star, TrendingUp, Users } from "lucide-react";
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
          <Award className="h-3.5 w-3.5" /> Quality Recognition System
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          Academic Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
          Rewarding genuine educational contributions. Rankings are calculated based on peer ratings, helpfulness votes, and verified note quality rather than raw download volume.
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-2xs dark:border-stone-800 dark:bg-stone-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-200 bg-stone-50/70 text-stone-500 dark:border-stone-800 dark:bg-stone-800/50">
              <tr>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Rank</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Contributor</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Institution</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-center">Approved Materials</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-right">Reputation Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {contributors.map((c) => (
                <tr key={c.rank} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition">
                  <td className="px-5 py-4 font-bold text-stone-900 dark:text-stone-100">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      c.rank === 1 ? "bg-amber-100 text-amber-700 font-black" :
                      c.rank === 2 ? "bg-stone-200 text-stone-700" :
                      c.rank === 3 ? "bg-amber-50 text-amber-800" : "text-stone-400"
                    }`}>
                      {c.rank}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 dark:text-stone-100">{c.name}</span>
                      {c.verified && (
                        <span title="Verified Educator">
                          <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                        </span>
                      )}
                    </div>
                    <span className="text-2xs text-stone-400">@{c.username} • {c.role}</span>
                  </td>
                  <td className="px-5 py-4 text-stone-600 dark:text-stone-400">
                    {c.institution}
                  </td>
                  <td className="px-5 py-4 text-center font-medium text-stone-700 dark:text-stone-300">
                    {c.approvedNotes}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-amber-600 dark:text-amber-400">
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
