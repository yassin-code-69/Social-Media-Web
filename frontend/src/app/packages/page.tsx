"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore, PackageItem } from "@/lib/mock-store";
import { Crown, Check, ArrowRight, ShieldCheck, Copy, X } from "lucide-react";

export default function PackagesPage() {
  const { packages, profile, purchasePackage } = useMockStore();
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [trxId, setTrxId] = useState("");
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    purchasePackage(selectedPackage);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSelectedPackage(null);
      setTrxId("");
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-[#dff0f8] flex flex-col">
      <div className="w-full max-w-lg mx-auto bg-[#eaf5fa] min-h-screen shadow-xl flex flex-col relative border-x border-slate-200/50">
        <Header />

        <main className="flex-1 px-3 pt-3 pb-24 flex flex-col gap-3">
          {/* Page Banner */}
          <div className="bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-sky-200 font-medium">আপনার বর্তমান স্তর</span>
              <h2 className="text-xl font-bold text-white flex items-center gap-1.5 mt-0.5 font-bengali">
                <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>{profile.packageName} মেম্বার</span>
              </h2>
              <span className="text-[11px] text-sky-100 mt-0.5">
                মেয়াদ: {profile.packageExpiry} পর্যন্ত কার্যকর
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-amber-300">
              <Crown className="w-7 h-7" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-1">
            <h3 className="text-base font-bold text-slate-900">সকল প্যাকেজ ও প্ল্যান</h3>
            <span className="text-xs text-slate-500">পছন্দমতো প্ল্যান বেছে নিন</span>
          </div>

          {/* Packages List */}
          <div className="flex flex-col gap-3">
            {packages.map((pkg) => {
              const isCurrent = profile.packageName.toLowerCase().includes(pkg.name.toLowerCase().split(" ")[0]);
              return (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm border transition-all relative overflow-hidden ${
                    pkg.isPopular
                      ? "border-amber-400 ring-2 ring-amber-400/20"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  {pkg.isPopular && (
                    <div className="absolute top-0 right-0 bg-[#f59e0b] text-slate-950 font-bold text-[10px] px-3 py-0.5 rounded-bl-xl shadow-sm">
                      সবচেয়ে জনপ্রিয়
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <h4 className="text-base font-bold text-slate-900">{pkg.name}</h4>
                      <div className="flex items-baseline gap-1 mt-1 font-sans">
                        <span className="text-2xl font-black text-[#1e5eb3]">
                          ৳ {pkg.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          / {pkg.validityDays} দিন
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-1 rounded-lg">
                        দৈনিক {pkg.dailyTaskLimit}টি কাজ
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="mt-4">
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full bg-slate-100 text-slate-400 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1 cursor-default"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>বর্তমানে সক্রিয় প্যাকেজ</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedPackage(pkg)}
                        className="w-full bg-[#1e5eb3] hover:bg-[#154286] text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all shadow-sm"
                      >
                        <span>প্যাকেজটি সক্রিয় করুন</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        <BottomNav />
      </div>

      {/* Package Purchase Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900">
                {selectedPackage.name} কেনা
              </h4>
              <button
                type="button"
                onClick={() => setSelectedPackage(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h5 className="text-base font-bold text-slate-900">অভিনন্দন!</h5>
                <p className="text-xs text-slate-500 mt-1">
                  আপনার {selectedPackage.name} সফলভাবে সক্রিয় করা হয়েছে।
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmPurchase} className="flex flex-col gap-3.5 mt-3">
                <div className="bg-sky-50 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-sky-800 font-medium">পরিশোধের পরিমাণ</span>
                  <span className="text-lg font-bold text-sky-950 font-sans">
                    ৳ {selectedPackage.price.toLocaleString()}
                  </span>
                </div>

                {/* Method selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    পেমেন্ট মাধ্যম বেছে নিন
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["bKash", "Nagad", "Rocket"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          paymentMethod === m
                            ? "bg-[#1e5eb3] text-white border-[#1e5eb3]"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin Merchant Number */}
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-amber-800">
                      {paymentMethod} ক্যাশআউট / সেন্ড মানি নম্বর (ব্যক্তিগত):
                    </span>
                    <span className="text-sm font-bold text-amber-950 font-sans mt-0.5">
                      01798-765432
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyNumber("01798765432")}
                    className="p-2 bg-amber-200/60 hover:bg-amber-200 rounded-lg text-amber-900 text-xs font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? "কপি হয়েছে!" : "কপি"}</span>
                  </button>
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পেমেন্ট Transaction ID (TrxID)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: 9J726GH1"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1e5eb3] focus:bg-white text-slate-900 font-sans uppercase"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-[#00a86b] hover:bg-[#059669] text-white font-bold text-sm py-2.5 rounded-xl shadow-md active:scale-95 transition-all"
                >
                  প্যাকেজ সক্রিয় নিশ্চিত করুন
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
