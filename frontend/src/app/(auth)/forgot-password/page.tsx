"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  };

  return (
    <div className="w-full min-h-screen bg-[#dff0f8] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 flex flex-col">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>লগইনে ফিরে যান</span>
        </Link>

        <h1 className="text-xl font-bold text-slate-900 tracking-tight font-bengali">
          পাসওয়ার্ড রিসেট করুন
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1 mb-6">
          আপনার অ্যাকাউন্টের ইমেইল দিন। আমরা পাসওয়ার্ড রিসেটের নির্দেশাবলি পাঠিয়ে দেব।
        </p>

        {sent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center flex flex-col items-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-2" />
            <h3 className="text-sm font-bold text-emerald-900">ইমেইল পাঠানো হয়েছে!</h3>
            <p className="text-xs text-emerald-700 mt-1">
              পাসওয়ার্ড রিসেট লিংকটি আপনার ইমেইলে পাঠিয়ে দেওয়া হয়েছে। ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন।
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block text-xs font-bold text-[#1e5eb3] hover:underline"
            >
              লগইন পেজে যান
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                রেজিস্টার্ড ইমেইল অ্যাড্রেস
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1e5eb3] focus:bg-white transition-all text-slate-900 font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#1e5eb3] hover:bg-[#154286] text-white font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all disabled:opacity-70"
            >
              {loading ? (
                <span>পাঠানো হচ্ছে...</span>
              ) : (
                <>
                  <span>রিসেট লিংক পাঠান</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
