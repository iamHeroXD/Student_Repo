import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { getCurrentSession } from "@/lib/auth/session";
import { Search, Upload, User, BookOpen } from "lucide-react";

export async function Header() {
  const session = await getCurrentSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8E2D9] bg-[#FFF8EF]/95 backdrop-blur-md dark:border-[#172633] dark:bg-[#101C28]/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center">
            <Logo size="md" showWordmark={true} />
          </Link>

          {/* Primary Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#687481] dark:text-[#A0AAB4]">
            <Link href="/explore" className="hover:text-[#172633] dark:hover:text-[#FFF8EF] transition">
              Explore
            </Link>
            <Link href="/classes" className="hover:text-[#172633] dark:hover:text-[#FFF8EF] transition">
              Classes
            </Link>
            <Link href="/question-papers" className="hover:text-[#172633] dark:hover:text-[#FFF8EF] transition">
              Question Papers
            </Link>
            <Link href="/study-planner" className="hover:text-[#172633] dark:hover:text-[#FFF8EF] transition">
              Study Planner
            </Link>
            <Link href="/leaderboard" className="hover:text-[#172633] dark:hover:text-[#FFF8EF] transition">
              Leaderboard
            </Link>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="flex items-center justify-center p-2 text-[#687481] hover:text-[#172633] dark:text-[#A0AAB4] dark:hover:text-[#FFF8EF] md:hidden"
            aria-label="Search resources"
          >
            <Search className="h-5 w-5" />
          </Link>

          <Link
            href="/upload"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#E8E2D9] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#172633] shadow-xs hover:bg-[#FFF8EF] dark:border-[#223344] dark:bg-[#172633] dark:text-[#FFF8EF] dark:hover:bg-[#203244] transition"
          >
            <Upload className="h-3.5 w-3.5 text-[#FF7A00]" />
            Upload Resources
          </Link>

          {session ? (
            <Link
              href={`/u/${session.username}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#172633] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#101C28] dark:bg-[#FF7A00] dark:text-white dark:hover:bg-[#E66E00] transition"
            >
              <User className="h-3.5 w-3.5" />
              <span>{session.username}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-[#172633] hover:text-[#FF7A00] dark:text-[#FFF8EF] dark:hover:text-[#FF7A00] px-2 py-1.5 transition"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-[#FF7A00] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#E66E00] transition"
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
