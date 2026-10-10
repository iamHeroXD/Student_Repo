import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { getCurrentSession } from "@/lib/auth/session";
import { Search, Upload, User, ShieldCheck } from "lucide-react";

export async function Header() {
  const session = await getCurrentSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md dark:border-[#1E2922] dark:bg-[#090A0B]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center">
            <Logo size="md" showWordmark={true} />
          </Link>

          {/* Primary Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">
            <Link href="/explore" className="hover:text-[#090A0B] dark:hover:text-[#F8FAFC] transition">
              Explore
            </Link>
            <Link href="/classes" className="hover:text-[#090A0B] dark:hover:text-[#F8FAFC] transition">
              Classes
            </Link>
            <Link href="/question-papers" className="hover:text-[#090A0B] dark:hover:text-[#F8FAFC] transition">
              Question Papers
            </Link>
            <Link href="/study-planner" className="hover:text-[#090A0B] dark:hover:text-[#F8FAFC] transition">
              Study Planner
            </Link>
            <Link href="/leaderboard" className="hover:text-[#090A0B] dark:hover:text-[#F8FAFC] transition">
              Leaderboard
            </Link>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="flex items-center justify-center p-2 text-[#64748B] hover:text-[#090A0B] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] md:hidden"
            aria-label="Search resources"
          >
            <Search className="h-5 w-5" />
          </Link>

          <Link
            href="/upload"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#090A0B] shadow-2xs hover:bg-[#F8FAFC] hover:border-[#CBD5E1] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F8FAFC] dark:hover:bg-[#151C17] transition"
          >
            <Upload className="h-3.5 w-3.5 text-[#10B981]" />
            Upload Resources
          </Link>

          {session ? (
            <div className="flex items-center gap-2">
              {session.role === "admin" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/20 transition"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
              <Link
                href={`/u/${session.username}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A0D0B] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#1E2922] dark:bg-[#10B981] dark:text-[#0A0D0B] dark:hover:bg-[#059669] transition"
              >
                <User className="h-3.5 w-3.5" />
                <span>{session.username}</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-[#090A0B] hover:text-[#10B981] dark:text-[#F8FAFC] dark:hover:text-[#10B981] px-2 py-1.5 transition"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-[#10B981] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] transition"
              >
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
