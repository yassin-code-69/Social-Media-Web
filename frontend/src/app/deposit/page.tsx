"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";
import {
  ArrowLeft,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  UploadCloud,
  X,
  History,
} from "lucide-react";

export default function DepositPage() {
  const { deposits, submitDeposit } = useMockStore();

  const [method, setMethod] = useState("bKash");
  const [amount, setAmount] = useState("1000");
  const [senderNumber, setSenderNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const methods = [
    { id: "bKash", name: "বিকাশ", number: "01712-345678", color: "bg-[#d12053] text-white" },
    { id: "Nagad", name: "নগদ", number: "01812-345678", color: "bg-[#f7941d] text-white" },
    { id: "Rocket", name: "রকেট", number: "01912-345678", color: "bg-[#8c338c] text-white" },
    { id: "Bank", name: "ব্যাংক ট্রান্সফার", number: "150.110.123456 (DBBL)", color: "bg-[#0b2149] text-white" },
  ];

  const currentMethod = methods.find((m) => m.id === method) || methods[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    submitDeposit(numAmount, method, senderNumber, trxId);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSenderNumber("");
      setTrxId("");
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#dff0f8] flex flex-col">
      <div className="w-full max-w-lg mx-auto bg-[#eaf5fa] min-h-screen shadow-xl flex flex-col relative border-x border-slate-200/50">
        <Header />

        <main className="flex-1 px-3 pt-3 pb-24 flex flex-col gap-3">
          {/* Back Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/wallet"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ওয়ালেটে ফিরে যান</span>
            </Link>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              ডিপোজিট / রিচার্জ
            </span>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col">
            <label className="text-xs font-bold text-slate-800 mb-2">
              পেমেন্ট মেথড নির্বাচন করুন
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    method === m.id
                      ? "bg-[#1e5eb3] text-white border-[#1e5eb3] shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            {/* Selected Method Merchant/Personal Number */}
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-amber-800">
                  {currentMethod.name} ক্যাশআউট / সেন্ড মানি নম্বর (ব্যক্তিগত):
                </span>
                <span className="text-base font-black text-amber-950 font-sans mt-0.5">
                  {currentMethod.number}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(currentMethod.number)}
                className="p-2 bg-amber-200/60 hover:bg-amber-200 rounded-lg text-amber-900 text-xs font-bold flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "কপি হয়েছে!" : "কপি"}</span>
              </button>
            </div>
          </div>

          {/* Deposit Submission Form */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-3">
              পেমেন্ট তথ্য প্রদান করুন
            </h3>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center flex flex-col items-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-2" />
                <h4 className="text-sm font-bold text-emerald-900">
                  ডিপোজিট রিকোয়েস্ট সফলভাবে জমা হয়েছে!
                </h4>
                <p className="text-xs text-emerald-700 mt-1">
                  অ্যাডমিন ট্রানজ্যাকশন ভেরিফাই করে অল্প সময়ের মধ্যে ব্যালেন্স যোগ করবেন।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Amount */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    টাকার পরিমাণ (৳)
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="যেমন: 1000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans font-bold focus:outline-none focus:border-[#1e5eb3] focus:bg-white"
                  />
                  {/* Preset Amount Badges */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {[500, 1000, 2000, 5000].map((val) => (
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

                {/* Sender Number */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    যে নম্বর থেকে টাকা পাঠিয়েছেন
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:outline-none focus:border-[#1e5eb3] focus:bg-white"
                  />
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Transaction ID (TrxID)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: 9J726GH1"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans uppercase font-bold focus:outline-none focus:border-[#1e5eb3] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-[#00a86b] hover:bg-[#059669] text-white font-bold text-xs py-2.5 rounded-xl shadow-md active:scale-95 transition-all"
                >
                  ডিপোজিট রিকোয়েস্ট নিশ্চিত করুন
                </button>
              </form>
            )}
          </div>

          {/* Deposit History */}
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-500" />
              <span>আমার ডিপোজিট রিকোয়েস্ট হিস্ট্রি</span>
            </h3>
          </div>

          <div className="flex flex-col gap-2">
            {deposits.map((dep) => (
              <div
                key={dep.id}
                className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">
                    {dep.paymentMethod} রিচার্জ - ৳ {dep.amount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans mt-0.5">
                    TrxID: {dep.transactionId} • {dep.createdAt}
                  </span>
                </div>

                <div>
                  {dep.status === "APPROVED" && (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      অনুমোদিত
                    </span>
                  )}
                  {dep.status === "PENDING" && (
                    <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      অপেক্ষমান
                    </span>
                  )}
                  {dep.status === "REJECTED" && (
                    <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      বাতিল
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
