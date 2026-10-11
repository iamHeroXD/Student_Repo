"use client";

import { useState, useEffect } from "react";

export function LogoIntroSplash() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    try {
      const alreadyPlayed = sessionStorage.getItem("studentrepo_intro_loaded");
      if (!alreadyPlayed) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const finishIntro = () => {
    try {
      sessionStorage.setItem("studentrepo_intro_loaded", "1");
    } catch {
      // ignore
    }
    setFading(true);
    setTimeout(() => {
      setVisible(false);
    }, 450);
  };

  if (!visible) return null;

  return (
    <div
      onClick={finishIntro}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#EBE5D8] transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <video
        src="/brand/logo-intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={finishIntro}
        onError={finishIntro}
        className="w-full max-w-xl sm:max-w-2xl h-auto object-contain pointer-events-none"
      />
    </div>
  );
}
