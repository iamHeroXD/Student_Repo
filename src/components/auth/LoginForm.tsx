"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { loginAction } from "@/lib/auth/actions";
import { Eye, EyeOff, Lock, User, AlertCircle, ArrowRight } from "lucide-react";

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
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center text-center mb-8">
        <Link href="/">
          <Logo size="lg" showWordmark={false} />
        </Link>
        <h1 className="text-2xl font-extrabold text-[#172633] dark:text-[#FFF8EF] mt-4">
          {isTeacher ? "Teacher Portal Log In" : "Log In to Student_Repo"}
        </h1>
        <p className="text-xs text-[#687481] dark:text-[#A0AAB4] mt-1 max-w-sm">
          {isTeacher 
            ? "Access your contributor dashboard, manage uploads, and track student reach."
            : "Sign in with your username to bookmark notes and access your study planner."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#E8E2D9] bg-white p-6 shadow-xs dark:border-[#223344] dark:bg-[#172633]">
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-[#172633] dark:text-[#FFF8EF]">Username</label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-3 h-4 w-4 text-[#687481]" />
            <input
              type="text"
              name="username"
              placeholder="e.g. rohan_k"
              required
              autoCapitalize="none"
              autoCorrect="off"
              className="w-full rounded-xl border border-[#E8E2D9] py-2.5 pl-9 pr-3 text-xs text-[#172633] placeholder:text-[#687481] focus:border-[#FF7A00] focus:outline-none dark:border-[#223344] dark:bg-[#101C28] dark:text-[#FFF8EF]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#172633] dark:text-[#FFF8EF]">Password</label>
          </div>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-[#687481]" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-[#E8E2D9] py-2.5 pl-9 pr-10 text-xs text-[#172633] placeholder:text-[#687481] focus:border-[#FF7A00] focus:outline-none dark:border-[#223344] dark:bg-[#101C28] dark:text-[#FFF8EF]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-2.5 text-[#687481] hover:text-[#172633] dark:hover:text-[#FFF8EF]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#FF7A00] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#E66E00] disabled:opacity-50 transition"
        >
          {loading ? "Authenticating..." : "Log In"}
        </button>

        <div className="pt-2 text-center text-xs text-[#687481] dark:text-[#A0AAB4] space-y-2">
          <p>
            Don&apos;t have an account?{" "}
            <Link href={isTeacher ? "/teacher/register" : "/register"} className="font-semibold text-[#FF7A00] hover:underline">
              Create one (No email required)
            </Link>
          </p>
          {!isTeacher && (
            <p>
              Are you an educator?{" "}
              <Link href="/teacher/login" className="text-xs underline text-[#172633] dark:text-[#FFF8EF]">
                Teacher Portal Log In
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
