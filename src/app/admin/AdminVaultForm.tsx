"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { unlockAdminVaultAction } from "@/lib/auth/actions";
import { KeyRound, ShieldAlert, Lock } from "lucide-react";

export function AdminVaultForm({ username }: { username: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await unlockAdminVaultAction(formData);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Invalid security key");
      return;
    }
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-[#D8CEBE] bg-white p-6 sm:p-8 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2FB617]/15 text-[#2FB617] mb-4">
          <KeyRound className="h-6 w-6" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#2FB617]/10 px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wider text-[#2FB617] mb-2">
          Step-Up 2FA Protection
        </div>

        <h1 className="text-xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC]">
          Unlock Admin Security Vault
        </h1>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1.5 leading-relaxed">
          Signed in as <strong className="text-[#090A0B] dark:text-[#F8FAFC]">@{username}</strong>. Enter your secondary Admin Security Key to unlock moderation controls for 30 minutes.
        </p>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-600 dark:text-rose-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#090A0B] dark:text-[#F8FAFC] mb-1.5">
              Admin Security Key
            </label>
            <input
              type="password"
              name="securityPin"
              required
              autoComplete="off"
              placeholder="Enter security key..."
              className="w-full rounded-xl border border-[#D8CEBE] bg-[#E8DFCE] px-3.5 py-2.5 text-xs text-[#090A0B] focus:border-[#2FB617] focus:bg-white focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2FB617] py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#259212] disabled:opacity-50 transition"
          >
            <Lock className="h-3.5 w-3.5" />
            {loading ? "Verifying Cryptographic Key..." : "Unlock Admin Console"}
          </button>
        </form>
      </div>
    </div>
  );
}
