"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  History,
  ShieldCheck,
} from "lucide-react";

export default function WithdrawPage() {
  const { profile, withdrawals, submitWithdrawal } = useMockStore();

  const [amount, setAmount] = useState("500");
  const [method, setMethod] = useState("bKash");
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const methods = ["bKash", "Nagad", "Rocket", "Bank Transfer"];

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const num = parseFloat(amount);
    if (isNaN(num) || num < 100) {
      setError("নূন্যতম উত্তোলনের পরিমাণ ৳ ১০০ হতে হবে!");
      return;
    }
    if (num > profile.balance) {
      setError("আপনার পর্যাপ্ত ব্যালেন্স নেই!");
      return;
    }
    if (accountNumber.length < 11) {
      setError("সঠিক ১১ ডিজিটের মোবাইল ব্যাংকিং নম্বর দিন!");
      return;
    }

    try {
      submitWithdrawal(num, method, accountNumber);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setAccountNumber("");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "উইথড্রয়াল ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#dff0f8] flex flex-col">
      <div className="w-full max-w-lg mx-auto bg-[#eaf5fa] min-h-screen shadow-xl flex flex-col relative border-x border-slate-200/50">
        <Header />

        <main className="flex-1 px-3 pt-3 pb-24 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/wallet"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ওয়ালেটে ফিরে যান</span>
            </Link>
            <span className="text-xs font-bold text-[#1e5eb3] bg-sky-50 px-2 py-0.5 rounded-md">
              টাকা উত্তোলন (Withdraw)
            </span>
          </div>

          {/* Balance card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-500">
                উত্তোলনযোগ্য ব্যালেন্স
              </span>
              <span className="text-xl font-black text-slate-900 font-sans mt-0.5">
                ৳ {profile.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>নিরাপদ পেমেন্ট</span>
            </div>
          </div>

          {/* Withdraw Form */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-3">
              উইথড্রয়াল তথ্য প্রদান করুন
            </h3>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center flex flex-col items-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-2" />
                <h4 className="text-sm font-bold text-emerald-900">
                  উইথড্রয়াল অনুরোধ জমা হয়েছে!
                </h4>
                <p className="text-xs text-emerald-700 mt-1">
                  আপনার একাউন্টে খুব দ্রুত টাকা পাঠিয়ে দেওয়া হবে।
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="flex flex-col gap-3">
                {/* Method Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    উত্তোলনের মাধ্যম
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {methods.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center truncate ${
                          method === m
                            ? "bg-[#1e5eb3] text-white border-[#1e5eb3] shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      উত্তোলনের পরিমাণ (৳)
                    </label>
                    <span className="text-[10px] text-slate-400">
                      নূন্যতম: ৳ ১০০ | সর্বোচ্চ: ৳ ২৫,০০০
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    min={100}
                    max={profile.balance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans font-bold focus:outline-none focus:border-[#1e5eb3] focus:bg-white"
                  />
                  {/* Preset amounts */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {[100, 300, 500, 1000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val.toString())}
                        className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md text-slate-700 font-sans"
                      >
                        ৳ {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {method} অ্যাকাউন্ট / মোবাইল নম্বর
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:outline-none focus:border-[#1e5eb3] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-[#1e5eb3] hover:bg-[#154286] text-white font-bold text-xs py-2.5 rounded-xl shadow-md active:scale-95 transition-all"
                >
                  উইথড্রয়াল নিশ্চিত করুন
                </button>
              </form>
            )}
          </div>

          {/* Withdrawal History */}
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-500" />
              <span>আমার উইথড্রয়াল হিস্ট্রি</span>
            </h3>
          </div>

          <div className="flex flex-col gap-2">
            {withdrawals.map((wth) => (
              <div
                key={wth.id}
                className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">
                    {wth.paymentMethod} - ৳ {wth.amount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans mt-0.5">
                    অ্যাকাউন্ট: {wth.maskedAccount} • {wth.createdAt}
                  </span>
                </div>

                <div>
                  {wth.status === "APPROVED" && (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      সম্পন্ন
                    </span>
                  )}
                  {wth.status === "PENDING" && (
                    <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      প্রক্রিয়াধীন
                    </span>
                  )}
                  {wth.status === "REJECTED" && (
                    <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      বাতিল (রিফান্ডেড)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
