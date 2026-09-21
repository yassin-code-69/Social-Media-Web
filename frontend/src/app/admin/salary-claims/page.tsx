"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api-client";
import {
  CalendarDays,
  Award,
  CheckCircle2,
  XCircle,
  X,
  Check,
  Truck,
  RefreshCw,
  Phone,
  MapPin,
  Clock,
  Coins,
} from "lucide-react";

interface SalaryClaimItem {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  targetTier: number;
  amount: number;
  eligibleMembersCount: number;
  monthYear: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote?: string;
  claimedAt: string;
}

interface IncentiveClaimItem {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  rewardTitle: string;
  gen1Count: number;
  gen2Count: number;
  gen3Count: number;
  recipientName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  status: "PENDING" | "APPROVED" | "DISPATCHED" | "DELIVERED" | "REJECTED";
  trackingNumber?: string;
  adminNote?: string;
  claimedAt: string;
}

export default function AdminSalaryClaimsPage() {
  const [activeTab, setActiveTab] = useState<"SALARY" | "INCENTIVES">("SALARY");
  const [salaryClaims, setSalaryClaims] = useState<SalaryClaimItem[]>([]);
  const [incentiveClaims, setIncentiveClaims] = useState<IncentiveClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Incentive Tracking Modal
  const [trackingModalItem, setTrackingModalItem] = useState<IncentiveClaimItem | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [sal, inc] = await Promise.allSettled([
        adminApi.getSalaryClaims(),
        adminApi.getIncentiveClaims(),
      ]);
      if (sal.status === "fulfilled") setSalaryClaims(sal.value);
      if (inc.status === "fulfilled") setIncentiveClaims(inc.value);
    } catch (err: any) {
      console.error("Failed to load claims", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveSalary = async (id: string) => {
    try {
      setActionLoading(id);
      const res = await adminApi.approveSalaryClaim(id);
      setToastMsg(res?.message || "মাসিক স্যালারি সফলভাবে অনুমোদিত হয়েছে!");
      await loadData();
    } catch (err: any) {
      alert(err.message || "অনুমোদন ব্যর্থ হয়েছে");
    } finally {
      setActionLoading(null);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const handleRejectSalary = async (id: string) => {
    const reason = prompt("বাতিলের কারণ উল্লেখ করুন:", "সদস্য সংখ্যা পর্যাপ্ত নয় বা শর্ত অপূর্ণ");
    if (reason === null) return;
    try {
      setActionLoading(id);
      const res = await adminApi.rejectSalaryClaim(id, reason);
      setToastMsg(res?.message || "স্যালারি আবেদন বাতিল করা হয়েছে।");
      await loadData();
    } catch (err: any) {
      alert(err.message || "বাতিল করা যায়নি");
    } finally {
      setActionLoading(null);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const handleConfirmIncentiveDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalItem) return;
    try {
      setActionLoading(trackingModalItem.id);
      const res = await adminApi.approveIncentiveClaim(trackingModalItem.id, {
        trackingNumber,
        status: trackingNumber ? "DISPATCHED" : "APPROVED",
      });
      setToastMsg(res?.message || "ইনসেন্টিভ পুরস্কার সফলভাবে আপডেট করা হয়েছে!");
      setTrackingModalItem(null);
      setTrackingNumber("");
      await loadData();
    } catch (err: any) {
      alert(err.message || "আপডেট করা যায়নি");
    } finally {
      setActionLoading(null);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const handleRejectIncentive = async (id: string) => {
    const reason = prompt("বাতিলের কারণ লিখুন:", "রেফারেল তথ্য যাচাইয়ে গরমিল পাওয়া গেছে");
    if (reason === null) return;
    try {
      setActionLoading(id);
      const res = await adminApi.rejectIncentiveClaim(id, reason);
      setToastMsg(res?.message || "ইনসেন্টিভ আবেদন বাতিল করা হয়েছে।");
      await loadData();
    } catch (err: any) {
      alert(err.message || "বাতিল করা যায়নি");
    } finally {
      setActionLoading(null);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-pink-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              মাসিক স্যালারি ও ইনসেন্টিভ কিউ
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            যোগ্য রেফারেল অর্জনকারীদের মাসিক স্যালারি অনুমোদন এবং ফিজিক্যাল পুরস্কার ক্লেইম পরিচালনা করুন।
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
          onClick={() => setActiveTab("SALARY")}
          className={`pb-3 px-3 text-xs font-bold transition-all relative ${
            activeTab === "SALARY"
              ? "text-[#1e5eb3] border-b-2 border-[#1e5eb3]"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Coins className="w-4 h-4" />
            মাসিক স্যালারি আবেদন ({salaryClaims.length})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("INCENTIVES")}
          className={`pb-3 px-3 text-xs font-bold transition-all relative ${
            activeTab === "INCENTIVES"
              ? "text-[#1e5eb3] border-b-2 border-[#1e5eb3]"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            ফিজিক্যাল ইনসেন্টিভ ক্লেইম ({incentiveClaims.length})
          </span>
        </button>
      </div>

      {/* Tab 1: Monthly Salary Claims */}
      {activeTab === "SALARY" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">ইউজার</th>
                  <th className="py-3 px-4">টার্গেট টিয়ার</th>
                  <th className="py-3 px-4">সদস্য সংখ্যা</th>
                  <th className="py-3 px-4">স্যালারি</th>
                  <th className="py-3 px-4">মাস/বছর</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salaryClaims.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                      কোনো মাসিক স্যালারি আবেদন নেই!
                    </td>
                  </tr>
                ) : (
                  salaryClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {claim.userName}
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {claim.phone}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        Tier {claim.targetTier} মেম্বার
                      </td>
                      <td className="py-3 px-4 font-bold text-[#1e5eb3]">
                        {claim.eligibleMembersCount} জন সদস্য
                      </td>
                      <td className="py-3 px-4 font-black text-emerald-600 font-sans">
                        ৳ {claim.amount}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono">
                        {claim.monthYear}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            claim.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-700"
                              : claim.status === "PENDING"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {claim.status === "APPROVED" && <CheckCircle2 className="w-3 h-3" />}
                          {claim.status === "PENDING" && <Clock className="w-3 h-3" />}
                          {claim.status === "APPROVED"
                            ? "অনুমোদিত"
                            : claim.status === "PENDING"
                            ? "অপেক্ষমান"
                            : "বাতিল"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {claim.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              disabled={actionLoading === claim.id}
                              onClick={() => handleApproveSalary(claim.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm active:scale-95 disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>অনুমোদন ও ক্রেডিট</span>
                            </button>
                            <button
                              type="button"
                              disabled={actionLoading === claim.id}
                              onClick={() => handleRejectSalary(claim.id)}
                              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm active:scale-95 disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>বাতিল</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">নিষ্পন্ন</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Incentive Claims */}
      {activeTab === "INCENTIVES" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incentiveClaims.length === 0 ? (
            <div className="col-span-2 bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-bold">কোনো ফিজিক্যাল ইনসেন্টিভ ক্লেইম জমা নেই।</p>
            </div>
          ) : (
            incentiveClaims.map((inc) => (
              <div
                key={inc.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-800">
                        মেগা পুরস্কার
                      </span>
                      <h3 className="font-black text-base text-slate-900 mt-1">{inc.rewardTitle}</h3>
                      <p className="text-xs text-slate-500">
                        ক্লেইমকারী: <span className="font-bold text-slate-800">{inc.userName}</span>
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inc.status === "DISPATCHED"
                          ? "bg-sky-100 text-sky-800"
                          : inc.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : inc.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>

                  {/* Referrals breakdown */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-3 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">১ম প্রজন্ম</span>
                      <span className="font-bold text-slate-900 font-sans">{inc.gen1Count} জন</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">২য় প্রজন্ম</span>
                      <span className="font-bold text-slate-900 font-sans">{inc.gen2Count} জন</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">৩য় প্রজন্ম</span>
                      <span className="font-bold text-slate-900 font-sans">{inc.gen3Count} জন</span>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span>প্রাপক: {inc.recipientName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inc.deliveryPhone}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>{inc.deliveryAddress}</span>
                    </div>
                    {inc.trackingNumber && (
                      <div className="flex items-center gap-1.5 text-[#1e5eb3] font-mono font-bold pt-1">
                        <Truck className="w-3.5 h-3.5" />
                        <span>কুরিয়ার ট্র্যাকিং: {inc.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {inc.status === "PENDING" && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={actionLoading === inc.id}
                      onClick={() => handleRejectIncentive(inc.id)}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-50"
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTrackingModalItem(inc);
                        setTrackingNumber(inc.trackingNumber || "");
                      }}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>অনুমোদন ও ট্র্যাকিং যোগ</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Courier Tracking Modal */}
      {trackingModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">কুরিয়ার ট্র্যাকিং যোগ করুন</h3>
              <button
                type="button"
                onClick={() => setTrackingModalItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmIncentiveDispatch} className="space-y-3.5 text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{trackingModalItem.rewardTitle}</span>
                <span className="text-slate-500 block">প্রাপক: {trackingModalItem.recipientName} ({trackingModalItem.deliveryPhone})</span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  কুরিয়ার ট্র্যাকিং নম্বর (Steadfast / Pathao / RedX ইত্যাদি):
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ST-9988776655"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full font-mono font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTrackingModalItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  ফিরে যান
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === trackingModalItem.id}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50"
                >
                  অনুমোদন ও ডিসপ্যাচ নিশ্চিত
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
