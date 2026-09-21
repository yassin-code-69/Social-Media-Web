"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api-client";
import {
  Wallet,
  TrendingUp,
  Edit2,
  CheckCircle2,
  X,
  RefreshCw,
  Coins,
  Calendar,
  Users,
} from "lucide-react";

interface IcashPlanItem {
  id: string;
  title: string;
  years: number;
  profitPercent: number;
  minDeposit: number;
  maxDeposit: number;
  popular?: string;
}

interface IcashInvestmentItem {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  planId: string;
  planTitle: string;
  investedAmount: number;
  monthlyProfit: number;
  totalProfitClaimed: number;
  status: string;
  startDate: string;
  maturityDate: string;
  nextProfitClaimDate: string;
}

export default function AdminIcashPage() {
  const [activeTab, setActiveTab] = useState<"PLANS" | "INVESTMENTS">("PLANS");
  const [plans, setPlans] = useState<IcashPlanItem[]>([]);
  const [investments, setInvestments] = useState<IcashInvestmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Edit Plan Modal
  const [editingPlan, setEditingPlan] = useState<IcashPlanItem | null>(null);
  const [profitPercent, setProfitPercent] = useState<number>(30);
  const [minDeposit, setMinDeposit] = useState<number>(500);
  const [maxDeposit, setMaxDeposit] = useState<number>(50000);
  const [savingPlan, setSavingPlan] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pls, invs] = await Promise.allSettled([
        adminApi.getIcashPlans(),
        adminApi.getIcashInvestments(),
      ]);
      if (pls.status === "fulfilled") setPlans(pls.value);
      if (invs.status === "fulfilled") setInvestments(invs.value);
    } catch (err: any) {
      console.error("Failed to load icash data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openEditModal = (p: IcashPlanItem) => {
    setEditingPlan(p);
    setProfitPercent(p.profitPercent);
    setMinDeposit(p.minDeposit);
    setMaxDeposit(p.maxDeposit);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      setSavingPlan(true);
      const res = await adminApi.updateIcashPlan(editingPlan.id, {
        profitPercent,
        minDeposit,
        maxDeposit,
      });
      setToastMsg(res?.message || `'${editingPlan.title}' প্ল্যান সফলভাবে আপডেট করা হয়েছে!`);
      setEditingPlan(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || "প্ল্যান আপডেট করা যায়নি");
    } finally {
      setSavingPlan(false);
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              I Cash ইনভেস্টমেন্ট ও প্ল্যান কন্ট্রোল
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ফিক্সড ডিপোজিট/বিনিয়োগ প্ল্যানের মুনাফার হার, ডিপোজিট সীমা ও ব্যবহারকারীদের বিনিয়োগ পর্যবেক্ষণ করুন।
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 bg-white text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#1e5eb3]" : ""}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Success Notification */}
      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("PLANS")}
          className={`pb-3 px-3 text-xs font-bold transition-all relative ${
            activeTab === "PLANS"
              ? "text-[#1e5eb3] border-b-2 border-[#1e5eb3]"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Coins className="w-4 h-4" />
            I Cash প্ল্যানসমূহ ({plans.length})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("INVESTMENTS")}
          className={`pb-3 px-3 text-xs font-bold transition-all relative ${
            activeTab === "INVESTMENTS"
              ? "text-[#1e5eb3] border-b-2 border-[#1e5eb3]"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            ইউজার ইনভেস্টমেন্ট তালিকা ({investments.length})
          </span>
        </button>
      </div>

      {/* Tab 1: Plans */}
      {activeTab === "PLANS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                    {p.years} বছর মেয়াদী
                  </span>
                  {p.popular && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {p.popular}
                    </span>
                  )}
                </div>
                <h3 className="font-black text-base text-slate-900 mt-2">{p.title}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-emerald-600 font-sans">{p.profitPercent}%</span>
                  <span className="text-xs text-slate-500">বার্ষিক মুনাফা</span>
                </div>

                <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>মিনিমাম ডিপোজিট:</span>
                    <span className="font-bold text-slate-800 font-sans">৳ {p.minDeposit?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>ম্যাক্সিমাম ডিপোজিট:</span>
                    <span className="font-bold text-slate-800 font-sans">৳ {p.maxDeposit?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openEditModal(p)}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>প্ল্যান রেট এডিট করুন</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: User Investments */}
      {activeTab === "INVESTMENTS" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">ইউজার</th>
                  <th className="py-3 px-4">প্ল্যান</th>
                  <th className="py-3 px-4">বিনিয়োগ পরিমাণ</th>
                  <th className="py-3 px-4">মাসিক মুনাফা</th>
                  <th className="py-3 px-4">পরবর্তী মুনাফা তারিখ</th>
                  <th className="py-3 px-4">মেয়াদ পূর্ণতা</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {investments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                      কোনো ইউজার এখনো I Cash প্ল্যানে ইনভেস্ট করেননি।
                    </td>
                  </tr>
                ) : (
                  investments.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {inv.userName}
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {inv.phone}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-600">
                        {inv.planTitle}
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900 font-sans">
                        ৳ {inv.investedAmount?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-black text-emerald-600 font-sans">
                        ৳ {inv.monthlyProfit?.toLocaleString()}/মাস
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(inv.nextProfitClaimDate).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(inv.maturityDate).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">{editingPlan.title} প্ল্যান এডিট</h3>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">বার্ষিক মুনাফার হার (%):</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={200}
                  value={profitPercent}
                  onChange={(e) => setProfitPercent(Number(e.target.value))}
                  className="w-full font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">সর্বনিম্ন ডিপোজিট (৳):</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={minDeposit}
                  onChange={(e) => setMinDeposit(Number(e.target.value))}
                  className="w-full font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">সর্বোচ্চ ডিপোজিট (৳):</label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={maxDeposit}
                  onChange={(e) => setMaxDeposit(Number(e.target.value))}
                  className="w-full font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={savingPlan}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50"
                >
                  আপডেট সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
