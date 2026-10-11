"use client";

import { useState } from "react";
import Link from "next/link";
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
  GraduationCap,
  LogIn,
  UserPlus,
  LayoutDashboard
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
    <header className="sticky top-0 z-50 w-full border-b border-[#D8CEBE] bg-white/90 backdrop-blur-md dark:border-[#1E2922] dark:bg-[#090A0B]/90 transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3.5 sm:px-6 lg:px-8 gap-2">
        {/* Brand Logo & Desktop/Tablet Nav */}
        <div className="flex items-center gap-4 lg:gap-8 min-w-0">
          <Link href="/" className="group flex items-center shrink-0">
            <Logo size="md" showWordmark={true} />
          </Link>

          {/* Primary Navigation Links (Tablet & Desktop) */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm font-medium text-[#64748B] dark:text-[#94A3B8] whitespace-nowrap">
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
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <ThemeToggle />

          <Link
            href="/explore"
            className="flex h-9 w-9 items-center justify-center text-[#64748B] hover:text-[#090A0B] hover:bg-[#E8DFCE] rounded-xl dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] dark:hover:bg-[#1E2922] transition"
            aria-label="Search resources"
          >
            <Search className="h-4 w-4" />
          </Link>

          <Link
            href="/upload"
            className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-[#D8CEBE] bg-white px-3.5 py-2 text-xs font-semibold text-[#090A0B] shadow-2xs hover:bg-[#E8DFCE] hover:border-[#10B981] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F8FAFC] dark:hover:bg-[#151C17] transition active:scale-98"
          >
            <Upload className="h-3.5 w-3.5 text-[#10B981]" />
            Upload PDF
          </Link>

          {session ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {(session.role === "admin" || session.role === "moderator") && (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-2 text-xs font-semibold text-emerald-600 dark:text-[#10B981] hover:bg-emerald-500/20 transition active:scale-98"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">Admin</span>
                </Link>
              )}
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A0D0B] px-3 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#1E2922] dark:bg-[#10B981] dark:text-[#0A0D0B] dark:hover:bg-[#059669] transition active:scale-98"
              >
                <User className="h-3.5 w-3.5 shrink-0" />
                <span className="max-w-[75px] sm:max-w-[110px] truncate">{session.username}</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className="hidden sm:inline-flex text-xs font-semibold text-[#090A0B] hover:text-[#10B981] dark:text-[#F8FAFC] dark:hover:text-[#10B981] px-2.5 py-2 transition"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-[#10B981] px-3 sm:px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] transition active:scale-98"
              >
                Join Free
              </Link>
            </div>
          )}

          {/* Mobile & Tablet Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center text-[#090A0B] hover:bg-[#E8DFCE] rounded-xl md:hidden dark:text-[#F8FAFC] dark:hover:bg-[#1E2922] transition"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#D8CEBE] bg-white px-4 pt-3 pb-6 dark:border-[#1E2922] dark:bg-[#090A0B] shadow-lg">
          <nav className="flex flex-col space-y-1.5 text-sm font-medium text-[#475569] dark:text-[#94A3B8]">
            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#E8DFCE] hover:text-[#090A0B] dark:hover:bg-[#121713] dark:hover:text-[#F8FAFC] transition"
            >
              <BookOpen className="h-4 w-4 text-[#10B981] shrink-0" />
              Explore Library
            </Link>
            <Link
              href="/classes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#E8DFCE] hover:text-[#090A0B] dark:hover:bg-[#121713] dark:hover:text-[#F8FAFC] transition"
            >
              <GraduationCap className="h-4 w-4 text-[#10B981] shrink-0" />
              Curriculum & Classes
            </Link>
            <Link
              href="/question-papers"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#E8DFCE] hover:text-[#090A0B] dark:hover:bg-[#121713] dark:hover:text-[#F8FAFC] transition"
            >
              <FileText className="h-4 w-4 text-[#10B981] shrink-0" />
              Question Papers Archive
            </Link>
            <Link
              href="/study-planner"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#E8DFCE] hover:text-[#090A0B] dark:hover:bg-[#121713] dark:hover:text-[#F8FAFC] transition"
            >
              <Calendar className="h-4 w-4 text-[#10B981] shrink-0" />
              Personal Study Planner
            </Link>
            <Link
              href="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#E8DFCE] hover:text-[#090A0B] dark:hover:bg-[#121713] dark:hover:text-[#F8FAFC] transition"
            >
              <Award className="h-4 w-4 text-[#10B981] shrink-0" />
              Contributor Leaderboard
            </Link>

            <div className="pt-3 mt-2 border-t border-[#D8CEBE] dark:border-[#1E2922] flex flex-col gap-2.5">
              <Link
                href="/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#10B981] py-3 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] transition"
              >
                <Upload className="h-4 w-4" />
                Upload PDF Material
              </Link>

              {session ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE] py-2.5 text-xs font-semibold text-[#090A0B] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F8FAFC] transition"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-[#10B981]" />
                    Dashboard
                  </Link>
                  {(session.role === "admin" || session.role === "moderator") ? (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-[#10B981]/30 bg-[#10B981]/10 py-2.5 text-xs font-semibold text-[#059669] dark:text-[#10B981] transition"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Admin Console
                    </Link>
                  ) : (
                    <Link
                      href={`/u/${session.username}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE] py-2.5 text-xs font-semibold text-[#090A0B] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F8FAFC] transition"
                    >
                      <User className="h-3.5 w-3.5 text-[#10B981]" />
                      Profile
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE] py-2.5 text-xs font-semibold text-[#090A0B] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F8FAFC] transition"
                  >
                    <LogIn className="h-3.5 w-3.5 text-[#10B981]" />
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE] py-2.5 text-xs font-semibold text-[#090A0B] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F8FAFC] transition"
                  >
                    <UserPlus className="h-3.5 w-3.5 text-[#10B981]" />
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
