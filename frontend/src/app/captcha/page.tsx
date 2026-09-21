"use client";

import React from "react";
import Link from "next/link";
import { ScanLine, Clock, ArrowLeft, Home, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function CaptchaUpcomingPage() {
  return (
    <div className="min-h-screen bg-[#f0f9ff] flex justify-center selection:bg-rose-500 selection:text-white">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-lg bg-white min-h-screen shadow-2xl flex flex-col relative pb-24 border-x border-slate-200/60 font-sans">
        {/* Header */}
        <Header />

        {/* Content */}
        <div className="px-4 py-8 flex-1 flex flex-col items-center justify-center text-center space-y-6">
          {/* Glowing Animated Icon Container */}
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-100 via-pink-50 to-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-lg border border-rose-200 animate-pulse">
              <ScanLine className="w-12 h-12 stroke-[2.2]" />
            </div>
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
              Upcoming
            </div>
          </div>

          {/* Texts */}
          <div className="space-y-2 max-w-xs">
            <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 border border-rose-200 px-3.5 py-1 rounded-full text-xs font-bold shadow-2xs">
              <Clock className="w-3.5 h-3.5" />
              <span>শীঘ্রই আসছে / Coming Soon</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-bengali pt-1">
              ক্যাপচা সলভিং
            </h1>
            <p className="text-xs text-slate-600 font-bengali leading-relaxed">
              এই সার্ভিসটি বর্তমানে প্রস্তুত করা হচ্ছে। এটি এখনো পাবলিকলি রিলিজ হয়নি। খুব শীঘ্রই ক্যাপচা লিখে আকর্ষণীয় ইনকামের সুযোগ নিয়ে আসা হবে!
            </p>
          </div>

          {/* Action Button */}
          <div className="w-full max-w-xs pt-2">
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white font-bold text-xs shadow-md hover:shadow-blue-900/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>হোমপেজে ফিরে যান</span>
            </Link>
          </div>
        </div>

        {/* Bottom Nav */}
        <BottomNav />
      </div>
    </div>
  );
}
