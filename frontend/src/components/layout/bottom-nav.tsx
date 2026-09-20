"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CheckSquare,
  Crown,
  Users,
  Wallet,
  Gift,
  User,
  PlaySquare,
} from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { id: "home", label: "হোম", href: "/", icon: Home },
    { id: "tasks", label: "টাস্ক", href: "/tasks", icon: CheckSquare },
    { id: "levels", label: "দিগন্ত স্তর", href: "/packages", icon: Crown },
    { id: "referral", label: "রেফারেল", href: "/referral", icon: Users },
    { id: "video", label: "ভিডিও কনটেন্ট", href: "/video-content", icon: PlaySquare },
    { id: "icash", label: "I Cash", href: "/icash", icon: Wallet },
    { id: "gift", label: "গিফট কোড", href: "/packages", icon: Gift },
    { id: "profile", label: "প্রোফাইল", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200/80 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-lg mx-auto flex items-center justify-between px-1 py-1.5">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-lg transition-all ${
                isActive
                  ? "text-[#1e5eb3]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <div className="relative">
                <IconComponent
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "stroke-[2.5] scale-110" : "stroke-[1.8]"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-1 leading-none tracking-tight ${
                  isActive ? "font-bold text-[#1e5eb3]" : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
