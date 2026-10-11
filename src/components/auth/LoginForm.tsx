"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { loginAction } from "@/lib/auth/actions";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";

interface LoginFormProps {
  isTeacher?: boolean;
}

export function LoginForm({ isTeacher = false }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);

    if (!res.success) {
      setError(res.error || "Login failed. Please check your credentials.");
      setLoading(false);
    } else {
      router.push(res.redirectTo || "/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-16 sm:px-6">
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
        <Link href="/">
          <Logo size="lg" showWordmark={false} />
        </Link>
        <h1 className="text-2xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC] mt-4 tracking-tight">
          {isTeacher ? "Teacher Portal Log In" : "Log In to Student_Repo"}
        </h1>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 max-w-sm">
          {isTeacher
            ? "Access your contributor dashboard, manage uploads, and track student reach."
            : "Sign in with your username to upload notes and manage your account."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]"
      >
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/25 p-3 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F8FAFC]">
            Username
          </label>
          <div className="relative mt-1.5">
            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              required
              autoCapitalize="none"
              autoCorrect="off"
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-3 text-base sm:text-xs text-[#090A0B] placeholder:text-[#94A3B8] focus:border-[#10B981] focus:bg-white focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F8FAFC]">
            Password
          </label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-10 text-base sm:text-xs text-[#090A0B] placeholder:text-[#94A3B8] focus:border-[#10B981] focus:bg-white focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-3 p-0.5 text-[#64748B] hover:text-[#090A0B] dark:hover:text-[#F8FAFC]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#10B981] py-3 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] disabled:opacity-50 transition active:scale-[0.99]"
        >
          {loading ? "Signing In..." : "Log In"}
        </button>

        <div className="pt-2 text-center text-xs text-[#64748B] dark:text-[#94A3B8] space-y-2">
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href={isTeacher ? "/teacher/register" : "/register"}
              className="font-semibold text-[#10B981] hover:underline"
            >
              Create one (No email required)
            </Link>
          </p>
          {!isTeacher && (
            <p>
              Are you an educator?{" "}
              <Link
                href="/teacher/login"
                className="text-xs underline text-[#090A0B] dark:text-[#F8FAFC]"
              >
                Teacher Portal Log In
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
