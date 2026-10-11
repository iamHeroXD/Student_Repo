"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { registerAction } from "@/lib/auth/actions";
import { siteConfig } from "@/config/site";
import { Eye, EyeOff, Lock, User, AlertCircle, School } from "lucide-react";

interface RegisterFormProps {
  isTeacher?: boolean;
}

export function RegisterForm({ isTeacher = false }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedClass, setSelectedClass] = useState("plus-two");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const showStream = selectedClass === "plus-one" || selectedClass === "plus-two";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("role", isTeacher ? "teacher" : "student");
    if (!showStream) {
      formData.delete("targetStream");
    }
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
    <div className="mx-auto max-w-md px-4 py-8 sm:py-10 sm:px-6 animate-fade-up">
      <div className="flex flex-col items-center text-center mb-6">
        <Link href="/">
          <Logo size="lg" showWordmark={false} />
        </Link>
        <h1 className="text-2xl font-extrabold text-[#090A0B] dark:text-[#F4EEE2] mt-3.5 tracking-tight">
          {isTeacher ? "Create Teacher Account" : "Create Student Account"}
        </h1>
        <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-1">
          Username & password only • No email or phone required
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="clay-card space-y-4 rounded-2xl border border-[#D8CEBE] bg-white p-5 sm:p-6 dark:border-[#1E2922] dark:bg-[#0F1310]"
      >
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/25 p-3 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Username */}
        <div>
          <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F4EEE2]">
            Username
          </label>
          <div className="relative mt-1.5">
            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#5C574F]" />
            <input
              type="text"
              name="username"
              placeholder="e.g. student_user"
              required
              minLength={3}
              maxLength={24}
              autoCapitalize="none"
              autoCorrect="off"
              className="w-full rounded-xl border border-[#D8CEBE] bg-[#E8DFCE] py-3 pl-10 pr-3 text-base sm:text-xs text-[#090A0B] placeholder:text-[#8C8375] focus:border-[#2FB617] focus:bg-white focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
            />
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F4EEE2]">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your name"
            required
            className="w-full mt-1.5 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE] p-3 text-base sm:text-xs text-[#090A0B] placeholder:text-[#8C8375] focus:border-[#2FB617] focus:bg-white focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
          />
        </div>

        {/* Class Selection for Student (Stream only appears for Plus One & Plus Two) */}
        {!isTeacher && (
          <div className={`grid grid-cols-1 ${showStream ? "sm:grid-cols-2" : ""} gap-3.5`}>
            <div>
              <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F4EEE2]">
                Academic Class
              </label>
              <select
                name="targetClass"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full mt-1.5 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE] p-3 text-base sm:text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
              >
                {siteConfig.supportedClasses.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {showStream && (
              <div className="animate-fade-in">
                <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F4EEE2]">
                  Stream (HSE)
                </label>
                <select
                  name="targetStream"
                  defaultValue="science"
                  className="w-full mt-1.5 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE] p-3 text-base sm:text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
                >
                  {siteConfig.streams
                    .filter((s) => s.slug !== "general")
                    .map((s) => (
                      <option key={s.id} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Teacher Institution */}
        {isTeacher && (
          <div>
            <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F8FAFC]">
              Institution / School Name (Optional)
            </label>
            <div className="relative mt-1.5">
              <School className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                name="institutionName"
                placeholder="Enter school or institution name"
                className="w-full rounded-xl border border-[#D8CEBE] bg-[#E8DFCE] py-3 pl-10 pr-3 text-base sm:text-xs text-[#090A0B] placeholder:text-[#94A3B8] focus:border-[#2FB617] focus:bg-white focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
              />
            </div>
          </div>
        )}

        {/* Password */}
        <div>
          <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F8FAFC]">
            Password
          </label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Minimum 6 characters"
              required
              minLength={6}
              className="w-full rounded-xl border border-[#D8CEBE] bg-[#E8DFCE] py-3 pl-10 pr-10 text-base sm:text-xs text-[#090A0B] placeholder:text-[#94A3B8] focus:border-[#2FB617] focus:bg-white focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
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

        {/* Confirm Password */}
        <div>
          <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F8FAFC]">
            Confirm Password
          </label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-type password"
              required
              minLength={6}
              className="w-full rounded-xl border border-[#D8CEBE] bg-[#E8DFCE] py-3 pl-10 pr-3 text-base sm:text-xs text-[#090A0B] placeholder:text-[#94A3B8] focus:border-[#2FB617] focus:bg-white focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#2FB617] py-3 text-xs font-semibold text-white shadow-2xs hover:bg-[#259212] disabled:opacity-50 transition active:scale-[0.99]"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="pt-2 text-center text-xs text-[#64748B] dark:text-[#94A3B8] space-y-2">
          <p>
            Already registered?{" "}
            <Link
              href={isTeacher ? "/teacher/login" : "/login"}
              className="font-semibold text-[#2FB617] hover:underline"
            >
              Log in with username
            </Link>
          </p>
          {!isTeacher && (
            <p>
              Are you a teacher?{" "}
              <Link
                href="/teacher/register"
                className="text-xs underline text-[#090A0B] dark:text-[#F8FAFC]"
              >
                Register as an Educator
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
