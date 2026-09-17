"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  Package,
  Settings,
  ArrowLeft,
  Menu,
  X,
  FileCheck,
  ShieldAlert,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "ড্যাশবোর্ড", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "টাস্ক প্রুফ রিভিউ", href: "/admin/submissions", icon: FileCheck },
    { label: "ডিপোজিট অনুমোদন", href: "/admin/deposits", icon: ArrowDownLeft },
    { label: "উইথড্রয়াল প্রসেসিং", href: "/admin/withdrawals", icon: ArrowUpRight },
    { label: "ব্যবহারকারী ব্যবস্থাপনা", href: "/admin/users", icon: Users },
    { label: "প্যাকেজ কন্ট্রোল", href: "/admin/packages", icon: Package },
    { label: "টাস্ক ম্যানেজমেন্ট", href: "/admin/tasks", icon: CheckSquare },
    { label: "সিস্টেম সেটিংস", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0b2149] text-white flex-col flex-shrink-0 shadow-lg min-h-screen">
        {/* Brand */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1e5eb3] flex items-center justify-center font-bold text-sm text-white">
              দ
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold leading-tight">দিগন্ত অ্যাডমিন</span>
              <span className="text-[10px] text-sky-200">সুপার কন্ট্রোল প্যানেল</span>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#1e5eb3] text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to User Dashboard */}
        <div className="p-3 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/15 text-sky-200 hover:text-white rounded-xl text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ইউজার ড্যাশবোর্ডে ফিরুন</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0b2149] text-white px-4 py-3 flex items-center justify-between shadow sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">দিগন্ত অ্যাডমিন প্যানেল</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-[11px] font-bold bg-white/10 px-2.5 py-1 rounded-lg text-sky-200"
          >
            ইউজার সাইট
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 rounded-lg hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b2149] text-white p-3 flex flex-col gap-1 border-b border-white/10 animate-in slide-in-from-top duration-200 z-30">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                  isActive ? "bg-[#1e5eb3] text-white" : "text-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
