import { mockResources } from "@/lib/data/resources";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { CheckCircle2 } from "lucide-react";

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
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 dark:border-[#1E2922] dark:bg-[#0F1310] shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10B981]/15 text-[#10B981] font-black text-2xl">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC] tracking-tight capitalize">
                  {profile.full_name}
                </h1>
                {profile.verification_status === "verified" && (
                  <span title="Verified Educator">
                    <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                @{profile.username} • {profile.role === "teacher" ? "Verified Educator" : "Student Member"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 dark:border-[#1E2922] dark:bg-[#0A0D0B]">
            <div className="text-center">
              <span className="block text-lg font-bold text-[#10B981]">{profile.reputation_score}</span>
              <span className="text-2xs text-[#64748B] dark:text-[#94A3B8] uppercase font-semibold">Reputation</span>
            </div>
            <div className="h-6 w-px bg-[#E2E8F0] dark:bg-[#1E2922]" />
            <div className="text-center">
              <span className="block text-lg font-bold text-[#090A0B] dark:text-[#F8FAFC]">{userResources.length}</span>
              <span className="text-2xs text-[#64748B] dark:text-[#94A3B8] uppercase font-semibold">Materials</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contributions Section */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#090A0B] dark:text-[#F8FAFC]">
            Published Academic Materials ({userResources.length})
          </h2>
        </div>

        {userResources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E2E8F0] p-12 text-center text-xs text-[#64748B] dark:border-[#1E2922] dark:text-[#94A3B8]">
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
