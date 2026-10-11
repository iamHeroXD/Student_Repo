import { notFound } from "next/navigation";
import { loadPlatformState } from "@/lib/supabase/persistence";
import { getCurrentSession } from "@/lib/auth/session";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ProfileAvatarEditor } from "@/components/profile/ProfileAvatarEditor";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const resolved = await params;
  return {
    title: `@${resolved.username} — Profile`,
    description: `Academic contributor profile for @${resolved.username} on Student_Repo.`,
  };
}

export default async function UserProfilePage({ params }: ProfilePageProps) {
  const resolved = await params;
  const username = resolved.username.toLowerCase();

  const [state, session] = await Promise.all([
    loadPlatformState(),
    getCurrentSession(),
  ]);

  const profile = state.users.find((u) => u.username_normalized === username);

  if (!profile) {
    notFound();
  }

  const isOwnProfile = session?.username.toLowerCase() === username;

  const userResources = state.customResources
    .map((r) => ({
      ...r,
      status: state.resourceStatusOverrides[r.id] || r.status,
    }))
    .filter(
      (r) =>
        r.status === "approved" &&
        (r.uploader_id === profile.id ||
          r.uploader?.username.toLowerCase() === username)
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 animate-fade-up space-y-6">
      {isOwnProfile && (
        <ProfileAvatarEditor
          username={profile.username}
          initialFullName={profile.full_name}
          initialAvatarUrl={profile.avatar_url || null}
          initialBio={profile.bio || null}
        />
      )}

      <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-6 sm:p-7 dark:border-[#1E2922] dark:bg-[#0F1310]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-[#2FB617]/50 shadow-sm shrink-0"
              />
            ) : (
              <div className="clay-pill flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2FB617]/15 text-[#2FB617] font-black text-2xl shrink-0">
                {profile.full_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#090A0B] dark:text-[#F4EEE2] tracking-tight capitalize">
                  {profile.full_name}
                </h1>
                {profile.verification_status === "verified" && (
                  <span title="Verified Educator">
                    <CheckCircle2 className="h-5 w-5 text-[#2FB617]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-0.5">
                @{profile.username} •{" "}
                {profile.role === "admin"
                  ? "Administrator"
                  : profile.role === "teacher"
                  ? "Educator"
                  : "Student"}
                {profile.target_class ? ` • ${profile.target_class.replace("-", " ").toUpperCase()}` : ""}
                {profile.target_stream ? ` (${profile.target_stream})` : ""}
                {profile.institution_name ? ` • ${profile.institution_name}` : ""}
              </p>
              {profile.bio && (
                <p className="text-xs text-[#090A0B] dark:text-[#F4EEE2] mt-1.5 font-medium">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          <div className="clay-pill flex items-center gap-4 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE] px-4 py-2.5 dark:border-[#1E2922] dark:bg-[#0A0D0B]">
            <div className="text-center">
              <span className="block text-lg font-bold text-[#2FB617]">
                {profile.reputation_score || 0}
              </span>
              <span className="text-2xs text-[#5C574F] dark:text-[#94A3B8] uppercase font-semibold">
                Reputation
              </span>
            </div>
            <div className="h-6 w-px bg-[#D8CEBE] dark:bg-[#1E2922]" />
            <div className="text-center">
              <span className="block text-lg font-bold text-[#090A0B] dark:text-[#F4EEE2]">
                {userResources.length}
              </span>
              <span className="text-2xs text-[#5C574F] dark:text-[#94A3B8] uppercase font-semibold">
                PDFs
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[#090A0B] dark:text-[#F4EEE2]">
            Published PDFs ({userResources.length})
          </h2>
        </div>

        {userResources.length === 0 ? (
          <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-10 text-center text-xs text-[#5C574F] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#94A3B8]">
            No published PDFs yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {userResources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
