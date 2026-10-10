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
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC]">
          Contribute Academic Material
        </h1>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
          Share chapter notes, previous question papers, or practical records with Kerala students.
        </p>
      </div>

      {!session ? (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-[#10B981] mx-auto mb-3">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-[#090A0B] dark:text-[#F8FAFC]">
            Account Required to Upload
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 max-w-md mx-auto leading-relaxed">
            While browsing and downloading resources is open to everyone, contributing notes requires a Student_Repo account so your material can be properly attributed and managed.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#10B981] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign In to Upload
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#090A0B] hover:bg-[#F8FAFC] dark:border-[#1E2922] dark:text-[#F8FAFC] transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      ) : (
        <UploadForm />
      )}
    </div>
  );
}
