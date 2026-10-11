"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, X, Play, Sparkles } from "lucide-react";

export function LogoIntroSplash() {
  const [showSplash, setShowSplash] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("studentrepo_intro_seen_v1");
      if (!seen) {
        setShowSplash(true);
      }
    } catch {
      // ignore storage errors
    }

    const handleReplay = () => {
      setIsFadingOut(false);
      setIsMuted(false);
      setShowSplash(true);
    };

    window.addEventListener("studentrepo:play-intro", handleReplay);
    return () => window.removeEventListener("studentrepo:play-intro", handleReplay);
  }, []);

  const dismissSplash = () => {
    try {
      sessionStorage.setItem("studentrepo_intro_seen_v1", "1");
    } catch {
      // ignore
    }
    setIsFadingOut(true);
    setTimeout(() => {
      setShowSplash(false);
      setIsFadingOut(false);
    }, 380);
  };

  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      videoRef.current.play().catch(() => {});
    }
  };

  if (!showSplash) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F1E9DB]/95 dark:bg-[#090A0B]/95 backdrop-blur-md p-4 transition-opacity duration-350 ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#D8CEBE] bg-[#F4EEE2] shadow-2xl dark:border-[#1E2922] dark:bg-[#0F1310] clay-card">
        {/* Top Controls Bar */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={toggleSound}
            className="clay-pill inline-flex items-center gap-1.5 rounded-full border border-[#D8CEBE]/90 bg-[#F4EEE2]/90 px-3 py-1.5 text-xs font-bold text-[#090A0B] hover:border-[#2FB617] dark:border-[#1E2922] dark:bg-[#0F1310]/90 dark:text-[#F4EEE2] backdrop-blur-xs transition"
          >
            {isMuted ? (
              <>
                <VolumeX className="h-3.5 w-3.5 text-[#5C574F]" />
                <span>Tap for Sound</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5 text-[#2FB617]" />
                <span>Sound On</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={dismissSplash}
            className="clay-pill inline-flex items-center gap-1 rounded-full border border-[#D8CEBE]/90 bg-[#F4EEE2]/90 px-3.5 py-1.5 text-xs font-bold text-[#090A0B] hover:border-[#2FB617] hover:text-[#2FB617] dark:border-[#1E2922] dark:bg-[#0F1310]/90 dark:text-[#F4EEE2] backdrop-blur-xs transition"
          >
            <span>Skip Intro</span>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Video Player */}
        <video
          ref={videoRef}
          src="/brand/logo-intro.mp4"
          autoPlay
          playsInline
          muted={isMuted}
          onEnded={dismissSplash}
          className="w-full aspect-video object-cover bg-[#F1E9DB]"
        />

        {/* Bottom Caption Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#D8CEBE]/70 bg-[#F4EEE2] dark:border-[#1E2922] dark:bg-[#0F1310]">
          <div className="flex items-center gap-2">
            <img
              src="/brand/mascot.png"
              alt="Student_Repo Owl Mascot"
              className="h-7 w-7 rounded-full object-cover ring-1 ring-[#2FB617]/40"
            />
            <span className="text-xs font-extrabold text-[#090A0B] dark:text-[#F4EEE2]">
              Student<span className="text-[#2FB617]">_</span>Repo
            </span>
            <span className="hidden sm:inline text-2xs text-[#5C574F] dark:text-[#94A3B8]">
              • All your study materials in one place
            </span>
          </div>

          <button
            type="button"
            onClick={dismissSplash}
            className="text-xs font-bold text-[#259212] hover:underline dark:text-[#2FB617]"
          >
            Enter Website →
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReplayIntroButton({ className = "" }: { className?: string }) {
  const handlePlay = () => {
    window.dispatchEvent(new CustomEvent("studentrepo:play-intro"));
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      className={
        className ||
        "clay-pill inline-flex items-center gap-1.5 rounded-xl border border-[#D8CEBE] bg-white px-3.5 py-2 text-xs font-semibold text-[#090A0B] hover:border-[#2FB617] dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F4EEE2] transition-all active:scale-96"
      }
    >
      <Play className="h-3.5 w-3.5 fill-[#2FB617] text-[#2FB617]" />
      <span>Watch Intro</span>
    </button>
  );
}

export function MascotHeroCard() {
  const handlePlay = () => {
    window.dispatchEvent(new CustomEvent("studentrepo:play-intro"));
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Soft ambient green glow behind mascot */}
      <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-[#2FB617]/12 blur-2xl dark:bg-[#2FB617]/15" />

      <div className="clay-card relative group overflow-hidden rounded-3xl border border-[#D8CEBE] bg-[#F4EEE2] p-3.5 sm:p-4 dark:border-[#1E2922] dark:bg-[#0F1310] max-w-[230px] sm:max-w-[260px]">
        {/* Floating Mascot Image */}
        <div className="relative overflow-hidden rounded-2xl bg-[#E8DFCE]/60 dark:bg-[#161F19]">
          <img
            src="/brand/mascot.png"
            alt="Student_Repo 3D Clay Owl Mascot"
            className="w-full h-44 sm:h-52 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <button
            type="button"
            onClick={handlePlay}
            title="Watch Student_Repo Logo Intro"
            className="clay-pill absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#D8CEBE]/90 bg-[#F4EEE2]/95 px-3 py-1 text-2xs font-extrabold text-[#090A0B] hover:border-[#2FB617] hover:text-[#2FB617] dark:border-[#1E2922] dark:bg-[#0F1310]/95 dark:text-[#F4EEE2] shadow-md transition"
          >
            <Play className="h-3 w-3 fill-[#2FB617] text-[#2FB617]" />
            Intro Video
          </button>
        </div>

        {/* Mascot Caption */}
        <div className="mt-2.5 flex items-center justify-between gap-2 px-1">
          <div>
            <div className="flex items-center gap-1 text-xs font-extrabold text-[#090A0B] dark:text-[#F4EEE2]">
              <Sparkles className="h-3 w-3 text-[#2FB617]" />
              <span>Repo Owl</span>
            </div>
            <p className="text-[11px] text-[#5C574F] dark:text-[#94A3B8]">
              Kerala Board Study Buddy
            </p>
          </div>
          <span className="rounded-lg bg-[#2FB617]/15 px-2 py-0.5 text-[10px] font-extrabold text-[#259212] dark:text-[#2FB617]">
            3D Clay
          </span>
        </div>
      </div>
    </div>
  );
}
