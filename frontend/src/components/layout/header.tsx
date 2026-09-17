"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  X,
  Home,
  CheckSquare,
  Package,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  Clock,
  User,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuLinks = [
    { label: "হোম ড্যাশবোর্ড", href: "/", icon: Home },
    { label: "টাস্ক তালিকা", href: "/tasks", icon: CheckSquare },
    { label: "দিগন্ত প্যাকেজ", href: "/packages", icon: Package },
    { label: "মাই ওয়ালেট", href: "/wallet", icon: Wallet },
    { label: "রিচার্জ / ডিপোজিট", href: "/deposit", icon: ArrowDownLeft },
    { label: "টাকা উত্তোলন (Withdraw)", href: "/withdraw", icon: ArrowUpRight },
    { label: "রেফারেল ও টিম", href: "/referral", icon: Users },
    { label: "লেনদেন হিস্ট্রি", href: "/history", icon: Clock },
    { label: "নোটিফিকেশন", href: "/notifications", icon: Bell },
    { label: "প্রোফাইল সেটিংস", href: "/profile", icon: User },
  ];

  return (
    <>
      <header className="w-full bg-[#0b2654] text-white px-4 pt-3 pb-4 shadow-md sticky top-0 z-40">
        <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
          {/* Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Menu"
            className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-transform"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          {/* Brand Logo & Slogan */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* Custom SVG Logo: Sun rising over waves */}
            <div className="relative w-9 h-9 flex-shrink-0 transition-transform group-hover:scale-105">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Sun rays */}
                <g stroke="#f59e0b" strokeWidth="4" strokeLinecap="round">
                  <line x1="50" y1="12" x2="50" y2="2" />
                  <line x1="68" y1="17" x2="75" y2="9" />
                  <line x1="82" y1="31" x2="90" y2="24" />
                  <line x1="88" y1="49" x2="98" y2="49" />
                  <line x1="32" y1="17" x2="25" y2="9" />
                  <line x1="18" y1="31" x2="10" y2="24" />
                  <line x1="12" y1="49" x2="2" y2="49" />
                </g>
                {/* Sun body */}
                <circle cx="50" cy="46" r="26" fill="#fbbf24" />
                <path
                  d="M24 46 C24 32 36 20 50 20 C64 20 76 32 76 46 Z"
                  fill="#f59e0b"
                />
                {/* Ocean Waves */}
                <path
                  d="M10 58 C25 50 35 66 50 58 C65 50 75 66 90 58 L90 70 C75 78 65 62 50 70 C35 78 25 62 10 70 Z"
                  fill="#38bdf8"
                />
                <path
                  d="M8 70 C24 62 36 78 50 70 C64 62 76 78 92 70 L92 84 C76 92 64 76 50 84 C36 92 24 76 8 84 Z"
                  fill="#0284c7"
                />
              </svg>
            </div>

            {/* Text Title & Subtitle */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight text-white leading-none font-bengali">
                দিগন্ত
              </h1>
              <span className="text-[11px] font-medium text-sky-200 mt-1 leading-tight tracking-wide">
                আজকের কাজ, আগামীর সমৃদ্ধি
              </span>
            </div>
          </Link>

          {/* Right Actions: Notifications & Avatar */}
          <div className="flex items-center gap-3">
            {/* Notification with Badge */}
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="relative p-1.5 rounded-full hover:bg-white/10 active:scale-95 transition-transform"
            >
              <Bell className="w-6 h-6 text-white" />
              <span className="absolute -top-0.5 -right-0.5 bg-[#ef4444] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0b2654]">
                3
              </span>
            </Link>

            {/* User Profile Avatar */}
            <Link
              href="/profile"
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/80 shadow-sm flex-shrink-0 cursor-pointer active:scale-95 transition-transform bg-slate-200 block"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                alt="তামিম ইসলাম"
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Side Navigation Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full bg-[#0b2149] text-white flex flex-col justify-between shadow-2xl p-4 animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1e5eb3] flex items-center justify-center font-bold text-sm">
                    দ
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">দিগন্ত মেনু</h3>
                    <span className="text-[10px] text-sky-200">আজকের কাজ, আগামীর সমৃদ্ধি</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                {menuLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-sky-300" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Admin Switch Link */}
            <div className="pt-3 border-t border-white/10">
              <Link
                href="/admin/dashboard"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>অ্যাডমিন কন্ট্রোল প্যানেল</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
