"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMockStore } from "@/lib/mock-store";
import { authApi } from "@/lib/api-client";
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
  CalendarCheck2,
  PlusCircle,
  Disc,
  Trophy,
  PenTool,
  PlaySquare,
  Flame,
  ClipboardCheck,
  BookOpen,
  DollarSign,
  TrendingUp,
  LogOut,
} from "lucide-react";

export function Header() {
  const router = useRouter();
  const { profile, notifications } = useMockStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const unreadCount = notifications ? notifications.filter((n) => !n.read).length : 0;
  const isAdmin = profile.role === "ADMIN" || (profile.role as any) === "SUPER_ADMIN";

  const handleLogout = async () => {
    setDrawerOpen(false);
    await authApi.logout();
    router.push("/login");
  };

  const menuLinks = [
    { label: "হোম ড্যাশবোর্ড", href: "/", icon: Home },
    { label: "মিশন সেন্টার (লগইন বোনাস)", href: "/mission", icon: CalendarCheck2 },
    { label: "দৈনিক লাকি স্পিন", href: "/spin", icon: Disc },
    { label: "লিডারবোর্ড (Top Earners)", href: "/leaderboard", icon: Trophy },
    { label: "কন্টেন্ট রাইটিং (লিখে আয়)", href: "/content-writing", icon: PenTool },
    { label: "ভিডিও কনটেন্ট প্রজেক্ট", href: "/video-content", icon: PlaySquare },
    { label: "অফারওয়াল (স্পেশাল অফার)", href: "/offerwall", icon: Flame },
    { label: "সার্ভে ও জরিপ (Survey)", href: "/survey", icon: ClipboardCheck },
    { label: "আর্টিকেল পড়া (Read & Earn)", href: "/articles", icon: BookOpen },
    { label: "টাস্ক তালিকা", href: "/tasks", icon: CheckSquare },
    { label: "নতুন কাজ দিন (Create Job)", href: "/create", icon: PlusCircle },
    { label: "দিগন্ত প্যাকেজ", href: "/packages", icon: Package },
    { label: "মাই ওয়ালেট", href: "/wallet", icon: Wallet },
    { label: "I Cash (বিনিয়োগ ও মুনাফা)", href: "/icash", icon: TrendingUp },
    { label: "রিচার্জ / ডিপোজিট", href: "/deposit", icon: ArrowDownLeft },
    { label: "টাকা উত্তোলন (Withdraw)", href: "/withdraw", icon: ArrowUpRight },
    { label: "রেফারেল ও টিম", href: "/referral", icon: Users },
    { label: "মাসিক বোনাস ও স্যালারি", href: "/monthly-salary", icon: DollarSign },
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

          {/* Logo and Brand Name */}
          <Link href="/" className="flex items-center gap-2 select-none group">
            {/* Custom SVG Sunrise Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0284c7] via-[#0369a1] to-[#075985] p-1.5 shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                {/* Rays */}
                <g stroke="#fef08a" strokeWidth="4" strokeLinecap="round">
                  <line x1="50" y1="12" x2="50" y2="4" />
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
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#ef4444] text-white font-bold text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center border-2 border-[#0b2654]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            {/* User Profile Avatar */}
            <Link
              href="/profile"
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/80 shadow-sm flex-shrink-0 cursor-pointer active:scale-95 transition-transform bg-[#0b2654] flex items-center justify-center text-white font-bold text-xs"
            >
              {profile.avatar && (profile.avatar.startsWith("http") || profile.avatar.startsWith("data:")) ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-white/90" />
              )}
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
                    {(profile.name || "দ").charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm truncate">{profile.name || "স্বাগতম"}</h3>
                    <span className="text-[10px] text-sky-200">
                      ID: {profile.referralCode || profile.id}
                    </span>
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
              <nav className="space-y-1 max-h-[58vh] overflow-y-auto pr-1">
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

            {/* Bottom Actions: Admin Switch & Logout */}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>অ্যাডমিন কন্ট্রোল প্যানেল</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-rose-300 font-semibold text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>লগআউট</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
