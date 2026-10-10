"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { registerAction } from "@/lib/auth/actions";
import { siteConfig } from "@/config/site";
import { Eye, EyeOff, Lock, User, AlertCircle, School, BookOpen } from "lucide-react";

interface RegisterFormProps {
  isTeacher?: boolean;
}

export function RegisterForm({ isTeacher = false }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("role", isTeacher ? "teacher" : "student");
    const res = await registerAction(formData);

    if (!res.success) {
      setError(res.error || "Registration failed. Please check your information.");
      setLoading(false);
    } else {
      router.push(res.redirectTo || "/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center text-center mb-8">
        <Link href="/">
          <Logo size="lg" showWordmark={false} />
        </Link>
        <h1 className="text-2xl font-extrabold text-[#172633] dark:text-[#FFF8EF] mt-4">
          {isTeacher ? "Create Teacher Account" : "Create Student Account"}
        </h1>
        <p className="text-xs text-[#687481] dark:text-[#A0AAB4] mt-1 max-w-sm">
          No email address or phone number required. Your privacy is respected.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#E8E2D9] bg-white p-6 shadow-xs dark:border-[#223344] dark:bg-[#172633]">
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Username */}
        <div>
          <label className="text-xs font-semibold text-[#172633] dark:text-[#FFF8EF]">Choose Username</label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-3 h-4 w-4 text-[#687481]" />
            <input
              type="text"
              name="username"
              placeholder="e.g. kiran_bio"
              required
              minLength={3}
              maxLength={24}
              autoCapitalize="none"
              autoCorrect="off"
              className="w-full rounded-xl border border-[#E8E2D9] py-2.5 pl-9 pr-3 text-xs text-[#172633] placeholder:text-[#687481] focus:border-[#FF7A00] focus:outline-none dark:border-[#223344] dark:bg-[#101C28] dark:text-[#FFF8EF]"
            />
          </div>
          <span className="text-2xs text-[#687481] mt-1 block">3–24 characters: letters, numbers, and underscores only.</span>
        </div>

        {/* Display Name */}
        <div>
          <label className="text-xs font-semibold text-[#172633] dark:text-[#FFF8EF]">Full Name or Display Name</label>
          <input
            type="text"
            name="fullName"
            placeholder={isTeacher ? "e.g. Dr. K. S. Radhakrishnan" : "e.g. Kiran Nair"}
            required
            className="w-full mt-1 rounded-xl border border-[#E8E2D9] p-2.5 text-xs text-[#172633] placeholder:text-[#687481] focus:border-[#FF7A00] focus:outline-none dark:border-[#223344] dark:bg-[#101C28] dark:text-[#FFF8EF]"
          />
        </div>

        {/* Class Selection for Student */}
        {!isTeacher && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#172633] dark:text-[#FFF8EF]">Academic Class</label>
              <select
                name="targetClass"
                className="w-full mt-1 rounded-xl border border-[#E8E2D9] p-2.5 text-xs text-[#172633] focus:border-[#FF7A00] focus:outline-none dark:border-[#223344] dark:bg-[#101C28] dark:text-[#FFF8EF]"
              >
                {siteConfig.supportedClasses.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#172633] dark:text-[#FFF8EF]">Stream</label>
              <select
                name="targetStream"
                className="w-full mt-1 rounded-xl border border-[#E8E2D9] p-2.5 text-xs text-[#172633] focus:border-[#FF7A00] focus:outline-none dark:border-[#223344] dark:bg-[#101C28] dark:text-[#FFF8EF]"
              >
                {siteConfig.streams.map((s) => (
                  <option key={s.id} value={s.slug}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Teacher Institution */}
        {isTeacher && (
          <div>
            <label className="text-xs font-semibold text-[#172633] dark:text-[#FFF8EF]">Institution / School Name (Optional)</label>
            <div className="relative mt-1">
              <School className="absolute left-3 top-3 h-4 w-4 text-[#687481]" />
              <input
                type="text"
                name="institutionName"
                placeholder="e.g. Govt Model HSS, Kozhikode"
                className="w-full rounded-xl border border-[#E8E2D9] py-2.5 pl-9 pr-3 text-xs text-[#172633] placeholder:text-[#687481] focus:border-[#FF7A00] focus:outline-none dark:border-[#223344] dark:bg-[#101C28] dark:text-[#FFF8EF]"
              />
            </div>
          </div>
        )}

        {/* Password */}
        <div>
          <label className="text-xs font-semibold text-[#172633] dark:text-[#FFF8EF]">Password</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-[#687481]" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Minimum 6 characters"
              required
              minLength={6}
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

        {/* Confirm Password */}
        <div>
          <label className="text-xs font-semibold text-[#172633] dark:text-[#FFF8EF]">Confirm Password</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-[#687481]" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-type password"
              required
              minLength={6}
              className="w-full rounded-xl border border-[#E8E2D9] py-2.5 pl-9 pr-3 text-xs text-[#172633] placeholder:text-[#687481] focus:border-[#FF7A00] focus:outline-none dark:border-[#223344] dark:bg-[#101C28] dark:text-[#FFF8EF]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#FF7A00] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#E66E00] disabled:opacity-50 transition"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="pt-2 text-center text-xs text-[#687481] dark:text-[#A0AAB4] space-y-2">
          <p>
            Already registered?{" "}
            <Link href={isTeacher ? "/teacher/login" : "/login"} className="font-semibold text-[#FF7A00] hover:underline">
              Log in with username
            </Link>
          </p>
          {!isTeacher && (
            <p>
              Are you a teacher?{" "}
              <Link href="/teacher/register" className="text-xs underline text-[#172633] dark:text-[#FFF8EF]">
                Register as an Educator
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
