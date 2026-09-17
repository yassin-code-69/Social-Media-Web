"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";
import {
  ArrowLeft,
  Crown,
  Check,
  ShieldCheck,
  Copy,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { packages, profile, purchasePackage } = useMockStore();

  const packageId = params?.id as string;
  const pkg = packages.find((p) => p.id === packageId) || packages[0];

  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [trxId, setTrxId] = useState("");
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;
    purchasePackage(pkg);
    setSuccess(true);
    setTimeout(() => {
      router.push("/packages");
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#dff0f8] flex flex-col">
      <div className="w-full max-w-lg mx-auto bg-[#eaf5fa] min-h-screen shadow-xl flex flex-col relative border-x border-slate-200/50">
        <Header />

        <main className="flex-1 px-3 pt-3 pb-24 flex flex-col gap-3">
          {/* Back button */}
          <div className="flex items-center gap-2">
            <Link
              href="/packages"
              className="p-2 rounded-xl bg-white text-slate-600 hover:text-slate-900 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-base font-bold text-slate-900">প্যাকেজের বিস্তারিত</h1>
          </div>

          {/* Package Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 relative overflow-hidden space-y-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${pkg.color} text-white`}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/80">দিগন্ত মেম্বারশিপ প্ল্যান</span>
                {pkg.isPopular && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold">
                    জনপ্রিয়
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold mt-1">{pkg.name}</h2>
              <div className="mt-2 flex items-baseline gap-1 font-inter">
                <span className="text-3xl font-black">৳{pkg.price}</span>
                <span className="text-xs opacity-80">/ {pkg.validityDays} দিন</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">দৈনিক কাজ</span>
                <span className="text-xs font-bold text-slate-800">{pkg.dailyTaskLimit}টি</span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[10px] text-slate-400 block">সর্বোচ্চ আয়</span>
                <span className="text-xs font-bold text-emerald-600 font-inter">৳{pkg.dailyRewardLimit}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">রেফার কমিশন</span>
                <span className="text-xs font-bold text-amber-600">{pkg.referralBonus}%</span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800">প্যাকেজের প্রধান সুবিধাসমূহ:</h3>
              <div className="space-y-2">
                {pkg.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase Form */}
            {success ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-800">প্যাকেজ সফলভাবে সক্রিয় হয়েছে!</h4>
                <p className="text-xs text-emerald-700">আপনাকে প্যাকেজ তালিকায় পুনঃনির্দেশ করা হচ্ছে...</p>
              </div>
            ) : (
              <form onSubmit={handlePurchase} className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-800">পেমেন্ট মেথড বেছে নিন:</h3>

                <div className="grid grid-cols-3 gap-2">
                  {["bKash", "Nagad", "Rocket"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                        paymentMethod === m
                          ? "bg-[#1e5eb3] text-white border-[#1e5eb3] shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">অফিসিয়াল {paymentMethod} নম্বর:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy("01789-123456")}
                      className="text-[#1e5eb3] font-bold flex items-center gap-1"
                    >
                      <span>01789-123456</span>
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    * উপরোক্ত নম্বরে <strong>Send Money</strong> করে ট্রানজেকশন আইডি দিন।
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    ট্রানজেকশন আইডি (TrxID):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: 9J7A6B8C2D"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#1e5eb3] hover:bg-[#184a8f] text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  ৳{pkg.price} পেমেন্ট নিশ্চিত করুন
                </button>
              </form>
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
