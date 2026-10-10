"use client";

import { useId } from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

export function Logo({ className = "", size = "md", showWordmark = true }: LogoProps) {
  const gradientId = useId();

  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Precision Document-Folder with Warm Orange Tab and Bookmark Cutout */}
      <svg
        className={`${iconSizes[size]} shrink-0 transition-transform duration-200 group-hover:scale-105`}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Back folder base plate (Deep Navy) */}
        <rect x="4" y="10" width="40" height="32" rx="5" fill="#172633" />
        
        {/* Warm Orange Folder Tab with Subtle Curvature */}
        <path
          d="M4 14C4 11.7909 5.79086 10 8 10H19.5L24 15H40C42.2091 15 44 16.7909 44 19V22H4V14Z"
          fill="#FF7A00"
        />

        {/* Inner white academic document preview layer */}
        <rect x="9" y="16" width="30" height="22" rx="3" fill="#FFF8EF" opacity="0.95" />
        <line x1="14" y1="21" x2="28" y2="21" stroke="#172633" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <line x1="14" y1="26" x2="34" y2="26" stroke="#172633" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <line x1="14" y1="31" x2="24" y2="31" stroke="#172633" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

        {/* Front folder layer with gentle perspective and bookmark notch */}
        <path
          d="M4 22C4 19.7909 5.79086 18 8 18H40C42.2091 18 44 19.7909 44 22V37C44 39.2091 42.2091 41 40 41H8C5.79086 41 4 39.2091 4 37V22Z"
          fill="#101C28"
        />

        {/* Elegant Bookmark Cutout ribbon on front folder */}
        <path
          d="M31 18V30L35 27.5L39 30V18H31Z"
          fill="#FF7A00"
        />
      </svg>

      {showWordmark && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight text-[#172633] dark:text-[#FFF8EF] ${textSizes[size]}`}>
            Student_Repo
          </span>
          {size === "lg" && (
            <span className="text-xs text-[#687481] dark:text-[#A0AAB4]">
              All your study materials in one place
            </span>
          )}
        </div>
      )}
    </div>
  );
}
