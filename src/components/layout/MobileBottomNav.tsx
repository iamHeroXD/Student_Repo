"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Upload, Calendar, User } from "lucide-react";

interface MobileBottomNavProps {
  session: {
    username: string;
    role: string;
    fullName: string;
  } | null;
}

export function MobileBottomNav({ session }: MobileBottomNavProps) {
  const pathname = usePathname();

  const items = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      label: "Explore",
      href: "/explore",
      icon: Compass,
      active: pathname.startsWith("/explore") || pathname.startsWith("/class"),
    },
    {
      label: "Upload",
      href: "/upload",
      icon: Upload,
      active: pathname.startsWith("/upload"),
      isPrimary: true,
    },
    {
      label: "Planner",
      href: "/study-planner",
      icon: Calendar,
      active: pathname.startsWith("/study-planner"),
    },
    {
      label: session ? "Account" : "Log In",
      href: session ? "/dashboard" : "/login",
      icon: User,
      active:
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/admin"),
    },
  ];

  return (
    <nav
      aria-label="Mobile quick navigation"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-[#D8CEBE] bg-white/95 backdrop-blur-md dark:border-[#1E2922] dark:bg-[#090A0B]/95 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {items.map((item) => {
          const Icon = item.icon;
          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2FB617] text-white shadow-md shadow-[#2FB617]/25 active:scale-95 transition">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="mt-0.5 text-[10px] font-bold text-[#2FB617]">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 transition active:scale-95 ${
                item.active
                  ? "text-[#2FB617] font-bold"
                  : "text-[#64748B] dark:text-[#94A3B8] font-medium"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
