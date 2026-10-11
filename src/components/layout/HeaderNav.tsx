"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "./ThemeToggle";
import { 
  Search, 
  Upload, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  BookOpen, 
  FileText, 
  Calendar, 
  Award,
  Layers,
  GraduationCap
} from "lucide-react";

interface HeaderNavProps {
  session: {
    username: string;
    role: string;
    fullName: string;
  } | null;
}

export function HeaderNav({ session }: HeaderNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/85 backdrop-blur-md dark:border-[#1E2922] dark:bg-[#090A0B]/85 transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center">
            <Logo size="md" showWordmark={true} />
          </Link>

          {/* Primary Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">
            <Link 
              href="/explore" 
              className="hover:text-[#090A0B] dark:hover:text-[#F8FAFC] transition duration-150"
            >
              Explore
            </Link>
            <Link 
              href="/classes" 
              className="hover:text-[#090A0B] dark:hover:text-[#F8FAFC] transition duration-150"
            >
              Classes
            </Link>
            <Link 
              href="/question-papers" 
              className="hover:text-[#090A0B] dark:hover:text-[#F8FAFC] transition duration-150"
            >
              Question Papers
            </Link>
            <Link 
              href="/study-planner" 
              className="hover:text-[#090A0B] dark:hover:text-[#F8FAFC] transition duration-150"
            >
              Study Planner
            </Link>
            <Link 
              href="/leaderboard" 
              className="hover:text-[#090A0B] dark:hover:text-[#F8FAFC] transition duration-150"
            >
              Leaderboard
            </Link>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <ThemeToggle />

          <Link
            href="/explore"
            className="flex items-center justify-center p-2 text-[#64748B] hover:text-[#090A0B] hover:bg-stone-100 rounded-lg dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] dark:hover:bg-[#1E2922] transition"
            aria-label="Search resources"
          >
            <Search className="h-4.5 w-4.5" />
          </Link>

          <Link
            href="/upload"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#090A0B] shadow-2xs hover:bg-[#F8FAFC] hover:border-[#CBD5E1] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F8FAFC] dark:hover:bg-[#151C17] transition active:scale-98"
          >
            <Upload className="h-3.5 w-3.5 text-[#10B981]" />
            Upload Resources
          </Link>

          {session ? (
            <div className="flex items-center gap-2">
              {session.role === "admin" && (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/20 transition active:scale-98"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
              <Link
                href={`/u/${session.username}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A0D0B] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#1E2922] dark:bg-[#10B981] dark:text-[#0A0D0B] dark:hover:bg-[#059669] transition active:scale-98"
              >
                <User className="h-3.5 w-3.5" />
                <span className="max-w-[100px] truncate">{session.username}</span>
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
                className="inline-flex items-center justify-center rounded-lg bg-[#10B981] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] transition active:scale-98"
              >
                Join Free
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center p-2 text-[#64748B] hover:text-[#090A0B] rounded-lg md:hidden dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] transition"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2E8F0] bg-white px-4 pt-3 pb-6 dark:border-[#1E2922] dark:bg-[#090A0B] animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">
            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-stone-50 hover:text-[#090A0B] dark:hover:bg-[#1E2922] dark:hover:text-[#F8FAFC] transition"
            >
              <BookOpen className="h-4 w-4 text-[#10B981]" />
              Explore Library
            </Link>
            <Link
              href="/classes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-stone-50 hover:text-[#090A0B] dark:hover:bg-[#1E2922] dark:hover:text-[#F8FAFC] transition"
            >
              <GraduationCap className="h-4 w-4 text-[#10B981]" />
              Curriculum & Classes
            </Link>
            <Link
              href="/question-papers"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-stone-50 hover:text-[#090A0B] dark:hover:bg-[#1E2922] dark:hover:text-[#F8FAFC] transition"
            >
              <FileText className="h-4 w-4 text-[#10B981]" />
              Question Papers Archive
            </Link>
            <Link
              href="/study-planner"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-stone-50 hover:text-[#090A0B] dark:hover:bg-[#1E2922] dark:hover:text-[#F8FAFC] transition"
            >
              <Calendar className="h-4 w-4 text-[#10B981]" />
              Study Planner
            </Link>
            <Link
              href="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-stone-50 hover:text-[#090A0B] dark:hover:bg-[#1E2922] dark:hover:text-[#F8FAFC] transition"
            >
              <Award className="h-4 w-4 text-[#10B981]" />
              Contributor Leaderboard
            </Link>

            <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1E2922] flex flex-col gap-2">
              <Link
                href="/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#10B981] py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] transition"
              >
                <Upload className="h-4 w-4" />
                Upload Study Materials
              </Link>
              {session?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2 text-xs font-semibold text-emerald-600 transition"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin Console
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
