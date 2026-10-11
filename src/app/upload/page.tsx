import { getCurrentSession } from "@/lib/auth/session";
import { UploadForm } from "@/components/resources/UploadForm";
import Link from "next/link";
import { Lock, LogIn } from "lucide-react";

export const metadata = {
  title: "Contribute Academic Material",
  description: "Share verified chapter notes, previous question papers, or practical records with Kerala students.",
};

export default async function UploadPage() {
  const session = await getCurrentSession();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10 sm:px-6 animate-fade-up">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-[#090A0B] dark:text-[#F4EEE2]">
          Upload PDF Material
        </h1>
        <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-0.5">
          Notes, question papers, or answer keys (PDF up to 25 MB).
        </p>
      </div>

      {!session ? (
        <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-7 text-center dark:border-[#1E2922] dark:bg-[#0F1310]">
          <div className="clay-pill flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/12 text-[#10B981] mx-auto mb-3">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-[#090A0B] dark:text-[#F4EEE2]">
            Sign In to Upload
          </h2>
          <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-1">
            Sign in so your uploaded PDFs are credited to your profile.
          </p>
          <div className="mt-5 flex justify-center gap-2.5">
            <Link
              href="/login"
              className="clay-btn inline-flex items-center gap-1.5 rounded-xl bg-[#10B981] px-4 py-2 text-xs font-bold text-[#090A0B] hover:text-white transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign In
            </Link>
            <Link
              href="/register"
              className="clay-pill inline-flex items-center rounded-xl border border-[#D8CEBE] bg-white px-4 py-2 text-xs font-semibold text-[#090A0B] hover:border-[#10B981] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F4EEE2] transition"
            >
              Register
            </Link>
          </div>
        </div>
      ) : (
        <UploadForm />
      )}
    </div>
  );
}
