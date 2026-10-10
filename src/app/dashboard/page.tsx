import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { mockResources } from "@/lib/data/resources";
import { ResourceCard } from "@/components/resources/ResourceCard";
import Link from "next/link";
import { BookOpen, Upload, Clock, Award, Bookmark, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

export const metadata = {
  title: "Student Dashboard",
  description: "Personal academic overview, recent tasks, and uploaded materials.",
};

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const myResources = mockResources.filter(
    (r) => r.uploader?.username.toLowerCase() === session.username.toLowerCase()
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D9] pb-6 dark:border-[#223344]">
        <div>
          <span className="text-xs font-semibold text-[#FF7A00] uppercase tracking-wider">
            {session.role === "teacher" ? "Educator Dashboard" : "Student Dashboard"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172633] dark:text-[#FFF8EF]">
            Welcome, {session.fullName}!
          </h1>
          <p className="text-xs text-[#687481] dark:text-[#A0AAB4] mt-1">
            Logged in as @{session.username} • Account active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/upload"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF7A00] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#E66E00] transition"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Study Material
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8E2D9] bg-white px-3.5 py-2 text-xs font-semibold text-[#172633] hover:bg-[#FFF8EF] dark:border-[#223344] dark:bg-[#172633] dark:text-[#FFF8EF] transition"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-500" />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-8">
        <div className="rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-xs dark:border-[#223344] dark:bg-[#172633]">
          <span className="text-xs text-[#687481] dark:text-[#A0AAB4]">My Uploaded Materials</span>
          <div className="text-2xl font-bold text-[#172633] dark:text-[#FFF8EF] mt-1">
            {myResources.length}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-xs dark:border-[#223344] dark:bg-[#172633]">
          <span className="text-xs text-[#687481] dark:text-[#A0AAB4]">Study Tasks</span>
          <div className="text-2xl font-bold text-[#172633] dark:text-[#FFF8EF] mt-1">
            <Link href="/study-planner" className="hover:text-[#FF7A00] transition">
              Open Planner →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-xs dark:border-[#223344] dark:bg-[#172633]">
          <span className="text-xs text-[#687481] dark:text-[#A0AAB4]">Public Profile</span>
          <div className="text-2xl font-bold text-[#172633] dark:text-[#FFF8EF] mt-1">
            <Link href={`/u/${session.username}`} className="hover:text-[#FF7A00] transition text-base">
              View Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* My Uploads */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-[#172633] dark:text-[#FFF8EF] mb-4">
          My Uploaded Resources
        </h2>

        {myResources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E8E2D9] p-10 text-center text-xs text-[#687481] dark:border-[#223344]">
            <p>You haven&apos;t uploaded any notes or question papers yet.</p>
            <Link href="/upload" className="mt-3 inline-block font-semibold text-[#FF7A00] hover:underline">
              Contribute your first document
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myResources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
