"use client";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

export function Logo({ className = "", size = "md", showWordmark = true }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        className={`${iconSizes[size]} shrink-0 transition-transform duration-200 group-hover:scale-105`}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="4" y="10" width="40" height="32" rx="6" fill="#0A0D0B" />
        <path
          d="M4 14C4 11.7909 5.79086 10 8 10H19.5L24 15H40C42.2091 15 44 16.7909 44 19V22H4V14Z"
          fill="#2FB617"
        />
        <rect x="9" y="16" width="30" height="22" rx="3" fill="#F1E9DB" opacity="0.95" />
        <line x1="14" y1="21" x2="26" y2="21" stroke="#0A0D0B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="14" y1="26" x2="33" y2="26" stroke="#0A0D0B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="14" y1="31" x2="22" y2="31" stroke="#0A0D0B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path
          d="M4 22C4 19.7909 5.79086 18 8 18H40C42.2091 18 44 19.7909 44 22V36C44 38.2091 42.2091 40 40 40H8C5.79086 40 4 38.2091 4 36V22Z"
          fill="#121713"
        />
        <path
          d="M31 18V29L35 26.5L39 29V18H31Z"
          fill="#2FB617"
        />
      </svg>

      {showWordmark && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight text-[#090A0B] dark:text-[#F8FAFC] ${textSizes[size]}`}>
            Student_Repo
          </span>
          {size === "lg" && (
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              All your study materials in one place
            </span>
          )}
        </div>
      )}
    </div>
  );
}


