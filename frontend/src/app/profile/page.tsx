"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";
import {
  User,
  Crown,
  Phone,
  Mail,
  Shield,
  Lock,
  LogOut,
  Camera,
  Check,
  Settings,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function ProfilePage() {
  const { profile } = useMockStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setIsEditing(false);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-[#dff0f8] flex flex-col">
      <div className="w-full max-w-lg mx-auto bg-[#eaf5fa] min-h-screen shadow-xl flex flex-col relative border-x border-slate-200/50">
        <Header />

        <main className="flex-1 px-3 pt-3 pb-24 flex flex-col gap-3">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center relative">
            <div className="relative mb-2">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-[#1e5eb3] text-white p-1.5 rounded-full shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <h2 className="text-base font-bold text-slate-900">{name}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="bg-[#0b2149] text-[#fbbf24] px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                <Crown className="w-3 h-3 fill-[#fbbf24]" />
                {profile.packageName} মেম্বার
              </span>
              <span className="text-[11px] text-slate-400 font-sans font-medium">
                ID: {profile.id}
              </span>
            </div>
          </div>

          {/* Admin Control Switch Banner */}
          <Link
            href="/admin/dashboard"
            className="bg-gradient-to-r from-[#0b2149] to-[#154286] text-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span>অ্যাডমিন কন্ট্রোল প্যানেল</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </span>
                <span className="text-[11px] text-sky-200">
                  টাস্ক প্রুফ, ডিপোজিট ও উইথড্রয়াল অনুমোদন করুন
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-sky-200" />
          </Link>

          {/* Account Details Form */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900">
                অ্যাকাউন্ট প্রোফাইল তথ্য
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-[#1e5eb3] hover:underline"
              >
                {isEditing ? "বাতিল" : "এডিট করুন"}
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  পুরো নাম
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1e5eb3] focus:bg-white disabled:opacity-75"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  মোবাইল নম্বর
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold font-sans focus:outline-none focus:border-[#1e5eb3] focus:bg-white disabled:opacity-75"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  ইমেইল অ্যাড্রেস (পরিবর্তন অযোগ্য)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-sans text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {isEditing && (
                <button
                  type="submit"
                  className="w-full mt-2 bg-[#00a86b] hover:bg-[#059669] text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{saved ? "সংরক্ষিত হয়েছে!" : "তথ্য সেভ করুন"}</span>
                </button>
              )}
            </form>
          </div>

          {/* Security & Logout */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100 flex flex-col">
            <Link
              href="/forgot-password"
              className="p-3 hover:bg-slate-50 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>পাসওয়ার্ড পরিবর্তন</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              href="/login"
              className="p-3 hover:bg-red-50 rounded-xl flex items-center justify-between text-xs font-bold text-red-600 transition-colors"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4 text-red-500" />
                <span>অ্যাকাউন্ট থেকে লগআউট</span>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </Link>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
