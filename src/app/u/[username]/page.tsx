import { notFound } from "next/navigation";
import { mockResources } from "@/lib/data/resources";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { CheckCircle2, User, Award, School, Calendar, BookOpen } from "lucide-react";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const resolved = await params;
  return {
    title: `@${resolved.username} — Contributor Profile`,
    description: `Public contributor academic profile for @${resolved.username} on Student_Repo.`,
  };
}

export default async function UserProfilePage({ params }: ProfilePageProps) {
  const resolved = await params;
  const username = resolved.username.toLowerCase();

  // Look for author in existing resources
  const userResources = mockResources.filter(
    (r) => r.uploader?.username.toLowerCase() === username
  );

  const fallbackUser = userResources[0]?.uploader;

  // Mock public profile details if user exists or fallback demonstration profile
  const profile = fallbackUser || {
    username: resolved.username,
    full_name: resolved.username.replace(/_/g, " "),
    role: "student" as const,
    verification_status: "none" as const,
    reputation_score: 50,
    created_at: "2026-03-01T00:00:00Z",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Profile Header Card */}
      <div className="rounded-2xl border border-[#E8E2D9] bg-white p-6 sm:p-8 dark:border-[#223344] dark:bg-[#172633] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF7A00]/15 text-[#FF7A00] font-black text-2xl">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[#172633] dark:text-[#FFF8EF]">
                  {profile.full_name}
                </h1>
                {profile.verification_status === "verified" && (
                  <span title="Verified Educator">
                    <CheckCircle2 className="h-5 w-5 text-[#FF7A00]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-[#687481] dark:text-[#A0AAB4] mt-0.5">
                @{profile.username} • {profile.role === "teacher" ? "Verified Educator" : "Student Member"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-[#E8E2D9] bg-[#FFF8EF] px-4 py-2.5 dark:border-[#223344] dark:bg-[#101C28]">
            <div className="text-center">
              <span className="block text-lg font-bold text-[#FF7A00]">{profile.reputation_score}</span>
              <span className="text-2xs text-[#687481] uppercase font-semibold">Reputation</span>
            </div>
            <div className="h-6 w-px bg-[#E8E2D9] dark:bg-[#223344]" />
            <div className="text-center">
              <span className="block text-lg font-bold text-[#172633] dark:text-[#FFF8EF]">{userResources.length}</span>
              <span className="text-2xs text-[#687481] uppercase font-semibold">Materials</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contributions Section */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#172633] dark:text-[#FFF8EF]">
            Published Academic Materials ({userResources.length})
          </h2>
        </div>

        {userResources.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E8E2D9] p-12 text-center text-xs text-[#687481] dark:border-[#223344]">
            No public notes or question papers contributed yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userResources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
