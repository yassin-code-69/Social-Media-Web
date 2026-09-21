"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api-client";
import {
  Settings,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Bell,
  ToggleLeft,
  ToggleRight,
  Sliders,
  DollarSign,
  PhoneCall,
  X,
  RefreshCw,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const [minWithdrawal, setMinWithdrawal] = useState(100);
  const [maxWithdrawal, setMaxWithdrawal] = useState(25000);
  const [referralBonus, setReferralBonus] = useState(25);

  const [bkashNumber, setBkashNumber] = useState("01755123456");
  const [nagadNumber, setNagadNumber] = useState("01855123456");
  const [rocketNumber, setRocketNumber] = useState("019551234567");

  const [announcement, setAnnouncement] = useState("");
  const [isDepositEnabled, setIsDepositEnabled] = useState(true);
  const [isWithdrawalEnabled, setIsWithdrawalEnabled] = useState(true);

  const [successToast, setSuccessToast] = useState(false);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getSettings();
      if (data) {
        setMinWithdrawal(data.minWithdrawal ?? 100);
        setMaxWithdrawal(data.maxWithdrawal ?? 25000);
        setReferralBonus(data.referralBonus ?? 25);
        setBkashNumber(data.bkashNumber || "01755123456");
        setNagadNumber(data.nagadNumber || "01855123456");
        setRocketNumber(data.rocketNumber || "019551234567");
        setAnnouncement(data.announcement || "");
        setIsDepositEnabled(data.isDepositEnabled ?? true);
        setIsWithdrawalEnabled(data.isWithdrawalEnabled ?? true);
      }
    } catch (err: any) {
      console.error("Failed to load admin settings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      await adminApi.updateSettings({
        minWithdrawal,
        maxWithdrawal,
        referralBonus,
        bkashNumber,
        nagadNumber,
        rocketNumber,
        announcement,
        isDepositEnabled,
        isWithdrawalEnabled,
      });
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3500);
    } catch (err: any) {
      alert(err.message || "সেটিংস সংরক্ষণ করা যায়নি");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">সিস্টেম কনফিগারেশন ও সেটিংস</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            পেমেন্ট নাম্বার, উইথড্রয়াল লিমিট, রেফারেল বোনাস ও সার্বজনীন ঘোষণা সরাসরি ডাটাবেজে নিয়ন্ত্রণ করুন।
          </p>
        </div>
        <button
          type="button"
          onClick={loadSettings}
          disabled={loading}
          className="inline-flex items-center gap-1.5 bg-white text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#1e5eb3]" : ""}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">
              সিস্টেম সেটিংস ও মার্চেন্ট নম্বর সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে!
            </span>
          </div>
          <button onClick={() => setSuccessToast(false)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-8 h-8 border-3 border-[#1e5eb3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-bold">সেটিংস লোড হচ্ছে...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Financial Rules Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900">
              <Sliders className="w-5 h-5 text-[#1e5eb3]" />
              <h2 className="font-bold text-sm sm:text-base">আর্থিক নীতিমালা ও লিমিট</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  সর্বনিম্ন উত্তোলন (৳):
                </label>
                <input
                  type="number"
                  min={10}
                  value={minWithdrawal}
                  onChange={(e) => setMinWithdrawal(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  সর্বোচ্চ উত্তোলন (৳):
                </label>
                <input
                  type="number"
                  min={100}
                  value={maxWithdrawal}
                  onChange={(e) => setMaxWithdrawal(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  প্রতি রেফার বোনাস (৳):
                </label>
                <input
                  type="number"
                  min={0}
                  value={referralBonus}
                  onChange={(e) => setReferralBonus(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                />
              </div>
            </div>
          </div>

          {/* Official Payment Accounts */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-sm sm:text-base">অফিসিয়াল মার্চেন্ট / ডিপোজিট নাম্বার</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  bKash নম্বর:
                </label>
                <input
                  type="text"
                  value={bkashNumber}
                  onChange={(e) => setBkashNumber(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nagad নম্বর:
                </label>
                <input
                  type="text"
                  value={nagadNumber}
                  onChange={(e) => setNagadNumber(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Rocket নম্বর:
                </label>
                <input
                  type="text"
                  value={rocketNumber}
                  onChange={(e) => setRocketNumber(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
                />
              </div>
            </div>
          </div>

          {/* System Announcement Notice */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900">
              <Bell className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-sm sm:text-base">সার্বজনীন নোটিশ ও ঘোষণা</h2>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ইউজার ড্যাশবোর্ডের স্ক্রোলিং বা ব্যানার নোটিশ:
              </label>
              <textarea
                rows={3}
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="যেমন: স্বাগতম দিগন্ত ডিজিটাল আর্নিং প্ল্যাটফর্মে! নিয়ম মেনে কাজ করুন..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
              />
            </div>
          </div>

          {/* System Feature Switches */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900">
              <Shield className="w-5 h-5 text-purple-600" />
              <h2 className="font-bold text-sm sm:text-base">সার্ভিস কন্ট্রোল সুইচ</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">ডিপোজিট সিস্টেম সক্রিয়</h4>
                  <p className="text-[10px] text-slate-500">ইউজাররা ওয়ালেটে রিচার্জ ও প্যাকেজ কিনতে পারবে</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDepositEnabled(!isDepositEnabled)}
                  className={`p-1 rounded-lg transition-colors ${
                    isDepositEnabled ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {isDepositEnabled ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">উইথড্রয়াল সিস্টেম সক্রিয়</h4>
                  <p className="text-[10px] text-slate-500">ইউজাররা টাকা উত্তোলনের রিকোয়েস্ট পাঠাতে পারবে</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWithdrawalEnabled(!isWithdrawalEnabled)}
                  className={`p-1 rounded-lg transition-colors ${
                    isWithdrawalEnabled ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {isWithdrawalEnabled ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={saveLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e5eb3] hover:bg-[#184a8f] text-white text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saveLoading ? "সংরক্ষণ হচ্ছে..." : "সকল সেটিংস সংরক্ষণ করুন"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
