"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfileAction } from "@/lib/auth/actions";
import { Camera, Check, Sparkles, Trash2, User } from "lucide-react";

interface ProfileAvatarEditorProps {
  username: string;
  initialFullName: string;
  initialAvatarUrl?: string | null;
  initialBio?: string | null;
}

const PRESET_AVATARS = [
  {
    label: "Forest Scholar",
    url: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="#090A0B"/><circle cx="60" cy="46" r="20" fill="#2FB617"/><path d="M26 102c6-20 20-30 34-30s28 10 34 30" fill="#2FB617"/></svg>`
    )}`,
  },
  {
    label: "Green Pulse",
    url: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="#2FB617"/><circle cx="60" cy="46" r="20" fill="#090A0B"/><path d="M26 102c6-20 20-30 34-30s28 10 34 30" fill="#090A0B"/></svg>`
    )}`,
  },
  {
    label: "Paper Minimal",
    url: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="#E8DFCE"/><circle cx="60" cy="46" r="20" fill="#090A0B"/><path d="M26 102c6-20 20-30 34-30s28 10 34 30" fill="#2FB617"/></svg>`
    )}`,
  },
  {
    label: "Geometric Cube",
    url: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="#0F1310"/><polygon points="60,20 96,40 96,80 60,100 24,80 24,40" fill="none" stroke="#2FB617" stroke-width="8"/><circle cx="60" cy="60" r="14" fill="#F4EEE2"/></svg>`
    )}`,
  },
];

export function ProfileAvatarEditor({
  username,
  initialFullName,
  initialAvatarUrl,
  initialBio,
}: ProfileAvatarEditorProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl || null);
  const [fullName, setFullName] = useState(initialFullName);
  const [bio, setBio] = useState(initialBio || "");
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select an image file (PNG, JPG, WebP).");
      return;
    }

    // Resize image client-side to 160x160 square JPEG data URL
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 160;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;

        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.84);
        setAvatarUrl(compressedDataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSavedMsg(null);

    const formData = new FormData();
    formData.set("avatarDataUrl", avatarUrl || "__CLEAR__");
    formData.set("fullName", fullName);
    formData.set("bio", bio);

    const res = await updateUserProfileAction(formData);
    setSaving(false);

    if (!res.success) {
      setErrorMsg(res.error || "Could not save profile.");
      return;
    }

    setSavedMsg("Profile updated!");
    setIsOpen(false);
    router.refresh();
  };

  return (
    <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-5 sm:p-6 dark:border-[#1E2922] dark:bg-[#0F1310]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={fullName}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-[#2FB617]/50 shadow-sm"
              />
            ) : (
              <div className="clay-pill flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2FB617]/15 text-[#2FB617] font-black text-2xl">
                {fullName.charAt(0).toUpperCase() || <User className="h-7 w-7" />}
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              title="Change Profile Picture"
              className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#090A0B] text-white shadow-md hover:bg-[#2FB617] hover:text-[#090A0B] transition"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#090A0B] dark:text-[#F4EEE2]">
              {fullName}
            </h2>
            <p className="text-xs text-[#5C574F] dark:text-[#94A3B8]">
              @{username} {bio ? `• ${bio}` : ""}
            </p>
            {savedMsg && (
              <span className="inline-flex items-center gap-1 text-2xs font-bold text-[#2FB617] mt-1">
                <Check className="h-3 w-3" /> {savedMsg}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="clay-pill self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl border border-[#D8CEBE] bg-white px-3.5 py-2 text-xs font-semibold text-[#090A0B] hover:border-[#2FB617] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2] transition"
        >
          <Camera className="h-3.5 w-3.5 text-[#2FB617]" />
          {isOpen ? "Close Editor" : "Setup PFP & Profile"}
        </button>
      </div>

      {isOpen && (
        <form
          onSubmit={handleSave}
          className="mt-5 pt-5 border-t border-[#D8CEBE] dark:border-[#1E2922] space-y-4 animate-fade-in"
        >
          {errorMsg && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/25 p-2.5 text-xs text-rose-600 dark:text-rose-400">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-bold text-[#090A0B] dark:text-[#F4EEE2] mb-1.5">
                Upload Custom PFP or Pick Preset
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="clay-btn inline-flex items-center gap-1.5 rounded-xl bg-[#2FB617] px-3.5 py-2 text-xs font-bold text-[#090A0B] hover:text-white transition"
                >
                  <Camera className="h-3.5 w-3.5" />
                  Upload Photo
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl(null)}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#D8CEBE] px-2.5 py-2 text-xs text-rose-600 hover:bg-rose-500/10 dark:border-[#1E2922] transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div>
              <span className="block text-2xs font-semibold text-[#5C574F] dark:text-[#94A3B8] mb-1.5">
                <Sparkles className="inline h-3 w-3 text-[#2FB617]" /> Quick Presets:
              </span>
              <div className="flex items-center gap-2">
                {PRESET_AVATARS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setAvatarUrl(preset.url)}
                    title={preset.label}
                    className={`h-10 w-10 rounded-xl overflow-hidden border-2 transition ${
                      avatarUrl === preset.url
                        ? "border-[#2FB617] scale-105"
                        : "border-transparent hover:border-[#2FB617]/50"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preset.url} alt={preset.label} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F4EEE2]">
                Display Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full mt-1 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/60 p-2.5 text-base sm:text-xs text-[#090A0B] focus:border-[#2FB617] focus:bg-white focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#090A0B] dark:text-[#F4EEE2]">
                Short Bio / Class Info (Optional)
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={120}
                placeholder="e.g. Plus Two Science • Physics & Maths"
                className="w-full mt-1 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/60 p-2.5 text-base sm:text-xs text-[#090A0B] focus:border-[#2FB617] focus:bg-white focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="clay-btn inline-flex items-center gap-1.5 rounded-xl bg-[#2FB617] px-5 py-2.5 text-xs font-bold text-[#090A0B] hover:text-white disabled:opacity-50 transition"
            >
              <Check className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save Profile & PFP"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
